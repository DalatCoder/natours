const fs = require('fs');
const path = require('path');

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', '/dev-data/data/tours-simple.json'),
    'utf8'
  )
);

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
  const id = parseInt(req.params.id);
  const tour = tours.find(el => el.id === id);

  if (tour) {
    return res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  }

  return res.status(404).json({
    status: 'fail',
    data: {
      message: 'Invalid tour ID!'
    }
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    path.join(__dirname, '/dev-data/data/tours-simple.json'),
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
  const id = req.params.id * 1;
  let tour = tours.find(el => el.id === id);
  let index = tours.findIndex(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      data: {
        message: 'Invalid tour ID!'
      }
    });
  }

  Object.keys(req.body).forEach(key => (tour[key] = req.body[key]));
  tours[index] = tour;

  fs.writeFile(
    path.join(__dirname, '/dev-data/data/tours-simple.json'),
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
  const id = req.params.id * 1;
  let index = tours.findIndex(el => el.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      data: {
        message: 'Invalid tour ID!'
      }
    });
  }

  tours.splice(index, 1);
  fs.writeFile(
    path.join(__dirname, '/dev-data/data/tours-simple.json'),
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
