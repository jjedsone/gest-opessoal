"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const functions = __importStar(require("firebase-functions"));
// Obter configuração do Firebase Functions Config ou variáveis de ambiente
const getDatabaseUrl = () => {
    // Primeiro tenta Firebase Functions config
    try {
        const config = functions.config();
        if (config.database?.url) {
            return config.database.url;
        }
    }
    catch (error) {
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
const pool = new pg_1.Pool({
    connectionString: getDatabaseUrl(),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
});
pool.on('error', (err) => {
    console.error('❌ Erro inesperado no pool de conexões:', err.message);
});
// Testar conexão ao criar o pool
pool.query('SELECT NOW()')
    .then(() => {
    console.log('✅ Pool de conexões criado com sucesso');
})
    .catch((err) => {
    console.error('❌ Erro ao criar pool de conexões:', err.message);
});
exports.default = pool;
//# sourceMappingURL=database.js.map