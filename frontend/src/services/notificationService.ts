import api from './api';

export interface Notification {
  id?: string;
  tipo: 'economia' | 'investimento' | 'meta' | 'divisao' | 'alerta' | 'resumo';
  texto: string;
  acao_sugerida?: any;
  status: 'pendente' | 'aceita' | 'rejeitada' | 'executada';
  visualizada: boolean;
  data: string;
}

export const notificationService = {
  async getAll(visualizada?: boolean) {
    const params: any = {};
    if (visualizada !== undefined) {
      params.visualizada = visualizada;
    }
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

