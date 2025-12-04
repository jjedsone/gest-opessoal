# 🚀 Como Iniciar PostgreSQL - Guia Completo

## ❌ Problema Atual

**Erro:** `ECONNREFUSED 127.0.0.1:5432`

Isso significa que o PostgreSQL **não está rodando**.

## ✅ Solução Passo a Passo

### Opção 1: Verificar se PostgreSQL Está Instalado

**Windows:**
```bash
# Verificar se está instalado
where psql

# Ou verificar serviço
sc query | findstr postgresql
```

**Se não encontrar:**
- Baixe e instale: https://www.postgresql.org/download/windows/
- Durante a instalação, anote a senha do usuário `postgres`
- Marque a opção para adicionar ao PATH

### Opção 2: Iniciar PostgreSQL

#### Windows (Serviço)

**Método 1 - Services (Mais Fácil):**
1. Pressione `Win + R`
2. Digite: `services.msc`
3. Procure por "postgresql" ou "PostgreSQL"
4. Clique com botão direito → **Iniciar**

**Método 2 - Linha de Comando:**
```bash
# Tentar diferentes versões (substitua XX pela sua versão)
net start postgresql-x64-16
net start postgresql-x64-15
net start postgresql-x64-14
net start postgresql-x64-13

# Ou use o script automático
scripts\iniciar-postgres.bat
```

**Método 3 - pgAdmin:**
1. Abra o pgAdmin
2. O PostgreSQL geralmente inicia automaticamente

#### Linux

```bash
# Iniciar serviço
sudo systemctl start postgresql

# Verificar status
sudo systemctl status postgresql

# Habilitar para iniciar automaticamente
sudo systemctl enable postgresql
```

#### Mac

```bash
# Com Homebrew
brew services start postgresql

# Ou manualmente
pg_ctl -D /usr/local/var/postgres start
```

### Opção 3: Verificar se Está Rodando

**Após iniciar, teste:**

```bash
# Windows (se psql estiver no PATH)
psql -U postgres -c "SELECT version();"

# Ou teste a porta
netstat -an | findstr 5432
```

**Se funcionar:** Você verá a versão do PostgreSQL.

**Se não funcionar:** Continue para a próxima seção.

## 🔧 Configurar Banco de Dados

### 1. Criar Banco de Dados

```bash
createdb finunity
```

**Ou usando psql:**
```bash
psql -U postgres
CREATE DATABASE finunity;
\q
```

### 2. Executar Schema SQL

```bash
psql -U postgres -d finunity -f database/schema.sql
```

### 3. Verificar Tabelas

```bash
psql -U postgres -d finunity -c "\dt"
```

Deve listar todas as tabelas criadas.

## ⚙️ Configurar .env

**Arquivo:** `backend/.env`

```env
PORT=3001
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/finunity
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Importante:**
- Substitua `SUA_SENHA_AQUI` pela senha do usuário `postgres`
- Se você criou outro usuário, use esse usuário
- Se a porta for diferente, ajuste na URL

## ✅ Teste Final

### 1. Verificar Conexão

```bash
curl http://localhost:3001/health/db
```

**Deve retornar:**
```json
{
  "status": "ok",
  "database": "connected",
  "tables": "exists"
}
```

### 2. Reiniciar Backend

```bash
cd backend
npm run dev
```

**No console você deve ver:**
```
✅ Conexão com banco de dados estabelecida
✅ Tabelas do banco de dados verificadas
✅ Pool de conexões criado com sucesso
🚀 Servidor rodando na porta 3001
```

## 🆘 Problemas Comuns

### "psql não é reconhecido"

**Solução:** PostgreSQL não está no PATH ou não está instalado.

**Windows:**
1. Adicione ao PATH: `C:\Program Files\PostgreSQL\14\bin`
2. Ou reinstale o PostgreSQL marcando "Add to PATH"

### "password authentication failed"

**Solução:** Senha incorreta no `.env`

1. Teste a senha: `psql -U postgres` (pedirá senha)
2. Se não souber a senha, você pode resetá-la ou criar um novo usuário

### "database does not exist"

**Solução:** Banco não foi criado

```bash
createdb finunity
```

### Serviço não inicia

**Windows:**
1. Verifique os logs em: `C:\Program Files\PostgreSQL\14\data\log`
2. Tente executar como Administrador
3. Verifique se a porta 5432 está livre

## 📋 Checklist Rápido

- [ ] PostgreSQL está instalado?
- [ ] Serviço PostgreSQL está rodando?
- [ ] Banco "finunity" foi criado?
- [ ] Schema SQL foi executado?
- [ ] Arquivo `backend/.env` está configurado?
- [ ] Backend consegue conectar?

## 🎯 Solução Rápida (Copie e Cole)

```bash
# 1. Iniciar PostgreSQL (Windows)
net start postgresql-x64-14

# 2. Criar banco
createdb finunity

# 3. Executar schema
psql -U postgres -d finunity -f database/schema.sql

# 4. Configurar .env (edite manualmente)
# DATABASE_URL=postgresql://postgres:SENHA@localhost:5432/finunity

# 5. Reiniciar backend
cd backend
npm run dev
```

---

**Após seguir estes passos, o erro 500 será resolvido!** ✅

