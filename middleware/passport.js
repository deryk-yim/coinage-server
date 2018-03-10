const passport = require('passport');
const mongoose = require('mongoose');

const Profile = mongoose.model('Profile');

passport.use(Profile.createStrategy());

passport.serializeUser(Profile.serializeUser());
passport.deserializeUser(Profile.deserializeUser());
