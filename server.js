const express = require('express');
const url = require('url');
const request = require('request');
const bodyParser = require('body-parser');

const port = 8000;
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const router = express.Router();
app.use('/proxy', router);

router.use(function (req, res, next) {
    next();
});

router.get('/*', function (req, res) {
    let url = req.params[0];

    let proxy = request(url);
    proxy.headers["Accept"] = req.headers['accept'];
    proxy.headers["Accept-Encoding"] = "gzip, deflate";
    proxy.headers["User-Agent"] = req.headers["user-agent"];
    proxy.pipe(res);
});

router.post('/*', function (req, res) {
    let url = req.params[0];

    if (!req.body) {
        console.error("We're missing the body for the post! Something went wrong!");
    }

    let proxy = request.post(url, {form: req.body});
    proxy.headers["Accept"] = req.headers['accept'];
    proxy.headers["Accept-Encoding"] = "gzip, deflate";
    proxy.headers["User-Agent"] = req.headers["user-agent"];
    proxy.pipe(res);
});

app.listen(port, function () {
    console.log("Listening on " + port);
});

