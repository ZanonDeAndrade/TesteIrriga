const jwt = require('jsonwebtoken');

// Middleware que valida o token JWT enviado no header Authorization.
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não informado.' });
  }

  const partes = authHeader.split(' ');

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token inválido.' });
  }

  const token = partes[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = payload.id;
    req.user = {
      id: payload.id,
      username: payload.username,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = authMiddleware;
