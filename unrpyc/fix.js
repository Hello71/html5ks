var fs = require('fs');

fs.readFile(process.argv[2], function (err, data) {
  if (err) throw err;
  fs.writeFile(process.argv[3], JSON.stringify(eval('(' + data + ')')));
});
