"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoals = getGoals;
exports.createGoal = createGoal;
exports.updateGoal = updateGoal;
exports.deleteGoal = deleteGoal;
const database_1 = __importDefault(require("../config/database"));
async function getGoals(req, res) {
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`SELECT * FROM goals 
       WHERE user_id = $1 AND status = 'ativa'
       ORDER BY prioridade DESC, criado_em DESC`, [userId]);
        res.json({
            goals: result.rows,
            total: result.rows.length,
        });
    }
    catch (error) {
        console.error('Erro ao buscar metas:', error);
        res.status(500).json({ error: 'Erro ao buscar metas' });
    }
}
async function createGoal(req, res) {
    const { titulo, valor_objetivo, prazo, prioridade } = req.body;
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`INSERT INTO goals (user_id, titulo, valor_objetivo, valor_atual, prazo, prioridade)
       VALUES ($1, $2, $3, 0, $4, $5)
       RETURNING *`, [userId, titulo, valor_objetivo, prazo || null, prioridade || 'media']);
        res.status(201).json({
            message: 'Meta criada com sucesso',
            goal: result.rows[0],
        });
    }
    catch (error) {
        console.error('Erro ao criar meta:', error);
        res.status(500).json({ error: 'Erro ao criar meta' });
    }
}
async function updateGoal(req, res) {
    const { id } = req.params;
    const { titulo, valor_objetivo, valor_atual, prazo, prioridade, status } = req.body;
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`UPDATE goals 
       SET titulo = COALESCE($1, titulo),
           valor_objetivo = COALESCE($2, valor_objetivo),
           valor_atual = COALESCE($3, valor_atual),
           prazo = COALESCE($4, prazo),
           prioridade = COALESCE($5, prioridade),
           status = COALESCE($6, status),
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING *`, [titulo, valor_objetivo, valor_atual, prazo, prioridade, status, id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Meta não encontrada' });
        }
        res.json({
            message: 'Meta atualizada com sucesso',
            goal: result.rows[0],
        });
    }
    catch (error) {
        console.error('Erro ao atualizar meta:', error);
        res.status(500).json({ error: 'Erro ao atualizar meta' });
    }
}
async function deleteGoal(req, res) {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        await database_1.default.query(`UPDATE goals SET status = 'cancelada' WHERE id = $1 AND user_id = $2`, [id, userId]);
        res.json({ message: 'Meta cancelada com sucesso' });
    }
    catch (error) {
        console.error('Erro ao deletar meta:', error);
        res.status(500).json({ error: 'Erro ao deletar meta' });
    }
}
//# sourceMappingURL=goalController.js.map