#!/bin/bash

# Ждем, пока Keycloak станет доступен
echo "Waiting for Keycloak to be ready..."
until curl -s http://localhost:8080/health/ready > /dev/null; do
    sleep 5
done

# Получаем токен администратора
echo "Getting admin token..."
TOKEN=$(curl -d "client_id=admin-cli" -d "username=$KEYCLOAK_ADMIN" -d "password=$KEYCLOAK_ADMIN_PASSWORD" -d "grant_type=password" "http://localhost:8080/realms/master/protocol/openid-connect/token" | jq -r '.access_token')

# Создаем realm
echo "Creating realm..."
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"realm":"social-analytics","enabled":true}' "http://localhost:8080/admin/realms"

# Создаем клиентов и получаем их секреты
echo "Creating clients and getting secrets..."

# Функция для создания клиента и получения секрета
create_client() {
    local client_id=$1
    local client_name=$2
    
    # Создаем клиента
    curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"clientId\":\"$client_id\",\"name\":\"$client_name\",\"enabled\":true,\"clientAuthenticatorType\":\"client-secret\",\"directAccessGrantsEnabled\":true,\"serviceAccountsEnabled\":true,\"authorizationServicesEnabled\":true,\"redirectUris\":[\"http://localhost:8000/*\"]}" "http://localhost:8080/admin/realms/social-analytics/clients"
    
    # Получаем ID клиента
    local client_uuid=$(curl -H "Authorization: Bearer $TOKEN" "http://localhost:8080/admin/realms/social-analytics/clients" | jq -r ".[] | select(.clientId==\"$client_id\") | .id")
    
    # Получаем секрет
    local secret=$(curl -H "Authorization: Bearer $TOKEN" "http://localhost:8080/admin/realms/social-analytics/clients/$client_uuid/client-secret" | jq -r '.value')
    
    echo "$secret"
}

# Создаем клиентов и получаем секреты
API_GATEWAY_SECRET=$(create_client "api-gateway" "API Gateway")
AUTH_SERVICE_SECRET=$(create_client "auth-service" "Auth Service")
DATA_PROCESSING_SECRET=$(create_client "data-processing-service" "Data Processing Service")
NOTIFICATION_SECRET=$(create_client "notification-service" "Notification Service")
SOCIAL_INTEGRATOR_SECRET=$(create_client "social-integrator-service" "Social Integrator Service")

# Обновляем .env файл
echo "Updating .env file..."
sed -i "s|KEYCLOAK_API_GATEWAY_SECRET=.*|KEYCLOAK_API_GATEWAY_SECRET=$API_GATEWAY_SECRET|" .env
sed -i "s|KEYCLOAK_AUTH_SERVICE_SECRET=.*|KEYCLOAK_AUTH_SERVICE_SECRET=$AUTH_SERVICE_SECRET|" .env
sed -i "s|KEYCLOAK_DATA_PROCESSING_SECRET=.*|KEYCLOAK_DATA_PROCESSING_SECRET=$DATA_PROCESSING_SECRET|" .env
sed -i "s|KEYCLOAK_NOTIFICATION_SECRET=.*|KEYCLOAK_NOTIFICATION_SECRET=$NOTIFICATION_SECRET|" .env
sed -i "s|KEYCLOAK_SOCIAL_INTEGRATOR_SECRET=.*|KEYCLOAK_SOCIAL_INTEGRATOR_SECRET=$SOCIAL_INTEGRATOR_SECRET|" .env

echo "Keycloak initialization completed!" 