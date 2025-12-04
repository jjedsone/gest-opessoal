import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { goalService, Goal } from '../services/goalService';
import './Metas.css';

function Metas() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState<Goal>({
    titulo: '',
    valor_objetivo: 0,
    valor_atual: 0,
    prazo: '',
    prioridade: 'media',
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadGoals();
  }, [navigate]);

  const loadGoals = async () => {
    try {
      const data = await goalService.getAll();
      setGoals(data.goals || []);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valor_objetivo' || name === 'valor_atual' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGoal?.id) {
        await goalService.update(editingGoal.id, formData);
      } else {
        await goalService.create(formData);
      }
      
      setShowForm(false);
      setEditingGoal(null);
      setFormData({
        titulo: '',
        valor_objetivo: 0,
        valor_atual: 0,
        prazo: '',
        prioridade: 'media',
      });
      loadGoals();
    } catch (error: any) {
      console.error('Erro ao salvar meta:', error);
      alert(error.response?.data?.error || 'Erro ao salvar meta');
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      titulo: goal.titulo,
      valor_objetivo: goal.valor_objetivo,
      valor_atual: goal.valor_atual || 0,
      prazo: goal.prazo || '',
      prioridade: goal.prioridade || 'media',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta meta?')) {
      return;
    }

    try {
      await goalService.delete(id);
      loadGoals();
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
      alert('Erro ao deletar meta');
    }
  };

  const handleAddValue = async (goal: Goal, valor: number) => {
    if (!goal.id) return;
    
    try {
      const novoValor = (goal.valor_atual || 0) + valor;
      await goalService.update(goal.id, { valor_atual: novoValor });
      loadGoals();
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      alert('Erro ao atualizar meta');
    }
  };

  const calcularProgresso = (goal: Goal): number => {
    if (!goal.valor_objetivo) return 0;
    return Math.min(((goal.valor_atual || 0) / goal.valor_objetivo) * 100, 100);
  };

  const calcularDiasRestantes = (prazo: string): number => {
    if (!prazo) return 0;
    const hoje = new Date();
    const dataPrazo = new Date(prazo);
    const diff = dataPrazo.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="metas-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="metas-container">
      <header className="metas-header">
        <div className="header-left">
          <h1>Metas de Poupança</h1>
          <button onClick={() => { setShowForm(!showForm); setEditingGoal(null); setFormData({ titulo: '', valor_objetivo: 0, valor_atual: 0, prazo: '', prioridade: 'media' }); }} className="btn-primary">
            {showForm ? 'Cancelar' : '+ Nova Meta'}
          </button>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          Voltar
        </button>
      </header>

      {showForm && (
        <div className="form-section">
          <div className="form-card">
            <h2>{editingGoal ? 'Editar Meta' : 'Nova Meta'}</h2>
            <form onSubmit={handleSubmit} className="meta-form">
              <div className="form-group">
                <label htmlFor="titulo">Título da Meta</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ex.: Viagem para Europa"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="valor_objetivo">Valor Objetivo (R$)</label>
                  <input
                    type="number"
                    id="valor_objetivo"
                    name="valor_objetivo"
                    value={formData.valor_objetivo}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="valor_atual">Valor Atual (R$)</label>
                  <input
                    type="number"
                    id="valor_atual"
                    name="valor_atual"
                    value={formData.valor_atual}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prazo">Prazo</label>
                  <input
                    type="date"
                    id="prazo"
                    name="prazo"
                    value={formData.prazo}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prioridade">Prioridade</label>
                  <select
                    id="prioridade"
                    name="prioridade"
                    value={formData.prioridade}
                    onChange={handleChange}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="submit-button">
                {editingGoal ? 'Atualizar Meta' : 'Criar Meta'}
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="metas-main">
        {goals.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma meta cadastrada.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Criar primeira meta
            </button>
          </div>
        ) : (
          <div className="goals-grid">
            {goals.map(goal => {
              const progresso = calcularProgresso(goal);
              const diasRestantes = calcularDiasRestantes(goal.prazo || '');
              const valorRestante = goal.valor_objetivo - (goal.valor_atual || 0);

              return (
                <div key={goal.id} className={`goal-card priority-${goal.prioridade}`}>
                  <div className="goal-header">
                    <h3>{goal.titulo}</h3>
                    <div className="goal-actions">
                      <button onClick={() => handleEdit(goal)} className="edit-button">Editar</button>
                      <button onClick={() => goal.id && handleDelete(goal.id)} className="delete-button">×</button>
                    </div>
                  </div>

                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progresso}%` }}
                      ></div>
                    </div>
                    <div className="progress-info">
                      <span className="progress-text">
                        {progresso.toFixed(1)}% concluído
                      </span>
                    </div>
                  </div>

                  <div className="goal-values">
                    <div className="value-item">
                      <span className="value-label">Atual</span>
                      <span className="value-amount">
                        R$ {(goal.valor_atual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="value-item">
                      <span className="value-label">Objetivo</span>
                      <span className="value-amount">
                        R$ {goal.valor_objetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="value-item">
                      <span className="value-label">Restante</span>
                      <span className="value-amount remaining">
                        R$ {valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {goal.prazo && (
                    <div className="goal-deadline">
                      <span className={`deadline-text ${diasRestantes < 30 ? 'urgent' : ''}`}>
                        {diasRestantes > 0 
                          ? `${diasRestantes} dias restantes`
                          : diasRestantes === 0
                          ? 'Prazo hoje'
                          : `Prazo vencido há ${Math.abs(diasRestantes)} dias`
                        }
                      </span>
                    </div>
                  )}

                  <div className="goal-quick-actions">
                    <button 
                      onClick={() => handleAddValue(goal, 100)}
                      className="quick-add"
                    >
                      +R$ 100
                    </button>
                    <button 
                      onClick={() => handleAddValue(goal, 500)}
                      className="quick-add"
                    >
                      +R$ 500
                    </button>
                    <button 
                      onClick={() => {
                        const valor = prompt('Digite o valor a adicionar:');
                        if (valor) handleAddValue(goal, parseFloat(valor));
                      }}
                      className="quick-add custom"
                    >
                      Valor customizado
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Metas;

