import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Ajuda.css';

function Ajuda() {
  const navigate = useNavigate();

  if (!authService.isAuthenticated()) {
    navigate('/login');
    return null;
  }

  return (
    <div className="ajuda-container">
      <header className="ajuda-header">
        <div className="header-left">
          <h1>Central de Ajuda</h1>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          Voltar
        </button>
      </header>

      <main className="ajuda-main">
        <section className="help-section">
          <h2>📚 Guia Rápido</h2>
          <div className="help-content">
            <h3>Primeiros Passos</h3>
            <ol>
              <li>Complete seu cadastro no onboarding</li>
              <li>Adicione suas contas bancárias</li>
              <li>Registre suas primeiras transações</li>
              <li>Configure suas metas de poupança</li>
              <li>Explore as sugestões da IA</li>
            </ol>
          </div>
        </section>

        <section className="help-section">
          <h2>💰 Registrando Transações</h2>
          <div className="help-content">
            <h3>Como registrar uma transação:</h3>
            <ol>
              <li>Acesse a página de Transações</li>
              <li>Clique em "Nova Transação"</li>
              <li>Preencha os campos:
                <ul>
                  <li><strong>Tipo:</strong> Receita ou Despesa</li>
                  <li><strong>Conta:</strong> Selecione a conta bancária</li>
                  <li><strong>Valor:</strong> Valor da transação</li>
                  <li><strong>Categoria:</strong> Categoria da transação</li>
                  <li><strong>Data:</strong> Data da transação</li>
                </ul>
              </li>
              <li>Clique em "Registrar Transação"</li>
            </ol>

            <h3>Para Casais:</h3>
            <p>
              Se você está em um relacionamento, pode escolher entre conta "Individual" ou "Conjunta".
              Para contas conjuntas, o sistema aplicará automaticamente a regra de divisão configurada.
            </p>
          </div>
        </section>

        <section className="help-section">
          <h2>🎯 Metas de Poupança</h2>
          <div className="help-content">
            <h3>Criando uma Meta:</h3>
            <ol>
              <li>Acesse a página de Metas</li>
              <li>Clique em "Nova Meta"</li>
              <li>Preencha:
                <ul>
                  <li><strong>Título:</strong> Nome da meta (ex: "Viagem para Europa")</li>
                  <li><strong>Valor Objetivo:</strong> Quanto você quer juntar</li>
                  <li><strong>Valor Atual:</strong> Quanto já tem guardado</li>
                  <li><strong>Prazo:</strong> Data limite para atingir a meta</li>
                  <li><strong>Prioridade:</strong> Alta, Média ou Baixa</li>
                </ul>
              </li>
            </ol>

            <h3>Acompanhando o Progresso:</h3>
            <p>
              A barra de progresso mostra visualmente quanto falta para atingir sua meta.
              Use os botões de ação rápida (+R$ 100, +R$ 500) para atualizar rapidamente.
            </p>
          </div>
        </section>

        <section className="help-section">
          <h2>📊 Relatórios</h2>
          <div className="help-content">
            <h3>O que você encontra nos relatórios:</h3>
            <ul>
              <li><strong>Evolução Mensal:</strong> Gráfico de receitas, despesas e saldo dos últimos 12 meses</li>
              <li><strong>Resumo do Mês:</strong> Total de receitas, despesas e saldo do mês atual</li>
              <li><strong>Top Categorias:</strong> As 5 categorias com maior gasto</li>
              <li><strong>Transações Recentes:</strong> Lista das últimas transações</li>
            </ul>

            <h3>Exportando Dados:</h3>
            <p>
              Você pode exportar seus dados em CSV ou PDF através dos botões na página de Relatórios.
            </p>
          </div>
        </section>

        <section className="help-section">
          <h2>📥 Importação de Extratos</h2>
          <div className="help-content">
            <h3>Como importar um extrato CSV:</h3>
            <ol>
              <li>Acesse a página de Importação</li>
              <li>Baixe o exemplo de arquivo CSV para ver o formato</li>
              <li>Prepare seu arquivo com as colunas:
                <ul>
                  <li><code>data</code> - Data no formato YYYY-MM-DD</li>
                  <li><code>valor</code> - Valor (positivo para receita, negativo para despesa)</li>
                  <li><code>descricao</code> - Descrição da transação</li>
                  <li><code>categoria</code> - Categoria (opcional)</li>
                  <li><code>metodo_pagamento</code> - Método de pagamento (opcional)</li>
                </ul>
              </li>
              <li>Selecione o arquivo e a conta</li>
              <li>Revise a pré-visualização</li>
              <li>Clique em "Importar Transações"</li>
            </ol>
          </div>
        </section>

        <section className="help-section">
          <h2>🤖 Sugestões da IA</h2>
          <div className="help-content">
            <h3>Como funciona:</h3>
            <p>
              A IA analisa suas transações e gera sugestões personalizadas para:
            </p>
            <ul>
              <li>Reduzir gastos em categorias específicas</li>
              <li>Ajustar aportes para atingir suas metas</li>
              <li>Alertar sobre variações nos seus gastos</li>
            </ul>

            <h3>Gerando Sugestões:</h3>
            <p>
              As sugestões são geradas automaticamente uma vez por dia. Você também pode gerar
              novas sugestões manualmente na página de Sugestões da IA.
            </p>

            <h3>Aceitando Sugestões:</h3>
            <p>
              Ao aceitar uma sugestão, o sistema pode executar ações automáticas, como atualizar
              o valor de uma meta ou ajustar um orçamento.
            </p>
          </div>
        </section>

        <section className="help-section">
          <h2>👥 Configurações para Casais</h2>
          <div className="help-content">
            <h3>Regras de Divisão:</h3>
            <p>Você pode configurar como dividir despesas conjuntas:</p>
            <ul>
              <li><strong>Divisão Igual (50/50):</strong> Divide igualmente entre os dois</li>
              <li><strong>Divisão Percentual:</strong> Define percentuais fixos (ex: 60/40)</li>
              <li><strong>Proporcional à Renda:</strong> Divide baseado na renda de cada um</li>
              <li><strong>Valor Fixo:</strong> Um paga valor fixo, o outro paga o restante</li>
            </ul>

            <h3>Configurando:</h3>
            <ol>
              <li>Acesse Configurações</li>
              <li>Vá em "Regras de Divisão de Contas"</li>
              <li>Clique em "Nova Regra"</li>
              <li>Escolha o tipo e configure os parâmetros</li>
              <li>Opcionalmente, defina uma categoria específica</li>
            </ol>
          </div>
        </section>

        <section className="help-section">
          <h2>❓ Perguntas Frequentes</h2>
          <div className="help-content">
            <div className="faq-item">
              <h3>Como altero minha senha?</h3>
              <p>Esta funcionalidade estará disponível em breve. Por enquanto, entre em contato com o suporte.</p>
            </div>

            <div className="faq-item">
              <h3>Posso ter múltiplas contas?</h3>
              <p>Sim! Você pode adicionar quantas contas quiser (corrente, poupança, investimento, etc.)</p>
            </div>

            <div className="faq-item">
              <h3>Os dados são seguros?</h3>
              <p>Sim, todos os dados são criptografados e armazenados de forma segura. Suas senhas são protegidas com hash.</p>
            </div>

            <div className="faq-item">
              <h3>Posso usar no celular?</h3>
              <p>O sistema é responsivo e funciona em dispositivos móveis. Uma versão mobile nativa está planejada.</p>
            </div>

            <div className="faq-item">
              <h3>Como excluo minha conta?</h3>
              <p>Entre em contato com o suporte para solicitar a exclusão da conta.</p>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h2>📞 Suporte</h2>
          <div className="help-content">
            <p>
              Se você tiver dúvidas ou problemas, entre em contato:
            </p>
            <ul>
              <li><strong>E-mail:</strong> suporte@finunity.com</li>
              <li><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Ajuda;

