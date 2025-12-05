# 🔐 Verificação de Login - FinUnity

Este documento explica como verificar se o sistema de login está funcionando corretamente.

## 🚀 Iniciar o Projeto

### Opção 1: Iniciar tudo de uma vez
```bash
npm run dev
```

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

## ✅ Verificar se os Servidores Estão Rodando

### Backend
- **URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Deve retornar**: `{"status":"ok","message":"FinUnity API está funcionando"}`

### Frontend
- **URL**: http://localhost:3000 (porta configurada no Vite)
- **Deve abrir**: Página de login do FinUnity

## 🧪 Testar Login

### Método 1: Script Automatizado (Recomendado)

**Windows PowerShell:**
```powershell
.\scripts\testar-login.ps1
```

**Windows CMD:**
```cmd
scripts\testar-login.bat
```

### Método 2: Teste Manual via Browser

1. Abra o navegador em: http://localhost:3000
2. Você verá a página de login
3. Use as credenciais:
   - **Username**: `admin`
   - **Senha**: `admin123`
4. Clique em "Entrar"
5. Se funcionar, você será redirecionado para o Dashboard

### Método 3: Teste via cURL

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Resposta esperada:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "...",
    "nome": "Administrador",
    "username": "admin",
    "tipo": "solteiro"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔍 Verificar Logs do Backend

Se o login não funcionar, verifique os logs do backend:

1. Abra o terminal onde o backend está rodando
2. Procure por mensagens de erro
3. Mensagens comuns:
   - `✅ Usuário admin criado automaticamente` - Admin foi criado
   - `❌ Erro ao fazer login` - Erro no processo de login
   - `Username ou senha incorretos` - Credenciais inválidas

## 🐛 Problemas Comuns

### 1. Backend não está rodando
**Sintoma**: Erro de conexão ao tentar fazer login
**Solução**: 
```bash
cd backend
npm run dev
```

### 2. Banco de dados não inicializado
**Sintoma**: Erro "no such table: users"
**Solução**: 
- Pare o servidor (Ctrl+C)
- Remova `database/finunity.db` (se existir)
- Reinicie o servidor (o banco será criado automaticamente)

### 3. Admin não foi criado
**Sintoma**: "Username ou senha incorretos" mesmo com credenciais corretas
**Solução**: 
- Verifique os logs do backend na inicialização
- Deve aparecer: `✅ Usuário admin criado automaticamente`
- Se não aparecer, verifique se há erros no console

### 4. CORS Error
**Sintoma**: Erro de CORS no navegador
**Solução**: 
- Verifique se o backend está configurado para aceitar requisições do frontend
- O backend já está configurado para aceitar todas as origens em desenvolvimento

## 📊 Status Esperado

Após iniciar o projeto, você deve ver:

### Backend (Terminal 1):
```
✅ Conexão com SQLite estabelecida em: .../database/finunity.db
✅ Banco de dados SQLite inicializado com sucesso
✅ Usuário admin criado automaticamente
   Username: admin
   Senha: admin123
🚀 Servidor rodando na porta 3001
📡 API disponível em http://localhost:3001
```

### Frontend (Terminal 2):
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## ✅ Checklist de Verificação

- [ ] Backend está rodando na porta 3001
- [ ] Frontend está rodando na porta 3000
- [ ] Banco de dados SQLite foi criado (`database/finunity.db`)
- [ ] Admin foi criado automaticamente (verificar logs)
- [ ] Health check do backend responde OK
- [ ] Página de login abre no navegador
- [ ] Login com `admin` / `admin123` funciona
- [ ] Redirecionamento para Dashboard após login funciona
- [ ] Token JWT é salvo no localStorage

## 🎯 Próximos Passos

Após confirmar que o login está funcionando:

1. Teste criar uma nova conta
2. Teste fazer logout
3. Teste acessar páginas protegidas sem estar logado
4. Verifique se o token é válido em requisições subsequentes

---

**Última atualização**: $(Get-Date -Format "dd/MM/yyyy HH:mm")

