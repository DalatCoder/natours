const Tour = require('./../models/tourModel');

exports.getAllTour = async (req, res) => {
  try {
    // Filter tours
    let queryObj = { ...req.query };
    const excludes = ['page', 'sort', 'limit', 'fields'];
    excludes.forEach(el => delete queryObj[el]); // xoa bo 1 so filter ra khoi query

    // Advanced Filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    // {Tour.find({ duration: {$gte: 5} })}
    queryObj = { ...JSON.parse(queryStr) };

    // Xay dung 1 query object trong mongoose
    let query = Tour.find(queryObj);

    // Sorting
    if (req.query.sort) {
      // Truong hop sap xep theo nhieu dieu kien query.sort('dk1 dk2 dk3')
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // Sap xep giam dan theo thoi gian dien ra tour
      // -createdAt de sap xep giam dan theo truong createdAt
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // Loai bo truong __v ra khoi response
      query = query.select('-__v');
    }

    // Lay data tu query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error
    });
  }
};

exports.getTour = async (req, res) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findById(id);

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found!'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid tour ID!'
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

exports.updateTour = async (req, res) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found!'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  const { id } = req.params;

  try {
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid tour ID!'
    });
  }
};
