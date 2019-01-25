const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');
const BillSchema = require('./billSchema');
const Currency = require('mongoose-currency');

const { Schema } = mongoose;

const transactionSchema = new Schema({
  transactionDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  amount: {
    type: Currency,
    min: 0,
    required: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  bill: mongoose.model('Bill').schema,
  location: {
    type: String,
    enum: ['Point'],
    coordinates: {
      type: [Number],
      required: true
    },
    required: false
  },
  isBill: {
    type: Boolean,
    default: false
  },
  isImport: {
    type: Boolean,
    default: false
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