# 🔍 PostgreSQL Não Encontrado - Guia Completo

## ❌ Situação Atual

O sistema não encontrou nenhum serviço PostgreSQL instalado. Isso pode significar:

1. **PostgreSQL não está instalado**
2. **PostgreSQL está instalado mas não como serviço**
3. **PostgreSQL está instalado mas não está no PATH**

## ✅ Solução Passo a Passo

### Passo 1: Verificar se Está Instalado

**Execute:**
```bash
scripts\verificar-instalacao-postgres.bat
```

Este script vai verificar:
- Se `psql` está disponível
- Se PostgreSQL está em diretórios comuns
- Se há serviços PostgreSQL

### Passo 2: Instalar PostgreSQL (Se Não Estiver Instalado)

**Download:**
- Site oficial: https://www.postgresql.org/download/windows/
- Escolha a versão mais recente (14, 15 ou 16)

**Durante a Instalação:**
1. ✅ Marque "Add PostgreSQL to PATH"
2. ✅ Anote a senha do usuário `postgres` (você vai precisar!)
3. ✅ Deixe a porta padrão (5432)
4. ✅ Deixe o locale como está

**Após Instalação:**
- O PostgreSQL geralmente inicia automaticamente
- Se não iniciar, use o pgAdmin ou inicie manualmente

### Passo 3: Verificar Instalação

**Teste se está funcionando:**
```bash
psql -U postgres -c "SELECT version();"
```

Se pedir senha e depois mostrar a versão, está funcionando! ✅

### Passo 4: Configurar Banco de Dados

```bash
# 1. Criar banco
createdb finunity

# 2. Executar schema
psql -U postgres -d finunity -f database/schema.sql

# 3. Verificar tabelas
psql -U postgres -d finunity -c "\dt"
```

### Passo 5: Configurar .env

**Arquivo:** `backend/.env`

```env
PORT=3001
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/finunity
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Importante:** Substitua `SUA_SENHA_AQUI` pela senha que você definiu durante a instalação.

### Passo 6: Reiniciar Backend

```bash
cd backend
npm run dev
```

**Você deve ver:**
```
✅ Conexão com banco de dados estabelecida
✅ Tabelas do banco de dados verificadas
✅ Pool de conexões criado com sucesso
🚀 Servidor rodando na porta 3001
```

## 🆘 Alternativas se Não Quiser Instalar PostgreSQL

### Opção 1: Usar PostgreSQL Online (Desenvolvimento)

Você pode usar serviços como:
- **Supabase** (gratuito): https://supabase.com
- **ElephantSQL** (gratuito): https://www.elephantsql.com
- **Neon** (gratuito): https://neon.tech

**Configuração:**
- Crie uma conta
- Crie um banco de dados
- Use a URL de conexão fornecida no `DATABASE_URL` do `.env`

### Opção 2: Usar Docker (Se Tiver Docker Instalado)

```bash
# Criar e iniciar PostgreSQL em Docker
docker run --name finunity-postgres -e POSTGRES_PASSWORD=senha123 -e POSTGRES_DB=finunity -p 5432:5432 -d postgres:14

# Executar schema
psql -h localhost -U postgres -d finunity -f database/schema.sql
```

### Opção 3: Usar SQLite (Modificação Necessária)

Requer alterações no código para usar SQLite ao invés de PostgreSQL.

## 📋 Checklist Final

- [ ] PostgreSQL está instalado?
- [ ] `psql` funciona no terminal?
- [ ] Serviço PostgreSQL está rodando?
- [ ] Banco "finunity" foi criado?
- [ ] Schema SQL foi executado?
- [ ] Arquivo `.env` está configurado?
- [ ] Backend consegue conectar?

## 🎯 Comando Rápido de Instalação

**Windows (usando Chocolatey - se tiver):**
```bash
choco install postgresql14
```

**Ou baixe o instalador:**
1. Acesse: https://www.postgresql.org/download/windows/
2. Baixe o instalador
3. Execute e siga as instruções
4. Anote a senha do `postgres`

---

**Execute `scripts\verificar-instalacao-postgres.bat` para diagnóstico completo!**

