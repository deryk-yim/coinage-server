const mongoose = require('mongoose');
const moment = require('moment');

const Budget = mongoose.model('Budget');
const Profile = mongoose.model('Profile');

const { promisify } = require('es6-promisify');

exports.createBudget = async (req, res) => {
    try{
    req.body.createdDate = moment();
    const budget = await(new Budget(req.body)).save();  
    req.user.budgets.push(budget);
    const user = await(new Profile(req.user)).save();
    return res.status(201).json(user);
    } catch(ex) {
        return res.status(400).send({ 'error': ex.message });
    }
};

exports.createBudgets = async (req, res) => {
    try {

        const addBudgets = req.body.map((data) => {
            return new Budget({data});
        });
    
        Budget.collection.insertMany(addBudgets);
        const user = await Profile.update({_id: req.params.id}, {
            $addToSet: {budgets: addBudgets}
        });
        return res.status(201).json(user);

    } catch (ex) {
        return res.status(400).send({ 'error': ex.message });
    }


};

exports.updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndUpdate({_id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        });
    } catch (ex) {
        return res.status(400).send({ 'error': ex.message });
    }

    return res.sendStatus(200);
};

exports.deleteBudget = async (req, res) => {
    const i = req.user.budgets.indexOf(req.body.id);
    if (i !== -1) 
        req.user.budgets.splice(i, 1);
    
    const user = await(new Profile(req.user)).save();
    Budget.deleteOne({_id: req.body.id})
    .then(() => {
        return res.sendStatus(200);
    }).catch(ex => {
        return res.status(400).send({ 'error': ex.message });
    });
}