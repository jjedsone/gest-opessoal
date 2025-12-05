import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';
import './StatusLogin.css';

interface StatusInfo {
  backend: {
    status: 'checking' | 'online' | 'offline';
    message: string;
    health?: any;
  };
  database: {
    status: 'checking' | 'connected' | 'disconnected';
    message: string;
  };
  login: {
    status: 'not-tested' | 'success' | 'failed';
    message: string;
    user?: any;
  };
}

function StatusLogin() {
  const [status, setStatus] = useState<StatusInfo>({
    backend: { status: 'checking', message: 'Verificando...' },
    database: { status: 'checking', message: 'Verificando...' },
    login: { status: 'not-tested', message: 'Não testado' },
  });
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      // Verificar health check básico
      const healthResponse = await fetch('http://localhost:3001/health');
      const healthData = await healthResponse.json();

      setStatus(prev => ({
        ...prev,
        backend: {
          status: 'online',
          message: 'Backend está online',
          health: healthData,
        },
      }));

      // Verificar health check do banco
      try {
        const dbHealthResponse = await fetch('http://localhost:3001/health/db');
        const dbHealthData = await dbHealthResponse.json();

        setStatus(prev => ({
          ...prev,
          database: {
            status: dbHealthData.status === 'ok' ? 'connected' : 'disconnected',
            message: dbHealthData.status === 'ok' 
              ? 'Banco de dados conectado' 
              : 'Banco de dados desconectado',
          },
        }));
      } catch (err) {
        setStatus(prev => ({
          ...prev,
          database: {
            status: 'disconnected',
            message: 'Erro ao verificar banco de dados',
          },
        }));
      }
    } catch (err) {
      setStatus(prev => ({
        ...prev,
        backend: {
          status: 'offline',
          message: 'Backend não está respondendo',
        },
        database: {
          status: 'disconnected',
          message: 'Não foi possível verificar',
        },
      }));
    }
  };

  const testLogin = async () => {
    setTesting(true);
    setStatus(prev => ({
      ...prev,
      login: {
        status: 'not-tested',
        message: 'Testando login...',
      },
    }));

    try {
      const result = await authService.login({
        username: 'admin',
        password: 'admin123',
      });

      setStatus(prev => ({
        ...prev,
        login: {
          status: 'success',
          message: 'Login realizado com sucesso!',
          user: result.user,
        },
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Erro desconhecido';
      setStatus(prev => ({
        ...prev,
        login: {
          status: 'failed',
          message: `Erro: ${errorMessage}`,
        },
      }));
    } finally {
      setTesting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'success':
        return '#10b981'; // green
      case 'offline':
      case 'disconnected':
      case 'failed':
        return '#ef4444'; // red
      case 'checking':
      case 'not-tested':
        return '#f59e0b'; // yellow
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'success':
        return '✅';
      case 'offline':
      case 'disconnected':
      case 'failed':
        return '❌';
      case 'checking':
        return '⏳';
      default:
        return '⏸️';
    }
  };

  return (
    <div className="status-login-container">
      <div className="status-login-card">
        <h1>🔍 Status do Sistema - FinUnity</h1>
        <p className="subtitle">Verificação de conectividade e login</p>

        <div className="status-grid">
          {/* Backend Status */}
          <div className="status-item">
            <div className="status-header">
              <span className="status-icon">{getStatusIcon(status.backend.status)}</span>
              <h3>Backend</h3>
            </div>
            <p className="status-message">{status.backend.message}</p>
            {status.backend.health && (
              <div className="status-details">
                <small>Status: {status.backend.health.status}</small>
              </div>
            )}
            <div 
              className="status-indicator" 
              style={{ backgroundColor: getStatusColor(status.backend.status) }}
            />
          </div>

          {/* Database Status */}
          <div className="status-item">
            <div className="status-header">
              <span className="status-icon">{getStatusIcon(status.database.status)}</span>
              <h3>Banco de Dados</h3>
            </div>
            <p className="status-message">{status.database.message}</p>
            <div 
              className="status-indicator" 
              style={{ backgroundColor: getStatusColor(status.database.status) }}
            />
          </div>

          {/* Login Status */}
          <div className="status-item">
            <div className="status-header">
              <span className="status-icon">{getStatusIcon(status.login.status)}</span>
              <h3>Login</h3>
            </div>
            <p className="status-message">{status.login.message}</p>
            {status.login.user && (
              <div className="status-details">
                <small>
                  Usuário: {status.login.user.username} ({status.login.user.nome})
                </small>
              </div>
            )}
            <button 
              onClick={testLogin} 
              disabled={testing || status.backend.status !== 'online'}
              className="test-button"
            >
              {testing ? 'Testando...' : 'Testar Login'}
            </button>
            <div 
              className="status-indicator" 
              style={{ backgroundColor: getStatusColor(status.login.status) }}
            />
          </div>
        </div>

        <div className="status-actions">
          <button onClick={checkBackend} className="refresh-button">
            🔄 Atualizar Status
          </button>
          <a href="/login-simples" className="login-link">
            Ir para Login
          </a>
        </div>

        <div className="status-info">
          <h4>Credenciais de Teste:</h4>
          <p>
            <strong>Username:</strong> admin<br />
            <strong>Senha:</strong> admin123
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatusLogin;

