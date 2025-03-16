from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, avg, sum, window
from datetime import datetime, timedelta
import json
from typing import Dict, List, Any
import os

class BatchProcessor:
    def __init__(self):
        self.spark = SparkSession.builder \
            .appName("SocialAnalyticsBatchProcessor") \
            .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0") \
            .getOrCreate()
        
        # Создание временных представлений
        self._create_views()

    def _create_views(self):
        """
        Создание временных представлений для работы с данными
        """
        # Чтение данных из Kafka
        messages_df = self.spark \
            .readStream \
            .format("kafka") \
            .option("kafka.bootstrap.servers", "kafka:9092") \
            .option("subscribe", "social-messages") \
            .load() \
            .selectExpr("CAST(value AS STRING) as value") \
            .selectExpr("from_json(value, 'message_id STRING, channel_id STRING, content STRING, engagement INT, timestamp TIMESTAMP') as data") \
            .select("data.*")
        
        # Создание временного представления
        messages_df.createOrReplaceTempView("messages")

    def calculate_channel_metrics(self, channel_id: str, days: int = 30) -> Dict[str, Any]:
        """
        Расчет метрик для канала за указанный период
        """
        query = f"""
        SELECT 
            channel_id,
            COUNT(*) as total_posts,
            AVG(engagement) as avg_engagement,
            SUM(engagement) as total_engagement,
            COUNT(DISTINCT DATE(timestamp)) as active_days
        FROM messages
        WHERE channel_id = '{channel_id}'
        AND timestamp >= date_sub(current_timestamp(), {days})
        GROUP BY channel_id
        """
        
        result = self.spark.sql(query).collect()[0]
        
        return {
            'channel_id': result['channel_id'],
            'total_posts': result['total_posts'],
            'avg_engagement': result['avg_engagement'],
            'total_engagement': result['total_engagement'],
            'active_days': result['active_days'],
            'period_days': days
        }

    def calculate_weekly_report(self, channel_id: str) -> List[Dict[str, Any]]:
        """
        Формирование еженедельного отчета
        """
        query = f"""
        SELECT 
            date_trunc('week', timestamp) as week,
            COUNT(*) as posts_count,
            AVG(engagement) as avg_engagement,
            SUM(engagement) as total_engagement
        FROM messages
        WHERE channel_id = '{channel_id}'
        AND timestamp >= date_sub(current_timestamp(), 90)
        GROUP BY date_trunc('week', timestamp)
        ORDER BY week DESC
        """
        
        results = self.spark.sql(query).collect()
        
        return [{
            'week': row['week'].strftime('%Y-%m-%d'),
            'posts_count': row['posts_count'],
            'avg_engagement': row['avg_engagement'],
            'total_engagement': row['total_engagement']
        } for row in results]

    def analyze_hashtags(self, channel_id: str, days: int = 7) -> List[Dict[str, Any]]:
        """
        Анализ хэштегов в сообщениях канала
        """
        query = f"""
        WITH hashtags AS (
            SELECT 
                explode(split(content, ' ')) as hashtag,
                engagement
            FROM messages
            WHERE channel_id = '{channel_id}'
            AND timestamp >= date_sub(current_timestamp(), {days})
            AND content LIKE '%#%'
        )
        SELECT 
            hashtag,
            COUNT(*) as usage_count,
            AVG(engagement) as avg_engagement
        FROM hashtags
        WHERE hashtag LIKE '#%'
        GROUP BY hashtag
        ORDER BY usage_count DESC
        LIMIT 20
        """
        
        results = self.spark.sql(query).collect()
        
        return [{
            'hashtag': row['hashtag'],
            'usage_count': row['usage_count'],
            'avg_engagement': row['avg_engagement']
        } for row in results]

    def calculate_engagement_trends(self, channel_id: str, days: int = 30) -> List[Dict[str, Any]]:
        """
        Расчет трендов вовлеченности
        """
        query = f"""
        SELECT 
            date_trunc('day', timestamp) as date,
            COUNT(*) as posts_count,
            AVG(engagement) as avg_engagement,
            SUM(engagement) as total_engagement
        FROM messages
        WHERE channel_id = '{channel_id}'
        AND timestamp >= date_sub(current_timestamp(), {days})
        GROUP BY date_trunc('day', timestamp)
        ORDER BY date
        """
        
        results = self.spark.sql(query).collect()
        
        return [{
            'date': row['date'].strftime('%Y-%m-%d'),
            'posts_count': row['posts_count'],
            'avg_engagement': row['avg_engagement'],
            'total_engagement': row['total_engagement']
        } for row in results]

    def __del__(self):
        """
        Закрытие Spark сессии при завершении работы
        """
        if hasattr(self, 'spark'):
            self.spark.stop() 