import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/BookDetailPage.css';
import { type Book, type Avaliacao } from '../data/books';
import { getBookById, addAvaliacao } from '../services/bookServices';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(book?.avaliacoes || []);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [novaAvaliacao, setNovaAvaliacao] = useState<{
    usuario: string;
    nota: number | null;
    comentario: string;
  }>({
    usuario: '',
    nota: null,
    comentario: '',
  });

  useEffect(() => {
    if (id) {
      getBookById(id)
        .then((bookData) => {
          setBook(bookData);
          setAvaliacoes(bookData.avaliacoes || []);
        })
        .catch((error) => {
          console.error("Erro ao carregar livro:", error);
          setBook(null);
        });
    }
  }, [id]);

  const mediaAtualizada = useMemo(() => {
    if (!book?.mediaAvaliacoes) return;
    if (avaliacoes.length === 0) return book.mediaAvaliacoes;
    const soma = avaliacoes.reduce((acc, aval) => acc + aval.nota, 0);
    return soma / avaliacoes.length;
  }, [avaliacoes, book?.mediaAvaliacoes]);

  if (!book) {
    return (
      <div className="detail-page">
        <div className="detail-container">
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Livro não encontrado</h1>
          <div style={{ textAlign: 'center' }}>
            <button className="back-button" onClick={() => navigate('/')}>
              ← Voltar para a biblioteca
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitAvaliacao = async () => {
    if (!novaAvaliacao.usuario.trim() || novaAvaliacao.nota === null || !novaAvaliacao.comentario.trim()) {
      return;
    }

    if (!id) return;

    const dataAtual = new Date().toISOString().split('T')[0];
    const avaliacaoEnviada = {
      usuario: novaAvaliacao.usuario,
      nota: novaAvaliacao.nota,
      comentario: novaAvaliacao.comentario,
      data: dataAtual,
    };

    try {
      const novaAval = await addAvaliacao(id, avaliacaoEnviada);

      // Garantir que a avaliação retornada tenha todos os campos necessários
      const avaliacaoProcessada = {
        _id: novaAval._id || novaAval.id || `a${Date.now()}`,
        usuario: novaAval.usuario || avaliacaoEnviada.usuario,
        nota: novaAval.nota ?? avaliacaoEnviada.nota,
        comentario: novaAval.comentario || avaliacaoEnviada.comentario,
        data: novaAval.data || dataAtual,
      };

      setAvaliacoes([avaliacaoProcessada, ...avaliacoes]);
      setNovaAvaliacao({ usuario: '', nota: null, comentario: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao adicionar avaliação:", error);
    }
  };

  const renderStars = (rating: number, large = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={large ? 'book-detail-star' : 'review-star'}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={large ? 'book-detail-star' : 'review-star'}>★</span>);
      } else {
        stars.push(<span key={i} className={`${large ? 'book-detail-star' : 'review-star'} empty`}>★</span>);
      }
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate('/')}>
          ← Voltar para a biblioteca
        </button>

        {/* Book Details Card */}
        <div className="book-detail-card">
          <div className="book-detail-grid">
            <div className="book-detail-cover">
              <img src={book.capa || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"} alt={book.titulo} />
            </div>
            <div className="book-detail-info">
              <h1 className="book-detail-title">{book.titulo}</h1>
              <p className="book-detail-author">por {book.autor}</p>

              <div className="book-detail-rating-container">
                <div className="book-detail-rating">
                  <div className="book-detail-stars">{renderStars(mediaAtualizada || 0, true)}</div>
                  <span className="book-detail-rating-value">{mediaAtualizada?.toFixed(1) || 0}</span>
                </div>
                <span className="book-detail-rating-count">
                  ({avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'})
                </span>
              </div>

              <div className="book-detail-tags">
                <span className="book-detail-tag book-detail-tag-genre">{book.genero}</span>
                <span className="book-detail-tag book-detail-tag-year">Publicado em {book.ano}</span>
              </div>

              <p className="book-detail-description">{book.descricao}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2 className="reviews-title">
            <span className="reviews-title-icon">⭐</span>
            Avaliações e Comentários
          </h2>

          {/* New Review Form */}
          <div className="review-form-card">
            <h3 className="review-form-title">Deixe sua avaliação</h3>

            {submitSuccess && (
              <div className="success-message">Avaliação enviada com sucesso!</div>
            )}

            <div className="form-group">
              <label className="form-label">Seu nome</label>
              <input
                type="text"
                className="form-input"
                value={novaAvaliacao.usuario}
                onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, usuario: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sua nota:</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`rating-star ${novaAvaliacao.nota && star <= novaAvaliacao.nota ? 'filled' : ''}`}
                    onClick={() => setNovaAvaliacao({ ...novaAvaliacao, nota: star })}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Seu comentário</label>
              <textarea
                className="form-textarea"
                value={novaAvaliacao.comentario}
                onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, comentario: e.target.value })}
              />
            </div>

            <button
              className="submit-button"
              onClick={handleSubmitAvaliacao}
              disabled={!novaAvaliacao.usuario.trim() || novaAvaliacao.nota === null || !novaAvaliacao.comentario.trim()}
            >
              Enviar Avaliação
            </button>
          </div>

          {/* Reviews List */}
          {avaliacoes.length > 0 ? (
            <div className="reviews-list">
              {avaliacoes.map((avaliacao, index) => (
                <div key={avaliacao._id} className="review-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="review-header">
                    <div className="review-avatar">👤</div>
                    <div className="review-header-content">
                      <div className="review-user">{avaliacao.usuario}</div>
                      <div className="review-meta">
                        <div className="review-stars">{renderStars(avaliacao.nota)}</div>
                        <span className="review-date">{formatDate(avaliacao.data)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="review-divider"></div>
                  <p className="review-comment">{avaliacao.comentario}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews">
              <p className="no-reviews-title">Ainda não há avaliações para este livro.</p>
              <p className="no-reviews-text">Seja o primeiro a avaliar!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}