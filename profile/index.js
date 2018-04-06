const express = require('express');
const controller = require('./profile');
const {catchErrors} = require('../middleware/errorHandlers');
const passport = require('passport');

const router = express.Router();


router.get('/', (req, res, next) => {
    res.sendStatus(200);
});

router.post('/login', controller.login);

router.post('/register', 
    controller.validateRegister, 
    controller.register 
);


router.post('/logout', controller.logout);

router.get('/reset/:token', controller.reset);
router.post('/reset/:token', 
    controller.confirmedPassword, 
    controller.update
);

router.post('/forgot', controller.forgot);
router.post('/update');


module.exports = router;
