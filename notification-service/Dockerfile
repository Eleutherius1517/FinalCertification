# Этап сборки
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /build

# Копируем файлы проекта
COPY pom.xml .
COPY src src/

# Собираем приложение
RUN mvn clean package -DskipTests

# Этап выполнения
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Создаем непривилегированного пользователя
RUN addgroup -S spring && adduser -S spring -G spring

# Копируем JAR из этапа сборки
COPY --from=builder /build/target/*.jar app.jar

# Указываем владельца файлов
RUN chown -R spring:spring /app

# Переключаемся на непривилегированного пользователя
USER spring

# Объявляем порт
EXPOSE 8003

# Настраиваем переменные среды по умолчанию
ENV JAVA_OPTS="-Xms512m -Xmx512m"

# Запускаем приложение
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 