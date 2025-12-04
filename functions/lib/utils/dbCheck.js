"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseConnection = checkDatabaseConnection;
exports.checkTablesExist = checkTablesExist;
const database_1 = __importDefault(require("../config/database"));
async function checkDatabaseConnection() {
    try {
        const result = await database_1.default.query('SELECT NOW()');
        console.log('✅ Conexão com banco de dados estabelecida');
        return true;
    }
    catch (error) {
        console.error('❌ Erro ao conectar com banco de dados:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('\n🔴 PROBLEMA: PostgreSQL não está rodando!');
            console.error('\n📋 SOLUÇÃO RÁPIDA:');
            console.error('   Windows: net start postgresql-x64-14');
            console.error('   Linux:   sudo systemctl start postgresql');
            console.error('   Mac:     brew services start postgresql');
            console.error('\n   Ou execute: scripts\\verificar-postgres.bat');
        }
        else if (error.code === '28P01' || error.code === '3D000') {
            console.error('\n🔴 PROBLEMA: Erro de autenticação ou banco não existe!');
            console.error('\n📋 Verifique:');
            console.error('   1. Credenciais no arquivo backend/.env (DATABASE_URL)');
            console.error('   2. Banco de dados existe? Execute: createdb finunity');
        }
        else {
            console.error('\n📋 Verifique:');
            console.error('1. PostgreSQL está rodando?');
            console.error('2. DATABASE_URL está configurado no arquivo .env?');
            console.error('3. O banco de dados "finunity" existe?');
            console.error('4. As credenciais estão corretas?');
        }
        return false;
    }
}
async function checkTablesExist() {
    try {
        const result = await database_1.default.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `);
        if (result.rows.length === 0) {
            console.error('❌ Tabelas não encontradas no banco de dados');
            console.error('\n📋 Execute o schema SQL:');
            console.error('psql -U usuario -d finunity -f database/schema.sql');
            return false;
        }
        console.log('✅ Tabelas do banco de dados verificadas');
        return true;
    }
    catch (error) {
        console.error('❌ Erro ao verificar tabelas:', error.message);
        return false;
    }
}
//# sourceMappingURL=dbCheck.js.map