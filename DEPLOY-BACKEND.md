# 🚀 Deploy do Backend em Produção

O frontend está no Firebase Hosting, mas precisa de um backend rodando para funcionar.

## Opções de Deploy do Backend

### Opção 1: Railway (Recomendado - Mais Fácil)

1. Acesse: https://railway.app
2. Conecte seu repositório GitHub
3. Selecione o projeto `gest-opessoal`
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev`
5. Adicione variáveis de ambiente:
   - `DATABASE_URL` - URL do PostgreSQL
   - `JWT_SECRET` - Secret para JWT
   - `PORT` - Porta (Railway define automaticamente)
   - `NODE_ENV=production`

### Opção 2: Render

1. Acesse: https://render.com
2. Conecte repositório GitHub
3. Crie novo **Web Service**
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev`
5. Adicione variáveis de ambiente (mesmas do Railway)

### Opção 3: Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create get-opessoal-backend

# Configurar buildpack
heroku buildpacks:set heroku/nodejs

# Configurar variáveis
heroku config:set DATABASE_URL=sua_url_postgres
heroku config:set JWT_SECRET=seu_jwt_secret
heroku config:set NODE_ENV=production

# Deploy
git subtree push --prefix backend heroku main
```

### Opção 4: Google Cloud Run

1. Acesse: https://console.cloud.google.com
2. Crie novo serviço Cloud Run
3. Configure Dockerfile ou use buildpack
4. Configure variáveis de ambiente

## Configurar CORS no Backend

Após fazer deploy do backend, atualize o CORS:

```typescript
// backend/src/index.ts
app.use(cors({
  origin: [
    'https://get-opessoal.web.app',
    'https://get-opessoal.firebaseapp.com',
    'http://localhost:3000' // Para desenvolvimento
  ],
  credentials: true
}));
```

## Configurar URL da API no Frontend

Após fazer deploy do backend, atualize:

1. **Opção A - Variável de ambiente:**
   - Edite `frontend/.env.production`
   - Configure: `VITE_API_URL=https://seu-backend.railway.app/api`
   - Faça novo build e deploy

2. **Opção B - Configuração dinâmica:**
   - Use variável de ambiente do Firebase Hosting
   - Configure no Firebase Console → Hosting → Configurações

## Banco de Dados em Produção

### Opção 1: Railway PostgreSQL
- Railway oferece PostgreSQL como addon
- Configure automaticamente

### Opção 2: Render PostgreSQL
- Render oferece PostgreSQL como serviço
- Configure automaticamente

### Opção 3: Supabase (Gratuito)
- Acesse: https://supabase.com
- Crie projeto
- Use a connection string fornecida

### Opção 4: Neon (Gratuito)
- Acesse: https://neon.tech
- Crie projeto
- Use a connection string fornecida

## Executar Schema SQL em Produção

Após criar o banco em produção:

```bash
# Com a connection string do banco em produção
psql "sua_connection_string_aqui" -f database/schema.sql
```

Ou use um cliente SQL online (pgAdmin, DBeaver, etc.)

## Checklist Final

- [ ] Backend deployado em produção
- [ ] Banco de dados criado em produção
- [ ] Schema SQL executado no banco de produção
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado no backend
- [ ] URL da API atualizada no frontend
- [ ] Novo build e deploy do frontend
- [ ] Testar aplicação completa

---

**Após completar estes passos, sua aplicação estará 100% funcional!** 🎉

