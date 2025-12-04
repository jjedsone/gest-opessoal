import pool from '../config/database';
import { hashPassword } from './password';

export async function createAdminUser() {
  try {
    // Verificar se admin já existe
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@finunity.com']
    );

    if (userExists.rows.length > 0) {
      console.log('ℹ️  Usuário admin já existe');
      return;
    }

    // Hash da senha "admin123"
    const passwordHash = await hashPassword('admin123');

    // Criar usuário admin
    const userResult = await pool.query(
      `INSERT INTO users (nome, email, password_hash, tipo) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, nome, email`,
      ['Administrador', 'admin@finunity.com', passwordHash, 'solteiro']
    );

    const admin = userResult.rows[0];
    console.log('✅ Usuário admin criado automaticamente');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Senha: admin123`);

    // Criar perfil
    await pool.query(
      `INSERT INTO profiles (user_id, renda_mensal) 
       VALUES ($1, $2)`,
      [admin.id, 0]
    );

    // Criar conta padrão
    await pool.query(
      `INSERT INTO accounts (user_id, nome, tipo, saldo) 
       VALUES ($1, $2, $3, 0)`,
      [admin.id, 'Conta Principal', 'corrente']
    );

    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro acesso!');
  } catch (error: any) {
    // Ignorar erros silenciosamente (pode ser que o banco não esteja disponível)
    if (error.code !== 'ECONNREFUSED' && error.code !== 'ENOTFOUND') {
      console.error('⚠️  Erro ao criar usuário admin:', error.message);
    }
  }
}

