const express = require('express');
const controller = require('./profile');
const {catchErrors} = require('../middleware/errorHandlers');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index', {title: 'Express'});
});

router.post('/register', controller.validateRegister, controller.register, controller.login);

router.post('/login', catchErrors(controller.login));
router.post('/logout', controller.logout);

router.get('/reset/:token', catchErrors(controller.reset));
router.post('/reset/:token', controller.confirmedPassword, catchErrors(controller.update));

router.post('forgot', catchErrors(controller.forgot));
router.post('/update');


module.exports = router;
