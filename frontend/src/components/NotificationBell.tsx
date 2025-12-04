import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import './NotificationBell.css';

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 60000); // Atualizar a cada minuto
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Erro ao carregar contador:', error);
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAll(false);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!showDropdown) {
      loadNotifications();
    }
    setShowDropdown(!showDropdown);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      loadUnreadCount();
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  return (
    <div className="notification-bell-container">
      <button onClick={handleToggle} className="bell-button">
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className="dropdown-overlay" onClick={() => setShowDropdown(false)}></div>
          <div className="notification-dropdown">
            <div className="dropdown-header">
              <h3>Notificações</h3>
              {notifications.length > 0 && (
                <button onClick={handleMarkAllAsRead} className="mark-all-read">
                  Marcar todas como lidas
                </button>
              )}
            </div>

            <div className="notifications-list">
              {loading ? (
                <div className="loading">Carregando...</div>
              ) : notifications.length === 0 ? (
                <div className="empty-notifications">
                  <p>Nenhuma notificação nova</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${notification.tipo}`}>
                    <div className="notification-content">
                      <p className="notification-text">{notification.texto}</p>
                      <span className="notification-time">
                        {new Date(notification.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <button
                      onClick={() => notification.id && handleMarkAsRead(notification.id)}
                      className="mark-read-button"
                      title="Marcar como lida"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationBell;

