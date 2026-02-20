const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Limite só para avaliações
const avaliacaoLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10, // 10 avaliações por IP
    message: { erro: 'Muitas avaliações enviadas. Tente novamente mais tarde.' }
  });
  

router.get('/', bookController.listAll);
router.get('/:id', bookController.getById);
router.post('/', bookController.create);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.remove);
router.post('/:id/avaliacoes', avaliacaoLimiter, bookController.addAvaliacao);

module.exports = router;
