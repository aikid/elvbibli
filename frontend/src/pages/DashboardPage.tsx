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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEmprestimos();
  }, []);

  const loadEmprestimos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/emprestimos');
      setEmprestimos(response.data);
    } catch (err: any) {
      setError(err.response?.data?.erro || 'Erro ao carregar empréstimos');
    } finally {
      setLoading(false);
    }
  };

  const handleDevolver = async (id: string) => {
    try {
      await api.put(`/emprestimos/${id}/devolver`);
      // Recarregar lista
      loadEmprestimos();
    } catch (err: any) {
      alert(err.response?.data?.erro || 'Erro ao devolver livro');
    }
  };

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
  const emprestimosDevolvidos = emprestimos.filter((e) => e.status === 'devolvido');

  return (
    <div className="tab-content-inner">
      <h2>Empréstimos</h2>
      <p>Total: {emprestimos.length} | Ativos: {emprestimosAtivos.length} | Devolvidos: {emprestimosDevolvidos.length}</p>

      {emprestimos.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum empréstimo registrado ainda.</p>
        </div>
      ) : (
        <table className="emprestimos-table">
          <thead>
            <tr>
              <th>Livro</th>
              <th>Pessoa</th>
              <th>Data Empréstimo</th>
              <th>Data Devolução</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {emprestimos.map((emprestimo) => (
              <tr key={emprestimo._id}>
                <td>{emprestimo.livro?.titulo || 'N/A'}</td>
                <td>{emprestimo.pessoa}</td>
                <td>{new Date(emprestimo.dataPegou).toLocaleDateString('pt-BR')}</td>
                <td>
                  {emprestimo.dataDevolucao
                    ? new Date(emprestimo.dataDevolucao).toLocaleDateString('pt-BR')
                    : '-'}
                </td>
                <td>
                  <span className={`status-badge status-${emprestimo.status}`}>
                    {emprestimo.status === 'ativo' ? 'Ativo' : 'Devolvido'}
                  </span>
                </td>
                <td>
                  {emprestimo.status === 'ativo' && (
                    <button
                      className="btn-devolver"
                      onClick={() => handleDevolver(emprestimo._id)}
                    >
                      Devolver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
