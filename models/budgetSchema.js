let mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');

const { Schema } = mongoose;

const budgetSchema = new Schema({
  description: String,
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    unique: true   
  },
  budgetAmount: Number,
  actualAmount: Number,
  thesholdLevel: Number,
  createdDate: Date,
  modifiedDate: Date
});

module.exports = mongoose.model('Budget', budgetSchema);