// Создание индексов и валидации для коллекций MongoDB

// Коллекция сообщений
db.createCollection("messages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["message_id", "channel_id", "platform", "content", "timestamp"],
      properties: {
        message_id: { bsonType: "string" },
        channel_id: { bsonType: "string" },
        platform: { enum: ["TELEGRAM", "TWITTER", "VK"] },
        content: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        views: { bsonType: "int" },
        reactions: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["type", "count"],
            properties: {
              type: { bsonType: "string" },
              count: { bsonType: "int" }
            }
          }
        },
        comments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["user_id", "text", "timestamp"],
            properties: {
              user_id: { bsonType: "string" },
              text: { bsonType: "string" },
              timestamp: { bsonType: "date" }
            }
          }
        },
        metadata: { bsonType: "object" }
      }
    }
  }
});

// Коллекция каналов
db.createCollection("channels", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["channel_id", "platform", "name", "url"],
      properties: {
        channel_id: { bsonType: "string" },
        platform: { enum: ["TELEGRAM", "TWITTER", "VK"] },
        name: { bsonType: "string" },
        url: { bsonType: "string" },
        description: { bsonType: "string" },
        subscribers_count: { bsonType: "int" },
        posts_count: { bsonType: "int" },
        last_updated: { bsonType: "date" },
        metadata: { bsonType: "object" }
      }
    }
  }
});

// Коллекция метрик
db.createCollection("metrics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["channel_id", "metric_type", "timestamp", "value"],
      properties: {
        channel_id: { bsonType: "string" },
        metric_type: { enum: ["ENGAGEMENT", "REACH", "GROWTH", "ACTIVITY"] },
        timestamp: { bsonType: "date" },
        value: { bsonType: "number" },
        period: { enum: ["HOURLY", "DAILY", "WEEKLY", "MONTHLY"] },
        metadata: { bsonType: "object" }
      }
    }
  }
});

// Создание индексов
db.messages.createIndex({ "message_id": 1 }, { unique: true });
db.messages.createIndex({ "channel_id": 1, "timestamp": -1 });
db.messages.createIndex({ "platform": 1, "timestamp": -1 });

db.channels.createIndex({ "channel_id": 1 }, { unique: true });
db.channels.createIndex({ "platform": 1 });
db.channels.createIndex({ "name": "text" });

db.metrics.createIndex({ "channel_id": 1, "metric_type": 1, "timestamp": -1 });
db.metrics.createIndex({ "timestamp": -1 });

// Создание TTL индексов для автоматического удаления старых данных
db.messages.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // 90 дней
db.metrics.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 }); // 1 год 