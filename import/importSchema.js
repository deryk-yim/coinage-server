let mongoose = require('mongoose');
const { Schema } = mongoose;

const importSchema = new Schema({
    _id: mongoose.Schema.ObjectId,
    _pid: mongoose.Schema.ObjectId,
    importType: {
        type: String,
        required: true
    },
    importFileName: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    recordsAdded: {
        type: String,
        required: false
    },
    errorMessage: {
        type: String,
        required: false
    },
    errorContent: {
        type: String,
        required: false
    }    
});

module.exports = mongoose.model('Import', importSchema);