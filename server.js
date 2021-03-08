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
    resp.send('This is working on Express.js server');
})

app.post('/signin', (req, resp) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        resp.json('Success...');
    } else {
        resp.status(400).json('Error loggin in...');
    }
})

app.listen(port, () => {
    console.log(`App is running on port ${port}!`);
});