const { tracer } = require('../metrics');

async function raiting(repo) {
  const span = tracer.startSpan('rating_handler');
  return (await (repo.getRaiting()
    .then((res) => {
      span.finish();
      return res;
    })))
    .map((it) => ({ ...it, login: BigInt(it.login) }));
}

module.exports.raiting = raiting;
