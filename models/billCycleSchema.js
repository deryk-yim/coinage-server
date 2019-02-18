let mongoose = require('mongoose');

const { Schema } = mongoose;

const billCycleSchema = new Schema({
  cycle: {
    type: String,
    enum: ['weekly', 'bi-weekly', 'tri-weekly', 'monthly', 'annually', 'semi-annumally', 'quarterly'],
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('BillCycle', billCycleSchema);