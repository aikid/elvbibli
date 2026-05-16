const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e adiciona o usuário ao req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ erro: 'Token de autenticação não fornecido' });
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    // Verificar e decodificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'seu-secret-key-mude-em-producao'
    );

    // Buscar usuário no banco para garantir que ainda existe
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    // Adicionar informações do usuário ao request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ erro: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ erro: 'Token expirado' });
    }
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ erro: 'Erro ao processar autenticação' });
  }
};

module.exports = authenticate;
