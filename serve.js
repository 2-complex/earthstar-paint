const http = require("http");
const express = require('express');
const body_parser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(body_parser.json())

app.get('/', (req, res) => {
    res.sendFile('./static/html/main.html', { root: __dirname });
});

app.get('/js/*.js', (req, res) => {
    res.sendFile('./static' + req.path, { root: __dirname });
});

app.get('/css/*.css', (req, res) => {
    res.sendFile('./static' + req.path, { root: __dirname });
});

app.post('/upload-base64', (req, res) => {
    axios({
        method: 'post',
        url: 'https://sha-da.com/upload-base64',
        headers: {
            'Content-Type': 'application/json'
        },
        data: req.body,
    }).then((response) => {
        res.send(response.data);
    }, (error) => {
        res.status(500).send(error.message);
    });
});

app.listen(port, () => console.log(`listening on port ${port}`));
