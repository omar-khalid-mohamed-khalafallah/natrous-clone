const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception Shutting Down');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = 3001;

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connection Successful');
  });
const server = app.listen(port, () => {
  console.log('Server Created Successfully');
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection Shutting Down');
  server.close(() => {
    process.exit(1);
  });
});
