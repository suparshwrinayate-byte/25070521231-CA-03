const express = require('express');
const controller = require('../controllers/medicineController');
const router = express.Router();

router.get('/stats', controller.getStats);
router.route('/').get(controller.getMedicines).post(controller.createMedicine);
router.route('/:id').put(controller.updateMedicine).delete(controller.deleteMedicine);
module.exports = router;
