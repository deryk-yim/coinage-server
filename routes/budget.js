const express = require('express');
const controller = require('../controllers/budgetController');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Budget:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *     createdDate:
 *      type: string
 *      format: date
 *     modifiedDate:
 *      type: string
 *      format: date
 *     description:
 *      type: string
 *     budgetAmount:
 *      type: integer
 *      format: int64
 *     actualAmount:
 *      type: integer
 *      format: int64
 *     thresholdLevel:
 *      type: integer
 *      format: int64
 */


// router.post('/', controller.createBudget);

/**
 * @swagger
 * /api/budget:
 *   post:
 *     tags:
 *       - Budget
 *     description: Add budget
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.post('/', controller.createBudgets);

/**
 * @swagger
 * /api/budget/update/{budgetId}:
 *   post:
 *     tags:
 *       - Budget
 *     description: Update budget by Id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.post('/update/:id', controller.updateBudget);

/**
 * @swagger
 * /api/budget:
 *   delete:
 *     tags:
 *       - Budget
 *     description: Delete budget (This should delete by Id)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.delete('/', controller.deleteBudget);

module.exports = router;