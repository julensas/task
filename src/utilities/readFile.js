const fs = require('fs');

const readFile = (filePath, cb) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    return cb(null, JSON.parse(data));
  });
};

module.exports = {
  readFile,
};
