async function raiting(repo) {
  return (await repo.getRaiting()).map((it) => ({ ...it, login: BigInt(it.login) }));
}

module.exports.raiting = raiting;
