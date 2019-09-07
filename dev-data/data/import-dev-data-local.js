const mongoose = require('mongoose');
const fs = require('fs');
const chalk = require('chalk');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log(chalk.green.inverse('DB connection successfully')))
  .catch(err e:q> console.log(err));
