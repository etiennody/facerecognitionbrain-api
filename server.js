const express = require('express');

const app = express();

app.get('/', (req, resp) => {
    resp.send('This is working on Express.js server')
})

app.listen(3000, () => {
    console.log('App is running on port 3000');
});