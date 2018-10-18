let mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');

const { Schema } = mongoose;

const billSchema = new Schema({
  _id: mongoose.Schema.ObjectId,
  _pid: mongoose.Schema.ObjectId,
  description: {
    type: String,
    required: true
  },
  isBiweekly: {
    type: Boolean,
    required: true
  },
  category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
  },
  transactions: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Transaction'
  }],
  isIncome: {
    type: Boolean,
    required: true
  },
  recurringDate: {
    type: Date,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  modifiedDate: Date
});

module.exports = mongoose.model('Bill', billSchema);