const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  listIrrigations,
  getIrrigationById,
  createIrrigation,
  deleteIrrigation,
  updateIrrigation,
} = require('../controllers/irrigationController');

const router = express.Router();


router.use(authMiddleware);
router.get('/', listIrrigations);
router.get('/:id', getIrrigationById);
router.post('/', createIrrigation);
router.delete('/:id', deleteIrrigation);
router.put('/:id', updateIrrigation);

module.exports = router;
