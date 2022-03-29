const { calculateNetworks } = require('../main/recursive');
const { separateNetworks } = require('../main/separateNetworks');
const { tracer } = require('../metrics');

async function calculate(repo) {
  const span = tracer.startSpan('calculate_handler');
  const response = await repo.getAll();
  const spanSN = tracer.startSpan('separateNetworks');
  const ntw = separateNetworks(response);
  spanSN.finish();

  const spanCN = tracer.startSpan('calculateNetworks');
  const calculated = calculateNetworks(ntw);
  spanCN.finish();

  const promices = [];
  try {
    await repo.prepToRecalc();

    calculated.forEach((item, index) => {
      item.forEach((it) => {
        promices.push(repo.updateSubBalance({ ...it, network_id: index }));
      });
    });

    await Promise.all(promices);
  } finally {
    span.finish();
  }

  return 'Ok';
}

module.exports.calculate = calculate;
