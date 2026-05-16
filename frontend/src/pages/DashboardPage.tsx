import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import '../styles/DashboardPage.css';

type TabType = 'cadastrar' | 'livros' | 'emprestimos';

interface Book {
  _id: string;
  titulo: string;
  autor: string;
  capa: string;
  descricao: string;
  ano?: number;
  genero: string;
  quantidade: number;
}

interface Emprestimo {
  _id: string;
  livro: Book;
  pessoa: string;
  dataPegou: string;
  dataDevolucao?: string;
  status: 'ativo' | 'devolvido';
  diasAtraso?: number;
  diasDesdeEmprestimo?: number;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('cadastrar');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard Administrativo</h1>
          <div className="header-actions">
            <span className="user-info">Olá, {user?.email}</span>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Ver Biblioteca
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <nav className="dashboard-tabs">
          <button
            className={activeTab === 'cadastrar' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('cadastrar')}
          >
            📚 Cadastrar Livro
          </button>
          <button
            className={activeTab === 'livros' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('livros')}
          >
            📖 Gerenciar Livros
          </button>
          <button
            className={activeTab === 'emprestimos' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('emprestimos')}
          >
            📋 Empréstimos
          </button>
        </nav>

        <div className="tab-content">
          {activeTab === 'cadastrar' && <CadastrarLivroTab />}
          {activeTab === 'livros' && <GerenciarLivrosTab />}
          {activeTab === 'emprestimos' && <EmprestimosTab />}
        </div>
      </div>
    </div>
  );
}

// Componente para Cadastrar Livro
function CadastrarLivroTab() {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    capa: '',
    descricao: '',
    ano: '',
    genero: '',
    quantidade: '1',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        ano: formData.ano ? parseInt(formData.ano) : undefined,
        quantidade: parseInt(formData.quantidade),
      };

      await api.post('/books', payload);
      setSuccess('Livro cadastrado com sucesso!');
      
      // Limpar formulário
      setFormData({
        titulo: '',
        autor: '',
        capa: '',
        descricao: '',
        ano: '',
        genero: '',
        quantidade: '1',
      });
    } catch (err: any) {
      setError(err.response?.data?.erro || 'Erro ao cadastrar livro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content-inner">
      <h2>Cadastrar Novo Livro</h2>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form-cadastro">
        <div className="form-group">
          <label htmlFor="titulo">Título *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="autor">Autor *</label>
          <input
            type="text"
            id="autor"
            name="autor"
            value={formData.autor}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="capa">URL da Capa *</label>
          <input
            type="url"
            id="capa"
            name="capa"
            value={formData.capa}
            onChange={handleChange}
            placeholder="https://exemplo.com/capa.jpg"
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="genero">Gênero</label>
            <input
              type="text"
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              placeholder="Ex: Ficção, Romance, etc."
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ano">Ano</label>
            <input
              type="number"
              id="ano"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              min="1000"
              max="2100"
              placeholder="2024"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="quantidade">Quantidade *</label>
          <input
            type="number"
            id="quantidade"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleChange}
            min="0"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Breve descrição do livro..."
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Livro'}
        </button>
      </form>
    </div>
  );
}

