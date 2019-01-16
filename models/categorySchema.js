const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    default: 'New Category',
    required: true
  },
  isIncome: {
    type: Boolean,
    default: false,
    required: true
  },
  default: {
    type: Boolean,
    default: false,
    required: true
  },
  isVisible: {
    type: Boolean,
    default: true,
    required: true
  },
  createdDate:{ 
    type: Date,
    default: Date.now
  },
  modifiedDate: Date,
});

module.exports = mongoose.model('Category', categorySchema);