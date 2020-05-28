const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const  {getSecret}  = require('./config.js');
const router = require('./routes/router.js');


mongoose.connect(getSecret('dbUri'),{ useNewUrlParser: true}
  )
  .then(
    () => {
      console.log('Connected to mongoDB');
    },
    (err) => console.log('Error connecting to mongoDB', err)
  );

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

