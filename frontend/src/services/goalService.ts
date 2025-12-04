import api from './api';

export interface Goal {
  id?: string;
  titulo: string;
  valor_objetivo: number;
  valor_atual?: number;
  prazo?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  status?: 'ativa' | 'concluida' | 'cancelada';
}

export const goalService = {
  async getAll() {
    const response = await api.get('/goals');
    return response.data;
  },

  async create(goal: Goal) {
    const response = await api.post('/goals', goal);
    return response.data;
  },

  async update(id: string, goal: Partial<Goal>) {
    const response = await api.put(`/goals/${id}`, goal);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },
};

