function separateNetworks(rowNetworks) {
  return rowNetworks.reduce((networks, curr) => {
    const nodeR = {
      login: BigInt(curr.r_login),
      balance_usd: curr.r_balance_usd,
      nodes: [],
    };
    const node = {
      login: BigInt(curr.login),
      balance_usd: curr.balance_usd,
      nodes: [],
    };

    let ret = false;

    networks.forEach((element) => {
      const findedNode = element.find((it) => it.login === node.login);
      const findedNodeR = element.find((it) => it.login === nodeR.login);

      if (findedNode === undefined && findedNodeR === undefined) {
        return;
      }

      if (findedNode !== undefined) {
        if (findedNodeR !== undefined) {
          findedNode.nodes.push(findedNodeR);
        } else {
          element.push(nodeR);
          findedNode.nodes.push(nodeR);
        }

        ret = true;
        return;
      }

      if (findedNode === undefined) {
        element.push(node);
        node.nodes.push(findedNodeR);

        ret = true;
      }
    });

    if (!ret) {
      node.nodes = [nodeR];
      networks.push([node, nodeR]);
    }

    return networks;
  }, []);
}

module.exports.separateNetworks = separateNetworks;
