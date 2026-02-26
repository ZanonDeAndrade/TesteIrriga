const { v4: uuidv4 } = require('uuid');
const { pivots, irrigations } = require('../data/database');

// Validação dos campos da irrigação.
function validarDadosIrrigacao(body) {
  const { pivotId, applicationAmount, irrigationDate } = body;

  if (typeof pivotId !== 'string' || pivotId.trim() === '') {
    return 'O campo pivotId é obrigatório.';
  }

  const laminaAplicada = Number(applicationAmount);
  if (
    applicationAmount === undefined ||
    applicationAmount === null ||
    Number.isNaN(laminaAplicada)
  ) {
    return 'O campo applicationAmount é obrigatório e deve ser numérico.';
  }

  if (typeof irrigationDate !== 'string' || irrigationDate.trim() === '') {
    return 'O campo irrigationDate é obrigatório.';
  }

  const data = new Date(irrigationDate);
  if (Number.isNaN(data.getTime())) {
    return 'O campo irrigationDate deve estar em formato ISO válido.';
  }

  return null;
}

// Lista todas as irrigações do usuário 
function listIrrigations(req, res) {
  const irrigacoesDoUsuario = irrigations.filter(
    (irrigation) => irrigation.userId === req.user.id
  );
  return res.status(200).json(irrigacoesDoUsuario);
}

// Busca uma irrigação cadastrada por um usuário específico 
function getIrrigationById(req, res) {
  const irrigation = irrigations.find(
    (item) => item.id === req.params.id && item.userId === req.user.id
  );

  if (!irrigation) {
    return res.status(404).json({ message: 'Irrigação não encontrada.' });
  }

  return res.status(200).json(irrigation);
}

// Cria uma nova irrigação do usuário
function createIrrigation(req, res) {
  const erroValidacao = validarDadosIrrigacao(req.body);
  if (erroValidacao) {
    return res.status(400).json({ message: erroValidacao });
  }

  const pivotDoUsuario = pivots.find(
    (pivot) =>
      pivot.id === req.body.pivotId.trim() && pivot.userId === req.user.id
  );

  if (!pivotDoUsuario) {
    return res.status(400).json({
      message: 'O pivotId informado não pertence ao usuário autenticado.',
    });
  }

  const novaIrrigacao = {
    id: uuidv4(),
    pivotId: req.body.pivotId.trim(),
    applicationAmount: Number(req.body.applicationAmount),
    irrigationDate: new Date(req.body.irrigationDate).toISOString(),
    userId: req.user.id,
  };

  irrigations.push(novaIrrigacao);

  return res.status(201).json({
    message: 'Irrigação criada com sucesso.',
    irrigation: novaIrrigacao,
  });
}


// Atualiza os dados da irrigação
function updateIrrigation (req, res){
  const indexIrrigacao = irrigations.findIndex(
    (item) => item.id === req.params.id && item.userId === req.user.id
  );

  if (indexIrrigacao === -1){
    return res.status(404).json({ message: "Irrigação não encontrada"});
  }

  const erroValidacao = validarDadosIrrigacao(req.body);
  if (erroValidacao){
    return res.status(400).json({ message: erroValidacao });
  }

  irrigations[indexIrrigacao]= {
    ...irrigations[indexIrrigacao],
    applicationAmount: Number(req.body.applicationAmount),
    irrigationDate: new Date(req.body.irrigationDate).toISOString(),
  };

  return res.status(200).json({
    message: 'Irrigação atualizada com sucesso',
    irrigation: irrigations[indexIrrigacao],
  })

}

// Remove uma irrigação 
function deleteIrrigation(req, res) {
  const indexIrrigacao = irrigations.findIndex(
    (item) => item.id === req.params.id && item.userId === req.user.id
  );

  if (indexIrrigacao === -1) {
    return res.status(404).json({ message: 'Irrigação não encontrada.' });
  }

  irrigations.splice(indexIrrigacao, 1);
  return res.status(200).json({ message: 'Irrigação removida com sucesso.' });
}

module.exports = {
  listIrrigations,
  getIrrigationById,
  createIrrigation,
  deleteIrrigation,
  updateIrrigation,
};
