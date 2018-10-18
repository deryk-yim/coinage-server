const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');

const Profile = mongoose.model('Profile');
const { promisify } = require('es6-promisify');


exports.login = (req, res) => {
    try {
        passport.authenticate('local')(req, res, () => {
            req.session.save((error) => {
                if (error) {
                    return res.status(400).send({ 'error': error });
                }
            return res.status(200).json(req.user);
            });
        });
    }
    catch (ex){
        return res.status(400).send({ 'error': ex.message });
    }
};

exports.register = async (req, res, next) => {
    Profile.register(new Profile({ email: req.body.email }),
        req.body.password, (err, profile) => {
            if (err){
                res.status(400).send({ 'error': err});
                return;
            }
            passport.authenticate('local')(req, res, () => {
                req.session.save((error) => {
                    if (error) {
                        return next(error);
                    }
                    return res.status(201).json(req.user);
                });
            });
        });
}

exports.logout = (req, res) => {
    req.logout();
    res.sendStatus(200);
}

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        next();
        return;
    };
    res.sendStatus(401);
}

// STILL NEED WORK
exports.forgot = async (req, res) => {
    const profile = await Profile.findOne({
        email: req.body.email
    });
    if (!profile) {
        return res.status(400).json({
        'error': {
            'name': 'UserDoesntExist',
            'message': 'The User does not exist.'
        }});
    }

    profile.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    profile.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await profile.save();

    /*
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
        user,
        filename: 'password-reset',
        subject: 'Password Reset',
        resetURL
    });

    */
    //req.flash('success', 'Password Reset Link Sent!');
    res.sendStatus(200);

}

// still need work
exports.reset = async (req, res) => {
    const profile = await Profile.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if(!profile){
        return res.status(400).json({
        'error': {
            'name': 'UserDoesNotExist',
            'message': 'The User does not exist.'
        }});
    }

    return res.sendStatus(200);
}

exports.confirmedPassword = (req, res, next) => {
    if(req.body.password === req.body['password-confirm']){
        next();
    }

    return res.status(400).json({
        'error': {
            'name': 'PasswordDoesNotMatch',
            'message': 'The passwords given does not match'
    }});
}

exports.update = async (req, res) => {
    const profile = await Profile.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!profile) {
        return res.status(400).json({
        'error': {
            'name': 'UserDoesNotExist',
            'message': 'The User does not exist.'
        }});
    }

    const setPassword = promisify(profile.setPassword, profile);
    await setPassword(req.body.password);
    profile.resetPasswordExpires = undefined;
    profile.resetPasswordToken = undefined;
    const updatedProfile = await profile.save();
    await req.login(updatedProfile);
    res.status(200).json(req.user);
}

exports.validateRegister = (req, res, next) => {
    req.checkBody('email', 'Email is not valid').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        gmail_remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'Confirmed password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'Password do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors){
        res.status(400).send({ 'error': errors});
        return;
    }
    next();
}