var http = require("http");
const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile('./static/html/main.html', { root: __dirname });
});

app.get('/js/*.js', (req, res) => {
    res.sendFile('./static' + req.path, { root: __dirname });
});

app.get('/css/*.css', (req, res) => {
    res.sendFile('./static' + req.path, { root: __dirname });
});

app.listen(port, () => console.log(`listening on port ${port}`));
