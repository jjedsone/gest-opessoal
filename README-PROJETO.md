# 🚀 FinUnity - Sistema de Gestão Financeira

Sistema completo de gestão financeira pessoal e para casais, com inteligência artificial para sugestões e controle financeiro.

## ⚡ Início Rápido

```bash
npm run dev
```

Isso iniciará automaticamente:
- **Backend** na porta **3001**
- **Frontend** na porta **3000**

## 🌐 URLs Importantes

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | Interface principal |
| **Status** | http://localhost:3000/status | Verificar status e testar login |
| **Backend API** | http://localhost:3001 | API REST |
| **Health Check** | http://localhost:3001/health | Verificar se backend está online |

## 🔐 Credenciais Padrão

- **Username**: `admin`
- **Senha**: `admin123`

> ⚠️ **Importante**: Altere a senha após o primeiro acesso em produção!

## ✅ Verificar se Está Funcionando

### 1. Página de Status (Recomendado)
Acesse: **http://localhost:3000/status**

Esta página mostra:
- ✅ Status do backend (online/offline)
- ✅ Status do banco de dados (conectado/desconectado)
- ✅ Botão para testar login diretamente

### 2. Teste Manual de Login
1. Acesse: **http://localhost:3000**
2. Digite:
   - Username: `admin`
   - Senha: `admin123`
3. Clique em "Entrar"
4. Deve redirecionar para o Dashboard

### 3. Script de Teste
```powershell
.\scripts\testar-login.ps1
```

## 📋 Pré-requisitos

- Node.js v18 ou superior
- npm ou yarn
- Navegador moderno (Chrome, Firefox, Edge)

## 🛠️ Instalação

```bash
# Instalar dependências do backend e frontend
npm run install:all

# Ou instalar separadamente
cd backend && npm install
cd ../frontend && npm install
```

## 🚀 Executar

```bash
# Iniciar tudo de uma vez
npm run dev

# Ou iniciar separadamente
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

## 📁 Estrutura do Projeto

```
finunity/
├── backend/          # API Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/   # Configurações (banco de dados)
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── database/     # Banco SQLite (criado automaticamente)
├── frontend/         # React + TypeScript + Vite
│   └── src/
│       ├── pages/
│       ├── components/
│       └── services/
└── scripts/          # Scripts auxiliares
```

## 🗄️ Banco de Dados

- **Tipo**: SQLite
- **Arquivo**: `database/finunity.db`
- **Criação**: Automática na primeira execução
- **Schema**: Aplicado automaticamente

## 🔧 Tecnologias

### Backend
- Node.js + Express
- TypeScript
- SQLite (better-sqlite3)
- JWT para autenticação
- bcryptjs para hash de senhas

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- Recharts (gráficos)

## 📚 Documentação Adicional

- `INICIAR-PROJETO.md` - Guia completo de inicialização
- `VERIFICAR-LOGIN.md` - Como verificar o login
- `RESUMO-FINAL.md` - Resumo técnico do projeto
- `MIGRACAO-SQLITE.md` - Detalhes da migração para SQLite

## 🐛 Problemas Comuns

### Porta já em uso
```bash
# Parar processos nas portas 3000 e 3001
scripts\parar-projeto.bat
```

### Banco de dados não cria
1. Pare o servidor (Ctrl+C)
2. Remova `database/finunity.db` (se existir)
3. Reinicie o servidor

### Backend não responde
1. Verifique se está rodando: `netstat -ano | findstr :3001`
2. Verifique os logs do terminal
3. Tente acessar: http://localhost:3001/health

## 📝 Scripts Disponíveis

- `npm run dev` - Iniciar backend e frontend
- `npm run install:all` - Instalar todas as dependências
- `scripts\testar-login.ps1` - Testar login via script
- `scripts\parar-projeto.bat` - Parar todos os processos

## 🎯 Funcionalidades

- ✅ Autenticação (login/registro)
- ✅ Gestão de transações
- ✅ Contas bancárias
- ✅ Metas financeiras
- ✅ Orçamentos
- ✅ Relatórios e gráficos
- ✅ Importação de CSV
- ✅ Sugestões de IA
- ✅ Suporte para casais (divisão de despesas)

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para gestão financeira pessoal**

