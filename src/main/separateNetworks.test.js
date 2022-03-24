const calculate = require('./separateNetworks');

describe('separateNetworks', () => {
  test('triangle with balance', () => {
    const rowNetworks = [
      {
        login: 1, r_login: 2, balance_usd: 10, r_balance_usd: 20,
      },
      {
        login: 2, r_login: 3, balance_usd: 20, r_balance_usd: 30,
      },
      {
        login: 2, r_login: 4, balance_usd: 20, r_balance_usd: 40,
      },
      {
        login: 3, r_login: 1, balance_usd: 30, r_balance_usd: 10,
      },
    ];

    const networks = calculate.separateNetworks(rowNetworks);

    expect(networks[0].length).toBe(4);
    expect(networks[0][0].nodes[0].login).toBe(2n);
    expect(networks[0][1].nodes[0].login).toBe(3n);
    expect(networks[0][1].nodes[1].login).toBe(4n);
    expect(networks[0][2].nodes[0].login).toBe(1n);
  });

  test('romb extended', () => {
    const rowNetworks = [
      { login: 1, r_login: 2 },
      { login: 1, r_login: 3 },
      { login: 3, r_login: 2 },
      { login: 3, r_login: 4 },
      { login: 3, r_login: 5 },
      { login: 4, r_login: 6 },
      { login: 5, r_login: 6 },
      { login: 2, r_login: 7 },
      { login: 2, r_login: 8 },
      { login: 6, r_login: 9 },
      { login: 6, r_login: 10 },
    ];

    const networks = calculate.separateNetworks(rowNetworks);

    expect(networks[0][0].nodes[0].login).toBe(2n);
    expect(networks[0][1].nodes[0].login).toBe(7n);
    expect(networks[0][2].nodes[0].login).toBe(2n);
  });

  test('nodes compare', () => {
    const rowNetworks = [
      { login: 1, r_login: 2 },
      { login: 1, r_login: 3 },
    ];

    const networks = calculate.separateNetworks(rowNetworks);

    expect(networks[0][0].nodes[0].login).toBe(2n);
    expect(networks[0][0].nodes[1].login).toBe(3n);
  });

  test('two networks', () => {
    const rowNetworks = [
      { login: 1, r_login: 2 },
      { login: 2, r_login: 3 },
      { login: 4, r_login: 5 },
      { login: 5, r_login: 6 },
    ];

    const networks = calculate.separateNetworks(rowNetworks);

    expect(networks.length).toBe(2);
  });
});
