require('dotenv').config({
  path: './.env',
});
const { app, startApp } = require('./app.js');
const connectDB = require('./db/index.js');

(async () => {
  try {
    // connect mongodb database
    await connectDB();

    // start express app
    startApp();

    // start http server
    app.listen(process.env.PORT, () => {
      console.log(`🚝 Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
})();
