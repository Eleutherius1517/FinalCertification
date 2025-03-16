from flask import Flask
from flask_restful import Api
from dotenv import load_dotenv
import os

from services.data_normalizer import DataNormalizer
from services.realtime_processor import RealtimeProcessor
from services.batch_processor import BatchProcessor
from services.cache_service import CacheService
from routes.analytics import AnalyticsResource
from routes.reports import ReportsResource

# Загрузка переменных окружения
load_dotenv()

app = Flask(__name__)
api = Api(app)

# Инициализация сервисов
data_normalizer = DataNormalizer()
realtime_processor = RealtimeProcessor()
batch_processor = BatchProcessor()
cache_service = CacheService()

# Регистрация маршрутов
api.add_resource(AnalyticsResource, '/api/analytics')
api.add_resource(ReportsResource, '/api/reports')

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 8083)),
        debug=os.getenv('FLASK_ENV') == 'development'
    ) 