require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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
app.post('/register', (req, resp) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            username: username,
            email: loginEmail[0],
            joined: new Date()
          })
          .then(user => {
            resp.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => resp.status(400).json('Unable to register...'))
})

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