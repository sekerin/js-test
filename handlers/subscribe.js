const {calculateNetworks} = require('../main/recursive');
const {separateNetworks} = require('../main/separateNetworks');

async function subscribe(repo, sub) {
    const r_node = await repo.getNodeByLogin(sub.r_login);

    await repo.addSubscription({
        login: sub.login,
        source: sub.source,
        r_login: sub.r_login,
        r_source: sub.r_source,
    });

    const network = (await repo.getNetworkByLogin(sub.login, sub.r_login))
        .map(it => ({...it, login: BigInt(it.login), r_login: BigInt(it.r_login)}));

    const networks = separateNetworks(network);
    const calculated = calculateNetworks(networks);

    const promices = [];
    let network_id = network.length > 0 ? network[0].network_id : 0;

    if (network_id === undefined || network_id === null) {
        network_id = await repo.getNextNetwork();
    }

    calculated[0].forEach(item => {
        promices.push(repo.updateSubBalance({...item, network_id}));
    });

    await Promise.all(promices);

    return 'Ok';
}

module.exports.subscribe = subscribe;
