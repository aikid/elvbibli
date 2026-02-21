import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/request-code', { email });
      setSuccess(response.data.mensagem || 'Código enviado com sucesso!');
      setStep('code');
      
      // Em desenvolvimento, mostrar o código se retornado
      if (response.data.codigo) {
        console.log('Código de verificação:', response.data.codigo);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.erro ||
        err.response?.data?.mensagem ||
        'Erro ao solicitar código. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-code', { email, code });
      const { token, user } = response.data;

      // Salvar token e usuário
      login(token, user);

      // Redirecionar para a página inicial
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.erro ||
        err.response?.data?.mensagem ||
        'Código inválido ou expirado. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Biblioteca Virtual</h1>
        <h2>Entrar</h2>

        {step === 'email' ? (
          <form onSubmit={handleRequestCode} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="login-form">
            <div className="form-group">
              <label htmlFor="code">Código de Verificação</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                disabled={loading}
                className="code-input"
              />
              <p className="code-hint">Digite o código de 6 dígitos enviado para {email}</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              <button
                type="button"
                onClick={handleBackToEmail}
                disabled={loading}
                className="back-button"
              >
                Voltar
              </button>
              <button type="submit" disabled={loading} className="submit-button">
                {loading ? 'Verificando...' : 'Verificar Código'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
