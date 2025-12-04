@echo off
echo 🔍 Verificando instalação do PostgreSQL...
echo.

REM Verificar se psql está no PATH
where psql >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL está instalado (psql encontrado)
    where psql
    echo.
    goto :check_service
) else (
    echo ⚠️  psql não encontrado no PATH
    echo.
)

REM Verificar diretórios comuns de instalação
echo Verificando diretórios de instalação...
echo.

if exist "C:\Program Files\PostgreSQL" (
    echo ✅ PostgreSQL encontrado em: C:\Program Files\PostgreSQL
    dir "C:\Program Files\PostgreSQL" /b
    echo.
    echo 💡 Adicione ao PATH: C:\Program Files\PostgreSQL\XX\bin
    echo    (substitua XX pela versão encontrada acima)
    echo.
) else (
    echo ❌ PostgreSQL não encontrado em C:\Program Files\PostgreSQL
    echo.
)

if exist "C:\Program Files (x86)\PostgreSQL" (
    echo ✅ PostgreSQL encontrado em: C:\Program Files (x86)\PostgreSQL
    dir "C:\Program Files (x86)\PostgreSQL" /b
    echo.
) else (
    echo ❌ PostgreSQL não encontrado em C:\Program Files (x86)\PostgreSQL
    echo.
)

:check_service
echo Verificando serviços PostgreSQL...
sc query | findstr /i "postgres" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Serviços PostgreSQL encontrados:
    sc query | findstr /i "postgres"
    echo.
) else (
    echo ❌ Nenhum serviço PostgreSQL encontrado
    echo.
    echo 📋 Possíveis causas:
    echo    1. PostgreSQL não está instalado
    echo    2. PostgreSQL está instalado mas não como serviço
    echo    3. Serviço tem nome diferente
    echo.
)

echo.
echo 📥 Se PostgreSQL não estiver instalado:
echo    Baixe em: https://www.postgresql.org/download/windows/
echo.
echo 💡 Dica: Durante a instalação, marque a opção para adicionar ao PATH
echo          e anote a senha do usuário 'postgres'
echo.

pause

