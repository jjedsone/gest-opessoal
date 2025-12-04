import { Request, Response } from 'express';
import pool from '../config/database';
import { classificarTransacao } from '../services/aiService';

export async function createTransaction(req: Request, res: Response) {
  const { account_id, tipo, categoria, subcategoria, valor, data, recorrente, frequencia, nota, metodo_pagamento, conta_origem, descricao } = req.body;
  const userId = req.user?.userId;

  try {
    // Se não tiver categoria, classificar automaticamente
    const categoriaFinal = categoria || (descricao ? classificarTransacao(descricao) : 'Outros');

    // Criar transação
    const result = await pool.query(
      `INSERT INTO transactions 
       (account_id, user_id, tipo, categoria, subcategoria, valor, data, recorrente, frequencia, nota, metodo_pagamento, conta_origem)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [account_id, userId, tipo, categoriaFinal, subcategoria, valor, data, recorrente || false, frequencia, nota, metodo_pagamento, conta_origem]
    );

    const transaction = result.rows[0];

    // Atualizar saldo da conta
    const saldoUpdate = tipo === 'receita' ? valor : -valor;
    await pool.query(
      `UPDATE accounts SET saldo = saldo + $1 WHERE id = $2`,
      [saldoUpdate, account_id]
    );

    // Se for conta conjunta e casal, aplicar divisão
    if (conta_origem === 'conjunta') {
      // Buscar regra de divisão
      const ruleResult = await pool.query(
        `SELECT tipo, parametros FROM rules_division 
         WHERE casal_id = $1 AND ativa = true 
         ORDER BY criado_em DESC LIMIT 1`,
        [userId]
      );

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
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
}

export async function getTransactions(req: Request, res: Response) {
  const userId = req.user?.userId;
  const { account_id, tipo, categoria, data_inicio, data_fim, limit = 50, offset = 0 } = req.query;

  try {
    let query = `
      SELECT t.*, a.nome as conta_nome, a.tipo as conta_tipo
      FROM transactions t
      JOIN accounts a ON t.account_id = a.id
      WHERE t.user_id = $1
    `;
    const params: any[] = [userId];
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

    const result = await pool.query(query, params);

    res.json({
      transactions: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
}

export async function getTransactionById(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const result = await pool.query(
      `SELECT t.*, a.nome as conta_nome 
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ error: 'Erro ao buscar transação' });
  }
}

export async function deleteTransaction(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    // Buscar transação para reverter saldo
    const transactionResult = await pool.query(
      `SELECT tipo, valor, account_id FROM transactions WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    const transaction = transactionResult.rows[0];

    // Reverter saldo
    const saldoUpdate = transaction.tipo === 'receita' ? -transaction.valor : transaction.valor;
    await pool.query(
      `UPDATE accounts SET saldo = saldo + $1 WHERE id = $2`,
      [saldoUpdate, transaction.account_id]
    );

    // Deletar transação
    await pool.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [id, userId]);

    res.json({ message: 'Transação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
}

