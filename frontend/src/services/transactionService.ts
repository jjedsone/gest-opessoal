import api from './api';

export interface Transaction {
  id?: string;
  account_id: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  subcategoria?: string;
  valor: number;
  data: string;
  recorrente?: boolean;
  frequencia?: string;
  nota?: string;
  metodo_pagamento?: string;
  conta_origem?: 'conjunta' | 'individual';
  descricao?: string;
}

export interface TransactionFilters {
  account_id?: string;
  tipo?: 'receita' | 'despesa';
  categoria?: string;
  data_inicio?: string;
  data_fim?: string;
  limit?: number;
  offset?: number;
}

export const transactionService = {
  async create(transaction: Transaction) {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },

  async getAll(filters?: TransactionFilters) {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

