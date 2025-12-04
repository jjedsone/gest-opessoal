# 🔍 Diagnóstico de Erro 500

## O que é um Erro 500?

Um erro 500 (Internal Server Error) indica que algo deu errado no servidor backend. Geralmente está relacionado a:

1. **Banco de dados não configurado**
2. **Tabelas não criadas**
3. **Variáveis de ambiente faltando**
4. **Erro no código**

## 🔧 Passo a Passo para Resolver

### 1. Verificar se o Backend Está Rodando

Abra um terminal e execute:

```bash
curl http://localhost:3001/health
```

**Se funcionar:** Você verá `{"status":"ok","message":"FinUnity API está funcionando"}`

**Se não funcionar:** O backend não está rodando. Execute:
```bash
cd backend
npm run dev
```

### 2. Verificar Conexão com Banco de Dados

Teste a conexão:

```bash
curl http://localhost:3001/health/db
```

**Possíveis respostas:**

✅ **Tudo OK:**
```json
{
  "status": "ok",
  "database": "connected",
  "tables": "exists"
}
```

❌ **Banco não conectado:**
```json
{
  "status": "error",
  "database": "disconnected",
  "tables": "missing"
}
```

### 3. Verificar Arquivo .env

**Localização:** `backend/.env`

**Deve conter:**
```env
PORT=3001
DATABASE_URL=postgresql://usuario:senha@localhost:5432/finunity
JWT_SECRET=seu_secret_aqui
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Se não existir:**
```bash
cd backend
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### 4. Verificar se PostgreSQL Está Rodando

**Windows:**
```bash
# Verificar serviço
sc query postgresql-x64-14

# Ou verificar processo
tasklist | findstr postgres
```

**Linux/Mac:**
```bash
sudo systemctl status postgresql
# ou
pg_isready
```

**Se não estiver rodando:**
- Windows: Inicie pelo Services ou execute `net start postgresql-x64-14`
- Linux: `sudo systemctl start postgresql`
- Mac: `brew services start postgresql`

### 5. Verificar se o Banco Existe

```bash
psql -U postgres -l | grep finunity
```

**Se não existir, crie:**
```bash
createdb finunity
# ou
psql -U postgres -c "CREATE DATABASE finunity;"
```

### 6. Verificar se as Tabelas Existem

```bash
psql -U postgres -d finunity -c "\dt"
```

**Se não houver tabelas, execute o schema:**
```bash
psql -U postgres -d finunity -f database/schema.sql
```

### 7. Verificar Logs do Backend

No terminal onde o backend está rodando, você verá mensagens como:

**✅ Sucesso:**
```
✅ Conexão com banco de dados estabelecida
✅ Tabelas do banco de dados verificadas
✅ Pool de conexões criado com sucesso
```

**❌ Erro:**
```
❌ Erro ao conectar com banco de dados: ...
❌ Tabelas não encontradas no banco de dados
```

## 🎯 Solução Rápida

Execute estes comandos na ordem:

```bash
# 1. Criar banco (se não existir)
createdb finunity

# 2. Executar schema
psql -U postgres -d finunity -f database/schema.sql

# 3. Verificar .env existe
cd backend
cp .env.example .env
# Edite .env com suas credenciais

# 4. Reiniciar backend
npm run dev
```

## 📋 Checklist de Verificação

- [ ] PostgreSQL está rodando?
- [ ] Banco de dados "finunity" existe?
- [ ] Tabelas foram criadas (execute schema.sql)?
- [ ] Arquivo backend/.env existe e está configurado?
- [ ] DATABASE_URL está correto no .env?
- [ ] Backend está rodando na porta 3001?
- [ ] Frontend está rodando na porta 3000?

## 🔍 Verificar Erro Específico

### No Navegador (F12 → Console)

Veja a mensagem de erro completa. Pode mostrar:
- Qual rota está falhando
- Qual é o erro específico
- Status code (500, 503, etc.)

### No Terminal do Backend

Os logs mostrarão:
- Erro de conexão com banco
- Erro de query SQL
- Erro de autenticação
- Stack trace completo

## 💡 Mensagens de Erro Comuns

### "ECONNREFUSED"
**Causa:** PostgreSQL não está rodando ou porta incorreta
**Solução:** Inicie o PostgreSQL

### "password authentication failed"
**Causa:** Credenciais incorretas no DATABASE_URL
**Solução:** Verifique usuário e senha no .env

### "database 'finunity' does not exist"
**Causa:** Banco não foi criado
**Solução:** Execute `createdb finunity`

### "relation 'users' does not exist"
**Causa:** Tabelas não foram criadas
**Solução:** Execute `psql -U postgres -d finunity -f database/schema.sql`

### "JWT_SECRET não configurado"
**Causa:** Variável de ambiente faltando
**Solução:** Adicione JWT_SECRET no .env

## ✅ Teste Final

Após corrigir, teste:

1. **Health check básico:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Health check com banco:**
   ```bash
   curl http://localhost:3001/health/db
   ```

3. **Teste de registro (no frontend):**
   - Acesse http://localhost:3000
   - Tente criar uma conta
   - Se funcionar, está tudo OK!

## 🆘 Ainda com Problemas?

1. Verifique os logs do backend no terminal
2. Verifique o console do navegador (F12)
3. Confirme que todas as dependências foram instaladas
4. Tente reiniciar o servidor backend

---

**Com essas verificações, você conseguirá identificar e resolver o erro 500!**

