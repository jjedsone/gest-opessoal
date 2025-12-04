import { Request, Response } from 'express';
import pool from '../config/database';

export async function getNotifications(req: Request, res: Response) {
  const userId = req.user?.userId;
  const { visualizada, limit = 50 } = req.query;

  try {
    let query = `
      SELECT * FROM ai_suggestions 
      WHERE user_id = $1
    `;
    const params: any[] = [userId];

    if (visualizada !== undefined) {
      query += ` AND visualizada = $2`;
      params.push(visualizada === 'true');
    }

    query += ` ORDER BY data DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);

    res.json({
      notifications: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
}

export async function markAsRead(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    await pool.query(
      `UPDATE ai_suggestions SET visualizada = true WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    res.json({ message: 'Notificação marcada como lida' });
  } catch (error) {
    console.error('Erro ao marcar notificação:', error);
    res.status(500).json({ error: 'Erro ao marcar notificação' });
  }
}

export async function markAllAsRead(req: Request, res: Response) {
  const userId = req.user?.userId;

  try {
    await pool.query(
      `UPDATE ai_suggestions SET visualizada = true WHERE user_id = $1 AND visualizada = false`,
      [userId]
    );

    res.json({ message: 'Todas as notificações marcadas como lidas' });
  } catch (error) {
    console.error('Erro ao marcar notificações:', error);
    res.status(500).json({ error: 'Erro ao marcar notificações' });
  }
}

export async function deleteNotification(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    await pool.query(
      `DELETE FROM ai_suggestions WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    res.json({ message: 'Notificação deletada' });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    res.status(500).json({ error: 'Erro ao deletar notificação' });
  }
}

export async function getUnreadCount(req: Request, res: Response) {
  const userId = req.user?.userId;

  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM ai_suggestions 
       WHERE user_id = $1 AND visualizada = false`,
      [userId]
    );

    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Erro ao contar notificações:', error);
    res.status(500).json({ error: 'Erro ao contar notificações' });
  }
}

