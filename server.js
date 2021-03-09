require('dotenv').config()
const express = require('express');
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


// console.log(process.env.REACT_APP_KNEX_HOST);
// console.log(process.env.REACT_APP_KNEX_USER);
// console.log(process.env.REACT_APP_KNEX_PASSWORD);
// console.log(process.env.REACT_APP_KNEX_DB);

db.select('*').from('users');

const app = express();

const port = 3000;

// const database = {
//     users: [
//         {
//             id: '123',
//             username: 'John',
//             email: 'john@gmail.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             username: 'Sally',
//             email: 'sally@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ]
// }

app.use(express.json());
app.use(cors());

// Home route
app.get('/', (req, resp) => {
    resp.send(database.users);
})

// Sign In route
app.post('/signin', (req, resp) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        resp.json(database.users[0]);
    } else {
        resp.status(400).json('Error loggin in...');
    }
})

// Register route
app.post('/register', (req, resp) => {
    const { username, email, password } = req.body;
    db('users')
        .returning('*')
        .insert({
            username: username,
            email: email,
            joined: new Date()
        })
        .then(user => {
            resp.json(user[0]);
        })
        .catch(err => resp.status(400).json('Unable to register...'))
})

// User profile route
app.get('/profile/:id', (req, resp) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach((user) => {
        if (user.id === id) {
            found = true;
            return resp.json(user);
        }
    })
    if (!found) {
        resp.status(400).json('Profile not found...');
    }
})

// Image entries route
app.put('/image', (req, resp) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach((user) => {
        if (user.id === id) {
            found = true;
            user.entries++
            return resp.json(user.entries);
        }
    })
    if (!found) {
        resp.status(400).json('User not found...');
    }
})

app.listen(port, () => {
    console.log(`App is running on port ${port}!`);
});