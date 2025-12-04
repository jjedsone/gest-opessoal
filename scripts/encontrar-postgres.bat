@echo off
echo 🔍 Procurando serviço PostgreSQL...

echo.
echo Verificando serviços PostgreSQL instalados...
echo.

REM Listar todos os serviços que contêm "postgres"
sc query | findstr /i "postgres" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Serviços PostgreSQL encontrados:
    sc query | findstr /i "postgres"
    echo.
) else (
    echo ❌ Nenhum serviço PostgreSQL encontrado
    echo.
    echo Verificando se PostgreSQL está instalado...
    where psql >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ PostgreSQL está instalado
        echo    Mas o serviço pode ter um nome diferente
    ) else (
        echo ❌ PostgreSQL não parece estar instalado
        echo    Baixe em: https://www.postgresql.org/download/windows/
    )
)

echo.
echo Tentando encontrar o nome exato do serviço...
echo.

REM Tentar diferentes nomes comuns
set SERVICES[0]=postgresql-x64-16
set SERVICES[1]=postgresql-x64-15
set SERVICES[2]=postgresql-x64-14
set SERVICES[3]=postgresql-x64-13
set SERVICES[4]=postgresql-x64-12
set SERVICES[5]=PostgreSQL-16
set SERVICES[6]=PostgreSQL-15
set SERVICES[7]=PostgreSQL-14
set SERVICES[8]=PostgreSQL-13
set SERVICES[9]=postgresql

echo Testando nomes de serviço comuns...
echo.

for /L %%i in (0,1,9) do (
    call set SERVICE_NAME=%%SERVICES[%%i]%%
    sc query "!SERVICE_NAME!" >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ Serviço encontrado: !SERVICE_NAME!
        echo.
        echo Status do serviço:
        sc query "!SERVICE_NAME!"
        echo.
        echo Para iniciar, execute:
        echo   net start "!SERVICE_NAME!"
        echo.
        goto :found
    )
)

echo ❌ Não foi possível encontrar o serviço automaticamente
echo.
echo 📋 Como encontrar manualmente:
echo    1. Pressione Win+R
echo    2. Digite: services.msc
echo    3. Procure por serviços que contenham "postgres" ou "PostgreSQL"
echo    4. Anote o nome exato do serviço
echo    5. Execute: net start "NOME_DO_SERVIÇO"
echo.

:found
pause

