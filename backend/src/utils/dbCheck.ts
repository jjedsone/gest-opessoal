import pool from '../config/database';

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT 1 as test');
    console.log('✅ Conexão com banco de dados SQLite estabelecida');
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao conectar com banco de dados:', error.message);
    console.error('\n📋 Verifique:');
    console.error('1. O arquivo database/finunity.db existe?');
    console.error('2. Permissões de escrita no diretório database/');
    return false;
  }
}

export async function checkTablesExist(): Promise<boolean> {
  try {
    const result = await pool.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    `);

    if (result.rows.length === 0) {
      console.error('❌ Tabelas não encontradas no banco de dados');
      console.error('\n📋 O banco será criado automaticamente na primeira execução');
      return false;
    }

    console.log('✅ Tabelas do banco de dados verificadas');
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao verificar tabelas:', error.message);
    return false;
  }
}
