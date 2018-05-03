const express = require('express');
const controller = require('./transaction');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

router.post('/:pid', controller.getTransactions);
router.post('/:pid/:id', controller.getTransactionById);
router.post('/bill/:pid/:bid', controller.getTransactionsByBillId);
router.post('/create/1/:pid', controller.createTransaction, controller.addTransactionToBill);
router.post('/2/:pid', controller.createTransactions);
router.delete('/delete/:pid/:id', controller.deleteTransactionFromBill, controller.deleteProfileTransaction, controller.deleteTransactionById);
router.put('/update/:pid/:id', controller.updateTransactionById, controller.addTransactionToBill);

module.exports = router;