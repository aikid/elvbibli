import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLoginPage.css';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulação - substituir por chamada real ao backend
      // await adminServices.requestCode(email)
      
      // Simulando delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Código enviado para seu e-mail!');
      setTimeout(() => {
        setStep('code');
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Erro ao enviar código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulação - substituir por chamada real ao backend
      // const valid = await adminServices.validateCode(email, code)
      
      // Simulando validação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Se válido, redirecionar para painel admin
      // navigate('/admin/dashboard');
      
      setError('Código inválido. Tente novamente.');
    } catch (err) {
      setError('Erro ao validar código. Tente novamente.');
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
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-login-icon">🔐</div>
          <h2>Área Administrativa</h2>
          <p className="admin-login-subtitle">
            {step === 'email' ? 'Acesso restrito a administradores' : 'Insira o código recebido'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step-dot ${step === 'email' ? 'active' : 'completed'}`}></div>
          <div className={`step-dot ${step === 'code' ? 'active' : ''}`}></div>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="admin-login-form">
            <div className="form-group-admin">
              <label htmlFor="email">E-mail:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                autoFocus
              />
            </div>

            {error && <div className="admin-error">❌ {error}</div>}
            {success && <div className="admin-success">✓ {success}</div>}

            <button 
              type="submit" 
              className={`admin-submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? '' : 'Enviar código'}
            </button>

            <button
              type="button"
              className="admin-back-button"
              onClick={() => navigate('/')}
            >
              ← Voltar para biblioteca
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="admin-login-form">
            <button
              type="button"
              className="admin-back-button"
              onClick={handleBackToEmail}
            >
              ← Alterar e-mail
            </button>

            <div className="admin-info">
              📧 Código enviado para: <strong>{email}</strong>
            </div>

            <div className="form-group-admin">
              <label htmlFor="code">Código de verificação:</label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                required
                autoFocus
              />
            </div>

            {error && <div className="admin-error">❌ {error}</div>}

            <button 
              type="submit" 
              className={`admin-submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? '' : 'Validar código'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
