// Middleware para tratar erros inesperados.
function errorMiddleware(error, req, res, next) {
  console.error('Erro capturado pelo middleware global:', error.message);

  const statusCode = error.status || 500;
  const message = error.message || 'Erro interno do servidor.';

  return res.status(statusCode).json({ message });
}

module.exports = errorMiddleware;
