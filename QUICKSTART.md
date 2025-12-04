# 🚀 Guia Rápido - FinUnity

## Início Rápido (5 minutos)

### 1. Instalar Dependências

**Windows:**
```bash
scripts\setup.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**Ou manualmente:**
```bash
npm run install:all
```

### 2. Configurar Banco de Dados

```bash
# Criar banco
createdb finunity

# Executar schema
psql -U postgres -d finunity -f database/schema.sql
```

### 3. Configurar Variáveis de Ambiente

**Copie e configure:**

```bash
# Backend
cp backend/.env.example backend/.env
# Edite backend/.env com suas credenciais

# Frontend (opcional)
cp frontend/.env.example frontend/.env
```

**backend/.env mínimo:**
```env
PORT=3001
DATABASE_URL=postgresql://usuario:senha@localhost:5432/finunity
JWT_SECRET=seu_secret_aqui_mude_em_producao
```

### 4. Executar Projeto

**Opção 1 - Tudo junto:**
```bash
npm run dev
```

**Opção 2 - Separado:**
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2  
cd frontend && npm run dev
```

**Opção 3 - Windows (janelas separadas):**
```bash
scripts\start-dev.bat
```

### 5. Acessar

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## ✅ Pronto!

Agora você pode:
1. Criar uma conta no onboarding
2. Registrar transações
3. Criar metas
4. Ver relatórios
5. Usar as sugestões da IA

## 📚 Documentação Completa

Veja `docs/TESTE.md` para guia completo de testes e `docs/instalacao-setup.md` para detalhes.

## 🆘 Problemas?

- Verifique se PostgreSQL está rodando
- Confirme as credenciais no .env
- Execute `npm install` novamente se houver erros de módulos

