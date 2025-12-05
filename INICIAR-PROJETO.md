# 🚀 Como Iniciar o Projeto FinUnity

## ⚡ Início Rápido

### Opção 1: Iniciar tudo de uma vez (Recomendado)
```bash
npm run dev
```

Isso iniciará:
- **Backend** na porta **3001**
- **Frontend** na porta **3000**

### Opção 2: Iniciar separadamente

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

## 🌐 URLs do Projeto

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Status/Login**: http://localhost:3000/status

## 🔐 Credenciais Padrão

- **Username**: `admin`
- **Senha**: `admin123`

## ✅ Verificar se Está Funcionando

### 1. Verificar Backend
Acesse: http://localhost:3001/health

Deve retornar:
```json
{
  "status": "ok",
  "message": "FinUnity API está funcionando",
  "timestamp": "..."
}
```

### 2. Verificar Frontend
Acesse: http://localhost:3000

Deve abrir a página de login do FinUnity.

### 3. Verificar Status Completo
Acesse: http://localhost:3000/status

Esta página mostra:
- ✅ Status do backend
- ✅ Status do banco de dados
- ✅ Teste de login

## 🧪 Testar Login

### Método 1: Via Página de Status
1. Acesse: http://localhost:3000/status
2. Clique em "Testar Login"
3. Verifique se aparece "Login realizado com sucesso!"

### Método 2: Via Página de Login
1. Acesse: http://localhost:3000
2. Digite:
   - Username: `admin`
   - Senha: `admin123`
3. Clique em "Entrar"
4. Deve redirecionar para o Dashboard

### Método 3: Via Script
```powershell
.\scripts\testar-login.ps1
```

## 🐛 Problemas Comuns

### Porta já em uso
Se a porta 3000 ou 3001 estiver ocupada:

**Windows:**
```powershell
# Ver processos na porta 3000
netstat -ano | findstr :3000

# Matar processo (substitua PID pelo número)
taskkill /PID <PID> /F
```

**Ou use o script:**
```bash
scripts\parar-projeto.bat
```

### Backend não inicia
1. Verifique se o Node.js está instalado: `node --version`
2. Instale as dependências: `cd backend && npm install`
3. Verifique se há erros no console

### Frontend não inicia
1. Verifique se o Node.js está instalado: `node --version`
2. Instale as dependências: `cd frontend && npm install`
3. Verifique se há erros no console

### Banco de dados não cria
1. Pare o servidor (Ctrl+C)
2. Remova `database/finunity.db` (se existir)
3. Reinicie o servidor
4. O banco será criado automaticamente

## 📋 Checklist de Inicialização

- [ ] Node.js instalado (v18+)
- [ ] Dependências instaladas (`npm install` em backend e frontend)
- [ ] Backend iniciado na porta 3001
- [ ] Frontend iniciado na porta 3000
- [ ] Banco de dados criado (`database/finunity.db`)
- [ ] Admin criado automaticamente (verificar logs)
- [ ] Health check responde OK
- [ ] Login funciona com admin/admin123

## 🎯 Próximos Passos

Após iniciar o projeto:

1. ✅ Teste o login em http://localhost:3000/status
2. ✅ Faça login em http://localhost:3000
3. ✅ Explore o Dashboard
4. ✅ Crie uma nova conta
5. ✅ Teste as funcionalidades

---

**Última atualização**: $(Get-Date -Format "dd/MM/yyyy HH:mm")

