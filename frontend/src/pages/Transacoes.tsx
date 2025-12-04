import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { transactionService, Transaction } from '../services/transactionService';
import RegistrarDespesa from '../components/RegistrarDespesa';
import './Transacoes.css';

function Transacoes() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterTipo, setFilterTipo] = useState<'todos' | 'receita' | 'despesa'>('todos');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const transactionsData = await transactionService.getAll({ limit: 100 });
      setTransactions(transactionsData.transactions || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta transação?')) {
      return;
    }

    try {
      await transactionService.delete(id);
      loadData();
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      alert('Erro ao deletar transação');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterTipo === 'todos') return true;
    return t.tipo === filterTipo;
  });

  if (loading) {
    return (
      <div className="transacoes-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="transacoes-container">
      <header className="transacoes-header">
        <div className="header-left">
          <h1>Transações</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancelar' : '+ Nova Transação'}
          </button>
        </div>
        <div className="header-right">
          <select 
            value={filterTipo} 
            onChange={(e) => setFilterTipo(e.target.value as any)}
            className="filter-select"
          >
            <option value="todos">Todas</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
          <button onClick={() => navigate('/importacao')} className="btn-secondary">
            Importar CSV
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Voltar
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-section">
          <RegistrarDespesa onSuccess={() => { setShowForm(false); loadData(); }} />
        </div>
      )}

      <main className="transacoes-main">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma transação encontrada.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Criar primeira transação
            </button>
          </div>
        ) : (
          <div className="transactions-list">
            {filteredTransactions.map(transaction => (
              <div key={transaction.id} className={`transaction-card ${transaction.tipo}`}>
                <div className="transaction-info">
                  <div className="transaction-header">
                    <h3>{transaction.categoria}</h3>
                    <span className={`transaction-value ${transaction.tipo}`}>
                      {transaction.tipo === 'receita' ? '+' : '-'}R$ {Math.abs(transaction.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {transaction.descricao && (
                    <p className="transaction-description">{transaction.descricao}</p>
                  )}
                  <div className="transaction-meta">
                    <span className="transaction-date">
                      {new Date(transaction.data).toLocaleDateString('pt-BR')}
                    </span>
                    {transaction.metodo_pagamento && (
                      <span className="transaction-method">{transaction.metodo_pagamento}</span>
                    )}
                    {transaction.conta_origem && (
                      <span className="transaction-account">{transaction.conta_origem}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => transaction.id && handleDelete(transaction.id)}
                  className="delete-button"
                  title="Deletar transação"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Transacoes;

