"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgets = getBudgets;
exports.createBudget = createBudget;
exports.updateBudget = updateBudget;
exports.deleteBudget = deleteBudget;
const database_1 = __importDefault(require("../config/database"));
async function getBudgets(req, res) {
    const userId = req.user?.userId;
    const { mes_ano } = req.query;
    try {
        let query = `
      SELECT * FROM budgets 
      WHERE user_id = $1
    `;
        const params = [userId];
        if (mes_ano) {
            query += ` AND mes_ano = $2`;
            params.push(mes_ano);
        }
        query += ` ORDER BY categoria`;
        const result = await database_1.default.query(query, params);
        res.json({
            budgets: result.rows,
            total: result.rows.length,
        });
    }
    catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
        res.status(500).json({ error: 'Erro ao buscar orçamentos' });
    }
}
async function createBudget(req, res) {
    const { categoria, limite_mensal, mes_ano } = req.body;
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`INSERT INTO budgets (user_id, categoria, limite_mensal, mes_ano)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [userId, categoria, limite_mensal, mes_ano || new Date().toISOString().slice(0, 7) + '-01']);
        res.status(201).json({
            message: 'Orçamento criado com sucesso',
            budget: result.rows[0],
        });
    }
    catch (error) {
        console.error('Erro ao criar orçamento:', error);
        res.status(500).json({ error: 'Erro ao criar orçamento' });
    }
}
async function updateBudget(req, res) {
    const { id } = req.params;
    const { limite_mensal } = req.body;
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`UPDATE budgets 
       SET limite_mensal = $1, atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`, [limite_mensal, id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Orçamento não encontrado' });
        }
        res.json({
            message: 'Orçamento atualizado com sucesso',
            budget: result.rows[0],
        });
    }
    catch (error) {
        console.error('Erro ao atualizar orçamento:', error);
        res.status(500).json({ error: 'Erro ao atualizar orçamento' });
    }
}
async function deleteBudget(req, res) {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        await database_1.default.query(`DELETE FROM budgets WHERE id = $1 AND user_id = $2`, [id, userId]);
        res.json({ message: 'Orçamento deletado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao deletar orçamento:', error);
        res.status(500).json({ error: 'Erro ao deletar orçamento' });
    }
}
//# sourceMappingURL=budgetController.js.map