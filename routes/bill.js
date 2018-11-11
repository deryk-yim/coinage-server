const express = require('express');
const controller = require('../bill/billController');
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
 *       isBiweekly:
 *          type: boolean
 *       category:
 *          type: object
 *          $ref: "#/definitions/Category"
 *       transactions:
 *          type: array
 *          $ref: "#/definitions/Transaction"
 *       isIncome:
 *          type: boolean
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
 *     description: Get Bill
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
 *     description: Post Bill
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.post('/', controller.createBill);

/**
 * @swagger
 * /api/bill/delete/{personId}/{billId}:
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
router.delete('/delete/:pid/:id', controller.deleteProfileBill, controller.deleteBillById);

/**
 * @swagger
 * /api/bill/update/{personId}/{billId}:
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