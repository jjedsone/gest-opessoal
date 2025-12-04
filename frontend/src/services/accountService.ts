import api from './api';

export interface Account {
  id?: string;
  nome: string;
  tipo: 'corrente' | 'poupanca' | 'conjunta' | 'investimento';
  saldo?: number;
}

export interface BalanceSummary {
  saldoTotal: number;
  totalReceitas: number;
  totalDespesas: number;
  contas: Account[];
}

export const accountService = {
  async getAll() {
    const response = await api.get('/accounts');
    return response.data;
  },

  async create(account: Account) {
    const response = await api.post('/accounts', account);
    return response.data;
  },

  async getBalance(): Promise<BalanceSummary> {
    const response = await api.get('/accounts/balance');
    return response.data;
  },
};

