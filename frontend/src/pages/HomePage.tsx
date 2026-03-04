import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import LogoElv from '../assets/logo-elv.png';
import { getBooks } from '../services/bookServices';
import { type Book } from '../data/books';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [booksData, setBooksData] = useState<Book[]>([]);
  const navigate = useNavigate();

  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return booksData;

    const term = searchTerm.toLowerCase();
    return booksData.filter(
      (book) =>
        book.titulo.toLowerCase().includes(term) ||
        book.autor.toLowerCase().includes(term) ||
        book.genero.toLowerCase().includes(term)
    );
  }, [searchTerm, booksData]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    return stars;
  };

  const optimizeImage = (url: string) => {
    console.log(url);
    if (!url) return "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop";
    return url.replace("/upload/", "/upload/w_300,q_auto,f_auto/");
  };

  useEffect(() => {
    getBooks()
      .then(setBooksData)
      .catch((error) => {
        console.error("Erro ao carregar livros:", error);
        setBooksData([]);
      });
  }, []);

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Header */}
        <header className="header">
          <div className="logo-container">
            <img src={LogoElv} alt="Logo" className="logo" />
          </div>
          <h1 className="title">Biblioteca da Igreja</h1>
          <p className="subtitle">Descubra sua próxima leitura</p>
        </header>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Pesquisar por título, autor ou gênero..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Books Count */}
        <div className="books-count">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'livro encontrado' : 'livros encontrados'}
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="books-grid">
            {filteredBooks.map((book, index) => (
              <div
                key={book._id}
                className="book-card"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/livro/${book._id}`)}
              >
                <div className="book-cover-container">
                  <img src={optimizeImage(book.capa)} alt={book.titulo} className="book-cover" />
                </div>
                <div className="book-content">
                  <h3 className="book-title">{book.titulo}</h3>
                  <p className="book-author">{book.autor}</p>
                  <div className="book-rating">
                    <div className="stars">{renderStars(book.mediaAvaliacoes)}</div>
                    <span className="rating-value">{book.mediaAvaliacoes.toFixed(1)}</span>
                  </div>
                  <div className="book-tags">
                    <span className={book.statusDisponibilidade === "emprestado" ? "tag tag-unavailable" : "tag tag-available"}>{book.statusDisponibilidade}</span>
                    <span className="tag tag-genre">{book.genero}</span>
                    <span className="tag tag-year">{book.ano}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h2 className="no-results-title">Nenhum livro encontrado</h2>
            <p className="no-results-text">Tente pesquisar com outros termos</p>
          </div>
        )}
      </div>
    </div>
  );
}
