@echo off
echo 🧪 Testando Projeto FinUnity
echo ================================
echo.

echo 📋 Verificando serviços...
echo.

REM Verificar PostgreSQL
where psql >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL encontrado
) else (
    echo ⚠️  PostgreSQL não encontrado no PATH
)

echo.
echo 📋 Testando Backend (porta 3001)...
echo.

curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend está respondendo
    curl -s http://localhost:3001/health
    echo.
    echo.
) else (
    echo ❌ Backend não está respondendo
    echo    Verifique se está rodando: cd backend ^&^& npm run dev
    echo.
)

echo 📋 Testando Frontend (porta 3000)...
echo.

curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend está respondendo
    echo    Acesse: http://localhost:3000
    echo.
) else (
    echo ❌ Frontend não está respondendo
    echo    Verifique se está rodando: cd frontend ^&^& npm run dev
    echo.
)

echo 📋 Testando Login Admin...
echo.

curl -s -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@finunity.com\",\"password\":\"admin123\"}" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Endpoint de login está funcionando
    echo    Testando login...
    curl -s -X POST http://localhost:3001/api/auth/login ^
      -H "Content-Type: application/json" ^
      -d "{\"email\":\"admin@finunity.com\",\"password\":\"admin123\"}"
    echo.
    echo.
) else (
    echo ⚠️  Não foi possível testar login (backend pode não estar rodando)
    echo.
)

echo ================================
echo ✅ Testes concluídos!
echo.
echo 📝 Próximos passos:
echo    1. Acesse: http://localhost:3000
echo    2. Use o botão "Login Rápido (Admin)"
echo    3. Ou faça login com: admin@finunity.com / admin123
echo.
pause

