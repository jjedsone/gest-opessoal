# 🔄 Migração para SQLite

## ✅ Mudanças Realizadas

### 1. Banco de Dados
- ✅ **PostgreSQL → SQLite**
- ✅ Banco de dados agora é um arquivo local: `database/finunity.db`
- ✅ Não precisa mais de servidor PostgreSQL rodando
- ✅ Criação automática do banco na primeira execução

### 2. Sistema de Login
- ✅ **Email → Username**
- ✅ Login agora usa apenas username (sem email)
- ✅ Username deve ter no mínimo 3 caracteres
- ✅ Conta admin: `admin` / `admin123`

### 3. Schema do Banco
- ✅ Criado `database/schema.sqlite.sql`
- ✅ Tabelas adaptadas para SQLite
- ✅ UUID gerado em JavaScript (não precisa de extensão PostgreSQL)

## 📋 Como Usar

### Iniciar o Projeto
```bash
npm run dev
```

O banco de dados será criado automaticamente em `database/finunity.db` na primeira execução.

### Credenciais Padrão
- **Username:** `admin`
- **Senha:** `admin123`

## 🔧 Configuração

### Variáveis de Ambiente (Opcional)
```env
# Caminho do banco de dados (opcional)
DATABASE_PATH=./database/finunity.db

# JWT Secret (obrigatório)
JWT_SECRET=seu_secret_aqui

# Porta do servidor (opcional)
PORT=3001
```

## 📁 Estrutura

```
projeto/
├── database/
│   ├── finunity.db          # Banco SQLite (criado automaticamente)
│   ├── schema.sql            # Schema PostgreSQL (antigo)
│   └── schema.sqlite.sql     # Schema SQLite (novo)
├── backend/
│   └── src/
│       └── config/
│           └── database.ts   # Configuração SQLite
```

## ⚠️ Notas Importantes

1. **Backup**: O banco SQLite é um arquivo único. Faça backup regularmente de `database/finunity.db`

2. **Migração de Dados**: Se você tinha dados no PostgreSQL, será necessário migrá-los manualmente

3. **Performance**: SQLite é adequado para desenvolvimento e pequenas aplicações. Para produção com muitos usuários, considere PostgreSQL ou MySQL

4. **Concorrência**: SQLite tem limitações de escrita concorrente. Para aplicações com muitas escritas simultâneas, use PostgreSQL

## 🚀 Vantagens do SQLite

- ✅ Não precisa de servidor separado
- ✅ Configuração simples
- ✅ Perfeito para desenvolvimento
- ✅ Arquivo único facilita backup
- ✅ Zero configuração

## 📝 Próximos Passos

1. Testar login com username
2. Verificar criação automática do banco
3. Testar registro de novos usuários
4. Verificar funcionamento das rotas da API

