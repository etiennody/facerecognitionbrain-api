require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

db.select('*').from('users');

const app = express();

const port = 3000;

app.use(express.json());
app.use(cors());

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
app.put('/image', image.handleImage(db))

app.listen(port, () => {
  console.log(`App is running on port ${port}!`);
});