import pika
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any
import threading
import time

class RealtimeProcessor:
    def __init__(self):
        # RabbitMQ connection
        credentials = pika.PlainCredentials('admin', 'admin123')
        parameters = pika.ConnectionParameters(
            host='rabbitmq',
            port=5672,
            credentials=credentials
        )
        self.connection = pika.BlockingConnection(parameters)
        self.channel = self.connection.channel()
        
        # Declare queues
        self.channel.queue_declare(queue='social-messages')
        self.channel.queue_declare(queue='realtime-analytics')
        
        # Message handling setup
        self.window_size = 300  # 5 minutes in seconds
        self.message_buffer: List[Dict[str, Any]] = []
        self.hashtag_counts: Dict[str, int] = {}
        self.mention_counts: Dict[str, int] = {}
        
        # Start processing in separate thread
        self.processing_thread = threading.Thread(target=self._process_messages)
        self.processing_thread.daemon = True
        self.processing_thread.start()


    def _process_messages(self):
        """
        Process messages in real-time
        """
        def callback(ch, method, properties, body):
            message = json.loads(body.decode())
            self._process_single_message(message)
            
        self.channel.basic_consume(
            queue='social-messages',
            on_message_callback=callback,
            auto_ack=True
        )
        self.channel.start_consuming()


    def _process_single_message(self, message: Dict[str, Any]):
        """
        Обработка одного сообщения
        """
        current_time = datetime.utcnow()
        
        # Добавление сообщения в буфер
        self.message_buffer.append({
            'timestamp': current_time,
            'message': message
        })
        
        # Подсчет хэштегов
        content = message.get('content', '').lower()
        hashtags = [tag for tag in content.split() if tag.startswith('#')]
        for hashtag in hashtags:
            self.hashtag_counts[hashtag] = self.hashtag_counts.get(hashtag, 0) + 1
        
        # Подсчет упоминаний
        mentions = [mention for mention in content.split() if mention.startswith('@')]
        for mention in mentions:
            self.mention_counts[mention] = self.mention_counts.get(mention, 0) + 1

    def _cleanup_old_data(self):
        """
        Очистка устаревших данных
        """
        current_time = datetime.utcnow()
        cutoff_time = current_time - timedelta(seconds=self.window_size)
        
        # Очистка буфера сообщений
        self.message_buffer = [
            msg for msg in self.message_buffer
            if msg['timestamp'] > cutoff_time
        ]
        
        # Сброс счетчиков
        self.hashtag_counts = {}
        self.mention_counts = {}
        
        # Пересчет для оставшихся сообщений
        for msg in self.message_buffer:
            content = msg['message'].get('content', '').lower()
            hashtags = [tag for tag in content.split() if tag.startswith('#')]
            mentions = [mention for mention in content.split() if mention.startswith('@')]
            
            for hashtag in hashtags:
                self.hashtag_counts[hashtag] = self.hashtag_counts.get(hashtag, 0) + 1
            for mention in mentions:
                self.mention_counts[mention] = self.mention_counts.get(mention, 0) + 1

    def _send_aggregated_data(self):
        """
        Send aggregated data
        """
        current_time = datetime.utcnow()
        
        report = {
            'timestamp': current_time.isoformat(),
            'window_size': self.window_size,
            'total_engagement': sum(msg['message'].get('engagement', 0) for msg in self.message_buffer),
            'message_count': len(self.message_buffer),
            'top_hashtags': sorted(
                self.hashtag_counts.items(),
                key=lambda x: x[1],
                reverse=True
            )[:10],
            'top_mentions': sorted(
                self.mention_counts.items(),
                key=lambda x: x[1],
                reverse=True
            )[:10]
        }
        
        self.channel.basic_publish(
            exchange='',
            routing_key='realtime-analytics',
            body=json.dumps(report)
        )

    def get_current_metrics(self) -> Dict[str, Any]:
        """
        Получение текущих метрик
        """
        return {
            'message_count': len(self.message_buffer),
            'total_engagement': sum(msg['message'].get('engagement', 0) for msg in self.message_buffer),
            'top_hashtags': sorted(
                self.hashtag_counts.items(),
                key=lambda x: x[1],
                reverse=True
            )[:10],
            'top_mentions': sorted(
                self.mention_counts.items(),
                key=lambda x: x[1],
                reverse=True
            )[:10]
        } 