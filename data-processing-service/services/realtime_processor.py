from kafka import KafkaConsumer, KafkaProducer
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any
import threading
import time

class RealtimeProcessor:
    def __init__(self):
        self.consumer = KafkaConsumer(
            'social-messages',
            bootstrap_servers=['kafka:9092'],
            group_id='realtime-processor',
            auto_offset_reset='latest',
            value_deserializer=lambda x: json.loads(x.decode('utf-8'))
        )
        
        self.producer = KafkaProducer(
            bootstrap_servers=['kafka:9092'],
            value_serializer=lambda x: json.dumps(x).encode('utf-8')
        )
        
        self.window_size = 300  # 5 минут в секундах
        self.message_buffer: List[Dict[str, Any]] = []
        self.hashtag_counts: Dict[str, int] = {}
        self.mention_counts: Dict[str, int] = {}
        
        # Запуск обработки в отдельном потоке
        self.processing_thread = threading.Thread(target=self._process_messages)
        self.processing_thread.daemon = True
        self.processing_thread.start()

    def _process_messages(self):
        """
        Обработка сообщений в реальном времени
        """
        while True:
            try:
                # Получение сообщений из Kafka
                message_pack = self.consumer.poll(timeout_ms=1000)
                
                for topic_partition, messages in message_pack.items():
                    for message in messages:
                        self._process_single_message(message.value)
                
                # Очистка устаревших данных
                self._cleanup_old_data()
                
                # Отправка агрегированных данных
                self._send_aggregated_data()
                
            except Exception as e:
                print(f"Ошибка при обработке сообщений: {str(e)}")
                time.sleep(1)

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
        Отправка агрегированных данных
        """
        current_time = datetime.utcnow()
        
        # Подсчет общей активности
        total_engagement = sum(msg['message'].get('engagement', 0) for msg in self.message_buffer)
        message_count = len(self.message_buffer)
        
        # Формирование отчета
        report = {
            'timestamp': current_time.isoformat(),
            'window_size': self.window_size,
            'total_engagement': total_engagement,
            'message_count': message_count,
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
        
        # Отправка отчета в Kafka
        self.producer.send('realtime-analytics', report)
        self.producer.flush()

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