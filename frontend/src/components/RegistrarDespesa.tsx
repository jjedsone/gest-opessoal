import { useState, useEffect } from 'react';
import { accountService, Account } from '../services/accountService';
import './RegistrarDespesa.css';

interface DespesaData {
  valor: string;
  categoria: string;
  conta: 'conjunta' | 'individual';
  descricao: string;
  data: string;
}

interface DivisaoResultado {
  usuarioA: number;
  usuarioB: number;
  total: number;
}

interface RegistrarDespesaProps {
  onSuccess?: () => void;
}

function RegistrarDespesa({ onSuccess }: RegistrarDespesaProps) {
  const [formData, setFormData] = useState<DespesaData>({
    valor: '',
    categoria: '',
    conta: 'individual',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
  });

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState<string>('');
  const [tipoTransacao, setTipoTransacao] = useState<'receita' | 'despesa'>('despesa');
  const [divisaoResultado, setDivisaoResultado] = useState<DivisaoResultado | null>(null);
  const [loading, setLoading] = useState(false);
  const [tipoUsuario] = useState<'solteiro' | 'casal'>('casal'); // Será obtido do contexto/API

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await accountService.getAll();
      setAccounts(data.accounts || []);
      if (data.accounts && data.accounts.length > 0) {
        setAccountId(data.accounts[0].id || '');
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
    }
  };

  const categorias = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Compras',
    'Outros',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const calcularDivisao = async (valor: number, categoria?: string): Promise<DivisaoResultado | null> => {
    if (tipoUsuario !== 'casal') return null;

    try {
      const { divisionService } = await import('../services/divisionService');
      const resultado = await divisionService.calculateDivision(valor, categoria);
      return {
        usuarioA: resultado.usuarioA,
        usuarioB: resultado.usuarioB,
        total: resultado.total,
      };
    } catch (error) {
      console.error('Erro ao calcular divisão:', error);
      // Fallback para divisão igual
      return {
        usuarioA: valor / 2,
        usuarioB: valor / 2,
        total: valor,
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { transactionService } = await import('../services/transactionService');
      
      const transactionData = {
        account_id: accountId,
        tipo: tipoTransacao,
        categoria: formData.categoria,
        valor: parseFloat(formData.valor),
        data: formData.data,
        nota: formData.descricao,
        conta_origem: formData.conta === 'conjunta' ? 'conjunta' : 'individual',
        descricao: formData.descricao,
      };

      if (formData.conta === 'conjunta' && tipoUsuario === 'casal') {
        const valor = parseFloat(formData.valor);
        const divisao = await calcularDivisao(valor, formData.categoria);
        if (divisao) {
          setDivisaoResultado(divisao);
        }
      }

      await transactionService.create(transactionData);
      
      // Limpar formulário
      setFormData({
        valor: '',
        categoria: '',
        conta: 'individual',
        descricao: '',
        data: new Date().toISOString().split('T')[0],
      });
      setDivisaoResultado(null);

      if (onSuccess) {
        onSuccess();
      } else {
        alert('Transação registrada com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao registrar transação:', error);
      alert(error.response?.data?.error || 'Erro ao registrar transação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registrar-despesa-container">
      <div className="registrar-despesa-card">
        <h2>Registrar Transação</h2>

        <form onSubmit={handleSubmit} className="despesa-form">
          <div className="form-group">
            <label htmlFor="tipoTransacao">Tipo</label>
            <select
              id="tipoTransacao"
              value={tipoTransacao}
              onChange={(e) => setTipoTransacao(e.target.value as 'receita' | 'despesa')}
              required
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="accountId">Conta</label>
            <select
              id="accountId"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            >
              <option value="">Selecione uma conta</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.nome} ({account.tipo})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="valor">Valor (R$)</label>
            <input
              type="number"
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0,00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {tipoUsuario === 'casal' && (
            <div className="form-group">
              <label htmlFor="conta">Tipo de Conta</label>
              <select
                id="conta"
                name="conta"
                value={formData.conta}
                onChange={handleChange}
                required
              >
                <option value="individual">Individual</option>
                <option value="conjunta">Conjunta</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descrição da despesa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="data">Data</label>
            <input
              type="date"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
            />
          </div>

          {formData.conta === 'conjunta' && tipoUsuario === 'casal' && (
            <div className="divisao-preview">
              <button
                type="button"
                onClick={async () => {
                  const valor = parseFloat(formData.valor);
                  if (valor && formData.categoria) {
                    const divisao = await calcularDivisao(valor, formData.categoria);
                    if (divisao) {
                      setDivisaoResultado(divisao);
                    }
                  }
                }}
                className="btn-preview-division"
                disabled={!formData.valor || !formData.categoria}
              >
                Visualizar Divisão
              </button>
              {divisaoResultado && (
                <div className="divisao-info">
                  <h3>Divisão Aplicada</h3>
                  <p>Usuário A: R$ {divisaoResultado.usuarioA.toFixed(2)}</p>
                  <p>Usuário B: R$ {divisaoResultado.usuarioB.toFixed(2)}</p>
                  <p className="total">Total: R$ {divisaoResultado.total.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading || !accountId}>
            {loading ? 'Registrando...' : 'Registrar Transação'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrarDespesa;

