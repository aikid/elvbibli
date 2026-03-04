const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');

// Limite para criação de empréstimos
const emprestimoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // 50 empréstimos por IP por hora
  message: { erro: 'Muitas requisições. Tente novamente mais tarde.' }
});

router.get('/', emprestimoController.listAll);
router.get('/:id', emprestimoController.getById);
router.post('/', emprestimoLimiter, emprestimoController.create);
router.put('/:id/devolver', emprestimoController.devolver);
router.get('/livro/:livroId', emprestimoController.getByLivroId);
router.delete('/:id', emprestimoController.remove);

module.exports = router;
