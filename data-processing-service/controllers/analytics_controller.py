from flask import Blueprint, jsonify, request
from services.data_normalizer import DataNormalizer
from services.realtime_processor import RealtimeProcessor
from services.batch_processor import BatchProcessor
from services.cache_service import CacheService
from typing import Dict, Any

analytics_bp = Blueprint('analytics', __name__)
data_normalizer = DataNormalizer()
realtime_processor = RealtimeProcessor()
batch_processor = BatchProcessor()
cache_service = CacheService()

@analytics_bp.route('/channel/<channel_id>/metrics', methods=['GET'])
def get_channel_metrics(channel_id: str) -> Dict[str, Any]:
    """
    Получение метрик канала
    """
    # Проверяем кэш
    cached_metrics = cache_service.get_channel_metrics(channel_id)
    if cached_metrics:
        return jsonify(cached_metrics)
    
    # Если нет в кэше, вычисляем метрики
    days = request.args.get('days', default=30, type=int)
    metrics = batch_processor.calculate_channel_metrics(channel_id, days)
    
    # Сохраняем в кэш
    cache_service.set_channel_metrics(channel_id, metrics)
    return jsonify(metrics)

@analytics_bp.route('/channel/<channel_id>/weekly-report', methods=['GET'])
def get_weekly_report(channel_id: str) -> Dict[str, Any]:
    """
    Получение еженедельного отчета
    """
    # Проверяем кэш
    cached_report = cache_service.get_weekly_report(channel_id)
    if cached_report:
        return jsonify(cached_report)
    
    # Если нет в кэше, генерируем отчет
    report = batch_processor.calculate_weekly_report(channel_id)
    
    # Сохраняем в кэш
    cache_service.set_weekly_report(channel_id, report)
    return jsonify(report)

@analytics_bp.route('/channel/<channel_id>/hashtags', methods=['GET'])
def get_hashtag_analysis(channel_id: str) -> Dict[str, Any]:
    """
    Получение анализа хэштегов
    """
    # Проверяем кэш
    cached_analysis = cache_service.get_hashtag_analysis(channel_id)
    if cached_analysis:
        return jsonify(cached_analysis)
    
    # Если нет в кэше, выполняем анализ
    analysis = batch_processor.analyze_hashtags(channel_id)
    
    # Сохраняем в кэш
    cache_service.set_hashtag_analysis(channel_id, analysis)
    return jsonify(analysis)

@analytics_bp.route('/channel/<channel_id>/engagement-trends', methods=['GET'])
def get_engagement_trends(channel_id: str) -> Dict[str, Any]:
    """
    Получение трендов вовлеченности
    """
    # Проверяем кэш
    cached_trends = cache_service.get_engagement_trends(channel_id)
    if cached_trends:
        return jsonify(cached_trends)
    
    # Если нет в кэше, вычисляем тренды
    trends = batch_processor.calculate_engagement_trends(channel_id)
    
    # Сохраняем в кэш
    cache_service.set_engagement_trends(channel_id, trends)
    return jsonify(trends)

@analytics_bp.route('/channel/<channel_id>/realtime', methods=['GET'])
def get_realtime_metrics(channel_id: str) -> Dict[str, Any]:
    """
    Получение метрик в реальном времени
    """
    # Проверяем кэш
    cached_metrics = cache_service.get_realtime_metrics(channel_id)
    if cached_metrics:
        return jsonify(cached_metrics)
    
    # Если нет в кэше, получаем текущие метрики
    metrics = realtime_processor.get_current_metrics(channel_id)
    
    # Сохраняем в кэш
    cache_service.set_realtime_metrics(channel_id, metrics)
    return jsonify(metrics)

@analytics_bp.route('/channel/<channel_id>/cache/invalidate', methods=['POST'])
def invalidate_channel_cache(channel_id: str) -> Dict[str, Any]:
    """
    Инвалидация кэша для канала
    """
    cache_service.invalidate_channel_cache(channel_id)
    return jsonify({"status": "success", "message": "Cache invalidated"})

@analytics_bp.route('/normalize', methods=['POST'])
def normalize_data() -> Dict[str, Any]:
    """
    Нормализация данных из социальных сетей
    """
    data = request.get_json()
    platform = data.get('platform')
    content_type = data.get('content_type')
    raw_data = data.get('data')
    
    if not all([platform, content_type, raw_data]):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        if content_type == 'message':
            normalized_data = data_normalizer.normalize_message(platform, raw_data)
        elif content_type == 'channel':
            normalized_data = data_normalizer.normalize_channel(platform, raw_data)
        else:
            return jsonify({"error": "Invalid content type"}), 400
            
        return jsonify(normalized_data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400 