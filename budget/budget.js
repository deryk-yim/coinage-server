const mongoose = require('mongoose');
const moment = require('moment');

const Budget = mongoose.model('Budget');
const { promisify } = require('es6-promisify');

exports.createBudget = async (req, res) => {
    req.body.createdDate = moment();
    const budget = await(new Budget(req.body)).save();  
    console.log(res.locals.profile);
    return res;
};

exports.updateBudget = async (req, res) => {
    const budget = await Budget.findOneAndUpdate({_id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    }).exec();
};