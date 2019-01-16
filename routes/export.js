const express = require('express');
const controller = require('../controllers/exportController');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

router.post('/:pid', controller.getExports);
router.post('/create/1/:pid', controller.createExport);
router.post('/download/:pid', controller.exportCSVfile);

module.exports = router;