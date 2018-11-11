const express = require('express');
const controller = require('../category/categoryController');

const router = express.Router();
/**
 * @swagger
 * definitions:
 *  Category:
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
 *    name:
 *     type: string
 *    isIncome:
 *     type: boolean
 *    default:
 *     type: boolean
 *    isVisible:
 *     type: boolean
 */

 /**
  * @swagger
  * /api/category/:
  *   get:
  *     tags:
  *       - Category
  *     description: Get Categories
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Successful Operation
  *       400:
  *          description: Bad Request
  */
router.get('/', controller.getCategories);

/**
 * @swagger
 * /api/category/1/:
 *   post:
 *     tags:
 *       - Category
 *     description: Post Category (NOT IN USE)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
//router.post('/1/', controller.createCategory);

/**
 * @swagger
 * /api/category/:
 *   post:
 *     tags:
 *       - Category
 *     description: Post Categories (NOT IN USE)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
//router.post('/2/', controller.createCategories);

/**
 * @swagger
 * /api/category/update/{categoryId}:
 *   post:
 *     tags:
 *       - Category
 *     description: update Categories (NOT IN USE)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
//router.post('/update/:id', controller.updateCategory);

/**
 * @swagger
 * /api/category/{categoryId}:
 *   delete:
 *     tags:
 *       - Category
 *     description: Delete Category (NOT IN USE)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
//router.delete('/:id', controller.checkDefault, controller.deleteCategory, controller.deleteProfileCategory);

module.exports = router;