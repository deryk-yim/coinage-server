const passport = require('passport');
const passportJwt = require('passport-jwt');
const Profile = require('../models/profileSchema');

require('dotenv').config({path: 'variables.env'});

const jwtOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.SECRET,
  issuer: process.env.ISSUER,
  audience: process.env.AUDIENCE
};

passport.use(new passportJwt.Strategy(jwtOptions, (payload, done) => {
  const profile = Profile.findById(payload.sub);
  if (profile) {
    return done(null, profile, payload);
  }
  return done();
}));