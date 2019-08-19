const fs = require('fs');
const path = require('path');

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', '/dev-data/data/tours-simple.json'),
    'utf8'
  )
);

exports.checkID = (req, res, next, value) => {
  const index = tours.findIndex(el => el.id === value * 1);
  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid tour ID!'
    });
  }
  req.tourID = index;
  next();
};

exports.getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
  const tour = tours[req.tourID];

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    path.join(__dirname, '..', '/dev-data/data/tours-simple.json'),
    JSON.stringify(tours),
    err => {
      if (err)
        return res.status(500).json({
          status: 'error',
          data: {
            message: 'Internal server error!'
          }
        });

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const index = req.tourID;
  let tour = tours[index];

  Object.keys(req.body).forEach(key => (tour[key] = req.body[key]));
  tours[index] = tour;

  fs.writeFile(
    path.join(__dirname, '..', '/dev-data/data/tours-simple.json'),
    JSON.stringify(tours),
    err => {
      if (err)
        return res.status(500).json({
          status: 'error',
          data: {
            message: 'Internal server error!'
          }
        });

      res.status(200).json({
        status: 'success',
        data: {
          tour: tour
        }
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const index = req.tourID;

  tours.splice(index, 1);
  fs.writeFile(
    path.join(__dirname, '..', '/dev-data/data/tours-simple.json'),
    JSON.stringify(tours),
    err => {
      if (err)
        return res.status(500).json({
          status: 'error',
          data: {
            message: 'Internal server error!'
          }
        });

      res.status(204).json({
        status: 'success',
        data: null
      });
    }
  );
};
