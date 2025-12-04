import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { authService } from '../services/authService';
import { accountService, BalanceSummary } from '../services/accountService';
import { goalService, Goal } from '../services/goalService';
import { transactionService } from '../services/transactionService';
import NotificationBell from '../components/NotificationBell';
import { useAutoSuggestions } from '../hooks/useAutoSuggestions';
import './Dashboard.css';

interface CategorySpending {
  categoria: string;
  valor: number;
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<BalanceSummary | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  // Auto-gerar sugestões da IA
  useAutoSuggestions();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [balanceData, goalsData, transactionsData] = await Promise.all([
        accountService.getBalance(),
        goalService.getAll(),
        transactionService.getAll({ limit: 100 }),
      ]);
      
      setBalance(balanceData);
      setGoals(goalsData.goals || []);

      // Processar gastos por categoria
      const despesas = (transactionsData.transactions || []).filter((t: any) => t.tipo === 'despesa');
      const categoryMap = new Map<string, number>();

      despesas.forEach((t: any) => {
        const current = categoryMap.get(t.categoria) || 0;
        categoryMap.set(t.categoria, current + parseFloat(t.valor));
      });

      const categoryData = Array.from(categoryMap.entries()).map(([categoria, valor]) => ({
        categoria,
        valor: Math.abs(valor),
      })).sort((a, b) => b.valor - a.valor);

      setCategorySpending(categoryData);

      // Processar dados mensais (últimos 6 meses)
      const monthlyMap = new Map<string, { receitas: number; despesas: number }>();
      const hoje = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        monthlyMap.set(monthKey, { receitas: 0, despesas: 0 });
      }

      transactionsData.transactions?.forEach((t: any) => {
        const date = new Date(t.data);
        const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        const monthData = monthlyMap.get(monthKey);
        
        if (monthData) {
          if (t.tipo === 'receita') {
            monthData.receitas += parseFloat(t.valor);
          } else {
            monthData.despesas += Math.abs(parseFloat(t.valor));
          }
        }
      });

      const monthlyArray = Array.from(monthlyMap.entries()).map(([mes, dados]) => ({
        mes,
        receitas: dados.receitas,
        despesas: dados.despesas,
      }));

      setMonthlyData(monthlyArray);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>FinUnity</h1>
        <nav className="dashboard-nav">
          <a href="/dashboard">Dashboard</a>
          <a href="/transacoes">Transações</a>
          <a href="/metas">Metas</a>
          <a href="/relatorios">Relatórios</a>
          <a href="/importacao">Importar</a>
          <a href="/sugestoes-ia">IA</a>
          <a href="/ajuda">Ajuda</a>
          <a href="/configuracoes">Configurações</a>
        </nav>
        <div className="header-right">
          <NotificationBell />
          <span className="user-name">Olá, {user?.nome}</span>
          <button onClick={handleLogout} className="logout-button">Sair</button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="saldo-card">
          <h2>Saldo Total</h2>
          <p className="saldo-valor">
            R$ {balance?.saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
          </p>
          <div className="saldo-details">
            <span>Receitas: R$ {balance?.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</span>
            <span>Despesas: R$ {balance?.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</span>
          </div>
        </div>

        <div className="charts-grid">
          {categorySpending.length > 0 && (
            <div className="chart-card">
              <h3>Gastos por Categoria</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categorySpending}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ categoria, percent }) => `${categoria}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {monthlyData.length > 0 && (
            <div className="chart-card">
              <h3>Receitas vs Despesas (Últimos 6 Meses)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                  <Bar dataKey="receitas" fill="#48bb78" name="Receitas" />
                  <Bar dataKey="despesas" fill="#f56565" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
        <div className="cards-grid">
          <div className="card">
            <h3>Contas</h3>
            {balance?.contas && balance.contas.length > 0 ? (
              <ul className="accounts-list">
                {balance.contas.map(conta => (
                  <li key={conta.id}>
                    <span className="account-name">{conta.nome}</span>
                    <span className="account-balance">
                      R$ {conta.saldo?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma conta cadastrada</p>
            )}
          </div>
          
          <div className="card">
            <h3>Metas em Destaque</h3>
            {goals.length > 0 ? (
              <ul className="goals-list">
                {goals.slice(0, 3).map(meta => {
                  const progresso = meta.valor_atual && meta.valor_objetivo 
                    ? (meta.valor_atual / meta.valor_objetivo) * 100 
                    : 0;
                  return (
                    <li key={meta.id}>
                      <div className="goal-header">
                        <span className="goal-title">{meta.titulo}</span>
                        <span className="goal-priority">{meta.prioridade}</span>
                      </div>
                      <div className="goal-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${Math.min(progresso, 100)}%` }}
                          ></div>
                        </div>
                        <span className="goal-amount">
                          R$ {meta.valor_atual?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'} / 
                          R$ {meta.valor_objetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>Nenhuma meta cadastrada</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
