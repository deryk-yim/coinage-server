const moment = require('moment');

exports.getDateRange = (startDate, frequency) => {
  let result = [];
  let endDate = moment();
  switch (frequency.toLowerCase()) {
  case 'monthly':
    while (startDate < endDate) {
      const newDate = moment(startDate).add(1, 'M');
      result.push(newDate);
      startDate = newDate;
    }
    break;
  case 'bi-monthly':
    while (startDate < endDate) {
      var newDate = moment(startDate).add(Math.ceil(0.5), 'M');
      result.push(newDate);
      startDate = newDate;
    }
    break;
  case 'bi-weekly':
    while (startDate < endDate) {
      const newDate = moment(startDate).add(14, 'D');
      result.push(newDate);
      startDate = newDate;
    }
    break;
  case 'weekly':
    while (startDate < endDate) {
      const newDate = moment(startDate).add(7, 'D');
      result.push(newDate);
      startDate = newDate;
    }
    break;
  case 'yearly':
    while (startDate < endDate) {
      const newDate = moment(startDate).add(1, 'Y');
      result.push(newDate);
      startDate = newDate;
    }
    break;
  default:
    break;
  }
};