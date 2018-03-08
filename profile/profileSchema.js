const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('validator');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const profileSchema = new Schema({
    _id: Schema.Types.ObjectID,
    createdDate: Date,
    modifiedDate: Date,
    lastLoggedIn: Date,
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please supply a valid email address'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    budgets: [{
        type: mongoose.Schema.ObjectID,
        ref: 'Budget'
    }],
    bills: [{
        type: mongoose.Schema.ObjectID,
        ref: 'Bill'
    }],
    categories: [{
        type: mongoose.Schema.ObjectID,
        ref: 'Category'
    }],
    inLeaderboard: Boolean
    
});

profileSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
profileSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Profile', profileSchema);
