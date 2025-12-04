# ⚡ Solução Rápida - PostgreSQL Não Encontrado

## 🔍 Problema

**Erro:** "O nome de serviço é inválido"

O nome do serviço PostgreSQL pode variar dependendo da versão e instalação.

## ✅ Solução em 3 Passos

### Passo 1: Encontrar o Nome do Serviço

**Execute:**
```bash
scripts\encontrar-postgres.bat
```

Este script vai:
- Listar todos os serviços PostgreSQL
- Testar nomes comuns
- Mostrar o nome exato do seu serviço

### Passo 2: Iniciar PostgreSQL

**Opção A - Script Automático:**
```bash
scripts\iniciar-postgres-v2.bat
```

**Opção B - Manualmente pelo Services:**
1. Pressione `Win + R`
2. Digite: `services.msc`
3. Procure por serviços com "postgres" ou "PostgreSQL"
4. Clique com botão direito → **Iniciar**

**Opção C - Linha de Comando (após encontrar o nome):**
```bash
net start "NOME_DO_SERVIÇO_ENCONTRADO"
```

### Passo 3: Verificar se Funcionou

```bash
# Testar conexão
psql -U postgres -c "SELECT version();"
```

Se mostrar a versão, está funcionando! ✅

## 🎯 Nomes Comuns de Serviço

Tente estes nomes (um por vez):

```bash
net start postgresql-x64-16
net start postgresql-x64-15
net start postgresql-x64-14
net start postgresql-x64-13
net start PostgreSQL-16
net start PostgreSQL-15
net start PostgreSQL-14
```

## 📋 Após Iniciar PostgreSQL

1. **Criar banco:**
   ```bash
   createdb finunity
   ```

2. **Executar schema:**
   ```bash
   psql -U postgres -d finunity -f database/schema.sql
   ```

3. **Configurar .env:**
   ```env
   DATABASE_URL=postgresql://postgres:SENHA@localhost:5432/finunity
   ```

4. **Reiniciar backend:**
   ```bash
   cd backend
   npm run dev
   ```

## 🆘 Se Nada Funcionar

1. **Verificar se PostgreSQL está instalado:**
   - Procure por "PostgreSQL" no menu Iniciar
   - Ou verifique em: `C:\Program Files\PostgreSQL\`

2. **Instalar PostgreSQL:**
   - Baixe: https://www.postgresql.org/download/windows/
   - Durante instalação, anote a senha do usuário `postgres`

3. **Usar pgAdmin:**
   - Abra o pgAdmin
   - O PostgreSQL geralmente inicia automaticamente quando você abre o pgAdmin

---

**Execute `scripts\encontrar-postgres.bat` para encontrar o nome correto do serviço!**

