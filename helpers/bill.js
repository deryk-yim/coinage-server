const moment = require('moment');

exports.getDateRange = (startDate, frequency) => {
  let result = [];
  let endDate = moment();
  switch (frequency.toLowerCase()) {
  
  case 'weekly':
    while (startDate < endDate) {
      const newDate = moment(startDate).add(7, 'D');
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
  
  case 'tri-weekly':
    while (startDate < endDate) {
      const newDate = moment(startDate).add(21, 'D');
      result.push(newDate);
      startDate = newDate;
    }
    break; 
  
  case 'monthly':
    while (startDate < endDate) {
      const newDate = moment(startDate).add(1, 'M');
      result.push(newDate);
      startDate = newDate;
    }
    break;

  case 'annually':
    while (startDate < endDate) {
      const newDate = moment(startDate).add(1, 'Y');
      result.push(newDate);
      startDate = newDate;
    }
    break;
  
  case 'semi-annumally':
    while (startDate < endDate) {
      const newDate = moment(startDate).add(0.5, 'Y');
      result.push(newDate);
      startDate = newDate;
    }
    break;

  case 'quarterly':
    while (startDate < endDate) {
      const newDate = moment(startDate).add(0.25, 'Y');
      result.push(newDate);
      startDate = newDate;
    }
    break;

  default:
    break;
  }
};