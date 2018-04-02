const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    _pid: mongoose.Schema.ObjectId,
    name: {
        type: String,
        default: 'New Category'
    },
    isIncome: {
        type: Boolean,
        default: false
    },
    default: {
        type: Boolean,
        default: false
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    createdDate:{ 
        type: Date,
        default: Date.now
    },
    modifiedDate: Date,

});

module.exports = mongoose.model('Category', categorySchema);