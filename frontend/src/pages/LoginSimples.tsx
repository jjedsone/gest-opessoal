import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, LoginData } from '../services/authService';
import './Login.css';

function LoginSimples() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.login(formData);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Erro ao fazer login';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validações
    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await authService.register({
        nome: registerData.nome,
        email: registerData.email,
        password: registerData.password,
        estadoCivil: 'solteiro',
        rendaMensal: 0,
        contaConjunta: false,
        permitirIA: true,
      });
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Erro ao criar conta';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">FinUnity</h1>
        <p className="login-subtitle">
          {showRegister ? 'Crie sua conta' : 'Entre na sua conta'}
        </p>

        {!showRegister ? (
          // Formulário de Login
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleLoginChange}
                required
                placeholder="seu@email.com"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleLoginChange}
                required
                placeholder="Sua senha"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="login-footer">
              <p>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(true);
                    setError(null);
                  }}
                  className="link-button"
                >
                  Cadastre-se
                </button>
              </p>
            </div>
          </form>
        ) : (
          // Formulário de Registro
          <form onSubmit={handleRegister} className="login-form">
            <div className="form-group">
              <label htmlFor="register-nome">Nome</label>
              <input
                type="text"
                id="register-nome"
                name="nome"
                value={registerData.nome}
                onChange={handleRegisterChange}
                required
                placeholder="Seu nome"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">E-mail</label>
              <input
                type="email"
                id="register-email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Senha</label>
              <input
                type="password"
                id="register-password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-confirm-password">Confirmar Senha</label>
              <input
                type="password"
                id="register-confirm-password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                required
                placeholder="Digite a senha novamente"
                minLength={6}
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>

            <div className="login-footer">
              <p>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(false);
                    setError(null);
                  }}
                  className="link-button"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginSimples;

