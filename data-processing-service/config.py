import os
from dotenv import load_dotenv

# Загрузка переменных окружения
load_dotenv()

class Config:
    # Основные настройки приложения
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
   
    # Настройки Redis
    REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
    REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
    REDIS_DB = int(os.getenv('REDIS_DB', 0))
   
    # Настройки RabbitMQ
    RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'rabbitmq')
    RABBITMQ_PORT = int(os.getenv('RABBITMQ_PORT', 5672))
    RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'admin')
    RABBITMQ_PASSWORD = os.getenv('RABBITMQ_PASSWORD', 'admin123')
    RABBITMQ_QUEUE_MESSAGES = os.getenv('RABBITMQ_QUEUE_MESSAGES', 'social-messages')
    RABBITMQ_QUEUE_ANALYTICS = os.getenv('RABBITMQ_QUEUE_ANALYTICS', 'realtime-analytics')
   
    # Настройки Spark
    SPARK_APP_NAME = os.getenv('SPARK_APP_NAME', 'SocialAnalytics')
    SPARK_MASTER = os.getenv('SPARK_MASTER', 'local[*]')
    SPARK_EXECUTOR_MEMORY = os.getenv('SPARK_EXECUTOR_MEMORY', '2g')
    SPARK_DRIVER_MEMORY = os.getenv('SPARK_DRIVER_MEMORY', '2g')
   
    # Настройки временных окон для анализа
    REALTIME_WINDOW_SECONDS = int(os.getenv('REALTIME_WINDOW_SECONDS', 300))
    BATCH_WINDOW_DAYS = int(os.getenv('BATCH_WINDOW_DAYS', 30))
   
    # Настройки кэширования
    CACHE_TTL = {
        'channel_metrics': int(os.getenv('CACHE_TTL_CHANNEL_METRICS', 3600)),
        'weekly_report': int(os.getenv('CACHE_TTL_WEEKLY_REPORT', 7200)),
        'hashtag_analysis': int(os.getenv('CACHE_TTL_HASHTAG_ANALYSIS', 1800)),
        'engagement_trends': int(os.getenv('CACHE_TTL_ENGAGEMENT_TRENDS', 3600)),
        'realtime_metrics': int(os.getenv('CACHE_TTL_REALTIME_METRICS', 300))
    }
   
    # Настройки логирования
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT = os.getenv('LOG_FORMAT', '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
   
    # Настройки безопасности
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
    RATE_LIMIT = os.getenv('RATE_LIMIT', '100 per minute')
   
    # Настройки мониторинга
    ENABLE_METRICS = os.getenv('ENABLE_METRICS', 'True').lower() == 'true'
    METRICS_PORT = int(os.getenv('METRICS_PORT', 9090))