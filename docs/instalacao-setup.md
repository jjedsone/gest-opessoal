# Guia de Instalação e Configuração - FinUnity

Este documento descreve como configurar e executar o projeto FinUnity localmente.

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado e rodando
- npm ou yarn instalado

## Passo 1: Configurar Banco de Dados

1. Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE finunity;
```

2. Execute o schema SQL:

```bash
psql -U seu_usuario -d finunity -f database/schema.sql
```

Ou usando o psql interativo:

```bash
psql -U seu_usuario -d finunity
\i database/schema.sql
```

## Passo 2: Instalar Dependências

Na raiz do projeto:

```bash
npm install
```

Instalar dependências do backend:

```bash
cd backend
npm install
```

Instalar dependências do frontend:

```bash
cd frontend
npm install
```

Ou use o script automatizado:

```bash
npm run install:all
```

## Passo 3: Configurar Variáveis de Ambiente

### Backend

Copie o arquivo de exemplo:

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3001
DATABASE_URL=postgresql://usuario:senha@localhost:5432/finunity
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sua_chave_openai_aqui
```

### Frontend

Copie o arquivo de exemplo:

```bash
cd frontend
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

## Passo 4: Executar o Projeto

### Opção 1: Executar Separadamente

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

O backend estará disponível em `http://localhost:3001`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

### Opção 2: Executar Tudo Junto

Na raiz do projeto:

```bash
npm run dev
```

Isso executará backend e frontend simultaneamente.

## Passo 5: Verificar Instalação

1. Acesse `http://localhost:3000` no navegador
2. Você deve ver a tela de onboarding
3. Teste o endpoint de health check: `http://localhost:3001/health`

## Estrutura de URLs da API

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil do usuário (requer autenticação)

- `GET /api/accounts` - Listar contas (requer autenticação)
- `POST /api/accounts` - Criar conta (requer autenticação)
- `GET /api/accounts/balance` - Obter saldo total (requer autenticação)

- `GET /api/transactions` - Listar transações (requer autenticação)
- `POST /api/transactions` - Criar transação (requer autenticação)
- `GET /api/transactions/:id` - Obter transação específica (requer autenticação)
- `DELETE /api/transactions/:id` - Deletar transação (requer autenticação)

- `GET /api/goals` - Listar metas (requer autenticação)
- `POST /api/goals` - Criar meta (requer autenticação)
- `PUT /api/goals/:id` - Atualizar meta (requer autenticação)
- `DELETE /api/goals/:id` - Deletar meta (requer autenticação)

## Solução de Problemas

### Erro de conexão com banco de dados

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `psql -U usuario -d finunity`

### Erro de porta já em uso

- Backend: Altere `PORT` no `.env` do backend
- Frontend: Altere a porta no `vite.config.ts`

### Erro de módulo não encontrado

- Execute `npm install` novamente
- Delete `node_modules` e `package-lock.json` e reinstale

### Erro de CORS

- Verifique se o backend está rodando na porta correta
- Confirme a URL da API no `.env` do frontend

## Próximos Passos

Após a instalação, você pode:

1. Criar uma conta através do onboarding
2. Adicionar contas bancárias
3. Registrar transações
4. Criar metas de poupança
5. Explorar o dashboard

