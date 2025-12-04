"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = createTransaction;
exports.getTransactions = getTransactions;
exports.getTransactionById = getTransactionById;
exports.deleteTransaction = deleteTransaction;
const database_1 = __importDefault(require("../config/database"));
const aiService_1 = require("../services/aiService");
async function createTransaction(req, res) {
    const { account_id, tipo, categoria, subcategoria, valor, data, recorrente, frequencia, nota, metodo_pagamento, conta_origem, descricao } = req.body;
    const userId = req.user?.userId;
    try {
        // Se não tiver categoria, classificar automaticamente
        const categoriaFinal = categoria || (descricao ? (0, aiService_1.classificarTransacao)(descricao) : 'Outros');
        // Criar transação
        const result = await database_1.default.query(`INSERT INTO transactions 
       (account_id, user_id, tipo, categoria, subcategoria, valor, data, recorrente, frequencia, nota, metodo_pagamento, conta_origem)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`, [account_id, userId, tipo, categoriaFinal, subcategoria, valor, data, recorrente || false, frequencia, nota, metodo_pagamento, conta_origem]);
        const transaction = result.rows[0];
        // Atualizar saldo da conta
        const saldoUpdate = tipo === 'receita' ? valor : -valor;
        await database_1.default.query(`UPDATE accounts SET saldo = saldo + $1 WHERE id = $2`, [saldoUpdate, account_id]);
        // Se for conta conjunta e casal, aplicar divisão
        if (conta_origem === 'conjunta') {
            // Buscar regra de divisão
            const ruleResult = await database_1.default.query(`SELECT tipo, parametros FROM rules_division 
         WHERE casal_id = $1 AND ativa = true 
         ORDER BY criado_em DESC LIMIT 1`, [userId]);
            if (ruleResult.rows.length > 0) {
                const rule = ruleResult.rows[0];
                // Aqui seria aplicada a lógica de divisão (será implementada depois)
                // Por enquanto, apenas registramos a transação
            }
        }
        res.status(201).json({
            message: 'Transação criada com sucesso',
            transaction,
        });
    }
    catch (error) {
        console.error('Erro ao criar transação:', error);
        res.status(500).json({ error: 'Erro ao criar transação' });
    }
}
async function getTransactions(req, res) {
    const userId = req.user?.userId;
    const { account_id, tipo, categoria, data_inicio, data_fim, limit = 50, offset = 0 } = req.query;
    try {
        let query = `
      SELECT t.*, a.nome as conta_nome, a.tipo as conta_tipo
      FROM transactions t
      JOIN accounts a ON t.account_id = a.id
      WHERE t.user_id = $1
    `;
        const params = [userId];
        let paramIndex = 2;
        if (account_id) {
            query += ` AND t.account_id = $${paramIndex}`;
            params.push(account_id);
            paramIndex++;
        }
        if (tipo) {
            query += ` AND t.tipo = $${paramIndex}`;
            params.push(tipo);
            paramIndex++;
        }
        if (categoria) {
            query += ` AND t.categoria = $${paramIndex}`;
            params.push(categoria);
            paramIndex++;
        }
        if (data_inicio) {
            query += ` AND t.data >= $${paramIndex}`;
            params.push(data_inicio);
            paramIndex++;
        }
        if (data_fim) {
            query += ` AND t.data <= $${paramIndex}`;
            params.push(data_fim);
            paramIndex++;
        }
        query += ` ORDER BY t.data DESC, t.criado_em DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);
        const result = await database_1.default.query(query, params);
        res.json({
            transactions: result.rows,
            total: result.rows.length,
        });
    }
    catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({ error: 'Erro ao buscar transações' });
    }
}
async function getTransactionById(req, res) {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`SELECT t.*, a.nome as conta_nome 
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE t.id = $1 AND t.user_id = $2`, [id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Erro ao buscar transação:', error);
        res.status(500).json({ error: 'Erro ao buscar transação' });
    }
}
async function deleteTransaction(req, res) {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        // Buscar transação para reverter saldo
        const transactionResult = await database_1.default.query(`SELECT tipo, valor, account_id FROM transactions WHERE id = $1 AND user_id = $2`, [id, userId]);
        if (transactionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        const transaction = transactionResult.rows[0];
        // Reverter saldo
        const saldoUpdate = transaction.tipo === 'receita' ? -transaction.valor : transaction.valor;
        await database_1.default.query(`UPDATE accounts SET saldo = saldo + $1 WHERE id = $2`, [saldoUpdate, transaction.account_id]);
        // Deletar transação
        await database_1.default.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [id, userId]);
        res.json({ message: 'Transação deletada com sucesso' });
    }
    catch (error) {
        console.error('Erro ao deletar transação:', error);
        res.status(500).json({ error: 'Erro ao deletar transação' });
    }
}
//# sourceMappingURL=transactionController.js.map