const mongoose = require('mongoose');
const Bill = mongoose.model('Bill');
const Profile = mongoose.model('Profile');

exports.getBills = (req, res, next) => {
  const userId = req.user.id;
  Bill.find({
    _pid: userId
  })
    .exec()
    .then((bills) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(bills);
    })
    .catch((err => {
      res.status(404).json({
        error: err
      })
    }))
};

exports.createBill = (req, res, next) => {
  const userId = req.user.id;
  Bill.create(req.body)
    .then((bill) => {
      Profile.update(
        { _id: userId },
        { $addToSet: { bills: bill } }
      )
        .exec()
    })
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(404).json({ error: err })
    })
};

exports.createBills = (req, res, next) => {
  const userId = req.user.id;
  const newBills = req.body.map((newData, index) => {
    const bill = new Bill({
      _pid: userId,
      _id: new mongoose.Types.ObjectId(),
    })
    const keys = Object.keys(req.body[index]);
    const values = Object.values(req.body[index]);
    for (let i = 0; i < keys.length; i += 1) {
      bill[keys[i]] = values[i]
    }
    return bill;
  })
  Bill.collection.insertMany(newBills)
  Profile.update(
    { _id: userId },
    { $addToSet: { bills: newBills } }
  )
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(404).json({ error: err });
    })
};

exports.getBillById = (req, res, next) => {
  Bill.findById(req.params.id)
    .exec()
    .then((bill) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(bill);
    })
    .catch((err => {
      res.status(404).json({
        error: err
      })
    }))
};

exports.deleteBillById = (req, res, next) => {
  Bill.findByIdAndRemove(req.params.id)
    .exec()
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ result });
      next();
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    })
    
};

exports.deleteProfileBill = (req, res, next) => {
  Profile.update(
    { _id: req.params.pid },
    { $pull: { bills: req.params.id } }
  )
    .exec()
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
      next();
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    })
};

exports.deleteAllTransactionsInBill = (req, res, next) => {
  Bill.update(
    { _id: req.params.id },
    { $set: { transactions: [] }}
  )
  .exec()
  .then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
    next();
  })
  .catch(err => {
    res.status(404).json({ Error: err });
  })
};

exports.updateBillById = (req, res, next) => {
  Bill.update(
    { _id: req.params.id },
    { $set: req.body }
  )
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(404).json({ error: err })
    })
};

exports.deleteAllProfileBills = (req, res, next) => {
  const userId = req.user.id;
  Profile.update(
    { _id: userId },
    { $set: { bills: [] }}
  )
  .exec()
  .then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
    next();
  })
  .catch(err => {
    res.status(404).json({ Error: err });
  })
};