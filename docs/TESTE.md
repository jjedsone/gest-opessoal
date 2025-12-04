# Guia de Testes - FinUnity

## Pré-requisitos

1. Node.js 18+ instalado
2. PostgreSQL 14+ instalado e rodando
3. Dependências instaladas (`npm run install:all` ou execute os scripts de setup)

## Passo 1: Configurar Banco de Dados

```bash
# Criar banco de dados
createdb finunity

# Ou usando psql
psql -U postgres
CREATE DATABASE finunity;
\q

# Executar schema
psql -U postgres -d finunity -f database/schema.sql
```

## Passo 2: Configurar Variáveis de Ambiente

### Backend (.env)

```env
PORT=3001
DATABASE_URL=postgresql://usuario:senha@localhost:5432/finunity
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sua_chave_openai_aqui_opcional
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

## Passo 3: Instalar Dependências

```bash
# Windows
scripts\setup.bat

# Linux/Mac
chmod +x scripts/setup.sh
./scripts/setup.sh

# Ou manualmente
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## Passo 4: Executar Projeto

### Opção 1: Executar tudo junto (recomendado)

```bash
npm run dev
```

### Opção 2: Executar separadamente

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

## Passo 5: Testar Funcionalidades

### 1. Testar API (Backend)

```bash
# Health check
curl http://localhost:3001/health

# Deve retornar: {"status":"ok","message":"FinUnity API está funcionando"}
```

### 2. Testar Frontend

1. Acesse: http://localhost:3000
2. Você deve ver a tela de onboarding

### 3. Fluxo Completo de Teste

#### A. Criar Conta
1. Preencha o formulário de onboarding
2. Clique em "Começar"
3. Você será redirecionado para o dashboard

#### B. Registrar Transação
1. Vá em "Transações"
2. Clique em "+ Nova Transação"
3. Preencha os campos e registre uma transação
4. Verifique se aparece na lista

#### C. Criar Meta
1. Vá em "Metas"
2. Clique em "+ Nova Meta"
3. Preencha os dados
4. Verifique se aparece no dashboard

#### D. Ver Relatórios
1. Vá em "Relatórios"
2. Verifique se os gráficos aparecem
3. Teste exportação CSV

#### E. Importar CSV
1. Vá em "Importar"
2. Baixe o exemplo de CSV
3. Faça upload de um arquivo de teste
4. Verifique se as transações foram importadas

#### F. Sugestões da IA
1. Vá em "IA"
2. Clique em "Gerar Novas Sugestões"
3. Verifique se aparecem sugestões
4. Teste aceitar/rejeitar

## Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se PostgreSQL está rodando
- Confirme as credenciais no .env
- Teste conexão: `psql -U usuario -d finunity`

### Erro: "Port already in use"
- Altere a porta no .env (backend) ou vite.config.ts (frontend)
- Ou pare o processo que está usando a porta

### Erro: "Module not found"
- Execute `npm install` novamente
- Delete `node_modules` e `package-lock.json` e reinstale

### Erro: CORS
- Verifique se o backend está rodando na porta correta
- Confirme a URL da API no .env do frontend

### Erro: "JWT_SECRET não configurado"
- Configure o JWT_SECRET no arquivo .env do backend

## Testes Automatizados (Futuro)

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Checklist de Funcionalidades

- [ ] Cadastro de usuário funciona
- [ ] Login funciona
- [ ] Dashboard carrega dados
- [ ] Gráficos aparecem corretamente
- [ ] Registro de transações funciona
- [ ] Listagem de transações funciona
- [ ] Criação de metas funciona
- [ ] Relatórios geram corretamente
- [ ] Importação CSV funciona
- [ ] Notificações aparecem
- [ ] Sugestões da IA funcionam
- [ ] Configurações de divisão funcionam (casais)

## Status

✅ MVP Completo e Funcional
✅ Todas as rotas implementadas
✅ Frontend integrado com backend
✅ Banco de dados configurado

