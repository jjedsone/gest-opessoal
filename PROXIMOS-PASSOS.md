# ✅ Próximos Passos - Configuração Final

## 🎯 Execute Estes 3 Passos na Ordem

### 📝 Passo 1: Configurar Arquivo .env

**Criar arquivo `backend/.env`:**

```env
PORT=3001
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/finunity
JWT_SECRET=finunity_jwt_secret_2024_mude_em_producao
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**⚠️ IMPORTANTE:**
- Substitua `SUA_SENHA_AQUI` pela senha do usuário `postgres` do PostgreSQL
- Se você não sabe a senha, tente a senha que definiu durante a instalação do PostgreSQL

**Ou use o script automático:**
```bash
scripts\configurar-completo.bat
```

### 🗄️ Passo 2: Executar Schema SQL

**2.1 Criar banco de dados (se não existir):**
```bash
createdb finunity
```

**2.2 Executar schema SQL:**
```bash
psql -U postgres -d finunity -f database\schema.sql
```

**Verificar se funcionou:**
```bash
psql -U postgres -d finunity -c "\dt"
```

Deve listar todas as tabelas criadas.

### 🚀 Passo 3: Executar Projeto

```bash
npm run dev
```

Isso iniciará backend e frontend.

**Acesse:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/health
- Health DB: http://localhost:3001/health/db

## 🔍 Verificação Rápida

**Teste se tudo está OK:**

1. **Backend responde?**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Banco conectado?**
   ```bash
   curl http://localhost:3001/health/db
   ```
   Deve retornar: `{"status":"ok","database":"connected","tables":"exists"}`

3. **Frontend carrega?**
   - Acesse http://localhost:3000
   - Deve mostrar a tela de onboarding

## ⚡ Script Automático

**Para facilitar, execute:**
```bash
scripts\configurar-completo.bat
```

Este script:
- ✅ Cria o arquivo .env
- ✅ Verifica PostgreSQL
- ✅ Cria banco de dados
- ✅ Executa schema SQL
- ✅ Verifica dependências

**Depois edite `backend/.env` com sua senha do PostgreSQL!**

## 🆘 Problemas?

### Erro: "password authentication failed"
- Verifique a senha no `DATABASE_URL` do `.env`
- Teste: `psql -U postgres` (pedirá senha)

### Erro: "database does not exist"
- Execute: `createdb finunity`

### Erro: "relation does not exist"
- Execute: `psql -U postgres -d finunity -f database\schema.sql`

### Erro: "ECONNREFUSED"
- PostgreSQL não está rodando
- Veja: `INICIAR-POSTGRES.md`

---

**Siga estes 3 passos e seu projeto estará funcionando!** 🎉

