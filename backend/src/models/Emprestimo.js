const mongoose = require('mongoose');

const emprestimoSchema = new mongoose.Schema({
  livro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Livro é obrigatório'],
  },
  pessoa: {
    type: String,
    required: [true, 'Nome da pessoa é obrigatório'],
    trim: true,
  },
  dataPegou: {
    type: Date,
    default: Date.now,
  },
  dataDevolucao: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['ativo', 'devolvido'],
    default: 'ativo',
  },
}, {
  timestamps: true,
  collection: 'Emprestimo',
});

const Emprestimo = mongoose.model('Emprestimo', emprestimoSchema);

module.exports = Emprestimo;
