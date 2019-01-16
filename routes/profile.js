const express = require('express');
const controller = require('../controllers/profileController');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *  Profile:
 *   type: object
 *   required:
 *    email
 *   properties:
 *    _id:
 *     type: string
 *    createdDate:
 *     type: string
 *     format: date
 *    modifiedDate:
 *     type: string
 *     format: date
 *    lastLoggedIn:
 *     type: string
 *    email:
 *     type: string
 *    resetPasswordToken:
 *     type: string
 *    resetPasswordExpires:
 *     type: string
 *     format: date
 *    budgets:
 *     type: array
 *     items:
 *      $ref: "#/definitions/Budget"
 *    bills:
 *     type: array
 *     items:
 *      $ref: "#/definitions/Bill"
 *    categories:
 *     type: array
 *     items:
 *      $ref: "#/definitions/Category"
 *    transactions:
 *     type: array
 *     items:
 *      $ref: "#/definitions/Transaction"
 */

/**
 * @swagger
 * /api/profile/login:
 *   post:
 *     tags:
 *       - Profile
 *     description: Login to account
 *     parameters:
 *     - in: body
 *       name: body
 *       description: credential for logging in
 *       required: true
 *       schema:
 *        type: object
 *        properties:
 *         email:
 *          type: string
 *         password:
 *          type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *         schema:
 *           $ref: "#/definitions/Profile"
 *       401:
 *          description: Unauthorized
 */
router.post('/login', controller.login);


/**
 * @swagger
 * /api/profile/register:
 *   post:
 *     tags:
 *       - Profile
 *     description: Register account
 *     parameters:
 *      - in: body
 *        name: body
 *        description: account details
 *        required: true
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *           type: string
 *          password:
 *           type: string
 *          password-confirm:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Successful Operation
 *         schema:
 *           $ref: '#/definitions/Profile'
 *       400:
 *          description: Bad Request
 */
router.post('/register', 
  controller.validateRegister, 
  controller.register 
);

/**
 * @swagger
 * /api/profile/logout:
 *   post:
 *     tags:
 *       - Profile
 *     description: Logout account
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.post('/logout', controller.logout);

/**
 * @swagger
 * /api/profile/resets/{token}:
 *   get:
 *     tags:
 *       - Profile
 *     description: Get reset (Need more work)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.get('/reset/:token', controller.reset);

/**
 * @swagger
 * /api/profile/resets/{token}:
 *   post:
 *     tags:
 *       - Profile
 *     description: Reset password (Need more work)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.post('/reset/:token', 
  controller.confirmedPassword, 
  controller.update
);

/**
 * @swagger
 * /api/profile/forgot:
 *   post:
 *     tags:
 *       - Profile
 *     description: Forgot password (Need more work)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.post('/forgot', controller.forgot);

/**
 * @swagger
 * /api/profile/update:
 *   post:
 *     tags:
 *       - Profile
 *     description: Update Profile (Need Work)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful Operation
 *       400:
 *          description: Bad Request
 */
router.post('/update');


module.exports = router;
