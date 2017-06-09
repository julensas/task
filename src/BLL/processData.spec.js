const { expect } = require('chai');
const { cashInProcess } = require('./processData');

const config = {
  percents: 1,
  max: {
    amount: 2,
  },
};

const data = {
  amount: 100,
};

describe('Data process', () => {
  describe('Cash in', () => {
    it('when amount is 100 and margin is 1%', () => {
      const actual = cashInProcess(data, config);
      expect(actual).to.equal(1);
    });
  });
});
