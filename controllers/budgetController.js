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

exports.getBudgets = (req, res) => {
  Budget.find(createQuery(req))
    .exec()
    .then((budgets) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(budgets);
    })
    .catch((err => {
      res.status(404).json({
        error: err
      });
    }));
};

exports.createBudgets = (req, res) => {
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
  Profile.update(
    { _id: req.params.pid },
    { $addToSet: { budget: addBudgets } }
  )
    .exec()
    .then(result => { 
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(404).json({ error: err });
    });
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


exports.deleteBudget = (req, res) => {
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
