@echo off
echo 🔍 Verificando PostgreSQL...

REM Tentar conectar
pg_isready -h localhost -p 5432 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL está rodando na porta 5432
    echo.
    echo Testando conexão...
    psql -U postgres -c "SELECT version();" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Conexão com PostgreSQL funcionando!
    ) else (
        echo ⚠️  PostgreSQL está rodando mas não consegue conectar
        echo    Verifique as credenciais no arquivo backend\.env
    )
) else (
    echo ❌ PostgreSQL NÃO está rodando na porta 5432
    echo.
    echo 📋 Como iniciar PostgreSQL:
    echo.
    echo Windows (Serviço):
    echo   1. Abra "Serviços" (services.msc)
    echo   2. Procure por "PostgreSQL"
    echo   3. Clique com botão direito e selecione "Iniciar"
    echo.
    echo Ou execute:
    echo   net start postgresql-x64-14
    echo   (substitua 14 pela sua versão)
    echo.
    echo Linux:
    echo   sudo systemctl start postgresql
    echo.
    echo Mac:
    echo   brew services start postgresql
    echo.
)

pause

