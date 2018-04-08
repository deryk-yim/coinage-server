const express = require('express');
const controller = require('./budget');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

// router.post('/', controller.createBudget);
router.post('/', controller.createBudgets);
router.post('/update/:id', controller.updateBudget);
router.delete('/', controller.deleteBudget);
module.exports = router;