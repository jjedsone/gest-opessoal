"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(payload) {
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    if (!jwtSecret) {
        throw new Error('JWT_SECRET não configurado');
    }
    return jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn });
}
function verifyToken(token) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET não configurado');
    }
    return jsonwebtoken_1.default.verify(token, jwtSecret);
}
//# sourceMappingURL=jwt.js.map