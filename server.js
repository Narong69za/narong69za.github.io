const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use('/api', require('./routes/api.route'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('Server running on port', PORT);
});
