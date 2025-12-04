# 🧪 Teste Completo do Projeto FinUnity

## ✅ Checklist de Testes

### 1. Backend (http://localhost:3001)

#### Health Check
- [ ] `GET http://localhost:3001/health`
  - Deve retornar: `{"status":"ok","message":"FinUnity API está funcionando"}`
  
#### Health Check DB
- [ ] `GET http://localhost:3001/health/db`
  - Deve retornar: `{"status":"ok","database":"connected","tables":"exists"}`

#### Autenticação
- [ ] `POST http://localhost:3001/api/auth/register`
  ```json
  {
    "nome": "Teste User",
    "email": "teste@teste.com",
    "password": "senha123",
    "estadoCivil": "solteiro",
    "rendaMensal": 5000,
    "contaConjunta": false,
    "permitirIA": true
  }
  ```
  - Deve retornar: `201` com token e dados do usuário

- [ ] `POST http://localhost:3001/api/auth/login`
  ```json
  {
    "email": "admin@finunity.com",
    "password": "admin123"
  }
  ```
  - Deve retornar: `200` com token e dados do usuário

### 2. Frontend (http://localhost:3000)

#### Página Inicial
- [ ] Acessar http://localhost:3000
- [ ] Verificar se a tela de login aparece
- [ ] Verificar se o botão "Login Rápido (Admin)" está visível

#### Login Rápido
- [ ] Clicar em "Login Rápido (Admin)"
- [ ] Verificar se os campos são preenchidos automaticamente
- [ ] Clicar em "Entrar"
- [ ] Verificar se redireciona para `/dashboard`

#### Login Manual
- [ ] Preencher email: `admin@finunity.com`
- [ ] Preencher senha: `admin123`
- [ ] Clicar em "Entrar"
- [ ] Verificar se redireciona para `/dashboard`

#### Registro
- [ ] Clicar em "Cadastre-se"
- [ ] Preencher formulário:
  - Nome: "Teste"
  - Email: "teste@teste.com"
  - Senha: "senha123"
  - Confirmar Senha: "senha123"
- [ ] Clicar em "Criar Conta"
- [ ] Verificar se redireciona para `/dashboard`

#### Dashboard
- [ ] Verificar se carrega após login
- [ ] Verificar se mostra saldo geral
- [ ] Verificar se mostra gráficos
- [ ] Verificar se mostra transações recentes

#### Transações
- [ ] Acessar `/transacoes`
- [ ] Verificar se lista transações
- [ ] Testar criar nova transação
- [ ] Testar filtrar por tipo (receita/despesa)

#### Metas
- [ ] Acessar `/metas`
- [ ] Verificar se lista metas
- [ ] Testar criar nova meta
- [ ] Testar atualizar meta

#### Relatórios
- [ ] Acessar `/relatorios`
- [ ] Verificar se mostra gráficos
- [ ] Verificar se mostra resumo mensal

#### Configurações
- [ ] Acessar `/configuracoes`
- [ ] Verificar se mostra perfil do usuário
- [ ] Testar atualizar informações

### 3. Integração Frontend-Backend

#### Teste de Conexão
- [ ] Verificar se o frontend consegue fazer requisições ao backend
- [ ] Verificar se o CORS está configurado corretamente
- [ ] Verificar se os tokens JWT são salvos no localStorage

#### Teste de Autenticação
- [ ] Fazer login
- [ ] Verificar se o token é salvo
- [ ] Fazer logout
- [ ] Verificar se o token é removido
- [ ] Tentar acessar rota protegida sem token
- [ ] Verificar se redireciona para login

## 🐛 Problemas Comuns e Soluções

### Backend não inicia
- Verificar se PostgreSQL está rodando
- Verificar se `DATABASE_URL` está configurado no `.env`
- Verificar se as tabelas foram criadas

### Frontend não conecta ao backend
- Verificar se o backend está rodando na porta 3001
- Verificar se o proxy está configurado no `vite.config.ts`
- Verificar CORS no backend

### Erro 500 no registro/login
- Verificar logs do backend
- Verificar se o banco está conectado
- Verificar se as tabelas existem

### Admin não é criado automaticamente
- Verificar logs do backend
- Executar manualmente: `npm run create-admin`
- Verificar se o banco está conectado

## 📋 Comandos Úteis

```bash
# Iniciar tudo
npm run dev

# Iniciar apenas backend
cd backend && npm run dev

# Iniciar apenas frontend
cd frontend && npm run dev

# Criar admin manualmente
npm run create-admin

# Verificar PostgreSQL
scripts\verificar-postgres.bat

# Ver logs do backend
# (aparecem no terminal onde o backend está rodando)
```

## ✅ Resultado Esperado

Após todos os testes:
- ✅ Backend rodando na porta 3001
- ✅ Frontend rodando na porta 3000
- ✅ Login funcionando
- ✅ Registro funcionando
- ✅ Dashboard carregando
- ✅ Todas as rotas protegidas funcionando
- ✅ Dados sendo salvos no banco

---

**Execute os testes e verifique se tudo está funcionando!** 🚀

