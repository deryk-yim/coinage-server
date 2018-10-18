const express = require('express');
const controller = require('../transaction/transactionController');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *  Transaction:
 *   type: object
 *   properties:
 *    _id:
 *     type: string
 *    _pid:
 *     type: string
 *    createdDate:
 *     type: string
 *     format: date
 *    modifiedDate:
 *     type: string
 *     format: date
 *    transactionDate:
 *     type: string
 *     format: date
 *    description:
 *     type: string
 *    amount:
 *     type: integer
 *     format: int64
 *    category:
 *     type: object
 *     $ref: "#/definitions/Category"
 *    bill:
 *     type: object
 *     $ref: "#/definitions/Bill"
 */


router.post('/:pid/:page', controller.getTransactions);
router.post('/count/1/:pid', controller.getCountTransactions);
router.post('/:pid/:id', controller.getTransactionById);
router.post('/bill/:pid/:bid', controller.getTransactionsByBillId);
router.post('/create/1/:pid', controller.createTransaction, controller.addTransactionToBill);
router.post('/create/2/:pid', controller.createTransactions);
router.delete('/delete/:pid/:id', controller.deleteProfileTransaction, controller.deleteTransactionById);
router.put('/update/:pid/:id', controller.updateTransactionById, controller.addTransactionToBill, controller.deleteTransactionFromBill);

module.exports = router;