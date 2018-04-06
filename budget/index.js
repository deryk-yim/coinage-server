const express = require('express');
const controller = require('./budget');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index', {title: 'Express'});
});

router.post('/', catchErrors(controller.createBudget));
router.post('/update/:id', catchErrors(controller.updateBudget));
module.exports = router;