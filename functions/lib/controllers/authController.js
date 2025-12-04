"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getProfile = getProfile;
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
async function register(req, res) {
    const { nome, email, password, estadoCivil, rendaMensal, contaConjunta, metaPrincipal, permitirIA } = req.body;
    try {
        // Verificar se usuário já existe
        const userExists = await database_1.default.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        }
        // Hash da senha
        const passwordHash = await (0, password_1.hashPassword)(password);
        // Criar usuário
        const userResult = await database_1.default.query(`INSERT INTO users (nome, email, password_hash, tipo) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, nome, email, tipo, criado_em`, [nome, email, passwordHash, estadoCivil === 'casado' ? 'casal' : 'solteiro']);
        const user = userResult.rows[0];
        // Criar perfil
        await database_1.default.query(`INSERT INTO profiles (user_id, renda_mensal, preferencia_divisao) 
       VALUES ($1, $2, $3)`, [user.id, rendaMensal || null, null]);
        // Criar conta padrão
        await database_1.default.query(`INSERT INTO accounts (user_id, nome, tipo, saldo) 
       VALUES ($1, $2, $3, 0)`, [user.id, 'Conta Principal', 'corrente']);
        // Se for casal e tiver conta conjunta, criar conta conjunta
        if (estadoCivil === 'casado' && contaConjunta) {
            await database_1.default.query(`INSERT INTO accounts (user_id, nome, tipo, saldo) 
         VALUES ($1, $2, $3, 0)`, [user.id, 'Conta Conjunta', 'conjunta']);
        }
        // Criar meta se informada
        if (metaPrincipal) {
            await database_1.default.query(`INSERT INTO goals (user_id, titulo, valor_objetivo, valor_atual, prioridade) 
         VALUES ($1, $2, 0, 0, 'media')`, [user.id, metaPrincipal]);
        }
        // Gerar token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
        });
        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo,
            },
            token,
        });
    }
    catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
}
async function login(req, res) {
    const { email, password } = req.body;
    try {
        // Buscar usuário
        const userResult = await database_1.default.query(`SELECT u.id, u.nome, u.email, u.password_hash, u.tipo 
       FROM users u 
       WHERE u.email = $1`, [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos' });
        }
        const user = userResult.rows[0];
        // Verificar senha
        const passwordMatch = await (0, password_1.comparePassword)(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos' });
        }
        // Gerar token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
        });
        res.json({
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo,
            },
            token,
        });
    }
    catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
}
async function getProfile(req, res) {
    try {
        const userId = req.user?.userId;
        const userResult = await database_1.default.query(`SELECT u.id, u.nome, u.email, u.tipo, u.criado_em, 
              p.renda_mensal, p.preferencia_divisao
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1`, [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(userResult.rows[0]);
    }
    catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
}
//# sourceMappingURL=authController.js.map