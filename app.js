const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');

const db = require('./config/dbConn');
const patientRoute = require('./route/patientRoute');
const rdvRoute = require('./route/rdvRoute');
const secretaryRoute = require('./route/secretaryRoute');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(credentials);

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.json())

app.use('/auth', require('./route/auth'));
app.use('/logout', require('./route/logout'));

// app.use(verifyJWT);
app.use('/refresh', require('./route/refresh'));

app.use('/patient', patientRoute);
app.use('/rdv', rdvRoute);
app.use('/secretary', secretaryRoute);

app.use('/register', require('./route/register'));




db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
