const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');
const Profile = mongoose.model('Profile');
const moment = require('moment');

const createQuery = (req) => {
  const query = {
    _pid: req.user.id,
  }
  if (req.body.categories) {
    query.category = req.body.categories;
  }
  if (req.body.dateFrom && req.body.dateTo) {
  query.transactionDate = {
      $gte: moment(req.body.dateFrom).toDate(),
      $lte: moment(req.body.dateTo).toDate()
    }
  }
  return query;
};

exports.getTransactionsPerPage = (req, res) => {
  const perPage = 20;
  const page = req.params.page || 1;
  Transaction.find(createQuery(req)
  ).populate('category').sort({ transactionDate: -1 }).skip((perPage * page) - perPage).limit(perPage)
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

exports.getTransactionsCounts = (req, res) => {
  Transaction.find(createQuery(req)
  ).count()
  .exec()
  .then((results) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
      data: results
    })
  })
  .catch((err => {
    res.status(404).json({
      error: err
    })
  }))
};

exports.getTransactionsSum = (req, res) => {
  Transaction.find(createQuery(req)).aggregate(
    [{
      $group: { 
        _id: req.params.id, 
        total: { 
            $sum: "$amount" 
        } 
    } 
    }
  ])
    .exec()
    .then((results) => {
      res.setHeader('Content-Type', 'application/json');
      res.json({
        data: results
      })
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

exports.createTransactions = (req, res) => {
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
  const transaction = new Transaction({
    _pid: req.params.pid,
    _id: new mongoose.Types.ObjectId(),
  });
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  for (let i = 0; i < keys.length; i += 1) {
    transaction[keys[i]] = values[i];
  }
  Transaction.collection.insertOne(transaction);
  Profile.update(
    { _id: req.params.pid },
    { $addToSet: { transactions: transaction } }
  )
    .exec()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(404).json({ error: err })
    })
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

exports.deleteTransactions = (req, res) => {
  Transaction.deleteMany({
    _pid: req.user.id,
    _id: {
      $in: req.body.deleteList
    }
  }).exec()
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ result })
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    })
};

exports.updateTransactionById = (req, res) => {
  Transaction.findOneAndUpdate({
    _id: req.params.id,
    _pid: req.user.id,
  }, {
      $set: req.body
    })
    .exec()
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(404).json({ error: err })
    })
};