from flask import Blueprint, jsonify, request
from services.advanced_analytics import AdvancedAnalytics
from services.cache_service import CacheService
from typing import Dict, Any, List

advanced_analytics_bp = Blueprint('advanced_analytics', __name__)
advanced_analytics = AdvancedAnalytics()
cache_service = CacheService()

@advanced_analytics_bp.route('/channel/<channel_id>/engagement-rate', methods=['GET'])
def get_engagement_rate(channel_id: str) -> Dict[str, Any]:
    """
    Получение коэффициента вовлеченности канала
    """
    # Проверяем кэш
    cache_key = f"engagement_rate:{channel_id}"
    cached_data = cache_service.get_realtime_metrics(cache_key)
    if cached_data:
        return jsonify(cached_data)
    
    # Получаем данные из базы
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Рассчитываем ER
    engagement_rate = advanced_analytics.calculate_engagement_rate(data)
    
    result = {
        'channel_id': channel_id,
        'engagement_rate': engagement_rate,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Сохраняем в кэш
    cache_service.set_realtime_metrics(cache_key, result)
    return jsonify(result)

@advanced_analytics_bp.route('/channel/<channel_id>/peak-hours', methods=['GET'])
def get_peak_hours(channel_id: str) -> Dict[str, Any]:
    """
    Получение пиковых часов активности
    """
    # Проверяем кэш
    cache_key = f"peak_hours:{channel_id}"
    cached_data = cache_service.get_realtime_metrics(cache_key)
    if cached_data:
        return jsonify(cached_data)
    
    # Получаем данные из базы
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Анализируем пиковые часы
    peak_hours = advanced_analytics.find_peak_hours(data)
    
    result = {
        'channel_id': channel_id,
        'peak_hours': peak_hours,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Сохраняем в кэш
    cache_service.set_realtime_metrics(cache_key, result)
    return jsonify(result)

@advanced_analytics_bp.route('/channel/<channel_id>/geography', methods=['GET'])
def get_geography_analysis(channel_id: str) -> Dict[str, Any]:
    """
    Получение географического анализа аудитории
    """
    # Проверяем кэш
    cache_key = f"geography:{channel_id}"
    cached_data = cache_service.get_realtime_metrics(cache_key)
    if cached_data:
        return jsonify(cached_data)
    
    # Получаем данные из базы
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Анализируем географию
    geography_stats = advanced_analytics.analyze_geography(data)
    
    result = {
        'channel_id': channel_id,
        'geography_stats': geography_stats,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Сохраняем в кэш
    cache_service.set_realtime_metrics(cache_key, result)
    return jsonify(result)

@advanced_analytics_bp.route('/channel/<channel_id>/sentiment', methods=['POST'])
def analyze_sentiment(channel_id: str) -> Dict[str, Any]:
    """
    Анализ тональности текстов
    """
    data = request.get_json()
    if not data or 'texts' not in data:
        return jsonify({"error": "No texts provided"}), 400
    
    texts = data['texts']
    if not isinstance(texts, list):
        return jsonify({"error": "Texts must be a list"}), 400
    
    # Анализируем тональность
    sentiment_results = advanced_analytics.analyze_sentiment(texts)
    
    return jsonify({
        'channel_id': channel_id,
        'sentiment_analysis': sentiment_results,
        'timestamp': datetime.utcnow().isoformat()
    })

@advanced_analytics_bp.route('/channel/<channel_id>/trends', methods=['GET'])
def get_trends(channel_id: str) -> Dict[str, Any]:
    """
    Получение анализа трендов и аномалий
    """
    # Проверяем кэш
    cache_key = f"trends:{channel_id}"
    cached_data = cache_service.get_realtime_metrics(cache_key)
    if cached_data:
        return jsonify(cached_data)
    
    # Получаем данные из базы
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Анализируем тренды
    trends = advanced_analytics.detect_trends(data)
    
    result = {
        'channel_id': channel_id,
        'trends': trends,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Сохраняем в кэш
    cache_service.set_realtime_metrics(cache_key, result)
    return jsonify(result)

@advanced_analytics_bp.route('/channel/<channel_id>/topics', methods=['GET'])
def get_topic_clusters(channel_id: str) -> Dict[str, Any]:
    """
    Получение кластеризации тем
    """
    # Проверяем кэш
    cache_key = f"topics:{channel_id}"
    cached_data = cache_service.get_realtime_metrics(cache_key)
    if cached_data:
        return jsonify(cached_data)
    
    # Получаем данные из базы
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Получаем количество кластеров из параметров запроса
    n_clusters = request.args.get('n_clusters', default=5, type=int)
    
    # Анализируем темы
    topics = advanced_analytics.get_topic_clusters(data, n_clusters)
    
    result = {
        'channel_id': channel_id,
        'topics': topics,
        'n_clusters': n_clusters,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Сохраняем в кэш
    cache_service.set_realtime_metrics(cache_key, result)
    return jsonify(result) 