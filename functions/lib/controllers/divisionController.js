"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDivisionRules = getDivisionRules;
exports.createDivisionRule = createDivisionRule;
exports.updateDivisionRule = updateDivisionRule;
exports.deleteDivisionRule = deleteDivisionRule;
exports.calculateDivision = calculateDivision;
const database_1 = __importDefault(require("../config/database"));
async function getDivisionRules(req, res) {
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`SELECT * FROM rules_division 
       WHERE casal_id = $1 
       ORDER BY criado_em DESC`, [userId]);
        res.json({
            rules: result.rows,
            total: result.rows.length,
        });
    }
    catch (error) {
        console.error('Erro ao buscar regras de divisão:', error);
        res.status(500).json({ error: 'Erro ao buscar regras de divisão' });
    }
}
async function createDivisionRule(req, res) {
    const { tipo, parametros, categoria } = req.body;
    const userId = req.user?.userId;
    try {
        // Verificar se é casal
        const userResult = await database_1.default.query(`SELECT tipo FROM users WHERE id = $1`, [userId]);
        if (userResult.rows[0]?.tipo !== 'casal') {
            return res.status(400).json({ error: 'Regras de divisão são apenas para casais' });
        }
        const result = await database_1.default.query(`INSERT INTO rules_division (casal_id, tipo, parametros, categoria, ativa)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`, [userId, tipo, JSON.stringify(parametros), categoria || null]);
        res.status(201).json({
            message: 'Regra de divisão criada com sucesso',
            rule: result.rows[0],
        });
    }
    catch (error) {
        console.error('Erro ao criar regra de divisão:', error);
        res.status(500).json({ error: 'Erro ao criar regra de divisão' });
    }
}
async function updateDivisionRule(req, res) {
    const { id } = req.params;
    const { tipo, parametros, categoria, ativa } = req.body;
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`UPDATE rules_division 
       SET tipo = COALESCE($1, tipo),
           parametros = COALESCE($2::jsonb, parametros),
           categoria = COALESCE($3, categoria),
           ativa = COALESCE($4, ativa),
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $5 AND casal_id = $6
       RETURNING *`, [tipo, parametros ? JSON.stringify(parametros) : null, categoria, ativa, id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Regra não encontrada' });
        }
        res.json({
            message: 'Regra atualizada com sucesso',
            rule: result.rows[0],
        });
    }
    catch (error) {
        console.error('Erro ao atualizar regra de divisão:', error);
        res.status(500).json({ error: 'Erro ao atualizar regra de divisão' });
    }
}
async function deleteDivisionRule(req, res) {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        await database_1.default.query(`DELETE FROM rules_division WHERE id = $1 AND casal_id = $2`, [id, userId]);
        res.json({ message: 'Regra deletada com sucesso' });
    }
    catch (error) {
        console.error('Erro ao deletar regra de divisão:', error);
        res.status(500).json({ error: 'Erro ao deletar regra de divisão' });
    }
}
async function calculateDivision(req, res) {
    const { valor, categoria } = req.body;
    const userId = req.user?.userId;
    try {
        // Buscar regra ativa
        let query = `
      SELECT tipo, parametros FROM rules_division 
      WHERE casal_id = $1 AND ativa = true
    `;
        const params = [userId];
        if (categoria) {
            query += ` AND (categoria IS NULL OR categoria = $2)`;
            params.push(categoria);
        }
        query += ` ORDER BY categoria NULLS LAST LIMIT 1`;
        const ruleResult = await database_1.default.query(query, params);
        if (ruleResult.rows.length === 0) {
            // Default: divisão igual
            return res.json({
                usuarioA: valor / 2,
                usuarioB: valor / 2,
                total: valor,
                tipo: 'equal',
            });
        }
        const rule = ruleResult.rows[0];
        const parametros = typeof rule.parametros === 'string'
            ? JSON.parse(rule.parametros)
            : rule.parametros;
        let divisao;
        switch (rule.tipo) {
            case 'equal':
                divisao = {
                    usuarioA: valor / 2,
                    usuarioB: valor / 2,
                    total: valor,
                };
                break;
            case 'percentual':
                const percentA = (parametros.percentual_a || 0) / 100;
                const percentB = (parametros.percentual_b || 0) / 100;
                divisao = {
                    usuarioA: valor * percentA,
                    usuarioB: valor * percentB,
                    total: valor,
                };
                break;
            case 'proporcional':
                // Buscar rendas dos usuários do casal
                const rendaResult = await database_1.default.query(`SELECT p.renda_mensal FROM profiles p
           JOIN users u ON p.user_id = u.id
           WHERE u.id = $1`, [userId]);
                // Por enquanto, retorna divisão igual (será melhorado)
                divisao = {
                    usuarioA: valor / 2,
                    usuarioB: valor / 2,
                    total: valor,
                };
                break;
            case 'fixo':
                const valorFixo = parametros.valor_fixo || 0;
                divisao = {
                    usuarioA: valorFixo,
                    usuarioB: valor - valorFixo,
                    total: valor,
                };
                break;
            default:
                divisao = {
                    usuarioA: valor / 2,
                    usuarioB: valor / 2,
                    total: valor,
                };
        }
        res.json({
            ...divisao,
            tipo: rule.tipo,
        });
    }
    catch (error) {
        console.error('Erro ao calcular divisão:', error);
        res.status(500).json({ error: 'Erro ao calcular divisão' });
    }
}
//# sourceMappingURL=divisionController.js.map