import { Request, Response } from 'express';
import pool from '../config/database';

export async function getAccounts(req: Request, res: Response) {
  const userId = req.user?.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM accounts WHERE user_id = $1 ORDER BY criado_em DESC`,
      [userId]
    );

    res.json({
      accounts: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    res.status(500).json({ error: 'Erro ao buscar contas' });
  }
}

export async function createAccount(req: Request, res: Response) {
  const { nome, tipo } = req.body;
  const userId = req.user?.userId;

  try {
    const result = await pool.query(
      `INSERT INTO accounts (user_id, nome, tipo, saldo)
       VALUES ($1, $2, $3, 0)
       RETURNING *`,
      [userId, nome, tipo || 'corrente']
    );

    res.status(201).json({
      message: 'Conta criada com sucesso',
      account: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
}

export async function getAccountBalance(req: Request, res: Response) {
  const userId = req.user?.userId;

  try {
    const result = await pool.query(
      `SELECT 
         SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) as total_receitas,
         SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) as total_despesas,
         SUM(CASE WHEN tipo = 'receita' THEN valor ELSE -valor END) as saldo_total
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE a.user_id = $1`,
      [userId]
    );

    const accountsResult = await pool.query(
      `SELECT id, nome, tipo, saldo FROM accounts WHERE user_id = $1`,
      [userId]
    );

    res.json({
      saldoTotal: parseFloat(result.rows[0].saldo_total || 0),
      totalReceitas: parseFloat(result.rows[0].total_receitas || 0),
      totalDespesas: parseFloat(result.rows[0].total_despesas || 0),
      contas: accountsResult.rows,
    });
  } catch (error) {
    console.error('Erro ao buscar saldo:', error);
    res.status(500).json({ error: 'Erro ao buscar saldo' });
  }
}

