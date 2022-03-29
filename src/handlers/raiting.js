const { tracer } = require('../metrics');

async function raiting(repo) {
  const span = tracer.startSpan('rating_handler');
  return (await (repo.getRaiting()
    .finally(() => {
      span.finish();
    })))
    .map((it) => ({ ...it, login: BigInt(it.login) }));
}

module.exports.raiting = raiting;
