let mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');

const { Schema } = mongoose;

let categorySchema = new Schema({
    _id: Integer,
    name: String,
    subCategory:  Array[Object],
    isIncome: Boolean,
    createdDate:{
        type: Date,
        default: Date.now
    },
    modifiedDate: Date
});

module.exports = mongoose.model('Category', categorySchema);