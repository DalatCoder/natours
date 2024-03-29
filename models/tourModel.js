const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const schemaDefinition = {
  name: {
    type: String,
    unique: true,
    required: [true, 'A tour must have a name!'],
    trim: true,
    maxlength: [40, 'A tour must have less or equal than 40 characters'],
    minlength: [10, 'A tour must have more or equal than 10 characters']
  },
  slug: String,
  secret: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration!']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size!']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price!'],
    min: [1, 'Price must be above 1$']
  },
  priceDiscount: {
    type: Number,
    // 'this' keyword only points to current doc on NEW document creation
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price'
    }
  },
  summary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image!']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false // Hide property from client
  },
  startDates: [Date]
};

const schemaOption = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

const tourSchema = new mongoose.Schema(schemaDefinition, schemaOption);

// virtual property
tourSchema.virtual('durationWeek').get(function() {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  // create slug: The Hiker Tour = the-hiker-tour
  this.slug = slugify(this.name, { lower: true });
  next();
});

// DOCUMENT MIDDLEWARE: runs after all pre hooks
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function(next) {
  this.find({ secret: { $ne: true } });
  next();
});

// AGGRERATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
