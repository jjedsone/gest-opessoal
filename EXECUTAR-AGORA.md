# ✅ Projeto Pronto - Como Executar AGORA

## ✅ Dependências Instaladas!

As dependências do frontend e backend foram instaladas com sucesso.

## 🚀 Executar o Projeto

### Opção 1: Executar Tudo Junto (Recomendado)

**Abra um terminal na raiz do projeto e execute:**

```bash
npm run dev
```

Isso iniciará backend e frontend simultaneamente.

### Opção 2: Executar Separadamente

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

## ⚙️ Antes de Executar - Configurar Banco de Dados

### 1. Criar Banco de Dados

```bash
createdb finunity
```

Ou usando psql:
```sql
CREATE DATABASE finunity;
```

### 2. Executar Schema SQL

```bash
psql -U postgres -d finunity -f database/schema.sql
```

### 3. Configurar Variáveis de Ambiente

**Criar arquivo `backend/.env`:**

```env
PORT=3001
DATABASE_URL=postgresql://usuario:senha@localhost:5432/finunity
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Copiar exemplo:**
```bash
cp backend/.env.example backend/.env
# Depois edite o arquivo com suas credenciais
```

## 🌐 Acessar a Aplicação

Após executar `npm run dev`:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## ✅ Verificar se Está Funcionando

1. Acesse http://localhost:3000
2. Você deve ver a tela de onboarding
3. Teste criar uma conta
4. Faça login
5. Explore o dashboard

## 🆘 Problemas Comuns

### Erro: "Cannot connect to database"
- Verifique se PostgreSQL está rodando
- Confirme as credenciais no `backend/.env`
- Teste: `psql -U usuario -d finunity`

### Erro: "Port already in use"
- Altere a porta no `.env` (backend) ou `vite.config.ts` (frontend)
- Ou pare o processo que está usando a porta

### Frontend não carrega
- Verifique se o backend está rodando na porta 3001
- Confirme que a URL da API está correta no `.env` do frontend

## 📝 Próximos Passos

1. ✅ Dependências instaladas
2. ⏳ Configurar banco de dados
3. ⏳ Configurar arquivo .env
4. ⏳ Executar projeto
5. ⏳ Testar funcionalidades

---

**Tudo pronto! Execute `npm run dev` e comece a usar! 🎉**

