@echo off
echo ⚙️  Configurando Projeto FinUnity
echo.

REM Verificar se está na raiz do projeto
if not exist "backend" (
    echo ❌ Execute este script na raiz do projeto
    pause
    exit /b 1
)

echo 📋 Passo 1: Configurando arquivo .env
echo.

cd backend

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo ✅ Arquivo .env criado a partir do .env.example
    ) else (
        echo ⚠️  Arquivo .env.example não encontrado
        echo    Criando .env básico...
        (
            echo PORT=3001
            echo DATABASE_URL=postgresql://postgres:SENHA_AQUI@localhost:5432/finunity
            echo JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
            echo JWT_EXPIRES_IN=7d
            echo NODE_ENV=development
        ) > .env
        echo ✅ Arquivo .env criado
    )
    echo.
    echo ⚠️  IMPORTANTE: Edite o arquivo backend\.env com suas credenciais!
    echo    Especialmente: DATABASE_URL e JWT_SECRET
    echo.
) else (
    echo ✅ Arquivo .env já existe
    echo.
)

cd ..

echo 📋 Passo 2: Verificando banco de dados
echo.

REM Verificar se psql está disponível
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  psql não encontrado no PATH
    echo    PostgreSQL pode não estar instalado ou não está no PATH
    echo    Configure manualmente o banco de dados
    echo.
    goto :skip_db
)

echo Testando conexão com PostgreSQL...
psql -U postgres -c "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Não foi possível conectar ao PostgreSQL
    echo    Verifique se está rodando e se as credenciais estão corretas
    echo.
    goto :skip_db
)

echo ✅ PostgreSQL está acessível
echo.

REM Verificar se banco existe
psql -U postgres -l | findstr finunity >nul 2>&1
if %errorlevel% neq 0 (
    echo Banco 'finunity' não existe. Criando...
    createdb finunity
    if %errorlevel% equ 0 (
        echo ✅ Banco 'finunity' criado
    ) else (
        echo ❌ Erro ao criar banco
        echo    Execute manualmente: createdb finunity
    )
) else (
    echo ✅ Banco 'finunity' já existe
)
echo.

REM Verificar se tabelas existem
psql -U postgres -d finunity -c "\dt" | findstr users >nul 2>&1
if %errorlevel% neq 0 (
    echo Tabelas não encontradas. Executando schema...
    if exist "database\schema.sql" (
        psql -U postgres -d finunity -f database\schema.sql
        if %errorlevel% equ 0 (
            echo ✅ Schema SQL executado com sucesso
        ) else (
            echo ❌ Erro ao executar schema
            echo    Execute manualmente: psql -U postgres -d finunity -f database\schema.sql
        )
    ) else (
        echo ❌ Arquivo database\schema.sql não encontrado
    )
) else (
    echo ✅ Tabelas já existem no banco
)
echo.

:skip_db
echo 📋 Passo 3: Verificando dependências
echo.

if not exist "backend\node_modules" (
    echo ⚠️  Dependências do backend não instaladas
    echo    Execute: cd backend ^&^& npm install
) else (
    echo ✅ Dependências do backend instaladas
)

if not exist "frontend\node_modules" (
    echo ⚠️  Dependências do frontend não instaladas
    echo    Execute: cd frontend ^&^& npm install
) else (
    echo ✅ Dependências do frontend instaladas
)
echo.

echo ✅ Configuração concluída!
echo.
echo 📝 Próximos passos:
echo    1. Edite backend\.env com suas credenciais do PostgreSQL
echo    2. Se o banco não foi criado, execute: createdb finunity
echo    3. Se o schema não foi executado, execute: psql -U postgres -d finunity -f database\schema.sql
echo    4. Execute: npm run dev
echo.

pause

