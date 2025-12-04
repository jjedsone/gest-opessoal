import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { authService } from '../services/authService';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import './Importacao.css';

interface CSVRow {
  data: string;
  valor: string;
  descricao: string;
  categoria?: string;
  metodo_pagamento?: string;
  conta?: string;
}

function Importacao() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadAccounts();
  }, [navigate]);

  const loadAccounts = async () => {
    try {
      const data = await accountService.getAll();
      setAccounts(data.accounts || []);
      if (data.accounts && data.accounts.length > 0) {
        setSelectedAccount(data.accounts[0].id || '');
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview([]);
      setErrors([]);
      setSuccess(false);
      
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<any>) => {
          const data = results.data as any[];
          const previewData = data.slice(0, 10).map(row => ({
            data: row.data || row.Data || '',
            valor: row.valor || row.Valor || '',
            descricao: row.descricao || row.Descricao || row.descrição || '',
            categoria: row.categoria || row.Categoria || '',
            metodo_pagamento: row.metodo_pagamento || row['metodo_pagamento'] || '',
            conta: row.conta || row.Conta || '',
          }));
          setPreview(previewData);
        },
        error: (error: Error) => {
          setErrors([`Erro ao ler arquivo: ${error.message}`]);
        },
      });
    }
  };

  const validateRow = (row: CSVRow, index: number): string[] => {
    const rowErrors: string[] = [];

    if (!row.data) {
      rowErrors.push(`Linha ${index + 1}: Data é obrigatória`);
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(row.data)) {
        rowErrors.push(`Linha ${index + 1}: Data deve estar no formato YYYY-MM-DD`);
      }
    }

    if (!row.valor) {
      rowErrors.push(`Linha ${index + 1}: Valor é obrigatório`);
    } else {
      const valor = parseFloat(row.valor);
      if (isNaN(valor) || valor === 0) {
        rowErrors.push(`Linha ${index + 1}: Valor inválido`);
      }
    }

    if (!row.descricao) {
      rowErrors.push(`Linha ${index + 1}: Descrição é obrigatória`);
    }

    return rowErrors;
  };

  const handleImport = async () => {
    if (!file || !selectedAccount) {
      setErrors(['Selecione um arquivo e uma conta']);
      return;
    }

    setLoading(true);
    setErrors([]);
    setSuccess(false);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: Papa.ParseResult<any>) => {
        const allErrors: string[] = [];
        const transactions: any[] = [];

        results.data.forEach((row: any, index: number) => {
          const csvRow: CSVRow = {
            data: row.data || row.Data || '',
            valor: row.valor || row.Valor || '',
            descricao: row.descricao || row.Descricao || row.descrição || '',
            categoria: row.categoria || row.Categoria || '',
            metodo_pagamento: row.metodo_pagamento || row['metodo_pagamento'] || '',
            conta: row.conta || row.Conta || '',
          };

          const rowErrors = validateRow(csvRow, index);
          if (rowErrors.length > 0) {
            allErrors.push(...rowErrors);
          } else {
            const valor = parseFloat(csvRow.valor);
            const tipo = valor > 0 ? 'receita' : 'despesa';

            transactions.push({
              account_id: selectedAccount,
              tipo,
              categoria: csvRow.categoria || 'Outros',
              valor: Math.abs(valor),
              data: csvRow.data,
              nota: csvRow.descricao,
              metodo_pagamento: csvRow.metodo_pagamento || 'Transferência',
              descricao: csvRow.descricao,
            });
          }
        });

        if (allErrors.length > 0) {
          setErrors(allErrors);
          setLoading(false);
          return;
        }

        // Importar transações
        try {
          let successCount = 0;
          let errorCount = 0;

          for (const transaction of transactions) {
            try {
              await transactionService.create(transaction);
              successCount++;
            } catch (error) {
              errorCount++;
              console.error('Erro ao importar transação:', error);
            }
          }

          if (errorCount > 0) {
            setErrors([`Importadas ${successCount} transações. ${errorCount} falharam.`]);
          } else {
            setSuccess(true);
            setPreview([]);
            setFile(null);
          }
        } catch (error: any) {
          setErrors([`Erro ao importar: ${error.message}`]);
        } finally {
          setLoading(false);
        }
      },
      error: (error: Error) => {
        setErrors([`Erro ao processar arquivo: ${error.message}`]);
        setLoading(false);
      },
    });
  };

  return (
    <div className="importacao-container">
      <header className="importacao-header">
        <div className="header-left">
          <h1>Importação de Extratos</h1>
        </div>
        <button onClick={() => navigate('/transacoes')} className="btn-secondary">
          Voltar
        </button>
      </header>

      <main className="importacao-main">
        <div className="import-section">
          <h2>Instruções</h2>
          <div className="instructions">
            <p>O arquivo CSV deve conter as seguintes colunas:</p>
            <ul>
              <li><strong>data</strong> - Data da transação (formato: YYYY-MM-DD)</li>
              <li><strong>valor</strong> - Valor da transação (positivo para receita, negativo para despesa)</li>
              <li><strong>descricao</strong> - Descrição da transação</li>
              <li><strong>categoria</strong> - Categoria (opcional, será classificada automaticamente se não informada)</li>
              <li><strong>metodo_pagamento</strong> - Método de pagamento (opcional)</li>
            </ul>
            <p>
              <a href="/docs/exemplo-csv-extrato.csv" download className="download-link">
                Baixar exemplo de arquivo CSV
              </a>
            </p>
          </div>
        </div>

        <div className="import-section">
          <h2>Selecionar Arquivo</h2>
          <div className="file-selector">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file-input"
              id="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              {file ? file.name : 'Escolher arquivo CSV'}
            </label>
          </div>

          <div className="account-selector">
            <label htmlFor="account-select">Conta para importar:</label>
            <select
              id="account-select"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="account-select"
            >
              <option value="">Selecione uma conta</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.nome} ({account.tipo})
                </option>
              ))}
            </select>
          </div>
        </div>

        {preview.length > 0 && (
          <div className="import-section">
            <h2>Pré-visualização (Primeiras 10 linhas)</h2>
            <div className="preview-table">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index}>
                      <td>{row.data}</td>
                      <td className={parseFloat(row.valor) > 0 ? 'positive' : 'negative'}>
                        R$ {Math.abs(parseFloat(row.valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td>{row.descricao}</td>
                      <td>{row.categoria || 'Será classificada'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="error-box">
            <h3>Erros encontrados:</h3>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {success && (
          <div className="success-box">
            <h3>✓ Importação concluída com sucesso!</h3>
            <p>Suas transações foram importadas e estão disponíveis na página de Transações.</p>
          </div>
        )}

        <div className="import-actions">
          <button
            onClick={handleImport}
            disabled={!file || !selectedAccount || loading}
            className="btn-import"
          >
            {loading ? 'Importando...' : 'Importar Transações'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Importacao;

