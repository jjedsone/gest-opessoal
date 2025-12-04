import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { transactionService } from '../services/transactionService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Relatorios.css';

interface MonthlyReport {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
  categorias: { [key: string]: number };
}

function Relatorios() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const data = await transactionService.getAll({ limit: 1000 });
      setTransactions(data.transactions || []);
      processMonthlyData(data.transactions || []);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (transactions: any[]) => {
    const monthlyMap = new Map<string, MonthlyReport>();
    const hoje = new Date();

    // Criar estrutura para últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const date = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      
      monthlyMap.set(monthKey, {
        mes: monthLabel,
        receitas: 0,
        despesas: 0,
        saldo: 0,
        categorias: {},
      });
    }

    // Processar transações
    transactions.forEach((t: any) => {
      const date = new Date(t.data);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthData = monthlyMap.get(monthKey);

      if (monthData) {
        const valor = parseFloat(t.valor);
        
        if (t.tipo === 'receita') {
          monthData.receitas += valor;
          monthData.saldo += valor;
        } else {
          monthData.despesas += Math.abs(valor);
          monthData.saldo -= Math.abs(valor);
          
          // Agrupar por categoria
          const categoria = t.categoria || 'Outros';
          monthData.categorias[categoria] = (monthData.categorias[categoria] || 0) + Math.abs(valor);
        }
      }
    });

    const reports = Array.from(monthlyMap.values()).filter(r => r.receitas > 0 || r.despesas > 0);
    setMonthlyReport(reports);
    
    if (reports.length > 0) {
      const lastMonth = reports[reports.length - 1];
      const monthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      setSelectedMonth(monthKey);
    }
  };

  const getCurrentMonthData = () => {
    if (!selectedMonth) return null;
    
    const report = monthlyReport.find(r => {
      const date = new Date(r.mes + ' 1');
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return monthKey === selectedMonth;
    });

    return report;
  };

  const exportToCSV = () => {
    const headers = ['Data', 'Tipo', 'Categoria', 'Valor', 'Descrição'];
    const rows = transactions.map(t => [
      t.data,
      t.tipo,
      t.categoria,
      t.valor,
      t.descricao || t.nota || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-finunity-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="relatorios-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  const currentMonthData = getCurrentMonthData();
  const topCategories = currentMonthData 
    ? Object.entries(currentMonthData.categorias)
        .map(([categoria, valor]) => ({ categoria, valor }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5)
    : [];

  return (
    <div className="relatorios-container">
      <header className="relatorios-header">
        <div className="header-left">
          <h1>Relatórios</h1>
          <div className="export-buttons">
            <button onClick={exportToCSV} className="btn-export">
              Exportar CSV
            </button>
            <button onClick={exportToPDF} className="btn-export">
              Exportar PDF
            </button>
          </div>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          Voltar
        </button>
      </header>

      <main className="relatorios-main">
        <div className="report-section">
          <h2>Evolução Mensal (Últimos 12 Meses)</h2>
          {monthlyReport.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyReport}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                  <Line type="monotone" dataKey="receitas" stroke="#48bb78" name="Receitas" strokeWidth={2} />
                  <Line type="monotone" dataKey="despesas" stroke="#f56565" name="Despesas" strokeWidth={2} />
                  <Line type="monotone" dataKey="saldo" stroke="#667eea" name="Saldo" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="empty-message">Nenhum dado disponível</p>
          )}
        </div>

        {currentMonthData && (
          <div className="report-section">
            <h2>Resumo do Mês Atual</h2>
            <div className="summary-cards">
              <div className="summary-card receitas">
                <h3>Receitas</h3>
                <p className="summary-value">
                  R$ {currentMonthData.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="summary-card despesas">
                <h3>Despesas</h3>
                <p className="summary-value">
                  R$ {currentMonthData.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`summary-card ${currentMonthData.saldo >= 0 ? 'positivo' : 'negativo'}`}>
                <h3>Saldo</h3>
                <p className="summary-value">
                  R$ {currentMonthData.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        )}

        {topCategories.length > 0 && (
          <div className="report-section">
            <h2>Top 5 Categorias de Gastos (Mês Atual)</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Bar dataKey="valor" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="report-section">
          <h2>Transações Recentes</h2>
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 20).map((t: any) => (
                  <tr key={t.id}>
                    <td>{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`badge ${t.tipo}`}>
                        {t.tipo === 'receita' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td>{t.categoria}</td>
                    <td className={t.tipo === 'receita' ? 'positive' : 'negative'}>
                      {t.tipo === 'receita' ? '+' : '-'}R$ {Math.abs(parseFloat(t.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td>{t.descricao || t.nota || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Relatorios;

