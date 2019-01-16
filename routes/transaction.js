const express = require('express');
const controller = require('../controllers/transactionController');
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
 *    location:
 *      type: object
 *    category:
 *     type: object
 *     $ref: "#/definitions/Category"
 *    bill:
 *     type: object
 *     $ref: "#/definitions/Bill"
 *    isBill:
 *      type: boolean
 *    isImport:
 *      type: boolean
 *    isIncome:
 *      type: boolean
 *    isLifeExpense:
 *      type: boolean
 */

router.get('/page/:page', controller.getTransactionsPerPage);
router.get('/count/', controller.getCountTransactions);
router.get('/record/', controller.getTransactionById);
router.get('/bill/:bid', controller.getTransactionsByBillId);
router.post('/create/1/', controller.createTransaction);
router.post('/create/2/', controller.createTransactions);
//router.delete('/delete/1/', controller.deleteTransactionById);
//router.delete('/delete/2', controller.deleteTransactions);
router.put('/update/:id', controller.updateTransactionById);

module.exports = router;