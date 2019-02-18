let mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');
const Currency = require('mongoose-currency');


const { Schema } = mongoose;

const billSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  defaultAmount: {
    type: Currency,
    min: 0,
    required: false
  },
  billCycle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BillCycle'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
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