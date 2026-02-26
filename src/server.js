require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

// Precisa definir JWT_SECRET no .env
if (!process.env.JWT_SECRET) {
  console.error('A variável JWT_SECRET não foi definida no arquivo .env, recomendo criar um arquivo .env e usar as variáveis do .env.exemple');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});
