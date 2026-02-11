require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/api.route'));
app.use('/api/payment', require('./routes/payment.route'));
app.use('/api/webhook', require('./routes/webhook.route'));

app.listen(process.env.PORT || 3000, () => {
  console.log('SN DESIGN BACKEND RUNNING');
});
