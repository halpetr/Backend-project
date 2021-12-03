const express = require('express');
const app = express();
var cors = require('cors');

const port = process.env.PORT || 8080;

const locations = require('./routes/locations');

// Middleware
app.use(express.json());
app.use(cors());
app.use('/locations', locations);
app.use(express.static('frontend/build'));

//Server
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

const shutdown = () => {
  console.log('Signal to close received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    connection.end();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

//Test connectionn
app.get('/', async (req, res, next) => {
  res.send({ message: 'ok' });
});
