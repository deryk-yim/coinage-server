const express = require('express');
const controller = require('./category');

const router = express.Router();

router.get('/:pid', controller.getCategories);
router.post('/1/:pid', controller.createCategory);
router.post('/2/:pid', controller.createCategories);
router.post('/update/:id', controller.updateCategory);
router.delete('/:id', controller.checkDefault, controller.deleteCategory, controller.deleteProfileCategory);

module.exports = router;