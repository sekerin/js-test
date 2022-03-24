function calculateNetworks(networks) {
    networks.forEach(network => network.forEach(item => {
        const calced = calcNet(item, item);
        item.balance_usd_sub = calced.balance_usd_sub - item.balance_usd;
        item.count = calced.count;
        network.forEach(it => delete(it.visited));
    }));
    
    return networks;
}

function calcNet(node, firstNode) {
    const calced = {
        balance_usd_sub: 0,
        count: 0,
    };

    if (node.visited) {
        return calced;
    }

    node.visited = true

    node.nodes.forEach(item => {
        const curCalc = calcNet(item, firstNode);

        if (item == firstNode) {
            curCalc.balance_usd_sub = item.balance_usd;
        }

        calced.balance_usd_sub += curCalc.balance_usd_sub;
        calced.count += curCalc.count + 1;
    });

    return {balance_usd_sub: node.balance_usd + calced.balance_usd_sub, count: calced.count};
}

module.exports.calculateNetworks = calculateNetworks;
