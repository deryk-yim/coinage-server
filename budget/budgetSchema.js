let mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');

const { Schema } = mongoose;

const budgetSchema = new Schema({
    _id: Integer,
    description: String,
    category: Object,
    budgetAmount: Double,
    actualAmount: Double,
    thesholdLevel: String,
    createdDate: Date,
    modifiedDate: Date
})

module.exports = mongoose.model('Budget', budgetSchema);