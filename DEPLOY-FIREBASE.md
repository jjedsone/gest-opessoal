# 🚀 Deploy no Firebase Hosting

## Pré-requisitos

- ✅ Firebase CLI instalado (`npm install -g firebase-tools`)
- ✅ Projeto criado no Firebase Console: `get-opessoal`
- ✅ Frontend buildado

## Passos para Deploy

### 1. Fazer Login no Firebase

```bash
firebase login
```

Isso abrirá o navegador para autenticação com sua conta Google.

### 2. Configurar URL da API em Produção

**Edite o arquivo `frontend/.env.production`:**

```env
VITE_API_URL=https://seu-backend-em-producao.com/api
```

**Opções de backend em produção:**
- Heroku
- Railway
- Render
- Vercel (serverless functions)
- Google Cloud Run
- AWS Elastic Beanstalk

### 3. Build do Frontend

```bash
cd frontend
npm run build
```

Isso criará a pasta `frontend/dist` com os arquivos otimizados.

### 4. Deploy no Firebase

```bash
# Na raiz do projeto
firebase deploy --only hosting
```

### 5. Verificar Deploy

Após o deploy, você receberá uma URL como:
```
https://get-opessoal.web.app
ou
https://get-opessoal.firebaseapp.com
```

## Configuração Completa

### Arquivos Criados

- ✅ `firebase.json` - Configuração do Firebase Hosting
- ✅ `.firebaserc` - Projeto Firebase configurado
- ✅ `frontend/.env.production` - Variáveis de ambiente para produção

### Estrutura do Firebase

```
firebase.json
├── hosting
│   ├── public: "frontend/dist" (arquivos buildados)
│   ├── rewrites: SPA routing (todas as rotas → index.html)
│   └── headers: Cache para assets estáticos
```

## ⚠️ Importante

### Backend em Produção

O frontend precisa de um backend rodando. Opções:

1. **Deploy do Backend separado:**
   - Heroku: `git push heroku main`
   - Railway: Conecte o repositório
   - Render: Conecte o repositório

2. **Configurar CORS no Backend:**
   ```typescript
   // backend/src/index.ts
   app.use(cors({
     origin: ['https://get-opessoal.web.app', 'https://get-opessoal.firebaseapp.com'],
     credentials: true
   }));
   ```

3. **Atualizar URL da API:**
   - Edite `frontend/.env.production` com a URL do backend em produção

## Comandos Úteis

```bash
# Ver status do projeto
firebase projects:list

# Ver sites configurados
firebase hosting:sites:list

# Ver histórico de deploys
firebase hosting:clone

# Fazer deploy apenas do hosting
firebase deploy --only hosting

# Fazer deploy de tudo
firebase deploy

# Ver logs
firebase hosting:channel:list
```

## Troubleshooting

### Erro: "Project not found"
- Verifique se o projeto `get-opessoal` existe no Firebase Console
- Execute: `firebase use get-opessoal`

### Erro: "Build failed"
- Verifique se todas as dependências estão instaladas: `cd frontend && npm install`
- Execute o build localmente: `npm run build`

### Erro: "API not found"
- Configure `VITE_API_URL` no `.env.production`
- Verifique se o backend está rodando e acessível
- Verifique CORS no backend

## Próximos Passos

1. ✅ Fazer login no Firebase
2. ✅ Configurar URL do backend em produção
3. ✅ Fazer build do frontend
4. ✅ Deploy no Firebase Hosting
5. ⚠️ Deploy do backend em produção (Heroku/Railway/Render)
6. ⚠️ Configurar CORS no backend
7. ✅ Testar aplicação completa

---

**Documentação Firebase:** https://firebase.google.com/docs/hosting

