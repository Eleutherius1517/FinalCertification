# Базовый образ с поддержкой CUDA для ML
FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04 as builder

# Установка Python и зависимостей
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Копируем файлы зависимостей
COPY requirements.txt .

# Установка зависимостей
RUN pip3 install --no-cache-dir -r requirements.txt

# Этап выполнения
FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04

# Установка Python
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Создаем непривилегированного пользователя
RUN groupadd -r app && useradd -r -g app app

# Копируем зависимости из этапа сборки
COPY --from=builder /usr/local/lib/python3.11/dist-packages /usr/local/lib/python3.11/dist-packages

# Копируем исходный код
COPY . .

# Указываем владельца файлов
RUN chown -R app:app /app

# Переключаемся на непривилегированного пользователя
USER app

# Объявляем порт
EXPOSE 8002

# Настраиваем переменные среды
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app \
    FLASK_APP=app.py \
    FLASK_ENV=production

# Запускаем приложение
CMD ["python3", "app.py"] 