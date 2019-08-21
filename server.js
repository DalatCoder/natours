const mongoose = require('mongoose');
const chalk = require('chalk');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log(chalk.green.inverse('DB connection successfully!')))
  .catch(err => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server is running on port: ${chalk.green(port)}`);
});
