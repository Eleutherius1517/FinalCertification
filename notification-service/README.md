# Сервис уведомлений

Сервис для отправки уведомлений через Telegram и обработки триггеров на основе данных из социальных сетей.

## Основные возможности

### Уведомления
- Telegram Bot: оповещения в реальном времени

### Триггеры
- Мониторинг резких изменений активности
- Отслеживание упоминаний бренда
- Настраиваемые условия уведомлений

## Технологии

- Spring Boot 3.2.0
- RabbitMQ
- PostgreSQL
- Telegram Bot API
- Docker

## Требования

- Java 17
- Docker и Docker Compose
- Доступ к сервисам:
  - Telegram Bot API

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd notification-service
```

2. Создайте файл .env на основе .env.example:
```bash
cp .env.example .env
```

3. Настройте переменные окружения в файле .env:
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_BOT_USERNAME=your_telegram_bot_username
```

4. Соберите проект:
```bash
./mvnw clean package
```

5. Запустите сервис с помощью Docker Compose:
```bash
docker-compose up --build
```

## API Endpoints

### Управление настройками уведомлений
```
GET /api/preferences/{userId}
PUT /api/preferences/{userId}
```

### Управление уведомлениями
```
GET /api/notifications/{userId}
POST /api/notifications/send
```

### Управление триггерами
```
POST /api/triggers/activity
POST /api/triggers/brand-mention
```

## Триггеры

### Мониторинг активности
- Отслеживание резких изменений активности в каналах
- Настраиваемый порог падения активности (по умолчанию 50%)
- Настраиваемое окно времени (по умолчанию 2 часа)

### Упоминания бренда
- Поиск ключевых слов в сообщениях
- Поддержка множества ключевых слов
- Регистронезависимый поиск

## Разработка

### Локальная разработка

1. Запустите необходимые сервисы:
```bash
docker-compose up -d postgres rabbitmq
```

2. Запустите приложение:
```bash
./mvnw spring-boot:run
```

### Тестирование

Запуск тестов:
```bash
./mvnw test
```

## Мониторинг

Сервис предоставляет метрики в формате Prometheus по адресу `/actuator/prometheus`.

## Лицензия

MIT 