const { v4: uuidv4 } = require('uuid');
const { pivots, irrigations } = require('../data/database');

// Faz validações dos campos do pivô.
function validarDadosPivot(body) {
  const { description, flowRate, minApplicationDepth } = body;

  if (typeof description !== 'string' || description.trim() === '') {
    return 'O campo description é obrigatório.';
  }

  const vazao = Number(flowRate);
  if (flowRate === undefined || flowRate === null || Number.isNaN(vazao)) {
    return 'O campo flowRate é obrigatório e deve ser numérico.';
  }

  const laminacaoMinima = Number(minApplicationDepth);
  if (
    minApplicationDepth === undefined ||
    minApplicationDepth === null ||
    Number.isNaN(laminacaoMinima)
  ) {
    return 'O campo minApplicationDepth é obrigatório e deve ser numérico.';
  }

  return null;
}

// Lista todos os pivôs cadastrados
function listPivots(req, res) {
  const pivotsDoUsuario = pivots.filter((pivot) => pivot.userId === req.user.id);
  return res.status(200).json(pivotsDoUsuario);
}

// Busca um pivô de um usuário específico
function getPivotById(req, res) {
  const pivot = pivots.find(
    (item) => item.id === req.params.id && item.userId === req.user.id
  );

  if (!pivot) {
    return res.status(404).json({ message: 'Pivô não encontrado.' });
  }

  return res.status(200).json(pivot);
}

// Cria um novo pivô 
function createPivot(req, res) {
  const erroValidacao = validarDadosPivot(req.body);
  if (erroValidacao) {
    return res.status(400).json({ message: erroValidacao });
  }

  const novoPivot = {
    id: uuidv4(),
    description: req.body.description.trim(),
    flowRate: Number(req.body.flowRate),
    minApplicationDepth: Number(req.body.minApplicationDepth),
    userId: req.user.id,
  };

  pivots.push(novoPivot);

  return res.status(201).json({
    message: 'Pivô criado com sucesso.',
    pivot: novoPivot,
  });
}

// Atualiza os dados de um pivô 
function updatePivot(req, res) {
  const indexPivot = pivots.findIndex(
    (item) => item.id === req.params.id && item.userId === req.user.id
  );

  if (indexPivot === -1) {
    return res.status(404).json({ message: 'Pivô não encontrado.' });
  }

  const erroValidacao = validarDadosPivot(req.body);
  if (erroValidacao) {
    return res.status(400).json({ message: erroValidacao });
  }

  pivots[indexPivot] = {
    ...pivots[indexPivot],
    description: req.body.description.trim(),
    flowRate: Number(req.body.flowRate),
    minApplicationDepth: Number(req.body.minApplicationDepth),
  };

  return res.status(200).json({
    message: 'Pivô atualizado com sucesso.',
    pivot: pivots[indexPivot],
  });
}

// Exclui um pivô 
function deletePivot(req, res) {
  const indexPivot = pivots.findIndex(
    (item) => item.id === req.params.id && item.userId === req.user.id
  );

  if (indexPivot === -1) {
    return res.status(404).json({ message: 'Pivô não encontrado.' });
  }

  const pivotRemovido = pivots[indexPivot];
  pivots.splice(indexPivot, 1);

  // Também remove irrigações ligadas ao pivô para manter os dados coerentes.
  for (let i = irrigations.length - 1; i >= 0; i -= 1) {
    if (
      irrigations[i].pivotId === pivotRemovido.id &&
      irrigations[i].userId === req.user.id
    ) {
      irrigations.splice(i, 1);
    }
  }

  return res.status(200).json({ message: 'Pivô removido com sucesso.' });
}

module.exports = {
  listPivots,
  getPivotById,
  createPivot,
  updatePivot,
  deletePivot,
};
