-- FinUnity Database Schema
-- SQLite

-- Tabela de usuários (sem email obrigatório)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('solteiro', 'casal')),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cpf TEXT,
    renda_mensal REAL,
    preferencia_divisao TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Tabela de contas
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('corrente', 'poupanca', 'conjunta', 'investimento')),
    saldo REAL DEFAULT 0.00,
    ativa INTEGER DEFAULT 1,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de transações
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
);

-- Tabela de orçamentos
CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    categoria TEXT NOT NULL,
    limite_mensal REAL NOT NULL,
    mes_ano DATE NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, categoria, mes_ano)
);

-- Tabela de metas
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
);

-- Tabela de regras de divisão (para casais)
CREATE TABLE IF NOT EXISTS rules_division (
    id TEXT PRIMARY KEY,
    casal_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('percentual', 'proporcional', 'fixo', 'equal')),
    parametros TEXT NOT NULL,
    categoria TEXT,
    ativa INTEGER DEFAULT 1,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de sugestões da IA
CREATE TABLE IF NOT EXISTS ai_suggestions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    texto TEXT NOT NULL,
    acao_sugerida TEXT,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceita', 'rejeitada', 'executada')),
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    visualizada INTEGER DEFAULT 0
);

-- Tabela de relacionamento casal
CREATE TABLE IF NOT EXISTS couple_relationships (
    id TEXT PRIMARY KEY,
    user_a_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_b_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_a_id, user_b_id),
    CHECK (user_a_id != user_b_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_data ON transactions(data);
CREATE INDEX IF NOT EXISTS idx_transactions_tipo ON transactions(tipo);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_id ON ai_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_status ON ai_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

