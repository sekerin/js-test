const express = require('express');
const mysql = require('mysql');
const JSONbig = require('json-bigint')({ useNativeBigInt: true });
const { tracer } = require('./src/metrics');

const { calculate } = require('./src/handlers/calculate');
const { raiting } = require('./src/handlers/raiting');
const { subscribe } = require('./src/handlers/subscribe');
const { unsubscribe } = require('./src/handlers/unsubscribe');
const { Repository } = require('./src/repositories/repository');

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  supportBigNumbers: true,
});

const repo = new Repository(connection);

const app = express();

function jsonParser() {
  return (req, res, next) => {
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = JSONbig.parse(req.body);
    }
    next();
  };
}

app.use(express.text({ type: 'application/json' }));
app.use(jsonParser());

const port = process.env.PORT || 3000;

app.get('/calc', (req, res) => {
  const span = tracer.startSpan('calc');
  calculate(repo).then((rs) => {
    res.json(rs);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Something broke!');
  }).finally(() => {
    span.finish();
  });
});

app.get('/rating', (req, res) => {
  const span = tracer.startSpan('rating');
  raiting(repo).then((rs) => {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.send(JSONbig.stringify(rs));
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Something broke!');
  }).finally(() => {
    span.finish();
  });
});

app.post('/subscribe', (req, res) => {
  const span = tracer.startSpan('subscribe');
  subscribe(repo, req.body).then((rs) => {
    res.json(rs);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Something broke!');
  }).finally(() => {
    span.finish();
  });
});

app.post('/unsubscribe', (req, res) => {
  const span = tracer.startSpan('unsubscribe');
  unsubscribe(repo, req.body).then((rs) => {
    res.json(rs);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('Something broke!');
  }).finally(() => {
    span.finish();
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
