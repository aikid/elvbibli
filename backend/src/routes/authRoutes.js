const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');

// Rate limit para solicitação de código: 5 tentativas por IP a cada 15 minutos
const requestCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: { erro: 'Muitas solicitações. Tente novamente mais tarde.' },
});

// Rate limit para verificação de código: 10 tentativas por IP a cada 15 minutos
const verifyCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { erro: 'Muitas tentativas de verificação. Tente novamente mais tarde.' },
});

router.post('/request-code', requestCodeLimiter, authController.requestCode);
router.post('/verify-code', verifyCodeLimiter, authController.verifyCode);

module.exports = router;
