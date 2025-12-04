# ⚙️ Configurar Projeto FinUnity - Passo a Passo

## 📋 Pré-requisitos

- ✅ PostgreSQL instalado e rodando
- ✅ Dependências instaladas (`npm run install:all`)
- ✅ Banco de dados "finunity" criado

## 🔧 Passo 1: Configurar Arquivo .env

### 1.1 Criar arquivo .env

**No diretório `backend`:**
```bash
cd backend
copy .env.example .env
```

**Ou manualmente:**
- Copie o arquivo `backend/.env.example`
- Renomeie para `backend/.env`

### 1.2 Editar arquivo .env

Abra `backend/.env` e configure:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/finunity
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sua_chave_openai_aqui_opcional
NODE_ENV=development
```

**O que configurar:**

1. **DATABASE_URL** (OBRIGATÓRIO):
   ```
   postgresql://USUARIO:SENHA@HOST:PORTA/BANCO
   ```
   
   **Exemplo:**
   ```env
   DATABASE_URL=postgresql://postgres:minhasenha123@localhost:5432/finunity
   ```
   
   - `postgres` = usuário padrão (ou seu usuário)
   - `minhasenha123` = senha que você definiu na instalação
   - `localhost` = host (geralmente localhost)
   - `5432` = porta padrão
   - `finunity` = nome do banco

2. **JWT_SECRET** (OBRIGATÓRIO):
   ```env
   JWT_SECRET=qualquer_string_longa_e_aleatoria_aqui
   ```
   
   **Gere uma senha segura:**
   - Use qualquer string longa e aleatória
   - Exemplo: `meu_jwt_secret_super_seguro_2024_finunity`

3. **Outras variáveis** (opcionais):
   - `PORT`: Porta do backend (padrão: 3001)
   - `REDIS_URL`: Se usar Redis (opcional)
   - `OPENAI_API_KEY`: Se usar IA avançada (opcional)

### 1.3 Verificar configuração

**Teste a conexão:**
```bash
# Se psql estiver no PATH
psql postgresql://postgres:SUA_SENHA@localhost:5432/finunity -c "SELECT 1;"
```

Se retornar `1`, a configuração está correta! ✅

## 🗄️ Passo 2: Criar Banco de Dados

### 2.1 Verificar se banco existe

```bash
psql -U postgres -l | findstr finunity
```

**Se não existir, criar:**
```bash
createdb finunity
```

**Ou usando psql:**
```bash
psql -U postgres
CREATE DATABASE finunity;
\q
```

### 2.2 Executar Schema SQL

**Opção A - Comando direto:**
```bash
psql -U postgres -d finunity -f database\schema.sql
```

**Opção B - Passo a passo:**
```bash
# 1. Conectar ao banco
psql -U postgres -d finunity

# 2. Executar schema (dentro do psql)
\i database/schema.sql

# 3. Verificar tabelas criadas
\dt

# 4. Sair
\q
```

**Opção C - Se estiver na raiz do projeto:**
```bash
psql -U postgres -d finunity -f database\schema.sql
```

### 2.3 Verificar se funcionou

```bash
psql -U postgres -d finunity -c "\dt"
```

**Deve listar as tabelas:**
- users
- profiles
- accounts
- transactions
- budgets
- goals
- rules_division
- ai_suggestions
- couple_relationships

## 🚀 Passo 3: Executar Projeto

### 3.1 Executar tudo junto

**Na raiz do projeto:**
```bash
npm run dev
```

Isso iniciará backend e frontend simultaneamente.

### 3.2 Ou executar separadamente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 3.3 Verificar se está funcionando

**Backend:**
- Acesse: http://localhost:3001/health
- Deve retornar: `{"status":"ok","message":"FinUnity API está funcionando"}`

**Backend com banco:**
- Acesse: http://localhost:3001/health/db
- Deve retornar: `{"status":"ok","database":"connected","tables":"exists"}`

**Frontend:**
- Acesse: http://localhost:3000
- Deve mostrar a tela de onboarding

## ✅ Checklist Final

- [ ] Arquivo `backend/.env` criado e configurado
- [ ] `DATABASE_URL` está correto no `.env`
- [ ] `JWT_SECRET` está configurado
- [ ] Banco de dados "finunity" existe
- [ ] Schema SQL foi executado com sucesso
- [ ] Tabelas foram criadas (verificar com `\dt`)
- [ ] Backend inicia sem erros
- [ ] Health check retorna OK
- [ ] Frontend carrega corretamente

## 🆘 Problemas Comuns

### Erro: "password authentication failed"
**Solução:** Senha incorreta no `DATABASE_URL`
- Verifique a senha do usuário `postgres`
- Teste: `psql -U postgres` (pedirá senha)

### Erro: "database does not exist"
**Solução:** Banco não foi criado
```bash
createdb finunity
```

### Erro: "relation does not exist"
**Solução:** Schema não foi executado
```bash
psql -U postgres -d finunity -f database\schema.sql
```

### Erro: "JWT_SECRET não configurado"
**Solução:** Adicione `JWT_SECRET` no `.env`
```env
JWT_SECRET=qualquer_string_longa_aqui
```

## 📝 Exemplo Completo de .env

```env
# Porta do servidor backend
PORT=3001

# URL de conexão com PostgreSQL
# Formato: postgresql://usuario:senha@host:porta/banco
DATABASE_URL=postgresql://postgres:minhasenha123@localhost:5432/finunity

# Secret para JWT (use uma string longa e aleatória)
JWT_SECRET=meu_jwt_secret_super_seguro_finunity_2024_nao_compartilhar

# Tempo de expiração do token JWT
JWT_EXPIRES_IN=7d

# Ambiente (development, production)
NODE_ENV=development

# Redis (opcional - deixe como está se não usar)
REDIS_URL=redis://localhost:6379

# OpenAI API Key (opcional - deixe vazio se não usar)
OPENAI_API_KEY=
```

## 🎯 Comandos Rápidos (Copie e Cole)

```bash
# 1. Criar .env
cd backend
copy .env.example .env
# Edite o arquivo .env com suas credenciais

# 2. Criar banco
createdb finunity

# 3. Executar schema
psql -U postgres -d finunity -f database\schema.sql

# 4. Verificar tabelas
psql -U postgres -d finunity -c "\dt"

# 5. Executar projeto
cd ..
npm run dev
```

---

**Após seguir estes passos, seu projeto estará funcionando!** 🎉

