import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transacoes from './pages/Transacoes';
import Metas from './pages/Metas';
import Configuracoes from './pages/Configuracoes';
import Relatorios from './pages/Relatorios';
import Importacao from './pages/Importacao';
import SugestoesIA from './pages/SugestoesIA';
import Ajuda from './pages/Ajuda';
import './App.css';

// Componente de rota protegida
function ProtectedRoute({ children }: { children: React.ReactElement }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transacoes" 
          element={
            <ProtectedRoute>
              <Transacoes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/metas" 
          element={
            <ProtectedRoute>
              <Metas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/configuracoes" 
          element={
            <ProtectedRoute>
              <Configuracoes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/relatorios" 
          element={
            <ProtectedRoute>
              <Relatorios />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/importacao" 
          element={
            <ProtectedRoute>
              <Importacao />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sugestoes-ia" 
          element={
            <ProtectedRoute>
              <SugestoesIA />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ajuda" 
          element={
            <ProtectedRoute>
              <Ajuda />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

