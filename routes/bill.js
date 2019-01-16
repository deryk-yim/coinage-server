const express = require('express');
const controller = require('../controllers/billController');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Bill:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       _pid:
 *         type: string
 *       createdDate:
 *         type: string
 *         format: date
 *       modifiedDate:
 *         type: string
 *         format: date
 *       description:
 *          type: string
 *       defaultAmount:
 *          type: number
 *       frequency:
 *          type: string
 *       category:
 *          type: object
 *          $ref: "#/definitions/Category"
 *       transactions:
 *          type: array
 *          $ref: "#/definitions/Transaction"
 *       recurringDate:
 *          type: string
 *          format: date
 */


/**
 * @swagger
 * /api/bill/:
 *   get:
 *     tags:
 *       - Bill
 *     description: Get Bills by Profile Id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.get('/', controller.getBills);

/**
 * @swagger
 * /api/bill/{billId}:
 *   get:
 *     tags:
 *       - Bill
 *     description: Get Bill by ID
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Bill Id
 *         required: true
 *         schema:
 *          type: string
 *          properties:
 *            billId: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.get('/:id', controller.getBillById);

/**
 * @swagger
 * /api/bill/:
 *   post:
 *     tags:
 *       - Bill
 *     description: Will create bill if it does not exist, else update
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.post('/', controller.createAndUpdateBill);

/**
 * @swagger
 * /api/bill/{id}/transactions:
 *   post:
 *     tags:
 *       - Bill
 *     description: Generate Transactions for a Bill
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.post('/:id/transactions', controller.generateBillTransactions);

/**
 * @swagger
 * /api/bill/delete/{billId}:
 *   delete:
 *     tags:
 *       - Bill
 *     description: Delete Bill by Id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.delete('/delete/:id', controller.deleteProfileBill, controller.deleteBillById);

/**
 * @swagger
 * /api/bill/update/{billId}:
 *   put:
 *     tags:
 *       - Bill
 *     description: Update Bill by ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.put('/update/:id', controller.updateBillById);

module.exports = router;