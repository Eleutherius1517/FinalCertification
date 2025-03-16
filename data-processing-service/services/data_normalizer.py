from datetime import datetime
import json
from typing import Dict, Any

class DataNormalizer:
    def normalize_message(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Нормализация данных сообщения в единый формат
        """
        platform = raw_data.get('networkType', '').lower()
        
        if platform == 'telegram':
            return self._normalize_telegram_message(raw_data)
        elif platform == 'twitter':
            return self._normalize_twitter_message(raw_data)
        elif platform == 'vk':
            return self._normalize_vk_message(raw_data)
        else:
            raise ValueError(f"Неподдерживаемая платформа: {platform}")

    def _normalize_telegram_message(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'platform': 'telegram',
            'content': data.get('text', ''),
            'engagement': data.get('viewsCount', 0),
            'timestamp': data.get('publishedAt', datetime.utcnow().isoformat()),
            'message_id': data.get('id'),
            'channel_id': data.get('channelId'),
            'reactions': data.get('reactions', []),
            'comments_count': data.get('commentsCount', 0)
        }

    def _normalize_twitter_message(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'platform': 'twitter',
            'content': data.get('text', ''),
            'engagement': data.get('likes', 0) + data.get('retweets', 0),
            'timestamp': data.get('created_at', datetime.utcnow().isoformat()),
            'message_id': data.get('id'),
            'channel_id': data.get('channelId'),
            'reactions': [
                {'emoji': '❤️', 'count': data.get('likes', 0)},
                {'emoji': '🔄', 'count': data.get('retweets', 0)}
            ],
            'comments_count': data.get('replies', 0)
        }

    def _normalize_vk_message(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'platform': 'vk',
            'content': data.get('text', ''),
            'engagement': data.get('likes', 0) + data.get('reposts', 0),
            'timestamp': data.get('date', datetime.utcnow().isoformat()),
            'message_id': data.get('id'),
            'channel_id': data.get('channelId'),
            'reactions': [
                {'emoji': '❤️', 'count': data.get('likes', 0)},
                {'emoji': '🔄', 'count': data.get('reposts', 0)}
            ],
            'comments_count': data.get('comments', 0)
        }

    def normalize_channel(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Нормализация данных канала в единый формат
        """
        platform = raw_data.get('networkType', '').lower()
        
        if platform == 'telegram':
            return self._normalize_telegram_channel(raw_data)
        elif platform == 'twitter':
            return self._normalize_twitter_channel(raw_data)
        elif platform == 'vk':
            return self._normalize_vk_channel(raw_data)
        else:
            raise ValueError(f"Неподдерживаемая платформа: {platform}")

    def _normalize_telegram_channel(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'platform': 'telegram',
            'channel_id': data.get('id'),
            'name': data.get('name'),
            'description': data.get('description'),
            'subscribers_count': data.get('subscribersCount', 0),
            'posts_count': data.get('postsCount', 0),
            'engagement_rate': data.get('engagementRate', 0.0),
            'last_updated': data.get('lastUpdated', datetime.utcnow().isoformat())
        }

    def _normalize_twitter_channel(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'platform': 'twitter',
            'channel_id': data.get('id'),
            'name': data.get('name'),
            'description': data.get('description'),
            'subscribers_count': data.get('followers_count', 0),
            'posts_count': data.get('tweets_count', 0),
            'engagement_rate': data.get('engagement_rate', 0.0),
            'last_updated': data.get('last_updated', datetime.utcnow().isoformat())
        }

    def _normalize_vk_channel(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'platform': 'vk',
            'channel_id': data.get('id'),
            'name': data.get('name'),
            'description': data.get('description'),
            'subscribers_count': data.get('members_count', 0),
            'posts_count': data.get('wall_count', 0),
            'engagement_rate': data.get('engagement_rate', 0.0),
            'last_updated': data.get('last_updated', datetime.utcnow().isoformat())
        } 