/**
 * Serviço de IA para sugestões e mensagens personalizadas
 */

export interface AIMessageTemplate {
  tipo: 'economia' | 'investimento' | 'meta' | 'divisao' | 'alerta' | 'resumo';
  texto: string;
  variaveis?: string[];
}

/**
 * Templates de mensagens da IA em português correto
 */
export const aiMessageTemplates: AIMessageTemplate[] = [
  {
    tipo: 'economia',
    texto: 'Você gastou R${valor} em {categoria} este mês — isso corresponde a {percentual}% do seu orçamento. Sugiro reduzir para R${valorSugerido}.',
    variaveis: ['valor', 'categoria', 'percentual', 'valorSugerido'],
  },
  {
    tipo: 'meta',
    texto: 'Faltam R${valorRestante} para atingir a meta "{tituloMeta}". Aumentando o aporte mensal em R${valorAporte}, você alcança em {meses} meses.',
    variaveis: ['valorRestante', 'tituloMeta', 'valorAporte', 'meses'],
  },
  {
    tipo: 'investimento',
    texto: 'Deseja que eu agende transferência automática de R${valor} para a poupança todo dia {dia}?',
    variaveis: ['valor', 'dia'],
  },
  {
    tipo: 'economia',
    texto: 'Reparei {quantidade} despesas recorrentes que você não usa mais. Quer que eu proponha cortes?',
    variaveis: ['quantidade'],
  },
  {
    tipo: 'alerta',
    texto: 'Comparando os últimos 3 meses, seus gastos com {categoria} aumentaram {percentual}%. Posso sugerir um plano de compras.',
    variaveis: ['categoria', 'percentual'],
  },
  {
    tipo: 'divisao',
    texto: 'Hoje seu saldo conjunto é R${saldoConjunto}. Vocês têm despesas previstas de R${despesasPrevistas} esta semana.',
    variaveis: ['saldoConjunto', 'despesasPrevistas'],
  },
  {
    tipo: 'investimento',
    texto: 'Sugiro o investimento simulado: aplicar R${valor} por {meses} meses em {tipoInvestimento} — retorno estimado R${retornoEstimado} (simulação).',
    variaveis: ['valor', 'meses', 'tipoInvestimento', 'retornoEstimado'],
  },
  {
    tipo: 'alerta',
    texto: 'Seu orçamento para {categoria} foi ultrapassado em {percentual}% este mês. Sugiro reduzir {acaoSugerida}.',
    variaveis: ['categoria', 'percentual', 'acaoSugerida'],
  },
  {
    tipo: 'divisao',
    texto: 'Deseja dividir a assinatura do {servico} entre vocês? Posso calcular a parte de cada um.',
    variaveis: ['servico'],
  },
  {
    tipo: 'resumo',
    texto: 'Resumo semanal: saldo inicial R${saldoInicial} — receitas R${receitas} — despesas R${despesas} — saldo final R${saldoFinal}. Quer ações para melhorar o saldo?',
    variaveis: ['saldoInicial', 'receitas', 'despesas', 'saldoFinal'],
  },
];

/**
 * Gera uma mensagem personalizada substituindo variáveis
 */
export function gerarMensagemIA(
  template: AIMessageTemplate,
  variaveis: Record<string, string | number>
): string {
  let mensagem = template.texto;

  if (template.variaveis) {
    template.variaveis.forEach(variavel => {
      const valor = variaveis[variavel];
      if (valor !== undefined) {
        // Formata valores monetários
        if (typeof valor === 'number' && variavel.includes('valor') || variavel.includes('saldo') || variavel.includes('receitas') || variavel.includes('despesas')) {
          mensagem = mensagem.replace(
            `\${${variavel}}`,
            valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          );
        } else {
          mensagem = mensagem.replace(`\${${variavel}}`, String(valor));
        }
        mensagem = mensagem.replace(`{${variavel}}`, String(valor));
      }
    });
  }

  return mensagem;
}

/**
 * Exemplos de uso dos templates
 */
export const exemplosMensagensIA = {
  economia: gerarMensagemIA(aiMessageTemplates[0], {
    valor: 350,
    categoria: 'delivery',
    percentual: 15,
    valorSugerido: 150,
  }),

  meta: gerarMensagemIA(aiMessageTemplates[1], {
    valorRestante: 5000,
    tituloMeta: 'Viagem',
    valorAporte: 200,
    meses: 25,
  }),

  divisao: gerarMensagemIA(aiMessageTemplates[5], {
    saldoConjunto: 2500,
    despesasPrevistas: 800,
  }),
};

/**
 * Classifica automaticamente uma transação por categoria
 */
export function classificarTransacao(descricao: string): string {
  const descricaoLower = descricao.toLowerCase();

  // Regras simples de classificação (será melhorado com ML)
  if (descricaoLower.includes('uber') || descricaoLower.includes('taxi') || descricaoLower.includes('99')) {
    return 'Transporte';
  }
  if (descricaoLower.includes('ifood') || descricaoLower.includes('rappi') || descricaoLower.includes('restaurante')) {
    return 'Alimentação';
  }
  if (descricaoLower.includes('supermercado') || descricaoLower.includes('carrefour') || descricaoLower.includes('extra')) {
    return 'Alimentação';
  }
  if (descricaoLower.includes('netflix') || descricaoLower.includes('spotify') || descricaoLower.includes('streaming')) {
    return 'Lazer';
  }
  if (descricaoLower.includes('farmacia') || descricaoLower.includes('drogaria') || descricaoLower.includes('medico')) {
    return 'Saúde';
  }

  return 'Outros';
}

