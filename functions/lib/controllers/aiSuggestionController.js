"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSuggestions = generateSuggestions;
exports.getSuggestions = getSuggestions;
exports.acceptSuggestion = acceptSuggestion;
exports.rejectSuggestion = rejectSuggestion;
const database_1 = __importDefault(require("../config/database"));
const aiService_1 = require("../services/aiService");
async function generateSuggestions(req, res) {
    const userId = req.user?.userId;
    try {
        const suggestions = [];
        // Buscar transações do último mês
        const hoje = new Date();
        const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
        const transactionsResult = await database_1.default.query(`SELECT * FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE a.user_id = $1 AND t.data >= $2
       ORDER BY t.data DESC`, [userId, mesPassado.toISOString().split('T')[0]]);
        const transactions = transactionsResult.rows;
        // Analisar gastos por categoria
        const categorySpending = new Map();
        transactions.forEach((t) => {
            if (t.tipo === 'despesa') {
                const current = categorySpending.get(t.categoria) || 0;
                categorySpending.set(t.categoria, current + parseFloat(t.valor));
            }
        });
        // Sugestão 1: Economia por categoria
        if (categorySpending.size > 0) {
            const topCategory = Array.from(categorySpending.entries())
                .sort((a, b) => b[1] - a[1])[0];
            if (topCategory[1] > 200) {
                const suggestion = (0, aiService_1.gerarMensagemIA)(aiService_1.aiMessageTemplates[0], {
                    valor: topCategory[1],
                    categoria: topCategory[0],
                    percentual: Math.round((topCategory[1] / Array.from(categorySpending.values()).reduce((a, b) => a + b, 0)) * 100),
                    valorSugerido: topCategory[1] * 0.7,
                });
                suggestions.push({
                    tipo: 'economia',
                    texto: suggestion,
                    acao_sugerida: {
                        categoria: topCategory[0],
                        valor_atual: topCategory[1],
                        valor_sugerido: topCategory[1] * 0.7,
                    },
                });
            }
        }
        // Sugestão 2: Metas
        const goalsResult = await database_1.default.query(`SELECT * FROM goals WHERE user_id = $1 AND status = 'ativa'`, [userId]);
        goalsResult.rows.forEach((goal) => {
            const valorRestante = goal.valor_objetivo - (goal.valor_atual || 0);
            if (valorRestante > 0) {
                const mesesRestantes = goal.prazo
                    ? Math.ceil((new Date(goal.prazo).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24 * 30))
                    : 12;
                if (mesesRestantes > 0) {
                    const valorAporte = valorRestante / mesesRestantes;
                    const suggestion = (0, aiService_1.gerarMensagemIA)(aiService_1.aiMessageTemplates[1], {
                        valorRestante,
                        tituloMeta: goal.titulo,
                        valorAporte: Math.ceil(valorAporte),
                        meses: mesesRestantes,
                    });
                    suggestions.push({
                        tipo: 'meta',
                        texto: suggestion,
                        acao_sugerida: {
                            goal_id: goal.id,
                            valor_aporte_sugerido: Math.ceil(valorAporte),
                        },
                    });
                }
            }
        });
        // Sugestão 3: Comparação mensal
        const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
        const doisMesesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1);
        const gastosMesAtual = transactions
            .filter((t) => new Date(t.data) >= mesAtual && t.tipo === 'despesa')
            .reduce((sum, t) => sum + parseFloat(t.valor), 0);
        const gastosMesAnterior = transactions
            .filter((t) => {
            const date = new Date(t.data);
            return date >= mesAnterior && date < mesAtual && t.tipo === 'despesa';
        })
            .reduce((sum, t) => sum + parseFloat(t.valor), 0);
        if (gastosMesAnterior > 0) {
            const variacao = ((gastosMesAtual - gastosMesAnterior) / gastosMesAnterior) * 100;
            if (Math.abs(variacao) > 10) {
                const categoriaMaisGasta = Array.from(categorySpending.entries())
                    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'geral';
                const suggestion = (0, aiService_1.gerarMensagemIA)(aiService_1.aiMessageTemplates[4], {
                    categoria: categoriaMaisGasta,
                    percentual: Math.abs(Math.round(variacao)),
                });
                suggestions.push({
                    tipo: 'alerta',
                    texto: suggestion,
                    acao_sugerida: {
                        variacao_percentual: variacao,
                        categoria: categoriaMaisGasta,
                    },
                });
            }
        }
        // Salvar sugestões no banco
        for (const suggestion of suggestions) {
            await database_1.default.query(`INSERT INTO ai_suggestions (user_id, tipo, texto, acao_sugerida, status)
         VALUES ($1, $2, $3, $4, 'pendente')`, [userId, suggestion.tipo, suggestion.texto, JSON.stringify(suggestion.acao_sugerida)]);
        }
        res.json({
            message: 'Sugestões geradas com sucesso',
            suggestions,
            total: suggestions.length,
        });
    }
    catch (error) {
        console.error('Erro ao gerar sugestões:', error);
        res.status(500).json({ error: 'Erro ao gerar sugestões' });
    }
}
async function getSuggestions(req, res) {
    const userId = req.user?.userId;
    const { tipo, status, limit = 20 } = req.query;
    try {
        let query = `
      SELECT * FROM ai_suggestions 
      WHERE user_id = $1
    `;
        const params = [userId];
        if (tipo) {
            query += ` AND tipo = $${params.length + 1}`;
            params.push(tipo);
        }
        if (status) {
            query += ` AND status = $${params.length + 1}`;
            params.push(status);
        }
        query += ` ORDER BY data DESC LIMIT $${params.length + 1}`;
        params.push(limit);
        const result = await database_1.default.query(query, params);
        res.json({
            suggestions: result.rows,
            total: result.rows.length,
        });
    }
    catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        res.status(500).json({ error: 'Erro ao buscar sugestões' });
    }
}
async function acceptSuggestion(req, res) {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        // Buscar sugestão
        const suggestionResult = await database_1.default.query(`SELECT * FROM ai_suggestions WHERE id = $1 AND user_id = $2`, [id, userId]);
        if (suggestionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Sugestão não encontrada' });
        }
        const suggestion = suggestionResult.rows[0];
        const acaoSugerida = typeof suggestion.acao_sugerida === 'string'
            ? JSON.parse(suggestion.acao_sugerida)
            : suggestion.acao_sugerida;
        // Executar ação baseada no tipo
        if (suggestion.tipo === 'meta' && acaoSugerida.goal_id) {
            // Atualizar meta com valor sugerido
            await database_1.default.query(`UPDATE goals 
         SET valor_atual = valor_atual + $1 
         WHERE id = $2 AND user_id = $3`, [acaoSugerida.valor_aporte_sugerido || 0, acaoSugerida.goal_id, userId]);
        }
        // Marcar sugestão como aceita
        await database_1.default.query(`UPDATE ai_suggestions 
       SET status = 'aceita', visualizada = true 
       WHERE id = $1`, [id]);
        res.json({ message: 'Sugestão aceita e ação executada' });
    }
    catch (error) {
        console.error('Erro ao aceitar sugestão:', error);
        res.status(500).json({ error: 'Erro ao aceitar sugestão' });
    }
}
async function rejectSuggestion(req, res) {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        await database_1.default.query(`UPDATE ai_suggestions 
       SET status = 'rejeitada', visualizada = true 
       WHERE id = $1 AND user_id = $2`, [id, userId]);
        res.json({ message: 'Sugestão rejeitada' });
    }
    catch (error) {
        console.error('Erro ao rejeitar sugestão:', error);
        res.status(500).json({ error: 'Erro ao rejeitar sugestão' });
    }
}
//# sourceMappingURL=aiSuggestionController.js.map