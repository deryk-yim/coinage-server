const jwt = require('jsonwebtoken');

function generateAccessToken(userId) {
  const expiresIn = '7 day';
  const audience = process.env.AUDIENCE;
  const issuer = process.env.ISSUER;
  const secret = process.env.SECRET;

  const token = jwt.sign({}, secret, {
    expiresIn: expiresIn,
    audience: audience,
    issuer: issuer,
    subject: userId.toString()
  });

  return token;
}

module.exports = {
  generateAccessToken: generateAccessToken
};