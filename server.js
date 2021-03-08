const express = require('express');

const app = express();

const port = 3000;

const database = {
    users: [
        {
            id: '123',
            username: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            username: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.use(express.json());

app.get('/', (req, resp) => {
    resp.send(database.users);
})

app.post('/signin', (req, resp) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        resp.json('Success...');
    } else {
        resp.status(400).json('Error loggin in...');
    }
})

app.post('/register', (req, resp) => {
    const { username, email, password } = req.body;
    database.users.push({
        id: '125',
        username: username,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    resp.json(database.users[database.users.length - 1]);
})

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

app.listen(port, () => {
    console.log(`App is running on port ${port}!`);
});