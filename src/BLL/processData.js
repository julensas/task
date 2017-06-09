const { getSource, loadConfig } = require('../DAL/loadData');
const moment = require('moment');

const amountPerWeek = {};

function cashInProcess(operation, cfg) {
  const margin = operation.amount * (cfg.percents / 100);
  return margin >= cfg.max.amount ? cfg.max.amount : margin;
}

function cashOutNatural(data, cfg) {
  const key = `${moment(data.date).week()}_${data.user_id}_${moment(data.date).format('YY')}`;
  let paidAmount = 0;
  if (amountPerWeek[key]) {
    if ((amountPerWeek[key] + data.operation.amount) > cfg.week_limit.amount) {
      paidAmount = (amountPerWeek[key] + data.operation.amount) - cfg.week_limit.amount;
      amountPerWeek[key] = cfg.week_limit.amount;
    } else {
      amountPerWeek[key] += data.operation.amount;
    }
  } else if (data.operation.amount > cfg.week_limit.amount) {
    paidAmount = data.operation.amount - cfg.week_limit.amount;
    amountPerWeek[key] = cfg.week_limit.amount;
  } else {
    amountPerWeek[key] = data.operation.amount;
  }

  return paidAmount * (cfg.percents / 100);
}

function cashOutJuridical(operation, cfg) {
  const margin = operation.amount * (cfg.percents / 100);
  return margin <= cfg.min.amount ? cfg.min.amount : margin;
}

loadConfig((errConfig, config) => {
  getSource((errData, dataSource) => {
    dataSource
      .filter(d => d.type === 'cash_in')
      .subscribe(d => console.log(cashInProcess(d.operation, config.cashIn)));

    const cashOut = dataSource
      .filter(d => d.type === 'cash_out');

    cashOut
      .filter(d => d.user_type === 'natural')
      .subscribe(d => console.log(cashOutNatural(d, config.cashOutNatural)));

    cashOut
      .filter(d => d.user_type === 'juridical')
      .subscribe(d => console.log(cashOutJuridical(d.operation, config.cashOutJuridical)));
  });
});

module.exports = {
  cashInProcess,
  cashOutNatural,
  cashOutJuridical,
};
