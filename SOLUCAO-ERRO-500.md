# 🔧 Solução Rápida para Erro 500 - PostgreSQL Não Conectado

## ❌ Erro Identificado

**Erro:** `ECONNREFUSED 127.0.0.1:5432`

**Causa:** PostgreSQL não está rodando ou não está acessível na porta 5432.

## ✅ Solução Rápida (3 passos)

### Passo 1: Verificar se PostgreSQL está rodando

**Windows:**
```bash
scripts\verificar-postgres.bat
```

**Ou manualmente:**
```bash
pg_isready -h localhost -p 5432
```

### Passo 2: Iniciar PostgreSQL

**Windows:**
```bash
# Opção 1: Script automático
scripts\iniciar-postgres.bat

# Opção 2: Manualmente
net start postgresql-x64-14
# (substitua 14 pela sua versão: 13, 14, 15, 16)

# Opção 3: Pelo Services
# 1. Pressione Win+R
# 2. Digite: services.msc
# 3. Procure por "PostgreSQL"
# 4. Clique com botão direito → Iniciar
```

**Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

**Mac:**
```bash
brew services start postgresql
# ou
pg_ctl -D /usr/local/var/postgres start
```

### Passo 3: Verificar Conexão

```bash
# Testar conexão
psql -U postgres -c "SELECT version();"
```

Se funcionar, você verá a versão do PostgreSQL.

## 🔍 Verificação Completa

### 1. Verificar se PostgreSQL está instalado

**Windows:**
```bash
where psql
```

**Linux/Mac:**
```bash
which psql
```

Se não encontrar, você precisa instalar o PostgreSQL primeiro.

### 2. Verificar porta

O PostgreSQL usa a porta 5432 por padrão. Verifique se está livre:

**Windows:**
```bash
netstat -an | findstr 5432
```

**Linux/Mac:**
```bash
lsof -i :5432
# ou
netstat -an | grep 5432
```

### 3. Verificar configuração do .env

**Arquivo:** `backend/.env`

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/finunity
```

**Importante:**
- Substitua `usuario` pelo seu usuário PostgreSQL (geralmente `postgres`)
- Substitua `senha` pela senha do PostgreSQL
- Se a porta for diferente de 5432, ajuste na URL

## 🚀 Após Iniciar PostgreSQL

1. **Criar banco de dados** (se não existir):
   ```bash
   createdb finunity
   ```

2. **Executar schema SQL:**
   ```bash
   psql -U postgres -d finunity -f database/schema.sql
   ```

3. **Reiniciar backend:**
   ```bash
   cd backend
   npm run dev
   ```

4. **Testar:**
   ```bash
   curl http://localhost:3001/health/db
   ```

## 📋 Checklist

- [ ] PostgreSQL está instalado?
- [ ] Serviço PostgreSQL está rodando?
- [ ] Porta 5432 está acessível?
- [ ] Arquivo `backend/.env` está configurado?
- [ ] Banco de dados "finunity" existe?
- [ ] Schema SQL foi executado?

## 🆘 Ainda com Problemas?

### Erro: "psql não é reconhecido"
**Solução:** PostgreSQL não está instalado ou não está no PATH.
- Instale o PostgreSQL: https://www.postgresql.org/download/
- Ou adicione ao PATH: `C:\Program Files\PostgreSQL\14\bin`

### Erro: "password authentication failed"
**Solução:** Credenciais incorretas no `.env`
- Verifique usuário e senha
- Teste: `psql -U postgres` (pedirá senha)

### Erro: "database does not exist"
**Solução:** Banco não foi criado
- Execute: `createdb finunity`

### Erro: "relation does not exist"
**Solução:** Tabelas não foram criadas
- Execute: `psql -U postgres -d finunity -f database/schema.sql`

## ✅ Teste Final

Após seguir todos os passos:

1. Backend deve iniciar sem erros
2. Acesse: http://localhost:3001/health/db
3. Deve retornar: `{"status":"ok","database":"connected","tables":"exists"}`

---

**Com PostgreSQL rodando, o erro 500 será resolvido!** 🎉

