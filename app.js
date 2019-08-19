const fs = require('fs');
const path = require('path');
const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '/dev-data/data/tours-simple.json'),
    'utf8'
  )
);

const getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
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

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

// app.get('/api/v1/tours', getAllTour);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app
  .route('/api/v1/tours')
  .get(getAllTour)
  .post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.listen(port, () => {
  console.log(`Server is running on port: ${chalk.green(port)}`);
});
