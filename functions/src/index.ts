import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

// Inicializar Firebase Admin
try {
  admin.initializeApp();
} catch (error) {
  // Já inicializado, ignora
}

// Importar rotas do backend
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import accountRoutes from './routes/accountRoutes';
import goalRoutes from './routes/goalRoutes';
import budgetRoutes from './routes/budgetRoutes';
import divisionRoutes from './routes/divisionRoutes';
import notificationRoutes from './routes/notificationRoutes';
import aiSuggestionRoutes from './routes/aiSuggestionRoutes';

// Middlewares
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

const app = express();

// CORS configurado para Firebase Hosting
app.use(cors({
  origin: [
    'https://get-opessoal.web.app',
    'https://get-opessoal.firebaseapp.com',
    'http://localhost:3000', // Para desenvolvimento local
  ],
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FinUnity API está funcionando',
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/division', divisionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai-suggestions', aiSuggestionRoutes);

// Middleware de erro (deve ser o último)
app.use(notFound);
app.use(errorHandler);

// Exportar como Firebase Function
export const api = functions.https.onRequest(app);
