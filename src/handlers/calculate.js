const { calculateNetworks } = require('../main/recursive');
const { separateNetworks } = require('../main/separateNetworks');

async function calculate(repo) {
  const response = await repo.getAll();
  const ntw = separateNetworks(response);

  const calculated = calculateNetworks(ntw);

  const promices = [];
  await repo.prepToRecalc();

  calculated.forEach((item, index) => {
    item.forEach((it) => {
      promices.push(repo.updateSubBalance({ ...it, network_id: index }));
    });
  });

  await Promise.all(promices);

  return 'Ok';
}

module.exports.calculate = calculate;
