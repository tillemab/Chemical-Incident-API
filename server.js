require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const signup = require('./route/signup');
const signin = require('./route/signin');
const incidents = require('./route/incidents');

// Initialize Express Application
const app = express();

// Define Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

// Define Routes
app.use('/signup', signup);
app.use('/signin', signin);
app.use('/incidents', incidents); 
app.use('/', express.Router());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;