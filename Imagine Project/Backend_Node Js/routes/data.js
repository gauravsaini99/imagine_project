var csv = require("csvtojson");// Convert a csv file with csvtojson
const csvFilePath = '/Data.csv';
const dataRoutes = (app, fs) => {
  // READ
  app.get('/data', (req, res) => {
    csv()
    .fromFile(__dirname + csvFilePath)
    .then((jsonArrayObj) => {
      console.log('%cjson.js line:4 jsonArrayObj', 'color: #007acc;', jsonArrayObj);
      res.send(JSON.stringify(jsonArrayObj));
    })
  });
};

module.exports = dataRoutes;