import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Caminho do banco de dados SQLite
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database/finunity.db');

// Garantir que o diretório existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Criar conexão com SQLite
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Criar tabelas se não existirem
function initializeDatabase() {
  const schemaPath = path.join(__dirname, '../../database/schema.sqlite.sql');
  
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    console.log('✅ Banco de dados SQLite inicializado');
  } else {
    console.warn('⚠️  Arquivo schema.sqlite.sql não encontrado');
  }
}

// Inicializar banco na primeira conexão
try {
  initializeDatabase();
  console.log('✅ Conexão com SQLite estabelecida');
} catch (error: any) {
  console.error('❌ Erro ao inicializar banco SQLite:', error.message);
}

// Wrapper para compatibilidade com código existente (pg)
const pool = {
  query: (text: string, params?: any[]) => {
    try {
      const stmt = db.prepare(text);
      const result = stmt.all(params || []);
      return Promise.resolve({ rows: result });
    } catch (error: any) {
      return Promise.reject(error);
    }
  },
  
  queryOne: (text: string, params?: any[]) => {
    try {
      const stmt = db.prepare(text);
      const result = stmt.get(params || []);
      return Promise.resolve({ rows: result ? [result] : [] });
    } catch (error: any) {
      return Promise.reject(error);
    }
  },
  
  // Para INSERT que retorna dados
  queryReturning: (text: string, params?: any[]) => {
    try {
      const stmt = db.prepare(text);
      const result = stmt.run(params || []);
      
      // Se a query contém RETURNING, buscar o último registro inserido
      if (text.toUpperCase().includes('RETURNING')) {
        const lastId = result.lastInsertRowid;
        const selectStmt = db.prepare(`SELECT * FROM ${text.match(/INSERT INTO (\w+)/i)?.[1]} WHERE rowid = ?`);
        const row = selectStmt.get(lastId);
        return Promise.resolve({ rows: row ? [row] : [] });
      }
      
      return Promise.resolve({ rows: [] });
    } catch (error: any) {
      return Promise.reject(error);
    }
  },
};

// Função helper para gerar UUID (SQLite não tem uuid-ossp)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default pool;
export { db, generateUUID };
