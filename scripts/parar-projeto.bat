@echo off
echo 🛑 Parando Projeto FinUnity
echo ================================
echo.

echo 📋 Parando processos Node.js...
taskkill /F /IM node.exe >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Processos Node.js parados
) else (
    echo ℹ️  Nenhum processo Node.js encontrado
)

echo.
echo 📋 Verificando portas...
netstat -ano | findstr ":3000 :3001" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Algumas portas ainda podem estar em uso
    echo    Aguarde alguns segundos ou reinicie o terminal
) else (
    echo ✅ Portas 3000 e 3001 liberadas
)

echo.
echo ================================
echo ✅ Projeto parado com sucesso!
echo.
echo Para iniciar novamente:
echo    npm run dev
echo.
pause

