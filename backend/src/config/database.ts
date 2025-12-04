import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Caminho do banco de dados SQLite
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database/finunity.db');

// Garantir que o diretório existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Criar conexão com SQLite
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Criar tabelas se não existirem
function initializeDatabase() {
  try {
    // Verificar se as tabelas já existem
    const tablesCheck = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    `).get();
    
    if (tablesCheck) {
      console.log('✅ Tabelas já existem no banco de dados');
      return;
    }

    // Se não existir, criar as tabelas
    console.log('📋 Criando tabelas no banco de dados...');
    
    // Criar tabela de usuários
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        tipo TEXT NOT NULL CHECK (tipo IN ('solteiro', 'casal')),
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de perfis
    db.exec(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        cpf TEXT,
        renda_mensal REAL,
        preferencia_divisao TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);

    // Criar tabela de contas
    db.exec(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL CHECK (tipo IN ('corrente', 'poupanca', 'conjunta', 'investimento')),
        saldo REAL DEFAULT 0.00,
        ativa INTEGER DEFAULT 1,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de transações
    db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
        categoria TEXT NOT NULL,
        subcategoria TEXT,
        valor REAL NOT NULL,
        data DATE NOT NULL,
        recorrente INTEGER DEFAULT 0,
        frequencia TEXT,
        nota TEXT,
        metodo_pagamento TEXT,
        conta_origem TEXT CHECK (conta_origem IN ('conjunta', 'individual')),
        divisao_aplicada TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de orçamentos
    db.exec(`
      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        categoria TEXT NOT NULL,
        limite_mensal REAL NOT NULL,
        mes_ano DATE NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, categoria, mes_ano)
      )
    `);

    // Criar tabela de metas
    db.exec(`
      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        titulo TEXT NOT NULL,
        valor_objetivo REAL NOT NULL,
        valor_atual REAL DEFAULT 0.00,
        prazo DATE,
        prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
        status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'cancelada')),
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de regras de divisão
    db.exec(`
      CREATE TABLE IF NOT EXISTS rules_division (
        id TEXT PRIMARY KEY,
        casal_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tipo TEXT NOT NULL CHECK (tipo IN ('percentual', 'proporcional', 'fixo', 'equal')),
        parametros TEXT NOT NULL,
        categoria TEXT,
        ativa INTEGER DEFAULT 1,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de sugestões da IA
    db.exec(`
      CREATE TABLE IF NOT EXISTS ai_suggestions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tipo TEXT NOT NULL,
        texto TEXT NOT NULL,
        acao_sugerida TEXT,
        status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceita', 'rejeitada', 'executada')),
        data DATETIME DEFAULT CURRENT_TIMESTAMP,
        visualizada INTEGER DEFAULT 0
      )
    `);

    // Criar tabela de relacionamento casal
    db.exec(`
      CREATE TABLE IF NOT EXISTS couple_relationships (
        id TEXT PRIMARY KEY,
        user_a_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user_b_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_a_id, user_b_id),
        CHECK (user_a_id != user_b_id)
      )
    `);

    // Criar índices
    db.exec(`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_transactions_data ON transactions(data)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_transactions_tipo ON transactions(tipo)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_id ON ai_suggestions(user_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_ai_suggestions_status ON ai_suggestions(status)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);

    console.log('✅ Banco de dados SQLite inicializado com sucesso');
  } catch (error: any) {
    console.error('❌ Erro ao inicializar banco SQLite:', error.message);
    console.error('   Stack:', error.stack);
    throw error;
  }
}

// Inicializar banco na primeira conexão
try {
  initializeDatabase();
  console.log(`✅ Conexão com SQLite estabelecida em: ${dbPath}`);
} catch (error: any) {
  console.error('❌ Erro crítico ao inicializar banco SQLite:', error.message);
  console.error('   Verifique se o diretório database/ existe e tem permissões de escrita');
  process.exit(1);
}

// Wrapper para compatibilidade com código existente (pg)
const pool = {
  query: async (text: string, params?: any[]) => {
    try {
      // Substituir placeholders PostgreSQL ($1, $2) por SQLite (?)
      let sql = text;
      if (params && params.length > 0) {
        // Se já usa ?, manter como está
        if (!text.includes('?')) {
          // Converter $1, $2, etc para ?
          sql = text.replace(/\$(\d+)/g, '?');
        }
      }
      
      const stmt = db.prepare(sql);
      const result = stmt.all(params || []);
      return Promise.resolve({ rows: result });
    } catch (error: any) {
      return Promise.reject(error);
    }
  },
  
  queryOne: async (text: string, params?: any[]) => {
    try {
      let sql = text;
      if (params && params.length > 0 && !text.includes('?')) {
        sql = text.replace(/\$(\d+)/g, '?');
      }
      const stmt = db.prepare(sql);
      const result = stmt.get(params || []);
      return Promise.resolve({ rows: result ? [result] : [] });
    } catch (error: any) {
      return Promise.reject(error);
    }
  },
};

// Função helper para gerar UUID (SQLite não tem uuid-ossp)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default pool;
export { db, generateUUID };
