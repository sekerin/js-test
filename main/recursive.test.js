const calculate = require('./recursive');

describe('recursive', () => {
    test('triangle', () => {

        const node1 = {login: 1, nodes: [], balance_usd: 10};
        const node2 = {login: 2, nodes: [], balance_usd: 20}; 
        const node3 = {login: 3, nodes: [], balance_usd: 30};

        node1.nodes = [node2];
        node2.nodes = [node3];
        node3.nodes = [node1];

        let network = [
            node1,
            node2,
            node3,
        ];

        network = calculate.calculateNetworks([network]);

        expect(network[0][0].balance_usd_sub).toBe(60);
        expect(network[0][1].balance_usd_sub).toBe(60);
        expect(network[0][2].balance_usd_sub).toBe(60);
        expect(network[0][0].count).toBe(3);
    });

    test('roga', () => {
        const node1 = {login: 1, nodes: [], balance_usd: 10};
        const node2 = {login: 2, nodes: [], balance_usd: 20}; 
        const node3 = {login: 3, nodes: [], balance_usd: 30};

        node1.nodes = [node2, node3];
        // node2.nodes = [node3];
        // node3.nodes = [node1];

        let network = [
            node1,
            node2,
            node3,
        ];

        network = calculate.calculateNetworks([network]);

        expect(network[0][0].balance_usd_sub).toBe(50);
        expect(network[0][0].count).toBe(2);
        // expect(network[0][1].balance_usd_sub).toBe(60);
        // expect(network[0][2].balance_usd_sub).toBe(60);
    });

    test('romb', () => {
        const node1 = {login: 1, nodes: [], balance_usd: 10};
        const node2 = {login: 2, nodes: [], balance_usd: 20}; 
        const node3 = {login: 3, nodes: [], balance_usd: 30};
        const node4 = {login: 4, nodes: [], balance_usd: 30};

        node1.nodes = [node2, node3];
        node2.nodes = [node4];
        node3.nodes = [node4];

        let network = [
            node1,
            node2,
            node3,
            node4,
        ];

        network = calculate.calculateNetworks([network]);

        expect(network[0][0].balance_usd_sub).toBe(80);
        expect(network[0][1].balance_usd_sub).toBe(30);
        expect(network[0][2].balance_usd_sub).toBe(30);
        expect(network[0][3].balance_usd_sub).toBe(0);
    });

    test('romb extended', () => {
        const node1 = {login: 60000000000062842n, nodes: [], balance_usd: 30};
        const node2 = {login: 60000000000063843n, nodes: [], balance_usd: 40}; 
        const node3 = {login: 60000000000064844n, nodes: [], balance_usd: 50};
        const node4 = {login: 60000000000065845n, nodes: [], balance_usd: 60};
        const node5 = {login: 60000000000066847n, nodes: [], balance_usd: 70};
        const node6 = {login: 60000000000067850n, nodes: [], balance_usd: 80};
        const node7 = {login: 60000000000068851n, nodes: [], balance_usd: 90};
        const node8 = {login: 60000000000069853n, nodes: [], balance_usd: 80};
        const node9 = {login: 60000000000070854n, nodes: [], balance_usd: 70};
        const node10 = {login: 60000000000071855n, nodes: [], balance_usd: 60};

        node1.nodes = [node2, node3];
        node2.nodes = [node7, node8];
        node3.nodes = [node2, node4, node5];
        node4.nodes = [node6];
        node5.nodes = [node6];
        node6.nodes = [node9, node10];

        let network = [
            node1,
            node2,
            node3,
            node4,
            node5,
            node6,
            node7,
            node8,
            node9,
            node10,
        ];

        network = calculate.calculateNetworks([network]);

        expect(network[0][0].balance_usd_sub).toBe(600);
        expect(network[0][1].balance_usd_sub).toBe(170);
        expect(network[0][2].balance_usd_sub).toBe(550);
        expect(network[0][3].balance_usd_sub).toBe(210);
        expect(network[0][4].balance_usd_sub).toBe(210);
        expect(network[0][5].balance_usd_sub).toBe(130);
        expect(network[0][6].balance_usd_sub).toBe(0);
    });
});
