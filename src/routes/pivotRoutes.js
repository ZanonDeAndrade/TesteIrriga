const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  listPivots,
  getPivotById,
  createPivot,
  updatePivot,
  deletePivot,
} = require('../controllers/pivotController');

const router = express.Router();


router.use(authMiddleware);
router.get('/', listPivots);
router.get('/:id', getPivotById);
router.post('/', createPivot);
router.put('/:id', updatePivot);
router.delete('/:id', deletePivot);

module.exports = router;
