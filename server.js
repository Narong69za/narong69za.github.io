const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

// serve root static files
app.use(express.static(__dirname));

// API Gateway
app.use('/api', require('./api/api.route'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
