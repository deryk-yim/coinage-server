const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const { promisify } = require('es6-promisify');
const expressValidator = require('express-validator');
const errorHandlers = require('./middleware/errorHandlers');
const helpers = require('./helpers/index');
const swaggerJSDoc = require('swagger-jsdoc');

require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`${err.message}`);
});

// IMPORT MODELS
require('./category/categorySchema');
require('./budget/budgetSchema');
require('./bill/billSchema');
require('./transaction/transactionSchema');
require('./import/importSchema');
require('./export/exportSchema');
require('./profile/profileSchema');
require('./middleware/passport');

// IMPORT ROUTES
const importRecord = require('./import/index');
const exportRecord = require('./export/index');
const budget = require('./routes/budget');
const profile = require('./routes/profile');
const category = require('./routes/category');
const bill = require('./routes/bill');
const transaction = require('./routes/transaction');


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
})


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  res.locals.session = req.session;
  next();
});

app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*"); 
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type'); 
  next(); 
});

app.use('/api/category', category);
app.use('/api/budget', budget);
app.use('/api/bill', bill);
app.use('/api/transaction', transaction);
app.use('/api/import', importRecord);
app.use('/api/export', exportRecord);
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


module.exports = app;
