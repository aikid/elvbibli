const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    lowercase: true,
    trim: true,
    index: true,
  },
  code: {
    type: String,
    required: [true, 'Código é obrigatório'],
    length: [6, 'Código deve ter 6 dígitos'],
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // TTL index para remoção automática
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'VerificationCode',
});

// Índice composto para busca rápida por email e código
verificationCodeSchema.index({ email: 1, code: 1 });

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

module.exports = VerificationCode;
