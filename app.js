const fs = require('fs');
const path = require('path');
const express = require('express');
const chalk = require('chalk');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '/dev-data/data/tours-simple.json'),
    'utf8'
  )
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server is running on port: ${chalk.green(port)}`);
});
