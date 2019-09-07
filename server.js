const mongoose = require('mongoose');
const chalk = require('chalk');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
  console.log('UNCAUGHT_EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

const port = process.env.PORT || 3000;
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// const DB_LOCAL = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log(chalk.green.inverse('DB connection successfully!')));

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${chalk.green(port)}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED_REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
