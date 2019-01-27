const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('validator');

require('./billSchema');
require('./budgetSchema');
require('./categorySchema');
require('./transactionSchema');
require('./importSchema');

mongoose.Promise = global.Promise;

const profileSchema = new mongoose.Schema({
  createdDate: Date,
  modifiedDate: Date,
  lastLoggedIn: Date,
  displayName: String,
  email: {
    type: String,
    validate: [validator.isEmail, 'Invalid Email Address'],
    unique: true ,
    lowercase : true,
    trim: true,
    required: 'Please supply a valid email address'
  },
  providers: [{
    type: String
  }],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  bills: [mongoose.model('Bill').schema],
  budgets: [mongoose.model('Budget').schema],
  categories: [mongoose.model('Category').schema],
  transactions: [mongoose.model('Transaction').schema],
  imports: [mongoose.model('Import').schema]
});

profileSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
profileSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Profile', profileSchema);
