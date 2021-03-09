require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');

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
app.post('/signin', (req, resp) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isSignInValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isSignInValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            resp.json(user[0])
          })
          .catch(err => resp.status(400).json('Sorry, unable to get user...'))
      } else {
        resp.status(400).json('Sorry, wrong credentials...')
      }
    })
    .catch(err => resp.status(400).json('Sorry, wrong credentials...'))
})

// Register route
app.post('/register', (req, resp) => { register.handleRegister(req, resp, db, bcrypt) })

// User profile route
app.get('/profile/:id', (req, resp) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        resp.json(user[0]);
      } else {
        resp.status(400).json('Profile not found...');
      }
    })
    .catch(err => resp.status(400).json('Error getting user...'))
})

// Image entries route
app.put('/image', (req, resp) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      resp.json(entries[0]);
    })
    .catch(err => resp.status(400).json('Unable to get entries...'))

})

app.listen(port, () => {
  console.log(`App is running on port ${port}!`);
});