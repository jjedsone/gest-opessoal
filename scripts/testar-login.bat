@echo off
SETLOCAL

ECHO ========================================
ECHO   TESTE DE LOGIN - FinUnity
ECHO ========================================
ECHO.

SET API_URL=http://localhost:3001
SET USERNAME=admin
SET PASSWORD=admin123

ECHO Testando conexão com backend...
curl -s %API_URL%/health >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO ❌ Backend não está respondendo em %API_URL%
    ECHO    Certifique-se de que o servidor está rodando: npm run dev
    EXIT /B 1
)

ECHO ✅ Backend está respondendo
ECHO.

ECHO Testando login com:
ECHO   Username: %USERNAME%
ECHO   Senha: %PASSWORD%
ECHO.

REM Fazer requisição de login
curl -X POST %API_URL%/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"%USERNAME%\",\"password\":\"%PASSWORD%\"}" ^
  -w "\nHTTP Status: %%{http_code}\n" ^
  > temp_login_response.json 2>nul

IF %ERRORLEVEL% NEQ 0 (
    ECHO ❌ Erro ao fazer requisição de login
    EXIT /B 1
)

ECHO Resposta do servidor:
type temp_login_response.json
ECHO.

REM Verificar se o token foi retornado
findstr /C:"token" temp_login_response.json >nul
IF %ERRORLEVEL% EQU 0 (
    ECHO ✅ Login realizado com sucesso!
    ECHO ✅ Token JWT recebido
) ELSE (
    ECHO ❌ Login falhou - Token não encontrado na resposta
    type temp_login_response.json
    EXIT /B 1
)

REM Limpar arquivo temporário
del temp_login_response.json >nul 2>&1

ECHO.
ECHO ========================================
ECHO   TESTE CONCLUÍDO COM SUCESSO!
ECHO ========================================
ECHO.

ENDLOCAL

