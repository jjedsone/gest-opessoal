import api from './api';

export interface DivisionRule {
  id?: string;
  tipo: 'equal' | 'percentual' | 'proporcional' | 'fixo';
  parametros: {
    percentual_a?: number;
    percentual_b?: number;
    valor_fixo?: number;
  };
  categoria?: string;
  ativa: boolean;
}

export interface DivisionResult {
  usuarioA: number;
  usuarioB: number;
  total: number;
  tipo: string;
}

export const divisionService = {
  async getRules() {
    const response = await api.get('/division');
    return response.data;
  },

  async createRule(rule: DivisionRule) {
    const response = await api.post('/division', rule);
    return response.data;
  },

  async updateRule(id: string, rule: Partial<DivisionRule>) {
    const response = await api.put(`/division/${id}`, rule);
    return response.data;
  },

  async deleteRule(id: string) {
    const response = await api.delete(`/division/${id}`);
    return response.data;
  },

  async calculateDivision(valor: number, categoria?: string): Promise<DivisionResult> {
    const response = await api.post('/division/calculate', { valor, categoria });
    return response.data;
  },
};

