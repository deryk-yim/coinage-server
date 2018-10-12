const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const Profile = mongoose.model('Profile');
const Bill = mongoose.model('Bill');

exports.getTransactions = (req, res) => {
  const perPage = 10;
  const page = req.params.page || 1;
  Transaction.find({
    _pid: req.params.pid
  }).populate('category').sort({ transactionDate: -1 }).skip((perPage * page) - perPage).limit(perPage)
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

exports.getCountTransactions = (req, res) => {
  Transaction.find({
    _pid: req.params.pid
  }).count()
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

exports.getTransactionsByDate = (req, res) => {
  Transaction.find({
    _pid: req.params.pid,
    $date: {
      $gte: req.paras.fromDate,
      $lt: req.paras.todayDate
    }
  }).populate('category').sort({ transactionDate: -1 })
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


exports.getTransactionById = (req, res) => {
  Transaction.find({
    _pid: req.params.pid
  }).findById(req.params.id)
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
    _id: new mongoose.Types.ObjectId(),     // return this.
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


exports.addTransactionToBill = (req, res, next) => {
  if (req.params.isBill === true) {
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
  if (req.params.isBill === false) {
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

exports.deleteTransactionById = (req, res) => {
  Transaction.find({
    _pid: req.params.pid,
    _id: req.params.id
  }).exec()
    .then((transaction) => {
      Profile.update({
        _id: req.params.pid
      },
        {
          $pull: { transactions: transaction }
        }).exec()
    })
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ result })
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    })
};

exports.deleteTransactionsMany = (req, res) => {
  Transaction.deleteMany({
    _pid: req.params.pid,
    _id: {
      $in: req.body.toDeleteList
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

exports.updateTransactionById = (req, res) => {
  Transaction.findOneAndUpdate({
    _id: req.params.id,
    _pid: req.params.pid,
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

exports.updateManyTransactions = (req, res) => {
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  const updateOperations = {}
  for (let i = 0; i < keys.length; i += 1) {
    updateOperations[keys[i]] = values[i];
  }
  Profile.update(
    { _id: req.params.id },
    { $set: updateOperations }
  )
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(404).json({ error: err })
    })
}