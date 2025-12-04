import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Configuracoes.css';

interface DivisionRule {
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

function Configuracoes() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [rules, setRules] = useState<DivisionRule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<DivisionRule>({
    tipo: 'equal',
    parametros: {},
    ativa: true,
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadUser();
    loadRules();
  }, [navigate]);

  const loadUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  const loadRules = async () => {
    // Simulação - será implementado quando a API estiver pronta
    // Por enquanto, vamos usar dados mockados
    setRules([
      {
        id: '1',
        tipo: 'equal',
        parametros: {},
        ativa: true,
      },
    ]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('param_')) {
      const paramName = name.replace('param_', '');
      setFormData(prev => ({
        ...prev,
        parametros: {
          ...prev.parametros,
          [paramName]: parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui será feita a chamada à API quando implementada
    alert('Regra de divisão salva! (Funcionalidade em desenvolvimento)');
    setShowForm(false);
    loadRules();
  };

  const getRuleDescription = (rule: DivisionRule): string => {
    switch (rule.tipo) {
      case 'equal':
        return 'Divisão igual (50/50)';
      case 'percentual':
        return `Divisão percentual (${rule.parametros.percentual_a || 0}% / ${rule.parametros.percentual_b || 0}%)`;
      case 'proporcional':
        return 'Divisão proporcional à renda';
      case 'fixo':
        return `Valor fixo: R$ ${rule.parametros.valor_fixo || 0}`;
      default:
        return 'Regra não definida';
    }
  };

  return (
    <div className="configuracoes-container">
      <header className="configuracoes-header">
        <div className="header-left">
          <h1>Configurações</h1>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          Voltar
        </button>
      </header>

      <main className="configuracoes-main">
        <div className="config-section">
          <h2>Informações do Perfil</h2>
          <div className="info-card">
            <div className="info-item">
              <span className="info-label">Nome</span>
              <span className="info-value">{user?.nome || 'Carregando...'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">E-mail</span>
              <span className="info-value">{user?.email || 'Carregando...'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tipo de Conta</span>
              <span className="info-value">{user?.tipo === 'casal' ? 'Casal' : 'Solteiro'}</span>
            </div>
            {user?.renda_mensal && (
              <div className="info-item">
                <span className="info-label">Renda Mensal</span>
                <span className="info-value">
                  R$ {parseFloat(user.renda_mensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        </div>

        {user?.tipo === 'casal' && (
          <div className="config-section">
            <div className="section-header">
              <h2>Regras de Divisão de Contas</h2>
              <button onClick={() => { setShowForm(true); setFormData({ tipo: 'equal', parametros: {}, ativa: true }); }} className="btn-primary">
                + Nova Regra
              </button>
            </div>

            {showForm && (
              <div className="form-card">
                <h3>Nova Regra de Divisão</h3>
                <form onSubmit={handleSubmit} className="rule-form">
                  <div className="form-group">
                    <label htmlFor="tipo">Tipo de Divisão</label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      required
                    >
                      <option value="equal">Divisão Igual (50/50)</option>
                      <option value="percentual">Divisão Percentual</option>
                      <option value="proporcional">Proporcional à Renda</option>
                      <option value="fixo">Valor Fixo</option>
                    </select>
                  </div>

                  {formData.tipo === 'percentual' && (
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="param_percentual_a">Percentual Usuário A (%)</label>
                        <input
                          type="number"
                          id="param_percentual_a"
                          name="param_percentual_a"
                          value={formData.parametros.percentual_a || 0}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="param_percentual_b">Percentual Usuário B (%)</label>
                        <input
                          type="number"
                          id="param_percentual_b"
                          name="param_percentual_b"
                          value={formData.parametros.percentual_b || 0}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {formData.tipo === 'fixo' && (
                    <div className="form-group">
                      <label htmlFor="param_valor_fixo">Valor Fixo (R$)</label>
                      <input
                        type="number"
                        id="param_valor_fixo"
                        name="param_valor_fixo"
                        value={formData.parametros.valor_fixo || 0}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="categoria">Categoria (opcional)</label>
                    <input
                      type="text"
                      id="categoria"
                      name="categoria"
                      value={formData.categoria || ''}
                      onChange={handleChange}
                      placeholder="Deixe vazio para aplicar a todas"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                      Salvar Regra
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="rules-list">
              {rules.length === 0 ? (
                <p className="empty-message">Nenhuma regra configurada</p>
              ) : (
                rules.map(rule => (
                  <div key={rule.id} className="rule-card">
                    <div className="rule-info">
                      <h4>{getRuleDescription(rule)}</h4>
                      {rule.categoria && (
                        <span className="rule-category">Categoria: {rule.categoria}</span>
                      )}
                      <span className={`rule-status ${rule.ativa ? 'active' : 'inactive'}`}>
                        {rule.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <div className="rule-actions">
                      <button className="edit-btn">Editar</button>
                      <button className="delete-btn">×</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Configuracoes;

