/**
 * Middleware de autorização
 * Verifica se o usuário autenticado tem role 'admin'
 * Deve ser usado APÓS o authMiddleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ erro: 'Autenticação necessária' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
  }

  next();
};

module.exports = requireAdmin;
