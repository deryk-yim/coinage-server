let mongoose = require('mongoose');
const { Schema } = mongoose;

const exportSchema = new Schema({
  exportType: {
    type: String,
    required: true
  },
  exportFileName: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  recordsExported: {
    type: String,
    required: false
  }  
});

module.exports = mongoose.model('Export', exportSchema);