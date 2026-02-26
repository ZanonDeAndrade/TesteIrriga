const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { users } = require('../data/database');

// Cadastra um novo usuário com senha criptografada.
async function register(req, res, next) {
  try {
    const { username, password } = req.body;

    if (typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({ message: 'O campo username é obrigatório.' });
    }

    if (typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ message: 'O campo password é obrigatório.' });
    }

    const usernameLimpo = username.trim();
    const usuarioExistente = users.find((user) => user.username === usernameLimpo);

    if (usuarioExistente) {
      return res.status(400).json({ message: 'Já existe um usuário com esse username.' });
    }

    const senhaHash = await bcrypt.hash(password, 10);

    const novoUsuario = {
      id: uuidv4(),
      username: usernameLimpo,
      password: senhaHash,
    };

    users.push(novoUsuario);

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      user: {
        id: novoUsuario.id,
        username: novoUsuario.username,
      },
    });
  } catch (error) {
    return next(error);
  }
}

// Realiza login e retorna um JWT com validade de 1 hora.
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({ message: 'O campo username é obrigatório.' });
    }

    if (typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ message: 'O campo password é obrigatório.' });
    }

    const usuario = users.find((user) => user.username === username.trim());

    if (!usuario) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);

    if (!senhaValida) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        username: usuario.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      token,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
};
