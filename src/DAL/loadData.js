const fileName = require('../../app');
const { readFile } = require('../utilities/readFile');
const { get } = require('../utilities/fetch');
const Rx = require('rx');

const getSource = (cb) => {
  readFile(fileName, (err, data) =>
    cb(null, Rx.Observable.fromArray(data)));
};

const loadConfig = (cb) => {
  Promise.all([
    get('config/cash-out/natural'),
    get('config/cash-out/juridical'),
    get('config/cash-in'),
  ]).then(([cashOutNatural, cashOutJuridical, cashIn]) =>
  cb(null, {
    cashOutNatural,
    cashOutJuridical,
    cashIn,
  }));
};

module.exports = {
  loadConfig,
  getSource,
};
