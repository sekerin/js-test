const express = require('express');
const mysql = require('mysql');
const JSONbig = require('json-bigint')({ useNativeBigInt: true });

const {calculate} = require('./handlers/calculate');
const {raiting} = require('./handlers/raiting');
const {subscribe} = require('./handlers/subscribe');
const {unsubscribe} = require('./handlers/unsubscribe');
const {Repository} = require('./repositories/repository');

const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
  supportBigNumbers: true,
});
connection.connect();
const repo = new Repository(connection);

const app = express();

function jsonParser() {
    return (req, res, next) => {
        if (req.body && Object.keys(req.body).length > 0) {
            req.body = JSONbig.parse(req.body);
        }
        next();
        return;
    }
}

app.use(express.text({type: 'application/json'}));
app.use(jsonParser());

const port = process.env.PORT || 3000;

app.get('/calc', (req, res) => {
    calculate(repo).then(rs => {
        res.json(rs);
    }).catch(error => {
        console.log(error);
        res.status(500).send('Something broke!');
    });
});

app.get('/rating', (req, res) => {
    raiting(repo).then(rs => {
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.send(JSONbig.stringify(rs));
    }).catch(error => {
        console.log(error);
        res.status(500).send('Something broke!');
    });
});

app.post('/subscribe', (req, res) => {
    subscribe(repo, req.body).then(rs => {
        res.json(rs);
    }).catch(error => {
        console.log(error);
        res.status(500).send('Something broke!');
    });
});

app.post('/unsubscribe', (req, res) => {
    unsubscribe(repo, req.body).then(rs => {
        res.json(rs);
    }).catch(error => {
        console.log(error);
        res.status(500).send('Something broke!');
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
