const apm = require('elastic-apm-node');
const Tracer = require('elastic-apm-node-opentracing');

const tracer = new Tracer(apm.start({
  serviceName: 'js-test',
  secretToken: process.env.MT_TOKEN,
  serverUrl: process.env.MT_URL,
  environment: process.env.MT_ENV,
  verifyServerCert: false,
  active: process.env.MT_ENV !== '',
}));

module.exports.tracer = tracer;
