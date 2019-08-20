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

const tourDescription = {
  name: {
    type: String,
    unique: true,
    required: [true, 'A tour must have a name!']
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: String,
    required: [true, 'A tour must have a price!']
  }
};

const tourSchema = new mongoose.Schema(tourDescription);

const Tour = mongoose.model('Tour', tourSchema);

const newTour = new Tour({
  name: 'Ho Xuan Huong',
  rating: 5,
  price: 5000000
});

newTour
  .save()
  .then(doc => console.log(doc))
  .catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on port: ${chalk.green(port)}`);
});
