const express = require('express');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');
const authenticate = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/adminMiddleware');

// Upload em memória — aceita apenas imagens até 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são aceitas'));
    }
  },
});

// Limite para criação de empréstimos
const emprestimoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // 50 empréstimos por IP por hora
  message: { erro: 'Muitas requisições. Tente novamente mais tarde.' }
});

// Limite para envio de emails
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 notificações por IP a cada 15 minutos
  message: { erro: 'Muitas tentativas de envio. Aguarde alguns minutos.' }
});

router.get('/', emprestimoController.listAll);
router.get('/atrasados', authenticate, requireAdmin, emprestimoController.getAtrasados);
router.post('/notificar-atrasados', authenticate, requireAdmin, emailLimiter, emprestimoController.sendNotificacoes);
router.post('/foto', emprestimoLimiter, upload.single('foto'), emprestimoController.createFromFoto);
router.get('/:id', emprestimoController.getById);
router.post('/', emprestimoLimiter, emprestimoController.create);
router.put('/:id/devolver', emprestimoController.devolver);
router.get('/livro/:livroId', emprestimoController.getByLivroId);
router.delete('/:id', emprestimoController.remove);

module.exports = router;
