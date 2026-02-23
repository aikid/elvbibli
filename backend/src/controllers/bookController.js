const Book = require('../models/Book');
const sanitizeHtml = require('sanitize-html');

/**
 * GET /books - Lista todos os livros
 */
const listAll = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao listar livros', mensagem: error.message });
  }
};

/**
 * GET /books/:id - Busca livro por id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    return res.status(200).json(book);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    return res.status(500).json({ erro: 'Erro ao buscar livro', mensagem: error.message });
  }
};

/**
 * POST /books - Cria novo livro
 */
const create = async (req, res) => {
  try {
    const { titulo, autor, capa, descricao, ano, genero, quantidade } = req.body;

    if (!titulo || !autor || !capa) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: titulo, autor, capa',
      });
    }

    const payload = {
      titulo,
      autor,
      capa,
      descricao: descricao ?? '',
      ano: ano ?? undefined,
      genero: genero ?? '',
      quantidade: quantidade ?? 0,
    };

    if (payload.quantidade < 0) {
      return res.status(400).json({ erro: 'Quantidade não pode ser negativa' });
    }

    const book = await Book.create(payload);
    return res.status(201).json(book);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ erro: 'Validação falhou', mensagens });
    }
    return res.status(500).json({ erro: 'Erro ao criar livro', mensagem: error.message });
  }
};

/**
 * PUT /books/:id - Atualiza livro
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, capa, descricao, ano, genero, quantidade } = req.body;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    if (quantidade !== undefined && quantidade < 0) {
      return res.status(400).json({ erro: 'Quantidade não pode ser negativa' });
    }

    if (titulo !== undefined) book.titulo = titulo;
    if (autor !== undefined) book.autor = autor;
    if (capa !== undefined) book.capa = capa;
    if (descricao !== undefined) book.descricao = descricao;
    if (ano !== undefined) book.ano = ano;
    if (genero !== undefined) book.genero = genero;
    if (quantidade !== undefined) book.quantidade = quantidade;

    await book.save();
    return res.status(200).json(book);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ erro: 'Validação falhou', mensagens });
    }
    return res.status(500).json({ erro: 'Erro ao atualizar livro', mensagem: error.message });
  }
};

/**
 * DELETE /books/:id - Remove livro
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    return res.status(200).json({ mensagem: 'Livro removido com sucesso' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    return res.status(500).json({ erro: 'Erro ao remover livro', mensagem: error.message });
  }
};

/**
 * POST /books/:id/avaliacoes - Adiciona avaliação e recalcula média
 */
const addAvaliacao = async (req, res) => {
  try {
    
    // 🤖 Proteção contra bots
    if (req.body.website) {
      return res.status(400).json({ erro: "Bot detectado" });
    }

    const { id } = req.params;
    const { usuario, nota, comentario, data } = req.body;

    if (!usuario || nota === undefined || !comentario) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: usuario, nota, comentario',
      });
    }

    const notaNum = Number(nota);
    if (isNaN(notaNum) || notaNum < 1 || notaNum > 5) {
      return res.status(400).json({ erro: 'Nota deve ser um número entre 1 e 5' });
    }

    // 🚫 Bloquear links
    if (/http|www\./i.test(comentario)) {
      return res.status(400).json({ erro: 'Links não são permitidos nas avaliações.' });
    }

    // 📏 Limitar tamanho
    if (comentario.length > 500) {
      return res.status(400).json({ erro: 'Comentário muito longo (máx 500 caracteres).' });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    // 🧼 Sanitização contra XSS
    const comentarioSeguro = sanitizeHtml(comentario.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    });

    const usuarioSeguro = sanitizeHtml(usuario.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    });

    // 🌍 Capturar IP corretamente no Render
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const novaAvaliacao = {
      usuario: usuario.trim(),
      nota: notaNum,
      comentario: comentario.trim(),
      data: data || new Date().toISOString().split('T')[0],
    };

    book.avaliacoes.push(novaAvaliacao);
    await book.save(); // o pre('save') recalcula mediaAvaliacoes

    return res.status(201).json(book);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ erro: 'Validação falhou', mensagens });
    }
    return res.status(500).json({ erro: 'Erro ao adicionar avaliação', mensagem: error.message });
  }
};

module.exports = {
  listAll,
  getById,
  create,
  update,
  remove,
  addAvaliacao,
};
