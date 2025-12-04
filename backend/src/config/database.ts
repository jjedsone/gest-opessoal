import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL não configurado no arquivo .env');
  console.warn('   Configure: DATABASE_URL=postgresql://usuario:senha@localhost:5432/finunity');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Configurações de timeout
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err: Error) => {
  console.error('❌ Erro inesperado no pool de conexões:', err.message);
  console.error('   Verifique se o PostgreSQL está rodando e se as credenciais estão corretas');
});

// Testar conexão ao criar o pool
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Pool de conexões criado com sucesso');
  })
  .catch((err: Error) => {
    console.error('❌ Erro ao criar pool de conexões:', err.message);
    console.error('   Configure o arquivo backend/.env com DATABASE_URL');
  });

export default pool;

