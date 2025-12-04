import pool, { generateUUID } from '../config/database';
import { hashPassword } from './password';

export async function createAdminUser() {
  try {
    // Verificar se admin já existe
    const userExists = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      ['admin']
    );

    if (userExists.rows.length > 0) {
      console.log('ℹ️  Usuário admin já existe');
      return;
    }

    // Hash da senha "admin123"
    const passwordHash = await hashPassword('admin123');

    // Gerar ID único
    const userId = generateUUID();

    // Criar usuário admin
    await pool.query(
      `INSERT INTO users (id, nome, username, password_hash, tipo) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, 'Administrador', 'admin', passwordHash, 'solteiro']
    );

    // Buscar admin criado
    const adminResult = await pool.query('SELECT id, nome, username FROM users WHERE id = ?', [userId]);
    const admin = adminResult.rows[0] as { id: string; nome: string; username: string } | undefined;
    
    if (!admin) {
      console.error('❌ Erro ao criar admin: usuário não encontrado após criação');
      return;
    }
    
    console.log('✅ Usuário admin criado automaticamente');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Senha: admin123`);

    // Criar perfil
    const profileId = generateUUID();
    await pool.query(
      `INSERT INTO profiles (id, user_id, renda_mensal) 
       VALUES (?, ?, ?)`,
      [profileId, admin.id, 0]
    );

    // Criar conta padrão
    const accountId = generateUUID();
    await pool.query(
      `INSERT INTO accounts (id, user_id, nome, tipo, saldo) 
       VALUES (?, ?, ?, ?, 0)`,
      [accountId, admin.id, 'Conta Principal', 'corrente']
    );

    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro acesso!');
  } catch (error: any) {
    // Ignorar erros silenciosamente (pode ser que o banco não esteja disponível)
    if (error.code !== 'ECONNREFUSED' && error.code !== 'ENOTFOUND') {
      console.error('⚠️  Erro ao criar usuário admin:', error.message);
    }
  }
}
