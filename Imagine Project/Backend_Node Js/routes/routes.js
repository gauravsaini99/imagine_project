const _dataRoutes = require('./data');
const appRouter = (app, fs) => {
  app.get('/', (req, res) => {
    res.send('welcome to the development api-server');
  });

  _dataRoutes(app, fs);
};

module.exports = appRouter;