# 🚀 Setup Completo no Firebase

## ⚠️ IMPORTANTE: Plano Blaze Necessário

Para usar **Firebase Functions**, você precisa fazer upgrade para o plano **Blaze (pay-as-you-go)**.

**Mas não se preocupe!** O plano Blaze tem:
- ✅ **Tier gratuito generoso** (2 milhões de invocações/mês)
- ✅ Você só paga pelo que usar além do gratuito
- ✅ Sem custo mensal fixo

**Upgrade:** https://console.firebase.google.com/project/get-opessoal/usage/details

## 📋 Passo a Passo Completo

### 1. Fazer Upgrade para Blaze

1. Acesse: https://console.firebase.google.com/project/get-opessoal/usage/details
2. Clique em "Upgrade to Blaze"
3. Configure método de pagamento (cartão de crédito)
4. **Não se preocupe com custos** - o tier gratuito cobre muito uso!

### 2. Instalar Dependências

```bash
cd functions
npm install
```

### 3. Configurar Variáveis de Ambiente

**Opção A - Via Firebase Console (Recomendado):**
1. Acesse: https://console.firebase.google.com/project/get-opessoal/functions/config
2. Adicione:
   - `DATABASE_URL` = sua URL do PostgreSQL
   - `JWT_SECRET` = seu secret para JWT

**Opção B - Via CLI:**
```bash
firebase functions:config:set database.url="postgresql://usuario:senha@host:5432/finunity"
firebase functions:config:set jwt.secret="seu_jwt_secret_aqui"
```

### 4. Build do Código

```bash
cd functions
npm run build
```

### 5. Deploy das Functions

```bash
# Na raiz do projeto
firebase deploy --only functions
```

### 6. Deploy do Frontend

```bash
# Build do frontend
cd frontend
npm run build
cd ..

# Deploy no Hosting
firebase deploy --only hosting
```

### 7. Deploy Completo (Tudo de Uma Vez)

```bash
firebase deploy
```

## 🗄️ Configurar Banco de Dados

### Opção 1: Cloud SQL (PostgreSQL) - Google Cloud

1. **Criar instância Cloud SQL:**
   - Acesse: https://console.cloud.google.com/sql/instances
   - Crie nova instância PostgreSQL
   - Configure usuário e senha
   - Anote a connection string

2. **Usar no Firebase Functions:**
   - Configure `DATABASE_URL` com a connection string do Cloud SQL
   - O Firebase Functions se conecta automaticamente

### Opção 2: Banco Externo (Mais Barato)

Você pode usar PostgreSQL em:
- **Railway** (gratuito com limites)
- **Render** (gratuito com limites)
- **Supabase** (gratuito generoso)
- **Neon** (gratuito generoso)

Configure `DATABASE_URL` com a URL do banco externo.

### Opção 3: Firestore (NoSQL)

Se preferir usar Firestore em vez de PostgreSQL:

1. **Habilitar Firestore:**
   ```bash
   firebase firestore:databases:create --location=us-central
   ```

2. **Migrar código:**
   - Substituir queries SQL por Firestore
   - Atualizar controllers e services

## 🔗 URLs Finais

Após o deploy completo:

- **Frontend:** https://get-opessoal.web.app
- **API:** https://get-opessoal.web.app/api (redireciona para Functions)
- **Console:** https://console.firebase.google.com/project/get-opessoal

## 📝 Estrutura de Arquivos

```
projeto/
├── functions/              # Backend (Firebase Functions)
│   ├── src/
│   │   ├── index.ts       # Entry point (exporta função 'api')
│   │   ├── config/
│   │   │   └── database.ts  # Config PostgreSQL
│   │   ├── routes/        # Rotas da API
│   │   ├── controllers/   # Controllers
│   │   └── ...
│   ├── package.json
│   └── tsconfig.json
├── frontend/              # Frontend (React)
│   └── dist/             # Build output (deployado no Hosting)
├── firebase.json          # Configuração Firebase
├── firestore.rules        # Regras Firestore
└── .firebaserc           # Projeto Firebase
```

## ⚙️ Como Funciona

### Rewrites no firebase.json

```json
{
  "rewrites": [
    {
      "source": "/api/**",
      "function": "api"  // Redireciona para Firebase Function 'api'
    },
    {
      "source": "**",
      "destination": "/index.html"  // SPA routing
    }
  ]
}
```

Isso significa:
- `/api/*` → Firebase Function `api`
- `/*` → Frontend (index.html)

**Tudo no mesmo domínio!** 🎉

## 💰 Custos Estimados

### Tier Gratuito (Sempre Grátis):
- **Functions:** 2 milhões de invocações/mês
- **Hosting:** 10 GB storage, 360 MB/day transfer
- **Firestore:** 1 GB storage, 50K reads/day, 20K writes/day

### Se Ultrapassar (Pay-as-you-go):
- **Functions:** $0.40/milhão de invocações
- **Hosting:** $0.026/GB storage, $0.15/GB transfer
- **Cloud SQL:** ~$7-25/mês (dependendo da configuração)

**Para um projeto pessoal, provavelmente ficará no tier gratuito!**

## 🆘 Troubleshooting

### Erro: "must be on the Blaze plan"
- **Solução:** Faça upgrade para Blaze (gratuito até certo limite)

### Erro: "Function failed to deploy"
- Verifique se `npm run build` foi executado
- Verifique logs: `firebase functions:log`
- Verifique se todas as dependências estão instaladas

### Erro: "Database connection failed"
- Verifique `DATABASE_URL` nas configurações
- Se usar Cloud SQL, verifique firewall e conexão
- Teste a connection string localmente

### Erro: "CORS error"
- Verifique configuração de CORS no `functions/src/index.ts`
- Adicione o domínio do Firebase Hosting

## ✅ Checklist Final

- [ ] Upgrade para plano Blaze feito
- [ ] Dependências instaladas (`cd functions && npm install`)
- [ ] Variáveis de ambiente configuradas (`DATABASE_URL`, `JWT_SECRET`)
- [ ] Banco de dados criado e schema executado
- [ ] Build do código (`cd functions && npm run build`)
- [ ] Deploy das Functions (`firebase deploy --only functions`)
- [ ] Build do frontend (`cd frontend && npm run build`)
- [ ] Deploy do Hosting (`firebase deploy --only hosting`)
- [ ] Testar aplicação completa

---

**Após completar estes passos, tudo estará no Firebase!** 🎉

**Próximo passo:** Faça upgrade para Blaze e execute `firebase deploy --only functions`

