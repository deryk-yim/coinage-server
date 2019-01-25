let mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');

const { Schema } = mongoose;

const budgetSchema = new Schema({
  description: String,
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    unique: true,
    required: true   
  },
  isOverBudget: {
    type: Boolean,
    default: false,
    required: true
  },
  budgetAmount: {
    type: Number,
    default:  0,
    required: true
  },
  actualAmount: {
    type: Number,
    default: 0,
    required: true 
  },
  thesholdLevel: Number,
  createdDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model('Budget', budgetSchema);