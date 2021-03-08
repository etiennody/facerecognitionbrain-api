const express = require('express');

const app = express();

const port = 3000;

app.get('/', (req, resp) => {
    resp.send('This is working on Express.js server')
})

app.listen(port, () => {
    console.log(`App is running on port ${port}!`);
});