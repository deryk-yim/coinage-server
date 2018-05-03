let mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');

const Currency = require('mongoose-Currency');

const { Schema } = mongoose;

const transactionSchema = new Schema({
  _id: mongoose.Schema.ObjectId,
  _pid: mongoose.Schema.ObjectId,
  _bid: mongoose.Schema.ObjectId,
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Currency,
    min: 0,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
  },
  coordinates: {
    type: [Number],
    index: '2dsphere',
    required: false
  },
  isBill: {
    type: Boolean,
    default: true
  },
  isImport: {
    type: Boolean,
    default: false,
  },
  isIncome: {
    type: Boolean,
    default: false,
    required: true
  },
  isLifeExpense: {
    type: Boolean,
    default: false,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  modifiedDate: Date
});

module.exports = mongoose.model('Transaction', transactionSchema);