# 🔥 Configurar Firestore para Dados e Logins

Este guia mostra como configurar o Firestore para receber todos os dados e gerenciar logins.

## 📋 Passo 1: Habilitar Firestore

### Via Console Firebase:

1. Acesse: https://console.firebase.google.com/project/get-opessoal/firestore
2. Clique em "Criar banco de dados"
3. Escolha:
   - **Modo:** Modo de produção (com regras de segurança)
   - **Localização:** Escolha a mais próxima (ex: `us-central1`)
4. Clique em "Ativar"

### Via CLI:

```bash
firebase firestore:databases:create --location=us-central1
```

## 🔐 Passo 2: Configurar Autenticação Firebase

### Habilitar Authentication:

1. Acesse: https://console.firebase.google.com/project/get-opessoal/authentication
2. Clique em "Começar"
3. Habilite **Email/Password**:
   - Clique em "Email/Password"
   - Ative "Email/Password"
   - Opcional: Ative "Email link (passwordless sign-in)"
   - Clique em "Salvar"

### Configurar Domínios Autorizados:

1. Na mesma página, vá em "Configurações"
2. Em "Domínios autorizados", adicione:
   - `get-opessoal.web.app`
   - `get-opessoal.firebaseapp.com`
   - `localhost` (para desenvolvimento)

## 📝 Passo 3: Deploy das Regras de Segurança

As regras já estão configuradas no arquivo `firestore.rules`. Faça o deploy:

```bash
firebase deploy --only firestore:rules
```

**Regras configuradas:**
- ✅ Usuários podem ler/escrever apenas seus próprios dados
- ✅ Autenticação obrigatória para todas as operações
- ✅ Proteção contra acesso não autorizado

## 🔧 Passo 4: Atualizar Código para Usar Firestore

### Opção A: Usar Firestore + Firebase Auth (Recomendado)

**Vantagens:**
- Autenticação gerenciada pelo Firebase
- Segurança integrada
- Escalável automaticamente
- Gratuito até certo limite

**Desvantagens:**
- Precisa migrar código existente
- Estrutura NoSQL diferente de SQL

### Opção B: Manter PostgreSQL + Usar Firestore para Cache

**Vantagens:**
- Mantém código existente
- SQL para queries complexas
- Firestore para cache rápido

**Desvantagens:**
- Duas fontes de dados
- Sincronização necessária

## 🚀 Passo 5: Migrar para Firebase Auth

### No Frontend:

1. **Instalar Firebase SDK:**
```bash
cd frontend
npm install firebase
```

2. **Criar arquivo de configuração:**
```typescript
// frontend/src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "get-opessoal.firebaseapp.com",
  projectId: "get-opessoal",
  storageBucket: "get-opessoal.appspot.com",
  messagingSenderId: "seu-sender-id",
  appId: "seu-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

3. **Obter credenciais:**
   - Acesse: https://console.firebase.google.com/project/get-opessoal/settings/general
   - Role até "Seus apps"
   - Clique em "Configuração" (ícone de engrenagem)
   - Copie o objeto `firebaseConfig`

### No Backend (Firebase Functions):

O código já está preparado para usar Firestore através do `firestoreService.ts`.

## 📊 Estrutura de Dados no Firestore

```
firestore/
├── users/
│   └── {userId}/
│       ├── nome: string
│       ├── email: string
│       ├── estado_civil: 'solteiro' | 'casal'
│       └── ...
├── accounts/
│   └── {accountId}/
│       ├── user_id: string
│       ├── nome: string
│       ├── tipo: string
│       └── saldo: number
├── transactions/
│   └── {transactionId}/
│       ├── user_id: string
│       ├── account_id: string
│       ├── tipo: 'receita' | 'despesa'
│       └── valor: number
├── goals/
├── budgets/
├── notifications/
└── ai_suggestions/
```

## 🔄 Passo 6: Migrar Dados do PostgreSQL para Firestore (Opcional)

Se você já tem dados no PostgreSQL e quer migrar:

1. **Script de migração:**
```typescript
// scripts/migrate-to-firestore.ts
import * as admin from 'firebase-admin';
import pool from '../backend/src/config/database';

admin.initializeApp();
const db = admin.firestore();

async function migrateUsers() {
  const result = await pool.query('SELECT * FROM users');
  
  for (const user of result.rows) {
    await db.collection('users').doc(user.id).set({
      nome: user.nome,
      email: user.email,
      estado_civil: user.estado_civil,
      // ... outros campos
    });
  }
}

// Execute migração
migrateUsers().then(() => {
  console.log('Migração concluída!');
  process.exit(0);
});
```

## ✅ Checklist

- [ ] Firestore habilitado no console
- [ ] Firebase Authentication habilitado (Email/Password)
- [ ] Regras de segurança deployadas (`firebase deploy --only firestore:rules`)
- [ ] Domínios autorizados configurados
- [ ] Código atualizado para usar Firestore (opcional)
- [ ] Dados migrados do PostgreSQL (opcional)
- [ ] Testar autenticação e escrita de dados

## 🆘 Troubleshooting

### Erro: "Missing or insufficient permissions"
- Verifique se as regras de segurança foram deployadas
- Verifique se o usuário está autenticado
- Verifique se o `user_id` corresponde ao `request.auth.uid`

### Erro: "Firestore not initialized"
- Verifique se `admin.initializeApp()` foi chamado
- Verifique se as credenciais estão corretas

### Erro: "Collection not found"
- Crie a primeira coleção manualmente no console
- Ou use o código para criar automaticamente

## 📚 Próximos Passos

1. ✅ Firestore habilitado
2. ✅ Regras de segurança configuradas
3. ⚠️ Atualizar código para usar Firestore (opcional)
4. ⚠️ Migrar dados existentes (opcional)
5. ✅ Testar autenticação e escrita

---

**Firestore está pronto para receber dados e logins!** 🔥

**Para usar Firebase Auth no frontend, instale:**
```bash
cd frontend
npm install firebase
```

