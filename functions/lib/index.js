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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Inicializar Firebase Admin
try {
    admin.initializeApp();
}
catch (error) {
    // Já inicializado, ignora
}
// Importar rotas do backend
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const goalRoutes_1 = __importDefault(require("./routes/goalRoutes"));
const budgetRoutes_1 = __importDefault(require("./routes/budgetRoutes"));
const divisionRoutes_1 = __importDefault(require("./routes/divisionRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const aiSuggestionRoutes_1 = __importDefault(require("./routes/aiSuggestionRoutes"));
// Middlewares
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const app = (0, express_1.default)();
// CORS configurado para Firebase Hosting
app.use((0, cors_1.default)({
    origin: [
        'https://get-opessoal.web.app',
        'https://get-opessoal.firebaseapp.com',
        'http://localhost:3000', // Para desenvolvimento local
    ],
    credentials: true,
}));
app.use(express_1.default.json());
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'FinUnity API está funcionando',
        timestamp: new Date().toISOString(),
    });
});
// Rotas da API
app.use('/api/auth', authRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
app.use('/api/accounts', accountRoutes_1.default);
app.use('/api/goals', goalRoutes_1.default);
app.use('/api/budgets', budgetRoutes_1.default);
app.use('/api/division', divisionRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/ai-suggestions', aiSuggestionRoutes_1.default);
// Middleware de erro (deve ser o último)
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
// Exportar como Firebase Function
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map