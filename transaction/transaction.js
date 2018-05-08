const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const Profile = mongoose.model('Profile');
const Bill = mongoose.model('Bill');

exports.getTransactions = (req, res, next) => {
  Transaction.find({
    _pid: req.params.pid
  })
    .exec()
    .then((transactions) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(transactions);
    })
    .catch((err => {
      res.status(404).json({
        error: err
      })
    }))
};

exports.getTransactionById = (req, res, next) => {
  Transaction.findById(req.params.id)
    .exec()
    .then((transaction) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(transaction);
    })
    .catch((err => {
      res.status(404).json({
        error: err
      })
    }))
};
exports.getTransactionsByBillId = (req, res, next) => {
  Transaction.find({
    _bid: req.params.bid
  })
    .exec()
    .then((transactions) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(transactions);
    })
    .catch((err => {
      res.status(404).json({
        error: err
      })
    }))

};

exports.createTransactions = (req, res, next) => {
  const newTransactions = req.body.map((newData, index) => {
    const transaction = new Transaction({
      _pid: req.params.pid,
      _id: new mongoose.Types.ObjectId(),
    })
    const keys = Object.keys(req.body[index]);
    const values = Object.values(req.body[index]);
    for (let i = 0; i < keys.length; i += 1) {
      transaction[keys[i]] = values[i]
    }
    return transaction;
  })
  Transaction.collection.insertMany(newTransactions)
  Profile.update(
    { _id: req.params.pid },
    { $addToSet: { transaction: newTransactions } }
  )
    .exec()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(404).json({ error: err });
    })
};

exports.createTransaction = (req, res, next) => {
  Transaction.create(req.body)
    .then((transaction) => {
      Profile.update(
        { _id: req.params.pid },
        { $addToSet: { transactions: transaction } }
      )
        .exec()
    })
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.status(201).json(result);
      if (req.params.isBill == true) {
        next();
      }
    })
    .catch(err => {
      res.status(404).json({ error: err })
    })
};


exports.addTransactionToBill = (req, res, next) => {
  if (req.params.isBill == true) {
    Transaction.findById(req.params.id)
      .exec()
      .then((transaction) => {
        Bill.update(
          { _id: req.params.bid },
          { $addToSet: { transactions: transaction } }
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
  }
};

exports.deleteTransactionFromBill = (req, res, next) => {
  if (req.params.isBill == false) {
    Transaction.findById(req.params.id)
      .exec()
      .then((transaction) => {
        Bill.update(
          { _id: req.params.bid },
          { $pull: { transactions: transaction } }
        )
          .exec()
      })
      .then(result => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ result })
        next();
      })
      .catch(err => {
        res.status(404).json({ Error: err });
      })
    }
};

exports.deleteTransactionById = (req, res, next) => {
  Transaction.findByIdAndRemove(req.params.id)
    .exec()
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ result })
      next();
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    })
};

exports.deleteProfileTransaction = (req, res, next) => {
  Transaction.findById(req.params.id)
    .exec()
    .then((transaction) => {
      Profile.update(
        { _id: req.params.pid },
        { $pull: { transactions: transaction } }
      )
        .exec()
    })
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ result })
      next();
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    })
};

exports.updateTransactionById = (req, res, next) => {
  let flag = false;
  Transaction.findById(req.params.id)
    .exec()
    .then((transaction) => {
      if(transaction.isBill == false && req.params.isBill == true) {
        flag = true;
      }
      Transaction.update(
        { _id: req.params.id },
        { $set: req.body }
      )
    })
    .then((result, transaction) => {
      res.status(200).json(result)
      if (flag) {
        next();
      }
    })
    .catch(err => {
      res.status(404).json({ error: err })
    })
};