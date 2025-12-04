import { Pool } from 'pg';
import * as functions from 'firebase-functions';

// Obter configuração do Firebase Functions Config ou variáveis de ambiente
const getDatabaseUrl = () => {
  // Primeiro tenta Firebase Functions config
  try {
    const config = functions.config();
    if (config.database?.url) {
      return config.database.url;
    }
  } catch (error) {
    // Ignora se não houver config
  }
  
  // Depois tenta variável de ambiente
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Fallback para desenvolvimento local
  return process.env.DATABASE_URL || 'postgresql://postgres:senha@localhost:5432/finunity';
};

if (!getDatabaseUrl() || getDatabaseUrl().includes('localhost')) {
  console.warn('⚠️  DATABASE_URL não configurado');
  console.warn('   Configure via: firebase functions:config:set database.url="sua_url"');
}

const pool = new Pool({
  connectionString: getDatabaseUrl(),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err: Error) => {
  console.error('❌ Erro inesperado no pool de conexões:', err.message);
});

// Testar conexão ao criar o pool
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Pool de conexões criado com sucesso');
  })
  .catch((err: Error) => {
    console.error('❌ Erro ao criar pool de conexões:', err.message);
  });

export default pool;
