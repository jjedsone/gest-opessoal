"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = getNotifications;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
exports.deleteNotification = deleteNotification;
exports.getUnreadCount = getUnreadCount;
const database_1 = __importDefault(require("../config/database"));
async function getNotifications(req, res) {
    const userId = req.user?.userId;
    const { visualizada, limit = 50 } = req.query;
    try {
        let query = `
      SELECT * FROM ai_suggestions 
      WHERE user_id = $1
    `;
        const params = [userId];
        if (visualizada !== undefined) {
            query += ` AND visualizada = $2`;
            params.push(visualizada === 'true');
        }
        query += ` ORDER BY data DESC LIMIT $${params.length + 1}`;
        params.push(limit);
        const result = await database_1.default.query(query, params);
        res.json({
            notifications: result.rows,
            total: result.rows.length,
        });
    }
    catch (error) {
        console.error('Erro ao buscar notificações:', error);
        res.status(500).json({ error: 'Erro ao buscar notificações' });
    }
}
async function markAsRead(req, res) {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        await database_1.default.query(`UPDATE ai_suggestions SET visualizada = true WHERE id = $1 AND user_id = $2`, [id, userId]);
        res.json({ message: 'Notificação marcada como lida' });
    }
    catch (error) {
        console.error('Erro ao marcar notificação:', error);
        res.status(500).json({ error: 'Erro ao marcar notificação' });
    }
}
async function markAllAsRead(req, res) {
    const userId = req.user?.userId;
    try {
        await database_1.default.query(`UPDATE ai_suggestions SET visualizada = true WHERE user_id = $1 AND visualizada = false`, [userId]);
        res.json({ message: 'Todas as notificações marcadas como lidas' });
    }
    catch (error) {
        console.error('Erro ao marcar notificações:', error);
        res.status(500).json({ error: 'Erro ao marcar notificações' });
    }
}
async function deleteNotification(req, res) {
    const { id } = req.params;
    const userId = req.user?.userId;
    try {
        await database_1.default.query(`DELETE FROM ai_suggestions WHERE id = $1 AND user_id = $2`, [id, userId]);
        res.json({ message: 'Notificação deletada' });
    }
    catch (error) {
        console.error('Erro ao deletar notificação:', error);
        res.status(500).json({ error: 'Erro ao deletar notificação' });
    }
}
async function getUnreadCount(req, res) {
    const userId = req.user?.userId;
    try {
        const result = await database_1.default.query(`SELECT COUNT(*) as count FROM ai_suggestions 
       WHERE user_id = $1 AND visualizada = false`, [userId]);
        res.json({ count: parseInt(result.rows[0].count) });
    }
    catch (error) {
        console.error('Erro ao contar notificações:', error);
        res.status(500).json({ error: 'Erro ao contar notificações' });
    }
}
//# sourceMappingURL=notificationController.js.map