import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, RegisterData } from '../services/authService';
import './Onboarding.css';

interface OnboardingData {
  nome: string;
  email: string;
  password: string;
  estadoCivil: 'solteiro' | 'casado';
  rendaMensal: string;
  contaConjunta: boolean;
  metaPrincipal: string;
  permitirIA: boolean;
}

function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<OnboardingData>({
    nome: '',
    email: '',
    password: '',
    estadoCivil: 'solteiro',
    rendaMensal: '',
    contaConjunta: false,
    metaPrincipal: '',
    permitirIA: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const registerData: RegisterData = {
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        estadoCivil: formData.estadoCivil,
        rendaMensal: formData.rendaMensal ? parseFloat(formData.rendaMensal) : undefined,
        contaConjunta: formData.contaConjunta,
        metaPrincipal: formData.metaPrincipal || undefined,
        permitirIA: formData.permitirIA,
      };

      await authService.register(registerData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1 className="onboarding-title">Bem-vindo ao FinUnity!</h1>
        <p className="onboarding-subtitle">Vamos configurar sua conta.</p>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Seu nome completo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="estadoCivil">Estado civil</label>
            <select
              id="estadoCivil"
              name="estadoCivil"
              value={formData.estadoCivil}
              onChange={handleChange}
              required
            >
              <option value="solteiro">Solteiro</option>
              <option value="casado">Casado</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rendaMensal">Renda mensal (R$)</label>
            <input
              type="number"
              id="rendaMensal"
              name="rendaMensal"
              value={formData.rendaMensal}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0,00"
            />
          </div>

          {formData.estadoCivil === 'casado' && (
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="contaConjunta"
                  checked={formData.contaConjunta}
                  onChange={handleChange}
                />
                <span>Tenho conta conjunta</span>
              </label>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Crie uma senha segura"
            />
          </div>

          <div className="form-group">
            <label htmlFor="metaPrincipal">Meta principal</label>
            <input
              type="text"
              id="metaPrincipal"
              name="metaPrincipal"
              value={formData.metaPrincipal}
              onChange={handleChange}
              placeholder="Ex.: emergência, imóvel, viagem"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="permitirIA"
                checked={formData.permitirIA}
                onChange={handleChange}
              />
              <span>Permitir assistente IA</span>
            </label>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Criando conta...' : 'Começar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;

