const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

require('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.REACT_APP_KNEX_HOST,
    user: process.env.REACT_APP_KNEX_USER,
    password: process.env.REACT_APP_KNEX_PASSWORD,
    database: process.env.REACT_APP_KNEX_DB
  }
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, resp) => {
  resp.send('Success...');
})

// Sign In route
app.post('/signin', signin.handleSignIn(db, bcrypt))

// Register route
app.post('/register', register.handleRegister(db, bcrypt))

// User profile route
app.get('/profile/:id', profile.handleUserProfile(db))

// Image entries route
app.put('/image', (req, resp) => { image.handleImage(req, resp, db) })

// Image Url entries route
app.post('/imageurl', (req, resp) => { image.handleClarifaiApiCall(req, resp) })

app.listen(port, () => {
  console.log(`App is running on port ${port}!`);
});