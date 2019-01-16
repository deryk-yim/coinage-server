const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');
//const BillSchema = require('../bill/billSchema');

const Currency = require('mongoose-currency');

const { Schema } = mongoose;

const transactionSchema = new Schema({
  _id: mongoose.Schema.ObjectId,
  _pid: mongoose.Schema.ObjectId,
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
  //bill: {BillSchema},
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