const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const { promisify } = require('es6-promisify');
const expressValidator = require('express-validator');
const errorHandlers = require('./middleware/errorHandlers');
const helpers = require('./helpers/index');
const swaggerJSDoc = require('swagger-jsdoc');

// AUTHENTICATION AND CONFIGURATION
const token = require('./authentication/token');
require('dotenv').config({path: 'variables.env'});
require('./authentication/jwt');
require('./authentication/google');
require('./authentication/facebook');

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`${err.message}`);
});

// IMPORT MODELS
require('./models/categorySchema');
require('./models/budgetSchema');
require('./models/billSchema');
require('./models/transactionSchema');
require('./models/importSchema');
require('./models/exportSchema');
require('./models/profileSchema');
require('./middleware/passport');

// IMPORT ROUTES
const importRoute = require('./routes/import');
const exportRoute = require('./routes/export');
const budget = require('./routes/budget');
const profile = require('./routes/profile');
const category = require('./routes/category');
const bill = require('./routes/bill');
const transaction = require('./routes/transaction');

function generateUserToken(req, res) {
  const accessToken = token.generateAccessToken(req.profile._id);
  res.status(200).json({ token: accessToken });
}

const app = express();

// SETTING UP SWAGGERJS
const swaggerDefinition = {
  info: {
    title: 'Koinij API',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  basePath: '/'
};

const options = {
  swaggerDefinition,
  apis:['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

app.use(passport.initialize());

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type'); 
  next(); 
});

app.get('/api/authentication/google/start', 
  passport.authenticate('google', {
    session: false, 
    scope: ['openid', 'profile', 'email']
  })
);

app.get('/api/authentication/google/redirect',
  passport.authenticate('google', {session: false}), 
  generateUserToken
);

app.get('/api/authentication/facebook/start',
  passport.authenticate('facebook', {
    session: false
  })
);

app.get('/api/authentication/facebook/redirect',
  passport.authenticate('facebook', {session: false}),
  generateUserToken
);

app.use('/api/category', category);
app.use('/api/budget', budget);
app.use('/api/bill', bill);
app.use('/api/transaction', transaction);
app.use('/api/import', importRoute);
app.use('/api/export', exportRoute);
app.use('/api/profile', profile);

app.use(errorHandlers.notFound);

// catch 404 and forward to error handler
app.use((req, res, next) =>{
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    message: err.message,
    error: err
  });
});

app.listen(3001, () => {
  console.log('Server listening on port ' + 3001);
  console.log('JWT for demo: ' + token.generateAccessToken(0));
});

module.exports = app;
