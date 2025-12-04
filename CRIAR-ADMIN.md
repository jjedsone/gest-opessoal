# 🔐 Criar Conta Admin

## Credenciais Padrão

- **Email:** `admin@finunity.com`
- **Senha:** `admin123`

## Como Criar

### Opção 1: Automático (Recomendado)

O usuário admin é criado **automaticamente** quando o backend inicia pela primeira vez!

Apenas inicie o servidor:
```bash
cd backend
npm run dev
```

O sistema verificará se o admin existe e criará automaticamente se não existir.

### Opção 2: Script Manual

Execute o script de criação:

```bash
# Windows
scripts\criar-admin.bat

# Ou manualmente
cd backend
node ../scripts/criar-admin.js
```

### Opção 3: SQL Direto

Execute o SQL diretamente no banco:

```bash
psql -U postgres -d finunity -f database/create-admin.sql
```

**Nota:** O SQL precisa do hash da senha gerado pelo bcryptjs. Use o script Node.js para gerar corretamente.

## Como Usar

1. Acesse: http://localhost:3000
2. Faça login com:
   - Email: `admin@finunity.com`
   - Senha: `admin123`

## ⚠️ Importante

**Altere a senha após o primeiro acesso!**

A conta admin tem acesso completo ao sistema. Use apenas para desenvolvimento/testes.

## Verificar se Admin Existe

```sql
SELECT id, nome, email FROM users WHERE email = 'admin@finunity.com';
```

## Resetar Senha do Admin

Se precisar resetar a senha:

```bash
# Deletar admin existente
psql -U postgres -d finunity -c "DELETE FROM users WHERE email = 'admin@finunity.com';"

# Recriar (o sistema criará automaticamente na próxima inicialização)
# Ou execute o script manualmente
scripts\criar-admin.bat
```

---

**A conta admin está pronta para uso!** 🎉

