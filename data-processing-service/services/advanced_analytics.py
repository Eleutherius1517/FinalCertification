import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from transformers import pipeline
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from collections import Counter
import pytz

class AdvancedAnalytics:
    def __init__(self):
        # Инициализация модели для анализа тональности
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="DeepPavlov/rubert-base-cased-sentiment"
        )
        
        # Инициализация токенизатора для кластеризации
        self.tokenizer = Tokenizer(num_words=10000)
        
        # Инициализация модели для кластеризации
        self.kmeans = KMeans(n_clusters=5, random_state=42)
        self.scaler = StandardScaler()

    def calculate_engagement_rate(self, data: List[Dict[str, Any]]) -> float:
        """
        Расчет коэффициента вовлеченности (ER)
        """
        df = pd.DataFrame(data)
        
        # Подсчет общего количества взаимодействий
        total_engagement = df['likes'].sum() + df['reposts'].sum() + df['comments'].sum()
        total_subscribers = df['subscribers_count'].iloc[0]  # Берем первое значение, так как оно одинаковое для канала
        
        if total_subscribers == 0:
            return 0.0
            
        engagement_rate = (total_engagement / total_subscribers) * 100
        return round(engagement_rate, 2)

    def find_peak_hours(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Определение пиковых часов активности
        """
        df = pd.DataFrame(data)
        
        # Конвертация timestamp в datetime
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Добавление часа публикации
        df['hour'] = df['timestamp'].dt.hour
        
        # Группировка по часам и подсчет среднего количества взаимодействий
        hourly_stats = df.groupby('hour').agg({
            'likes': 'mean',
            'reposts': 'mean',
            'comments': 'mean'
        }).reset_index()
        
        # Расчет общего вовлечения для каждого часа
        hourly_stats['total_engagement'] = (
            hourly_stats['likes'] + 
            hourly_stats['reposts'] + 
            hourly_stats['comments']
        )
        
        # Сортировка по убыванию вовлечения
        peak_hours = hourly_stats.nlargest(5, 'total_engagement')
        
        return peak_hours.to_dict('records')

    def analyze_geography(self, data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Анализ географического распределения аудитории
        """
        df = pd.DataFrame(data)
        
        # Группировка по странам/городам
        location_stats = df.groupby('location').agg({
            'user_id': 'count',
            'likes': 'sum',
            'reposts': 'sum',
            'comments': 'sum'
        }).reset_index()
        
        # Расчет процента от общей аудитории
        total_users = location_stats['user_id'].sum()
        location_stats['percentage'] = (location_stats['user_id'] / total_users * 100).round(2)
        
        return location_stats.to_dict('records')

    def analyze_sentiment(self, texts: List[str]) -> List[Dict[str, Any]]:
        """
        Анализ тональности текстов
        """
        results = []
        
        for text in texts:
            sentiment = self.sentiment_analyzer(text)[0]
            results.append({
                'text': text,
                'sentiment': sentiment['label'],
                'score': round(sentiment['score'], 2)
            })
            
        return results

    def detect_trends(self, data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Обнаружение трендов и аномалий
        """
        df = pd.DataFrame(data)
        
        # Подготовка данных для кластеризации
        texts = df['content'].tolist()
        self.tokenizer.fit_on_texts(texts)
        sequences = self.tokenizer.texts_to_sequences(texts)
        padded_sequences = pad_sequences(sequences, maxlen=100)
        
        # Кластеризация текстов
        clusters = self.kmeans.fit_predict(padded_sequences)
        
        # Анализ аномалий в активности
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        hourly_activity = df.groupby(df['timestamp'].dt.floor('H')).agg({
            'comments': 'count',
            'likes': 'sum',
            'reposts': 'sum'
        }).reset_index()
        
        # Расчет z-score для определения аномалий
        z_scores = np.abs(self.scaler.fit_transform(hourly_activity[['comments', 'likes', 'reposts']]))
        anomalies = hourly_activity[z_scores > 2]  # Порог 2 стандартных отклонения
        
        return {
            'clusters': {
                'labels': clusters.tolist(),
                'cluster_centers': self.kmeans.cluster_centers_.tolist()
            },
            'anomalies': anomalies.to_dict('records')
        }

    def get_topic_clusters(self, data: List[Dict[str, Any]], n_clusters: int = 5) -> List[Dict[str, Any]]:
        """
        Кластеризация тем постов
        """
        df = pd.DataFrame(data)
        
        # Подготовка текстов
        texts = df['content'].tolist()
        self.tokenizer.fit_on_texts(texts)
        sequences = self.tokenizer.texts_to_sequences(texts)
        padded_sequences = pad_sequences(sequences, maxlen=100)
        
        # Кластеризация
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        clusters = kmeans.fit_predict(padded_sequences)
        
        # Анализ кластеров
        cluster_analysis = []
        for i in range(n_clusters):
            cluster_texts = [text for j, text in enumerate(texts) if clusters[j] == i]
            common_words = self._get_common_words(cluster_texts)
            
            cluster_analysis.append({
                'cluster_id': i,
                'size': len(cluster_texts),
                'common_words': common_words,
                'sample_texts': cluster_texts[:3]
            })
            
        return cluster_analysis

    def _get_common_words(self, texts: List[str], top_n: int = 10) -> List[Tuple[str, int]]:
        """
        Получение наиболее частых слов в текстах
        """
        words = []
        for text in texts:
            words.extend(text.lower().split())
        
        return Counter(words).most_common(top_n) 