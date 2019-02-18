const mongoose = require('mongoose');
const moment = require('moment');
const Bill = mongoose.model('Bill');
const Profile = mongoose.model('Profile');
const Transaction = mongoose.model('Transaction');
const Category = mongoose.model('Category');
const BillCycle = mongoose.model('BillCycle');
const helper = require('../helpers/bill');

exports.getBills = async (req, res, next) => {
  try {
    const profile = await Profile.find({_id: req.user._id});
    res.json(profile.bills);
  }
  catch (err) {
    res.status(404).json({
      error: err
    });
  }
};

// todo and fix 
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

exports.updateBill = async (req, res, next) => {
  try {
    const billCycle = await BillCycle.update({ _billCycleId: req.body.billCycleId }, {
      $set: {
        cycle: req.body.cycle,
        dueDate: req.body.dueDate
      }
    });
    const result = await Bill.update({ _id: req.body._id }, { 
      $set: {
        description: req.body.description,
        defaultAmount: req.body.defaultAmount,
        recurringDate: req.body.recurringDate,
        billCycle: billCycle
      }
    });
    res.status(200).json(result);
  }
  catch (err) {
    res.status(404).json({
      error: err
    });
  }
};

exports.createBill = async (req, res, next) => {
  try {
    const billCycle = await BillCycle.create({
      cycle: req.body.cycle,
      dueDate: req.body.dueDate
    });
    const bill = await Bill.create({
      description: req.body.description,
      defaultAmount: req.body.defaultAmount,
      recurringDate: req.body.recurringDate,
      billCycle: billCycle
    });
    await Profile.update({_id: req.user._id}, {$addToSet: {bills: bill}});
    res.status(201).json(bill);
  }
  catch (err) {
    res.status(404).json({
      error: err
    });
  }
};

exports.getBillById = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);
    res.json(bill);
  }
  catch (err) {
    res.status(404).json({
      error: err
    });
  }
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



exports.getIntervals = (req, res, next) => {

  /*
  //get the bills that are monthy

 weekly bill
 made 5 weeks agO
 sign into app now 
 create 5 weeks worth of translations

 get bill of last date 
*/

};