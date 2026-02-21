const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authenticate = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/adminMiddleware');

// Limite só para avaliações
const avaliacaoLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10, // 10 avaliações por IP
    message: { erro: 'Muitas avaliações enviadas. Tente novamente mais tarde.' }
  });
  

// Rotas públicas
router.get('/', bookController.listAll);
router.get('/:id', bookController.getById);
router.post('/:id/avaliacoes', avaliacaoLimiter, bookController.addAvaliacao);

// Rotas protegidas - apenas usuários autenticados podem criar/editar/remover
// Apenas admin pode criar/editar/remover livros
router.post('/', authenticate, requireAdmin, bookController.create);
router.put('/:id', authenticate, requireAdmin, bookController.update);
router.delete('/:id', authenticate, requireAdmin, bookController.remove);

module.exports = router;
