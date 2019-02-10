const mongoose = require('mongoose');

const Budget = mongoose.model('Budget');
const Profile = mongoose.model('Profile');

const createQuery = (req) => {
  const query = {
    pid: req.user.id,
  };
  if (req.body.categories) {
    query.category = req.body.categories;
  }
  if (req.body.description) {
    query.description = req.body.description;
  }
  return query;
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find(createQuery(req)).exec();
    res.setHeader('Content-Type', 'application/json');
    res.json(budgets);
  }
  catch (err) {
    res.status(404).json({
      error: err
    });
  }
};

exports.createBudgets = async (req, res) => {
  try {
    const addBudgets = req.body.map((_newData, index) => {
      const budget = new Budget({
        _pid: req.params.pid,
        _id: new mongoose.Types.ObjectId(),
      });
      const keys = Object.keys(req.body[index]);
      const values = Object.values(req.body[index]);
      for (let i = 0; i < keys.length; i += 1) {
        budget[keys[i]] = values[i];
      }
      return budget;
    });
    Budget.collection.insertMany(addBudgets);
    const result = await Profile.update(
      { _id: req.params.pid },
      { $addToSet: { budget: addBudgets } }
    ).exec();
    res.status(201).json(result);
  }
  catch (err) {
    res.status(404).json({
      error: err
    });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate({ _id: req.params.id, _pid: req.user.id, },
      {
        $set: req.body
      }).exec();
    res.status(201).json(budget);
  }
  catch (err) {
    res.status(404).json({
      error: err
    });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const result = await Budget.deleteMany({
      _pid: req.user.id,
      _id: {
        $in: req.body.deleteList
      }
    }).exec();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ result });
  }
  catch(err) {
    res.status(404).json({
      error: err
    });
  }
};