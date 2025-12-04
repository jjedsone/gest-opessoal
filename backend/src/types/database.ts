// Tipos para resultados de queries do banco de dados

export interface QueryResult<T = any> {
  rows: T[];
}

export interface UserRow {
  id: string;
  nome: string;
  username: string;
  password_hash?: string;
  tipo: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface AccountRow {
  id: string;
  user_id: string;
  nome: string;
  tipo: string;
  saldo: number;
  ativa: number;
  criado_em?: string;
  atualizado_em?: string;
}

export interface TransactionRow {
  id: string;
  account_id: string;
  user_id: string;
  tipo: string;
  categoria: string;
  subcategoria?: string;
  valor: number;
  data: string;
  recorrente: number;
  frequencia?: string;
  nota?: string;
  metodo_pagamento?: string;
  conta_origem?: string;
  divisao_aplicada?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface GoalRow {
  id: string;
  user_id: string;
  titulo: string;
  valor_objetivo: number;
  valor_atual: number;
  prazo?: string;
  prioridade: string;
  status: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface BudgetRow {
  id: string;
  user_id: string;
  categoria: string;
  limite_mensal: number;
  mes_ano: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface AISuggestionRow {
  id: string;
  user_id: string;
  tipo: string;
  texto: string;
  acao_sugerida?: string;
  status: string;
  data: string;
  visualizada: number;
}

