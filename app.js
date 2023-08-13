const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');

const db = require('./model/dbConn');
const patientRoute = require('./route/patientRoute');
const rdvRoute = require('./route/rdvRoute');
const secretaryRoute = require('./route/secretaryRoute');



const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())

app.use('/patient', patientRoute);
app.use('/rdv', rdvRoute);
app.use('/secretary', secretaryRoute);



db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
