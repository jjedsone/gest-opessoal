import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { aiSuggestionService, AISuggestion } from '../services/aiSuggestionService';
import './SugestoesIA.css';

function SugestoesIA() {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'aceita' | 'rejeitada'>('todos');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadSuggestions();
  }, [navigate, filter]);

  const loadSuggestions = async () => {
    try {
      const data = await aiSuggestionService.getAll(
        undefined,
        filter === 'todos' ? undefined : filter
      );
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await aiSuggestionService.generate();
      await loadSuggestions();
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      alert('Erro ao gerar sugestões');
    } finally {
      setGenerating(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await aiSuggestionService.accept(id);
      await loadSuggestions();
    } catch (error) {
      console.error('Erro ao aceitar sugestão:', error);
      alert('Erro ao aceitar sugestão');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await aiSuggestionService.reject(id);
      await loadSuggestions();
    } catch (error) {
      console.error('Erro ao rejeitar sugestão:', error);
      alert('Erro ao rejeitar sugestão');
    }
  };

  const getTipoLabel = (tipo: string): string => {
    const labels: { [key: string]: string } = {
      economia: '💡 Economia',
      meta: '🎯 Meta',
      alerta: '⚠️ Alerta',
      investimento: '📈 Investimento',
      divisao: '👥 Divisão',
      resumo: '📊 Resumo',
    };
    return labels[tipo] || tipo;
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { text: string; class: string } } = {
      pendente: { text: 'Pendente', class: 'status-pending' },
      aceita: { text: 'Aceita', class: 'status-accepted' },
      rejeitada: { text: 'Rejeitada', class: 'status-rejected' },
      executada: { text: 'Executada', class: 'status-executed' },
    };
    const badge = badges[status] || badges.pendente;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  if (loading) {
    return (
      <div className="sugestoes-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="sugestoes-container">
      <header className="sugestoes-header">
        <div className="header-left">
          <h1>Sugestões da IA</h1>
          <button onClick={handleGenerate} className="btn-generate" disabled={generating}>
            {generating ? 'Gerando...' : '🔄 Gerar Novas Sugestões'}
          </button>
        </div>
        <div className="header-right">
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="filter-select">
            <option value="todos">Todas</option>
            <option value="pendente">Pendentes</option>
            <option value="aceita">Aceitas</option>
            <option value="rejeitada">Rejeitadas</option>
          </select>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Voltar
          </button>
        </div>
      </header>

      <main className="sugestoes-main">
        {suggestions.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma sugestão encontrada.</p>
            <button onClick={handleGenerate} className="btn-generate" disabled={generating}>
              {generating ? 'Gerando...' : 'Gerar Primeiras Sugestões'}
            </button>
          </div>
        ) : (
          <div className="suggestions-grid">
            {suggestions.map(suggestion => (
              <div key={suggestion.id} className={`suggestion-card ${suggestion.tipo}`}>
                <div className="suggestion-header">
                  <span className="suggestion-type">{getTipoLabel(suggestion.tipo)}</span>
                  {getStatusBadge(suggestion.status)}
                </div>

                <div className="suggestion-content">
                  <p className="suggestion-text">{suggestion.texto}</p>
                  <span className="suggestion-date">
                    {new Date(suggestion.data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {suggestion.status === 'pendente' && (
                  <div className="suggestion-actions">
                    <button
                      onClick={() => suggestion.id && handleAccept(suggestion.id)}
                      className="btn-accept"
                    >
                      ✓ Aceitar
                    </button>
                    <button
                      onClick={() => suggestion.id && handleReject(suggestion.id)}
                      className="btn-reject"
                    >
                      ✗ Rejeitar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SugestoesIA;

