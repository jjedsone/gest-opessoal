@echo off
echo ⚙️  Configuração Completa do FinUnity
echo ========================================
echo.

REM Verificar se está na raiz
if not exist "backend" (
    echo ❌ Execute este script na raiz do projeto
    pause
    exit /b 1
)

echo 📋 PASSO 1: Criar arquivo .env
echo.

cd backend

if not exist ".env" (
    echo Criando arquivo .env...
    (
        echo # Configuração do Backend FinUnity
        echo.
        echo # Porta do servidor
        echo PORT=3001
        echo.
        echo # URL de conexão com PostgreSQL
        echo # IMPORTANTE: Substitua SUA_SENHA_AQUI pela senha do PostgreSQL
        echo DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/finunity
        echo.
        echo # Secret para JWT
        echo JWT_SECRET=finunity_jwt_secret_2024_mude_em_producao
        echo.
        echo # Tempo de expiração do token
        echo JWT_EXPIRES_IN=7d
        echo.
        echo # Ambiente
        echo NODE_ENV=development
    ) > .env
    
    echo ✅ Arquivo .env criado!
    echo.
    echo ⚠️  ATENÇÃO: Edite o arquivo backend\.env
    echo    Especialmente a linha DATABASE_URL com sua senha do PostgreSQL
    echo.
    echo    Pressione qualquer tecla para abrir o arquivo .env no editor...
    pause >nul
    notepad .env
) else (
    echo ✅ Arquivo .env já existe
    echo.
)

cd ..

echo.
echo 📋 PASSO 2: Configurar Banco de Dados
echo.

REM Verificar PostgreSQL
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL não encontrado no PATH
    echo    Configure manualmente ou instale o PostgreSQL
    echo    Veja: INICIAR-POSTGRES.md
    echo.
    goto :skip_db
)

echo Verificando conexão com PostgreSQL...
psql -U postgres -c "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Não foi possível conectar ao PostgreSQL
    echo    Verifique se está rodando
    echo    Veja: INICIAR-POSTGRES.md
    echo.
    goto :skip_db
)

echo ✅ PostgreSQL está acessível
echo.

REM Criar banco se não existir
psql -U postgres -l | findstr finunity >nul 2>&1
if %errorlevel% neq 0 (
    echo Criando banco de dados 'finunity'...
    createdb finunity
    if %errorlevel% equ 0 (
        echo ✅ Banco criado
    )
) else (
    echo ✅ Banco 'finunity' já existe
)

REM Executar schema
if exist "database\schema.sql" (
    echo Executando schema SQL...
    psql -U postgres -d finunity -f database\schema.sql >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Schema SQL executado
    ) else (
        echo ⚠️  Erro ao executar schema (pode já estar executado)
    )
) else (
    echo ⚠️  Arquivo database\schema.sql não encontrado
)

:skip_db
echo.
echo 📋 PASSO 3: Verificar Dependências
echo.

if not exist "backend\node_modules" (
    echo ⚠️  Dependências do backend não instaladas
    echo    Instalando...
    cd backend
    call npm install
    cd ..
) else (
    echo ✅ Dependências do backend OK
)

if not exist "frontend\node_modules" (
    echo ⚠️  Dependências do frontend não instaladas
    echo    Instalando...
    cd frontend
    call npm install
    cd ..
) else (
    echo ✅ Dependências do frontend OK
)

echo.
echo ========================================
echo ✅ Configuração Concluída!
echo ========================================
echo.
echo 📝 PRÓXIMOS PASSOS:
echo.
echo 1. Edite backend\.env com sua senha do PostgreSQL
echo    (linha DATABASE_URL)
echo.
echo 2. Execute o projeto:
echo    npm run dev
echo.
echo 3. Acesse:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001/health
echo.
pause

