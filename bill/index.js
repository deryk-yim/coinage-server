const express = require('express');
const controller = require('./bill');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

router.post('/:pid', controller.getBills);
router.post('/:pid/:id', controller.getBillById);
router.post('/create/1/:pid', controller.createBill);
router.post('/create/2/:pid', controller.createBills);
router.delete('/delete/1/:pid/:id', controller.deleteProfileBill, controller.deleteBillById);
router.put('/update/1/:pid/:id', controller.updateBillById);

module.exports = router;