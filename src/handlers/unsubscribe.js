const { calculateNetworks } = require('../main/recursive');
const { separateNetworks } = require('../main/separateNetworks');

async function unsubscribe(repo, sub) {
  await repo.removeSubscription({
    login: sub.login,
    source: sub.source,
    r_login: sub.r_login,
    r_source: sub.r_source,
  });

  const network = (await repo.getNetworkByLogin(sub.login, sub.r_login))
    .map((it) => ({ ...it, login: BigInt(it.login), r_login: BigInt(it.r_login) }))
    .filter((it) => it.login !== sub.login || it.r_login !== sub.r_login);

  const networks = separateNetworks(network);
  const calculated = calculateNetworks(networks);

  await repo.nullNetwork(sub.login, sub.r_login);

  const promices = [];
  const network_id = network.length > 0 ? network[0].network_id : 0;
  const network_id_next = await repo.getNextNetwork();

  calculated.forEach((it, index) => it.forEach((item) => {
    promices.push(repo.updateSubBalance(
      { ...item, network_id: index === 0 ? network_id : network_id_next + index - 1 },
    ));
  }));

  await Promise.all(promices);

  return 'Ok';
}

module.exports.unsubscribe = unsubscribe;
