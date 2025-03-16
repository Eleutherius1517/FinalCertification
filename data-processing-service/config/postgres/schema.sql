-- Создание схемы
CREATE SCHEMA IF NOT EXISTS social_analytics;

-- Таблица ролей
CREATE TABLE social_analytics.roles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица пользователей
CREATE TABLE social_analytics.users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES social_analytics.roles(role_id),
    subscription_plan VARCHAR(20) NOT NULL DEFAULT 'FREE',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица разрешений
CREATE TABLE social_analytics.permissions (
    permission_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица связи ролей и разрешений
CREATE TABLE social_analytics.role_permissions (
    role_id INTEGER REFERENCES social_analytics.roles(role_id),
    permission_id INTEGER REFERENCES social_analytics.permissions(permission_id),
    PRIMARY KEY (role_id, permission_id)
);

-- Таблица сессий
CREATE TABLE social_analytics.sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES social_analytics.users(user_id),
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица настроек пользователя
CREATE TABLE social_analytics.user_settings (
    user_id UUID PRIMARY KEY REFERENCES social_analytics.users(user_id),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'ru',
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица настроек уведомлений
CREATE TABLE social_analytics.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES social_analytics.users(user_id),
    email_notifications BOOLEAN DEFAULT true,
    telegram_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    notification_frequency VARCHAR(20) DEFAULT 'DAILY',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_users_email ON social_analytics.users(email);
CREATE INDEX idx_sessions_token ON social_analytics.sessions(token);
CREATE INDEX idx_sessions_user_id ON social_analytics.sessions(user_id);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION social_analytics.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON social_analytics.users
    FOR EACH ROW
    EXECUTE FUNCTION social_analytics.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON social_analytics.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION social_analytics.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
    BEFORE UPDATE ON social_analytics.notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION social_analytics.update_updated_at_column(); 