import { Request, Response } from 'express';
import pool, { generateUUID } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export async function register(req: Request, res: Response) {
  const { nome, username, password, estadoCivil, rendaMensal, contaConjunta, metaPrincipal, permitirIA } = req.body;

  try {
    // Validar username
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ error: 'Username deve ter pelo menos 3 caracteres' });
    }

    // Verificar se usuário já existe
    const userExists = await pool.query('SELECT id FROM users WHERE username = ?', [username.trim()]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username já cadastrado' });
    }

    // Hash da senha
    const passwordHash = await hashPassword(password);

    // Gerar ID único
    const userId = generateUUID();

    // Criar usuário
    await pool.query(
      `INSERT INTO users (id, nome, username, password_hash, tipo) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, nome, username.trim(), passwordHash, estadoCivil === 'casado' ? 'casal' : 'solteiro']
    );

    // Buscar usuário criado
    const userResult = await pool.query('SELECT id, nome, username, tipo, criado_em FROM users WHERE id = ?', [userId]);
    const user = userResult.rows[0];

    // Criar perfil
    const profileId = generateUUID();
    await pool.query(
      `INSERT INTO profiles (id, user_id, renda_mensal, preferencia_divisao) 
       VALUES (?, ?, ?, ?)`,
      [profileId, user.id, rendaMensal || null, null]
    );

    // Criar conta padrão
    const accountId = generateUUID();
    await pool.query(
      `INSERT INTO accounts (id, user_id, nome, tipo, saldo) 
       VALUES (?, ?, ?, ?, 0)`,
      [accountId, user.id, 'Conta Principal', 'corrente']
    );

    // Se for casal e tiver conta conjunta, criar conta conjunta
    if (estadoCivil === 'casado' && contaConjunta) {
      const jointAccountId = generateUUID();
      await pool.query(
        `INSERT INTO accounts (id, user_id, nome, tipo, saldo) 
         VALUES (?, ?, ?, ?, 0)`,
        [jointAccountId, user.id, 'Conta Conjunta', 'conjunta']
      );
    }

    // Criar meta se informada
    if (metaPrincipal) {
      const goalId = generateUUID();
      await pool.query(
        `INSERT INTO goals (id, user_id, titulo, valor_objetivo, valor_atual, prioridade) 
         VALUES (?, ?, ?, 0, 0, 'media')`,
        [goalId, user.id, metaPrincipal]
      );
    }

    // Gerar token
    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        nome: user.nome,
        username: user.username,
        tipo: user.tipo,
      },
      token,
    });
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error);
    
    // Mensagens de erro mais específicas
    if (error.code === 'SQLITE_CONSTRAINT') {
      if (error.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Username já cadastrado' });
      }
    }
    
    res.status(500).json({ 
      error: 'Erro ao criar usuário',
      message: error.message || 'Erro desconhecido',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    // Buscar usuário por username
    const userResult = await pool.query(
      `SELECT u.id, u.nome, u.username, u.password_hash, u.tipo 
       FROM users u 
       WHERE u.username = ?`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Username ou senha incorretos' });
    }

    const user = userResult.rows[0];

    // Verificar senha
    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Username ou senha incorretos' });
    }

    // Gerar token
    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        nome: user.nome,
        username: user.username,
        tipo: user.tipo,
      },
      token,
    });
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    
    res.status(500).json({ 
      error: 'Erro ao fazer login',
      message: error.message || 'Erro desconhecido',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    const userResult = await pool.query(
      `SELECT u.id, u.nome, u.username, u.tipo, u.criado_em, 
              p.renda_mensal, p.preferencia_divisao
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(userResult.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
}
