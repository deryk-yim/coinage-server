const passport = require('passport');
const passportFacebook = require('passport-facebook');
const Profile = require('../models/profileSchema');

require('dotenv').config({path: 'variables.env'});

const passportConfig = {
  clientID: process.env.FACEBOOK_CLIENTID,
  clientSecret: process.env.FACEBOOK_CLIENTSECRET,
  callbackUrl: 'http://localhost:3000/api/authentication/facebook/redirect'
};

if(passportConfig.clientId) {
  passport.use(new passportFacebook.Strategy(passportConfig, function(accessToken, refreshToken, user, done) {
    let profile = Profile.findById(profile.id);
    if (!profile) {
      profile = Profile.register(new Profile({
        displayName: user.displayName, 
        provider: ['facebook'],
        _id: user.id
      }));
    }
    return done(null, profile);
  }));
}