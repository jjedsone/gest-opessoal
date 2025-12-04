@echo off
echo 🚀 Tentando iniciar PostgreSQL...

REM Tentar diferentes nomes de serviço comuns
net start postgresql-x64-16 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL 16 iniciado!
    goto :end
)

net start postgresql-x64-15 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL 15 iniciado!
    goto :end
)

net start postgresql-x64-14 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL 14 iniciado!
    goto :end
)

net start postgresql-x64-13 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL 13 iniciado!
    goto :end
)

echo ❌ Não foi possível iniciar PostgreSQL automaticamente
echo.
echo 📋 Opções:
echo   1. Abra "Serviços" (services.msc) e inicie manualmente
echo   2. Ou execute: net start postgresql-x64-XX (substitua XX pela versão)
echo   3. Ou inicie pelo pgAdmin
echo.

:end
timeout /t 2 /nobreak >nul
pg_isready -h localhost -p 5432 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL está rodando e pronto para uso!
) else (
    echo ⚠️  PostgreSQL ainda não está acessível
)

pause

