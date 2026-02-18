const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: [true, 'Usuário é obrigatório'],
    trim: true,
  },
  nota: {
    type: Number,
    required: [true, 'Nota é obrigatória'],
    min: [1, 'Nota deve ser entre 1 e 5'],
    max: [5, 'Nota deve ser entre 1 e 5'],
  },
  comentario: {
    type: String,
    required: [true, 'Comentário é obrigatório'],
    trim: true,
  },
  data: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
}, { _id: true });

module.exports = avaliacaoSchema;
