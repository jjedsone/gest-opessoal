"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error('Erro capturado:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    // Erro de conexão com banco
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        return res.status(503).json({
            error: 'Serviço de banco de dados indisponível',
            message: 'PostgreSQL não está rodando ou não está acessível na porta 5432',
            details: {
                code: err.code,
                address: err.address || '127.0.0.1',
                port: err.port || 5432,
            },
            solution: [
                '1. Verifique se PostgreSQL está instalado',
                '2. Inicie o serviço PostgreSQL',
                '3. Windows: net start postgresql-x64-XX (substitua XX pela versão)',
                '4. Linux: sudo systemctl start postgresql',
                '5. Mac: brew services start postgresql',
                '6. Execute: scripts\\verificar-postgres.bat para diagnóstico',
            ],
        });
    }
    // Erro de autenticação do banco
    if (err.code === '28P01' || err.code === '3D000') {
        return res.status(503).json({
            error: 'Erro de autenticação no banco de dados',
            message: 'Verifique as credenciais no arquivo backend/.env (DATABASE_URL)',
        });
    }
    // Erro de tabela não existe
    if (err.code === '42P01') {
        return res.status(500).json({
            error: 'Tabela não encontrada no banco de dados',
            message: 'Execute o schema SQL: psql -U usuario -d finunity -f database/schema.sql',
        });
    }
    // Erro de JWT
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token inválido ou expirado',
        });
    }
    // Erro genérico
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Erro interno do servidor'
        : err.message || 'Erro interno do servidor';
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
}
//# sourceMappingURL=errorHandler.js.map