const mongoose = require('mongoose');
const fs = require('fs');
const chalk = require('chalk');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

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

// Read data from file
let devData = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8');
devData = JSON.parse(devData);

// Import data to DB
const importData = async () => {
  try {
    await Tour.create(devData);
    console.log(chalk.green('All data loaded!'));
  } catch (err) {
    console.log(chalk.red(err));
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log(chalk.green('All data have been deleted!'));
  } catch (error) {
    console.log(chalk.red(error));
  }
  process.exit();
};

const action = process.argv[2];

if (action === '--import') {
  importData();
} else if (action === '--delete') {
  deleteData();
}
