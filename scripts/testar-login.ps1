# Script PowerShell para testar login
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TESTE DE LOGIN - FinUnity" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$API_URL = "http://localhost:3001"
$USERNAME = "admin"
$PASSWORD = "admin123"

# Testar conexão com backend
Write-Host "Testando conexão com backend..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-RestMethod -Uri "$API_URL/health" -Method Get -TimeoutSec 5
    Write-Host "✅ Backend está respondendo" -ForegroundColor Green
    Write-Host "   Status: $($healthCheck.status)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend não está respondendo em $API_URL" -ForegroundColor Red
    Write-Host "   Certifique-se de que o servidor está rodando: npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nTestando login com:" -ForegroundColor Yellow
Write-Host "   Username: $USERNAME" -ForegroundColor Gray
Write-Host "   Senha: $PASSWORD" -ForegroundColor Gray
Write-Host ""

# Fazer requisição de login
try {
    $body = @{
        username = $USERNAME
        password = $PASSWORD
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$API_URL/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -TimeoutSec 10

    Write-Host "✅ Login realizado com sucesso!`n" -ForegroundColor Green
    Write-Host "Resposta do servidor:" -ForegroundColor Cyan
    Write-Host "   Mensagem: $($response.message)" -ForegroundColor Gray
    Write-Host "   Username: $($response.user.username)" -ForegroundColor Gray
    Write-Host "   Tipo: $($response.user.tipo)" -ForegroundColor Gray
    Write-Host "   Token: $($response.token.Substring(0, 50))..." -ForegroundColor Gray
    
    if ($response.token) {
        Write-Host "`n✅ Token JWT recebido com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Token não encontrado na resposta" -ForegroundColor Red
        exit 1
    }

    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  TESTE CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan

} catch {
    Write-Host "❌ Erro ao fazer login:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Yellow
    
    if ($_.ErrorDetails.Message) {
        Write-Host "`nDetalhes do erro:" -ForegroundColor Yellow
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($errorDetails) {
            Write-Host "   $($errorDetails.error)" -ForegroundColor Red
        } else {
            Write-Host "   $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    exit 1
}

