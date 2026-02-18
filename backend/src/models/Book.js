const mongoose = require('mongoose');
const avaliacaoSchema = require('./Avaliacao');

const bookSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
  },
  autor: {
    type: String,
    required: [true, 'Autor é obrigatório'],
    trim: true,
  },
  capa: {
    type: String,
    trim: true,
    default: '',
  },
  descricao: {
    type: String,
    trim: true,
    default: '',
  },
  ano: {
    type: Number,
    min: [0, 'Ano não pode ser negativo'],
  },
  genero: {
    type: String,
    trim: true,
    default: '',
  },
  avaliacoes: {
    type: [avaliacaoSchema],
    default: [],
  },
  mediaAvaliacoes: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  quantidade: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: [0, 'Quantidade não pode ser negativa'],
    default: 0,
  },
}, {
  timestamps: true,
  collection: 'Book',
  toJSON: { virtuals: false },
  toObject: { virtuals: false },
});

// Recalcula a média das avaliações antes de salvar
bookSchema.pre('save', function (next) {
  if (this.avaliacoes && this.avaliacoes.length > 0) {
    const soma = this.avaliacoes.reduce((acc, av) => acc + av.nota, 0);
    this.mediaAvaliacoes = Math.round((soma / this.avaliacoes.length) * 10) / 10;
  } else {
    this.mediaAvaliacoes = 0;
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
