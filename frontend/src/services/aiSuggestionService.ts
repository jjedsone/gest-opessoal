import api from './api';

export interface AISuggestion {
  id?: string;
  tipo: 'economia' | 'investimento' | 'meta' | 'divisao' | 'alerta' | 'resumo';
  texto: string;
  acao_sugerida?: any;
  status: 'pendente' | 'aceita' | 'rejeitada' | 'executada';
  visualizada: boolean;
  data: string;
}

export const aiSuggestionService = {
  async generate() {
    const response = await api.post('/ai-suggestions/generate');
    return response.data;
  },

  async getAll(tipo?: string, status?: string) {
    const params: any = {};
    if (tipo) params.tipo = tipo;
    if (status) params.status = status;
    const response = await api.get('/ai-suggestions', { params });
    return response.data;
  },

  async accept(id: string) {
    const response = await api.post(`/ai-suggestions/${id}/accept`);
    return response.data;
  },

  async reject(id: string) {
    const response = await api.post(`/ai-suggestions/${id}/reject`);
    return response.data;
  },
};

