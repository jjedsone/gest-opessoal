"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccounts = getAccounts;
exports.createAccount = createAccount;
exports.getAccountBalance = getAccountBalance;
const database_1 = __importDefault(require("../config/database"));
async function getAccounts(req, res) {
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`SELECT * FROM accounts WHERE user_id = $1 ORDER BY criado_em DESC`, [userId]);
        res.json({
            accounts: result.rows,
            total: result.rows.length,
        });
    }
    catch (error) {
        console.error('Erro ao buscar contas:', error);
        res.status(500).json({ error: 'Erro ao buscar contas' });
    }
}
async function createAccount(req, res) {
    const { nome, tipo } = req.body;
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`INSERT INTO accounts (user_id, nome, tipo, saldo)
       VALUES ($1, $2, $3, 0)
       RETURNING *`, [userId, nome, tipo || 'corrente']);
        res.status(201).json({
            message: 'Conta criada com sucesso',
            account: result.rows[0],
        });
    }
    catch (error) {
        console.error('Erro ao criar conta:', error);
        res.status(500).json({ error: 'Erro ao criar conta' });
    }
}
async function getAccountBalance(req, res) {
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`SELECT 
         SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) as total_receitas,
         SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) as total_despesas,
         SUM(CASE WHEN tipo = 'receita' THEN valor ELSE -valor END) as saldo_total
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE a.user_id = $1`, [userId]);
        const accountsResult = await database_1.default.query(`SELECT id, nome, tipo, saldo FROM accounts WHERE user_id = $1`, [userId]);
        res.json({
            saldoTotal: parseFloat(result.rows[0].saldo_total || 0),
            totalReceitas: parseFloat(result.rows[0].total_receitas || 0),
            totalDespesas: parseFloat(result.rows[0].total_despesas || 0),
            contas: accountsResult.rows,
        });
    }
    catch (error) {
        console.error('Erro ao buscar saldo:', error);
        res.status(500).json({ error: 'Erro ao buscar saldo' });
    }
}
//# sourceMappingURL=accountController.js.map