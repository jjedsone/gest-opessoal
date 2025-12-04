@echo off
echo 🚀 Iniciando FinUnity em modo desenvolvimento...
echo.

REM Verificar se node_modules existe
if not exist "backend\node_modules" (
    echo ⚠️  Dependências do backend não instaladas. Execute: scripts\setup.bat
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo ⚠️  Dependências do frontend não instaladas. Execute: scripts\setup.bat
    pause
    exit /b 1
)

REM Verificar se .env existe
if not exist "backend\.env" (
    echo ⚠️  Arquivo backend\.env não encontrado!
    echo Copie backend\.env.example para backend\.env e configure.
    pause
    exit /b 1
)

echo ✅ Verificações concluídas!
echo.
echo Iniciando servidores...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.

start "FinUnity Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "FinUnity Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Servidores iniciados em janelas separadas!
echo Pressione qualquer tecla para fechar esta janela (os servidores continuarão rodando).
pause >nul

