const express = require('express');
const controller = require('./transaction');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

router.post('/:pid/:page', controller.getTransactions);
router.post('/count/1/:pid', controller.getCountTransactions);
router.post('/:pid/:id', controller.getTransactionById);
router.post('/bill/:pid/:bid', controller.getTransactionsByBillId);
router.post('/create/1/:pid', controller.createTransaction, controller.addTransactionToBill);
router.post('/create/2/:pid', controller.createTransactions);
router.delete('/delete/:pid/:id', controller.deleteTransactionById);
router.post('/delete/bulk/:pid', controller.deleteTransactionsMany);
router.put('/update/:pid/:id', controller.updateTransactionById);

module.exports = router;