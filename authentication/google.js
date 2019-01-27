const passport = require('passport');
const passportGoogle = require('passport-google-oauth');
const Profile = require('../models/profileSchema');

require('dotenv').config({path: 'variables.env'});

const passportConfig = {
  clientID: process.env.GOOGLE_CLIENTID,
  clientSecret: process.env.GOOGLE_CLIENTSECRET,
  callbackUrl: 'http://localhost:3000/api/authentication/google/redirect'
};

if (passportConfig.clientId) {
  passport.use(new passportGoogle.OAuth2Strategy(passportConfig, function(request, accessToken, refreshToke, user, done){
    let profile = Profile.findById(user.id);
    if (!profile){
      profile = Profile.register(new Profile({
        displayName: user.displayName,
        provider: ['google'],
        _id: user.id
      }));
    }
    return done(null, profile);
  }));
}