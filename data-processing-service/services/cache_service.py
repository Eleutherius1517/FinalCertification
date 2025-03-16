import redis
import json
from typing import Dict, Any, Optional
from datetime import timedelta

class CacheService:
    def __init__(self):
        self.redis_client = redis.Redis(
            host='redis',
            port=6379,
            db=0,
            decode_responses=True
        )
        
        # Время жизни кэша для разных типов данных (в секундах)
        self.cache_ttl = {
            'channel_metrics': 3600,  # 1 час
            'weekly_report': 7200,    # 2 часа
            'hashtag_analysis': 1800, # 30 минут
            'engagement_trends': 3600, # 1 час
            'realtime_metrics': 300   # 5 минут
        }

    def get_channel_metrics(self, channel_id: str) -> Optional[Dict[str, Any]]:
        """
        Получение метрик канала из кэша
        """
        key = f"channel_metrics:{channel_id}"
        data = self.redis_client.get(key)
        return json.loads(data) if data else None

    def set_channel_metrics(self, channel_id: str, metrics: Dict[str, Any]):
        """
        Сохранение метрик канала в кэш
        """
        key = f"channel_metrics:{channel_id}"
        self.redis_client.setex(
            key,
            self.cache_ttl['channel_metrics'],
            json.dumps(metrics)
        )

    def get_weekly_report(self, channel_id: str) -> Optional[Dict[str, Any]]:
        """
        Получение еженедельного отчета из кэша
        """
        key = f"weekly_report:{channel_id}"
        data = self.redis_client.get(key)
        return json.loads(data) if data else None

    def set_weekly_report(self, channel_id: str, report: Dict[str, Any]):
        """
        Сохранение еженедельного отчета в кэш
        """
        key = f"weekly_report:{channel_id}"
        self.redis_client.setex(
            key,
            self.cache_ttl['weekly_report'],
            json.dumps(report)
        )

    def get_hashtag_analysis(self, channel_id: str) -> Optional[Dict[str, Any]]:
        """
        Получение анализа хэштегов из кэша
        """
        key = f"hashtag_analysis:{channel_id}"
        data = self.redis_client.get(key)
        return json.loads(data) if data else None

    def set_hashtag_analysis(self, channel_id: str, analysis: Dict[str, Any]):
        """
        Сохранение анализа хэштегов в кэш
        """
        key = f"hashtag_analysis:{channel_id}"
        self.redis_client.setex(
            key,
            self.cache_ttl['hashtag_analysis'],
            json.dumps(analysis)
        )

    def get_engagement_trends(self, channel_id: str) -> Optional[Dict[str, Any]]:
        """
        Получение трендов вовлеченности из кэша
        """
        key = f"engagement_trends:{channel_id}"
        data = self.redis_client.get(key)
        return json.loads(data) if data else None

    def set_engagement_trends(self, channel_id: str, trends: Dict[str, Any]):
        """
        Сохранение трендов вовлеченности в кэш
        """
        key = f"engagement_trends:{channel_id}"
        self.redis_client.setex(
            key,
            self.cache_ttl['engagement_trends'],
            json.dumps(trends)
        )

    def get_realtime_metrics(self, channel_id: str) -> Optional[Dict[str, Any]]:
        """
        Получение метрик в реальном времени из кэша
        """
        key = f"realtime_metrics:{channel_id}"
        data = self.redis_client.get(key)
        return json.loads(data) if data else None

    def set_realtime_metrics(self, channel_id: str, metrics: Dict[str, Any]):
        """
        Сохранение метрик в реальном времени в кэш
        """
        key = f"realtime_metrics:{channel_id}"
        self.redis_client.setex(
            key,
            self.cache_ttl['realtime_metrics'],
            json.dumps(metrics)
        )

    def invalidate_channel_cache(self, channel_id: str):
        """
        Инвалидация кэша для канала
        """
        patterns = [
            f"channel_metrics:{channel_id}",
            f"weekly_report:{channel_id}",
            f"hashtag_analysis:{channel_id}",
            f"engagement_trends:{channel_id}",
            f"realtime_metrics:{channel_id}"
        ]
        
        for pattern in patterns:
            self.redis_client.delete(pattern)

    def set_custom_ttl(self, key: str, ttl: int):
        """
        Установка пользовательского времени жизни для ключа
        """
        self.cache_ttl[key] = ttl 