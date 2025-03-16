# Ждем, пока Keycloak будет готов
$maxAttempts = 30
$attempt = 0
Write-Host "Waiting for Keycloak to be ready..."
do {
    try {
        Write-Host "Attempt $($attempt + 1) of $maxAttempts"
        $response = Invoke-WebRequest -Uri "http://keycloak:8080/realms/master" -Method GET -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "Keycloak is ready!"
            break
        }
    }
    catch {
        Write-Host "Keycloak is not ready yet. Error: $_"
        $attempt++
        if ($attempt -eq $maxAttempts) {
            Write-Error "Keycloak failed to start after $maxAttempts attempts"
            exit 1
        }
        Start-Sleep -Seconds 10
    }
} while ($true)

Write-Host "Getting admin token..."
# Получаем токен администратора
try {
    $tokenResponse = Invoke-WebRequest -Uri "http://keycloak:8080/realms/master/protocol/openid-connect/token" `
        -Method POST `
        -Body "client_id=admin-cli&username=$env:KEYCLOAK_ADMIN&password=$env:KEYCLOAK_ADMIN_PASSWORD&grant_type=password" `
        -ContentType "application/x-www-form-urlencoded"

    $token = ($tokenResponse.Content | ConvertFrom-Json).access_token
    Write-Host "Successfully obtained admin token"
} catch {
    Write-Error "Failed to get admin token: $_"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Creating realm..."
# Создаем realm
$realmConfig = @{
    realm = $env:KEYCLOAK_REALM
    enabled = $true
    displayName = "Social Analytics"
} | ConvertTo-Json

try {
    Invoke-WebRequest -Uri "http://keycloak:8080/admin/realms" `
        -Method POST `
        -Headers $headers `
        -Body $realmConfig
} catch {
    Write-Host "Realm might already exist, continuing..."
}

Write-Host "Creating clients and getting secrets..."
# Список клиентов для создания
$clients = @(
    @{
        clientId = "api-gateway"
        secret = "KEYCLOAK_API_GATEWAY_SECRET"
    },
    @{
        clientId = "auth-service"
        secret = "KEYCLOAK_AUTH_SERVICE_SECRET"
    },
    @{
        clientId = "data-processing-service"
        secret = "KEYCLOAK_DATA_PROCESSING_SECRET"
    },
    @{
        clientId = "notification-service"
        secret = "KEYCLOAK_NOTIFICATION_SECRET"
    },
    @{
        clientId = "social-integrator-service"
        secret = "KEYCLOAK_SOCIAL_INTEGRATOR_SECRET"
    }
)

foreach ($client in $clients) {
    # Создаем клиента
    $clientConfig = @{
        clientId = $client.clientId
        enabled = $true
        protocol = "openid-connect"
        publicClient = $false
        standardFlowEnabled = $true
        serviceAccountsEnabled = $true
        authorizationServicesEnabled = $true
    } | ConvertTo-Json

    try {
        Invoke-WebRequest -Uri "http://keycloak:8080/admin/realms/$($env:KEYCLOAK_REALM)/clients" `
            -Method POST `
            -Headers $headers `
            -Body $clientConfig
    } catch {
        Write-Host "Client $($client.clientId) might already exist, continuing..."
    }

    # Получаем ID клиента
    $clientsResponse = Invoke-WebRequest -Uri "http://keycloak:8080/admin/realms/$($env:KEYCLOAK_REALM)/clients" `
        -Headers $headers
    $clients = $clientsResponse.Content | ConvertFrom-Json
    $clientId = ($clients | Where-Object { $_.clientId -eq $client.clientId }).id

    # Получаем секрет клиента
    $secretResponse = Invoke-WebRequest -Uri "http://keycloak:8080/admin/realms/$($env:KEYCLOAK_REALM)/clients/$clientId/client-secret" `
        -Headers $headers
    $secret = ($secretResponse.Content | ConvertFrom-Json).value

    # Обновляем .env файл
    Write-Host "Updating .env file..."
    $envPath = "/app/.env"
    $envContent = Get-Content $envPath -Raw
    $envContent = $envContent -replace "(?m)^$($client.secret)=.*$", "$($client.secret)=$secret"
    $envContent | Set-Content $envPath
}

Write-Host "Keycloak initialization completed!" 