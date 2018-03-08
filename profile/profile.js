const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');

const Profile = mongoose.model('Profile');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureMesssage: 'Login Failed',
    sucessRedirect: '/',
    successMessage: 'Login Successful'
});

exports.register = async(req, res, next) => {
    const profile = new Profile({ email: req.body.email });
    const register = promisify(Profile.register, Profile);
    await register(profile, req.body.password);
    next();
}

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        next();
        return;
    };
    req.redirect('/')    
}

exports.forgot = async (req, res) => {
    const profile = await Profile.findOne({
        email: req.body.email
    });
    if (!profile) {
        req.flash('error', 'No account with that email exists');
        return res.redirect('/login');
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
    req.flash('success', 'Password Reset Link Sent!');
    res.redirect('/login');

}

exports.reset = async (req, res) => {
    const profile = await Profile.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if(!profile){
        return res.redirect('/login');
    }

    return res.redirect('/reset');
}

exports.confirmedPassword = (req, res, next) => {
    if(req.body.password === req.body['password-confirm']){
        next();
    }

    res.redirect('back');
}

exports.update = async (req, res) => {
    const profile = await Profile.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!profile) {
        return res.redirect('/login');
    }

    const setPassword = promisify(profile.setPassword, profile);
    await setPassword(req.body.password);
    profile.resetPasswordExpires = undefined;
    profile.resetPasswordToken = undefined;
    const updatedProfile = await profile.save();
    await req.login(updatedProfile);
    res.redirect('/');
}

exports.validateRegister = (req, res, next) => {
    req.checkbody('email', 'Email is not valid').isEmail();
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
        req.flash('error', errors.map(err => err.msg));
        res.render('register', {title: 'Register', body: req.body, flashes: req.flash() });
        return;
    }
    next();
}