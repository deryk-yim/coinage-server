const express = require('express');
const controller = require('./import');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

router.post('/:pid', controller.getImports);
router.post('/create/1/:pid', controller.createImport);

module.exports = router;