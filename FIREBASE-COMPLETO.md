# 🚀 Deploy Completo no Firebase

Este guia mostra como fazer deploy de **tudo** no Firebase:
- ✅ Frontend → Firebase Hosting
- ✅ Backend → Firebase Functions
- ✅ Banco de Dados → Cloud SQL (PostgreSQL) ou Firestore

## 📋 Pré-requisitos

- ✅ Firebase CLI instalado (`npm install -g firebase-tools`)
- ✅ Conta Google com projeto Firebase criado
- ✅ Node.js 18+ instalado

## 🔧 Passo 1: Configurar Firebase Functions

### 1.1 Instalar dependências

```bash
cd functions
npm install
```

### 1.2 Configurar variáveis de ambiente

No Firebase Console:
1. Acesse: https://console.firebase.google.com/project/get-opessoal/functions/config
2. Adicione as variáveis:
   - `DATABASE_URL` - URL do PostgreSQL (Cloud SQL ou externo)
   - `JWT_SECRET` - Secret para JWT
   - `NODE_ENV=production`

**Ou via CLI:**
```bash
firebase functions:config:set database.url="sua_url_postgres"
firebase functions:config:set jwt.secret="seu_jwt_secret"
```

### 1.3 Build e Deploy

```bash
# Na raiz do projeto
cd functions
npm run build
cd ..
firebase deploy --only functions
```

## 🗄️ Passo 2: Configurar Banco de Dados

### Opção A: Cloud SQL (PostgreSQL) - Recomendado

1. **Criar instância Cloud SQL:**
   - Acesse: https://console.cloud.google.com/sql/instances
   - Crie nova instância PostgreSQL
   - Configure usuário e senha
   - Anote a connection string

2. **Conectar Firebase Functions ao Cloud SQL:**
   - No `firebase.json`, adicione configuração de conexão
   - Use a connection string no `DATABASE_URL`

### Opção B: Firestore (NoSQL)

Se preferir usar Firestore em vez de PostgreSQL:

1. **Habilitar Firestore:**
   ```bash
   firebase firestore:databases:create --location=us-central
   ```

2. **Migrar código para usar Firestore:**
   - Substituir queries SQL por Firestore
   - Atualizar controllers e services

### Opção C: Banco Externo (Railway, Render, etc.)

Você pode manter o PostgreSQL em um serviço externo e apenas conectar do Firebase Functions.

## 🌐 Passo 3: Configurar Frontend

### 3.1 Atualizar URL da API

O frontend já está configurado para usar `/api` que será redirecionado para Firebase Functions automaticamente.

**Verifique `frontend/src/services/api.ts`:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || '/api';
```

### 3.2 Build e Deploy

```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

## 🚀 Passo 4: Deploy Completo

```bash
# Deploy de tudo de uma vez
firebase deploy

# Ou deploy separado:
firebase deploy --only functions  # Backend
firebase deploy --only hosting   # Frontend
firebase deploy --only firestore:rules  # Regras Firestore
```

## 📝 Estrutura Final

```
projeto/
├── functions/          # Backend (Firebase Functions)
│   ├── src/
│   │   ├── index.ts   # Entry point
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── ...
│   └── package.json
├── frontend/          # Frontend (React)
│   └── dist/          # Build output (deployado no Hosting)
├── firebase.json      # Configuração Firebase
├── firestore.rules    # Regras Firestore
└── .firebaserc        # Projeto Firebase
```

## 🔗 URLs Finais

- **Frontend:** https://get-opessoal.web.app
- **API:** https://get-opessoal.web.app/api
- **Console:** https://console.firebase.google.com/project/get-opessoal

## ⚙️ Configuração de Rewrites

O `firebase.json` está configurado para:
- `/api/**` → Firebase Functions (`api`)
- `/**` → Frontend (index.html)

Isso permite que o frontend e API estejam no mesmo domínio!

## 💰 Custos

### Firebase Hosting
- **Gratuito:** 10 GB storage, 360 MB/day transfer
- **Blaze (Pay-as-you-go):** $0.026/GB storage, $0.15/GB transfer

### Firebase Functions
- **Gratuito:** 2 milhões de invocações/mês
- **Blaze:** $0.40/milhão de invocações após o limite

### Cloud SQL
- **Custo:** ~$7-25/mês (dependendo da configuração)
- **Alternativa:** Use PostgreSQL externo (Railway, Render) - mais barato

## 🆘 Troubleshooting

### Erro: "Function failed to deploy"
- Verifique se todas as dependências estão instaladas
- Execute `npm run build` na pasta `functions`
- Verifique logs: `firebase functions:log`

### Erro: "Database connection failed"
- Verifique `DATABASE_URL` nas configurações
- Se usar Cloud SQL, verifique se a instância está rodando
- Verifique regras de firewall do Cloud SQL

### Erro: "CORS error"
- Verifique configuração de CORS no `functions/src/index.ts`
- Adicione o domínio do Firebase Hosting

## ✅ Checklist

- [ ] Firebase Functions configurado
- [ ] Dependências instaladas (`cd functions && npm install`)
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado (Cloud SQL ou externo)
- [ ] Schema SQL executado no banco
- [ ] Build do frontend (`cd frontend && npm run build`)
- [ ] Deploy completo (`firebase deploy`)
- [ ] Testar aplicação em produção

---

**Agora tudo está no Firebase!** 🎉

