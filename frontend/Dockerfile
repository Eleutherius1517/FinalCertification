# Этап сборки
FROM node:18 AS build

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Очищаем кэш npm
RUN npm cache clean --force

# Устанавливаем все зависимости
RUN npm install --legacy-peer-deps

# Копируем исходный код
COPY . .

# Проверяем наличие директории public
RUN mkdir -p public

# Собираем приложение
RUN npm run build

# Этап production
FROM nginx:stable-alpine

# Копируем собранные файлы из этапа сборки
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"] 