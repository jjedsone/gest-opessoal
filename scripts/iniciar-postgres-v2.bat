@echo off
setlocal enabledelayedexpansion

echo 🚀 Tentando iniciar PostgreSQL...
echo.

REM Lista de nomes de serviço possíveis
set SERVICES=postgresql-x64-16 postgresql-x64-15 postgresql-x64-14 postgresql-x64-13 postgresql-x64-12 PostgreSQL-16 PostgreSQL-15 PostgreSQL-14 PostgreSQL-13 postgresql

for %%S in (%SERVICES%) do (
    echo Testando: %%S
    sc query "%%S" >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ Serviço encontrado: %%S
        echo    Tentando iniciar...
        net start "%%S" >nul 2>&1
        if !errorlevel! equ 0 (
            echo ✅ PostgreSQL iniciado com sucesso!
            echo    Serviço: %%S
            timeout /t 2 /nobreak >nul
            goto :test
        ) else (
            sc query "%%S" | findstr "RUNNING" >nul
            if !errorlevel! equ 0 (
                echo ℹ️  PostgreSQL já está rodando!
                goto :test
            ) else (
                echo ⚠️  Não foi possível iniciar automaticamente
                echo    Tente iniciar manualmente pelo Services (services.msc)
                goto :end
            )
        )
    )
)

echo ❌ Não foi possível encontrar o serviço PostgreSQL
echo.
echo 📋 Opções:
echo    1. Execute: scripts\encontrar-postgres.bat para encontrar o nome do serviço
echo    2. Abra Services (services.msc) e inicie manualmente
echo    3. Use o pgAdmin para iniciar o PostgreSQL
echo.
goto :end

:test
echo.
echo 🔍 Testando conexão...
timeout /t 2 /nobreak >nul

REM Verificar se psql está disponível
where psql >nul 2>&1
if %errorlevel% equ 0 (
    psql -U postgres -c "SELECT version();" >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ PostgreSQL está funcionando e aceitando conexões!
    ) else (
        echo ⚠️  PostgreSQL está rodando mas não consegue conectar
        echo    Verifique as credenciais no arquivo backend\.env
    )
) else (
    echo ⚠️  psql não está no PATH, mas o serviço está rodando
    echo    Teste manualmente: psql -U postgres
)

:end
pause

