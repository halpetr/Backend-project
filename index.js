const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());

const port = process.env.PORT || 8080;

const db = [{ name: 'tiina' }, { name: 'jack' }];

app.get('/names', (req, res) => {
  res.send(db);
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
