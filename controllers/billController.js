const mongoose = require('mongoose');
const moment = require('moment');
const Bill = mongoose.model('Bill');
const Profile = mongoose.model('Profile');
const Transaction = mongoose.model('Transaction');
const Category = mongoose.model('Category');
const helper = require('../helpers/bill');

exports.getBills = (req, res, next) => {
  Profile.find({
    _id: req.user._id
  }).exec()
    .then((profile) => {
      res.json(profile.bills);
    })
    .catch((err => {
      res.status(404).json({
        error: err
      });
    }));
};

exports.generateBillTransactions = (req, res, next) => {
  let bills = [];
  let unsaved_transactions = [];
  Profile.find({ _id: req.user._id }, function (err, profile) { 
    bills = profile.bills;
  });

  const getLatestTransaction = (prev, curr, i) => (curr.transactionDate > prev.transactionDate) && i ? curr : prev;

  bills.map((bill) => {
    const latestTransaction = bill.transactions.find(getLatestTransaction);
    const initialDate = latestTransaction || bill.recurringDate;
    
    const dates = helper.getDateRange(initialDate, bill.frequency);

    const billCategory = Category.find({
      name: 'Bills & Utilities'
    });

    dates.foreach(date => {
      unsaved_transactions.push(new Transaction({
        _pid: req.user._id,
        transactionDate: date,
        description: bill.description,
        amount: bill.defaultAmount,
        category: billCategory,
        bill: bill,
        isBill: true
      }));
    });

    console.log(unsaved_transactions);
  });
  
  res.status(201);
};

exports.createAndUpdateBill = (req, res, next) => {
  if (typeof req.body._id === 'undefined') {
    Bill.create(req.body).then(bill => {
      Profile.update({_id: req.user._id}, {$addToSet: {bills: bill}}.exec());
    }).then( result => {
      res.status(201).json(result);
    }).catch( err => {
      res.status(400).json({error: err });
    });
  }
  else {
    Bill.update({ _id: req.body._id }, { $set: req.body }).exec().then(result => {
      res.status(200).json(result);
    }).catch(err => {
      res.status(400).json({ error: err });
    });
  }
};

exports.createBills = (req, res, next) => {
  const newBills = req.body.map((newData, index) => {
    const bill = new Bill({
      _id: new mongoose.Types.ObjectId(),
    });
    const keys = Object.keys(req.body[index]);
    const values = Object.values(req.body[index]);
    for (let i = 0; i < keys.length; i += 1) {
      bill[keys[i]] = values[i];
    }
    return bill;
  });
  Bill.collection.insertMany(newBills);
  Profile.update(
    { _id: req.user._id },
    { $addToSet: { bills: newBills } }
  )
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(404).json({ error: err });
    });
};

exports.getBillById = (req, res, next) => {
  Bill.findById(req.params.id)
    .exec()
    .then((bill) => {
      res.json(bill);
    })
    .catch((err => {
      res.status(404).json({
        error: err
      });
    }));
};

exports.deleteBillById = (req, res, next) => {
  Bill.findByIdAndRemove(req.params.id)
    .exec()
    .then(result => {
      res.status(200).json({ result });
      next();
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
    
};

exports.deleteProfileBill = (req, res, next) => {
  Profile.update(
    { _id: req.user._id },
    { $pull: { bills: req.params.id } }
  )
    .exec()
    .then(result => {
      res.status(200).json(result);
      next();
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
};

exports.deleteAllTransactionsInBill = (req, res, next) => {
  Bill.update(
    { _id: req.params.id },
    { $set: { transactions: [] }}
  ).exec().then(result => {
    res.status(200).json(result);
    next();
  }).catch(err => {
    res.status(404).json({ Error: err });
  });
};

exports.updateBillById = (req, res, next) => {
  Bill.update(
    { _id: req.params.id },
    { $set: req.body }
  )
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(404).json({ error: err });
    });
};

exports.deleteAllProfileBills = (req, res, next) => {
  Profile.update(
    { _id: req.user._id },
    { $set: { bills: [] }}
  ).exec().then(result => {
    res.status(200).json(result);
    next();
  }).catch(err => {
    res.status(404).json({ Error: err });
  });
};