@echo off
echo 🔐 Criando usuário admin...
echo.

cd backend
node ..\scripts\criar-admin.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ Usuário admin criado com sucesso!
    echo.
    echo 📋 Credenciais:
    echo    Email: admin@finunity.com
    echo    Senha: admin123
    echo.
) else (
    echo.
    echo ❌ Erro ao criar usuário admin
    echo    Verifique se o PostgreSQL está rodando e configurado
    echo.
)

pause

