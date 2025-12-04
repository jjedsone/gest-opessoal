import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Rotas
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
import { checkDatabaseConnection, checkTablesExist } from './utils/dbCheck';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://get-opessoal.web.app',
        'https://get-opessoal.firebaseapp.com',
      ]
    : true, // Em desenvolvimento, permite todas as origens
  credentials: true,
}));
app.use(express.json());

// Health check (sem verificação de banco)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FinUnity API está funcionando',
    timestamp: new Date().toISOString(),
  });
});

// Health check com verificação de banco
app.get('/health/db', async (req, res) => {
  const dbConnected = await checkDatabaseConnection();
  const tablesExist = dbConnected ? await checkTablesExist() : false;
  
  res.json({
    status: dbConnected && tablesExist ? 'ok' : 'error',
    database: dbConnected ? 'connected' : 'disconnected',
    tables: tablesExist ? 'exists' : 'missing',
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

// Verificar banco de dados na inicialização
async function startServer() {
  console.log('🔍 Verificando conexão com banco de dados...');
  
  const dbConnected = await checkDatabaseConnection();
  if (!dbConnected) {
    console.error('\n⚠️  ATENÇÃO: Banco de dados não conectado!');
    console.error('O servidor iniciará, mas as rotas que precisam do banco retornarão erro.\n');
  } else {
    await checkTablesExist();
    
    // Criar usuário admin automaticamente se não existir
    try {
      const { createAdminUser } = await import('./utils/createAdmin');
      await createAdminUser();
    } catch (error) {
      // Ignorar erros ao criar admin
    }
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API disponível em http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`🔍 Health check DB: http://localhost:${PORT}/health/db\n`);
  });
}

startServer().catch((error) => {
  console.error('❌ Erro ao iniciar servidor:', error);
  process.exit(1);
});

