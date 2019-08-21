const mongoose = require('mongoose');

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
    type: Number,
    required: [true, 'A tour must have a price!']
  }
};

const tourSchema = new mongoose.Schema(tourDescription);

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