// Componente para Gerenciar Livros
function GerenciarLivrosTab() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.erro || 'Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja excluir o livro "${titulo}"?`)) {
      return;
    }

    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter((book) => book._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.erro || 'Erro ao excluir livro');
    }
  };

  if (loading) {
    return (
      <div className="tab-content-inner">
        <div className="loading">Carregando livros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content-inner">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="tab-content-inner">
      <h2>Gerenciar Livros ({books.length})</h2>

      {books.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum livro cadastrado ainda.</p>
        </div>
      ) : (
        <div className="livros-grid">
          {books.map((book) => (
            <div key={book._id} className="livro-card">
              <img src={book.capa} alt={book.titulo} />
              <h3>{book.titulo}</h3>
              <p>Autor: {book.autor}</p>
              {book.genero && <p>Gênero: {book.genero}</p>}
              {book.ano && <p>Ano: {book.ano}</p>}
              <p>Quantidade: {book.quantidade}</p>
              <div className="livro-actions">
                <button className="btn-delete" onClick={() => handleDelete(book._id, book.titulo)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para Empréstimos
function EmprestimosTab() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [emprestimosAtrasados, setEmprestimosAtrasados] = useState<Emprestimo[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailDestino, setEmailDestino] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    livroId: '',
    pessoa: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [emprestimosRes, booksRes, atrasadosRes] = await Promise.all([
        api.get('/emprestimos'),
        api.get('/books'),
        api.get('/emprestimos/atrasados'),
      ]);
      setEmprestimos(emprestimosRes.data);
      setBooks(booksRes.data);
      setEmprestimosAtrasados(atrasadosRes.data);
    } catch (err: any) {
      setError(err.response?.data?.erro || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDevolver = async (id: string) => {
    try {
      await api.put(`/emprestimos/${id}/devolver`);
      // Recarregar dados
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.erro || 'Erro ao devolver livro');
    }
  };

  const handleSubmitEmprestimo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      await api.post('/emprestimos', formData);
      setFormSuccess('Empréstimo registrado com sucesso!');
      
      // Limpar formulário e recarregar dados
      setFormData({ livroId: '', pessoa: '' });
      setShowForm(false);
      loadData();
    } catch (err: any) {
      setFormError(err.response?.data?.erro || 'Erro ao registrar empréstimo');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSendNotificacao = async () => {
    if (!emailDestino.trim()) {
      alert('Por favor, informe um e-mail válido');
      return;
    }

    setSendingEmail(true);

    try {
      const response = await api.post('/emprestimos/notificar-atrasados', {
        emailDestino: emailDestino.trim(),
      });
      
      alert(response.data.mensagem || 'Notificação enviada com sucesso!');
      setShowEmailDialog(false);
      setEmailDestino('');
    } catch (err: any) {
      console.error('Erro ao enviar notificação:', err);
      alert(err.response?.data?.erro || 'Erro ao enviar notificação');
    } finally {
      setSendingEmail(false);
    }
  };

  // Calcular livros disponíveis
  const booksWithAvailability = books.map((book) => {
    const emprestimosAtivos = emprestimos.filter(
      (e) => e.livro?._id === book._id && e.status === 'ativo'
    ).length;
    const disponivel = book.quantidade - emprestimosAtivos;
    return { ...book, disponivel };
  });

  const livrosDisponiveis = booksWithAvailability.filter((b) => b.disponivel > 0);

  if (loading) {
    return (
      <div className="tab-content-inner">
        <div className="loading">Carregando empréstimos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content-inner">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const emprestimosAtivos = emprestimos.filter((e) => e.status === 'ativo');

  return (
    <div className="tab-content-inner">
      {/* Alerta de empréstimos atrasados */}
      {emprestimosAtrasados.length > 0 && (
        <div className="alerta-atrasados">
          <div className="alerta-header">
            <div>
              <h3>⚠️ Atenção: {emprestimosAtrasados.length} empréstimo(s) atrasado(s)</h3>
              <p>Os seguintes empréstimos ultrapassaram 30 dias:</p>
            </div>
            <button
              className="btn-notificar"
              onClick={() => {
                setEmailDestino(user?.email || '');
                setShowEmailDialog(true);
              }}
            >
              📧 Enviar Notificação
            </button>
          </div>
          
          <div className="atrasados-lista">
            {emprestimosAtrasados.map((emp) => (
              <div key={emp._id} className="atrasado-item">
                <div className="atrasado-info">
                  <strong>{emp.livro?.titulo || 'N/A'}</strong>
                  <span>Emprestado para: {emp.pessoa}</span>
                  <span>Data: {new Date(emp.dataPegou).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="atrasado-dias">
                  <span className="dias-numero">{emp.diasAtraso}</span>
                  <span className="dias-label">dias de atraso</span>
                </div>
                <button
                  className="btn-devolver-small"
                  onClick={() => handleDevolver(emp._id)}
                >
                  Devolver
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dialog de envio de email */}
      {showEmailDialog && (
        <div className="email-dialog-overlay" onClick={() => !sendingEmail && setShowEmailDialog(false)}>
          <div className="email-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Enviar Notificação por E-mail</h3>
            <p>Um e-mail será enviado com a lista de todos os empréstimos atrasados.</p>
            
            <div className="form-group">
              <label htmlFor="emailDestino">E-mail de destino:</label>
              <input
                type="email"
                id="emailDestino"
                value={emailDestino}
                onChange={(e) => setEmailDestino(e.target.value)}
                placeholder="seu@email.com"
                disabled={sendingEmail}
                autoFocus
              />
            </div>

            <div className="dialog-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowEmailDialog(false)}
                disabled={sendingEmail}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={handleSendNotificacao}
                disabled={sendingEmail}
              >
                {sendingEmail ? 'Enviando...' : 'Enviar Notificação'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="emprestimos-header">
        <div>
          <h2>Empréstimos Ativos</h2>
          <p>{emprestimosAtivos.length} {emprestimosAtivos.length === 1 ? 'empréstimo ativo' : 'empréstimos ativos'}</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancelar' : '➕ Novo Empréstimo'}
        </button>
      </div>

      {/* Formulário de cadastro */}
      {showForm && (
        <div className="emprestimo-form-container">
          <h3>Registrar Novo Empréstimo</h3>
          
          {formSuccess && <div className="success-message">{formSuccess}</div>}
          {formError && <div className="error-message">{formError}</div>}

          <form onSubmit={handleSubmitEmprestimo} className="form-emprestimo">
            <div className="form-group">
              <label htmlFor="livroId">Livro *</label>
              <select
                id="livroId"
                name="livroId"
                value={formData.livroId}
                onChange={(e) => setFormData({ ...formData, livroId: e.target.value })}
                required
                disabled={formLoading}
              >
                <option value="">Selecione um livro</option>
                {livrosDisponiveis.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.titulo} - {book.autor} ({book.disponivel} disponível)
                  </option>
                ))}
              </select>
              {livrosDisponiveis.length === 0 && (
                <p className="form-hint error">Nenhum livro disponível para empréstimo no momento</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="pessoa">Nome da Pessoa *</label>
              <input
                type="text"
                id="pessoa"
                name="pessoa"
                value={formData.pessoa}
                onChange={(e) => setFormData({ ...formData, pessoa: e.target.value })}
                placeholder="Nome completo"
                required
                disabled={formLoading}
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={formLoading || livrosDisponiveis.length === 0}
              >
                {formLoading ? 'Registrando...' : 'Registrar Empréstimo'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ livroId: '', pessoa: '' });
                  setFormError('');
                  setFormSuccess('');
                }}
                disabled={formLoading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de empréstimos ativos */}
      {emprestimosAtivos.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum empréstimo ativo no momento.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="emprestimos-table">
            <thead>
              <tr>
                <th>Livro</th>
                <th>Pessoa</th>
                <th>Data Empréstimo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {emprestimosAtivos.map((emprestimo) => (
                <tr key={emprestimo._id}>
                  <td>{emprestimo.livro?.titulo || 'N/A'}</td>
                  <td>{emprestimo.pessoa}</td>
                  <td>{new Date(emprestimo.dataPegou).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <button
                      className="btn-devolver"
                      onClick={() => handleDevolver(emprestimo._id)}
                    >
                      Devolver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
