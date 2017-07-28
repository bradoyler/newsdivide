const cronA = require('../CronA');

const mockContext = {
  log: console.log,
  done: function () {}
};

cronA(mockContext, {});
