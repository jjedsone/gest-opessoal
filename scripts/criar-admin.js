const path = require('path');
const bcrypt = require(path.join(__dirname, '../backend/node_modules/bcryptjs'));
const { Pool } = require(path.join(__dirname, '../backend/node_modules/pg'));
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function criarAdmin() {
  try {
    console.log('🔐 Criando usuário admin...');
    
    // Verificar se admin já existe
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@finunity.com']);
    
    if (userExists.rows.length > 0) {
      console.log('⚠️  Usuário admin já existe!');
      console.log('   Email: admin@finunity.com');
      console.log('   Para resetar a senha, delete o usuário primeiro.');
      process.exit(0);
    }

    // Hash da senha "admin123"
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Criar usuário admin
    const userResult = await pool.query(
      `INSERT INTO users (nome, email, password_hash, tipo) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, nome, email`,
      ['Administrador', 'admin@finunity.com', passwordHash, 'solteiro']
    );

    const admin = userResult.rows[0];
    console.log('✅ Usuário admin criado!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nome: ${admin.nome}`);
    console.log(`   Email: ${admin.email}`);

    // Criar perfil
    await pool.query(
      `INSERT INTO profiles (user_id, renda_mensal) 
       VALUES ($1, $2)`,
      [admin.id, 0]
    );
    console.log('✅ Perfil criado!');

    // Criar conta padrão
    await pool.query(
      `INSERT INTO accounts (user_id, nome, tipo, saldo) 
       VALUES ($1, $2, $3, 0)`,
      [admin.id, 'Conta Principal', 'corrente']
    );
    console.log('✅ Conta padrão criada!');

    console.log('\n📋 Credenciais de acesso:');
    console.log('   Email: admin@finunity.com');
    console.log('   Senha: admin123');
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro acesso!');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n📋 Verifique:');
      console.error('1. PostgreSQL está rodando?');
      console.error('2. DATABASE_URL está configurado no backend/.env?');
      console.error('3. O banco de dados "finunity" existe?');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

criarAdmin();

