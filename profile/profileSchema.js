const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('validator');

mongoose.Promise = global.Promise;

const profileSchema = new mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    createdDate: Date,
    modifiedDate: Date,
    lastLoggedIn: Date,
    email: {
        type: String,
        validate: [validator.isEmail, 'Invalid Email Address'],
        unique: true ,
        lowercase : true,
        trim: true,
        required: 'Please supply a valid email address'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    budgets: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Budget'
    }],
    bills: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Bill'
    }],
    categories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    }],
    transactions : [{
        type: mongoose.Schema.ObjectId,
        ref: 'Transaction'
    }]
});

profileSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
profileSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Profile', profileSchema);
