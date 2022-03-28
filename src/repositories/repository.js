const { tracer } = require('../metrics');

function Repository(connection) {
  this.connection = connection;
}

Repository.prototype.query = function query(...args) {
  return new Promise((resolve, reject) => {
    this.connection.query(...args, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

Repository.prototype.queryOne = function query(...args) {
  return new Promise((resolve, reject) => {
    this.connection.query(...args, (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length > 0) {
        return resolve(results[0]);
      }
      return reject(Error('Not found'));
    });
  });
};

Repository.prototype.getAll = function getAll() {
  const span = tracer.startSpan('getAll_repo');
  return this.query(`SELECT s.login, s.r_login, a.balance_usd, a2.balance_usd r_balance_usd  
            FROM subscription s
            JOIN account a ON a.login = s.login
            JOIN account a2 ON a2.login = s.r_login
            ORDER BY s.login ASC`)
    .finally(() => {
      span.finish();
    });
};

Repository.prototype.getRaiting = function getRaiting() {
  const span = tracer.startSpan('getRaiting_repo');
  return this.query(`
    SELECT a.source, a.login, a.balance_usd, a.balance_usd_sub, a.subscribers_count 
    FROM account a 
    ORDER BY a.balance_usd_sub DESC
  `).finally(() => {
    span.finish();
  });
};

Repository.prototype.getNetworkByLogin = function getNetworkByLogin(login, r_login) {
  const span = tracer.startSpan('getNetworkByLogin_repo');
  return this.query(
    `WITH network AS (SELECT network_id id FROM account WHERE login IN (?, ?))
      SELECT DISTINCT s.login, s.r_login, a.balance_usd, a2.balance_usd r_balance_usd, a.network_id
      FROM subscription s
      JOIN account a ON a.login = s.login
      JOIN account a2 ON a2.login = s.r_login
      JOIN network n ON n.id = a.network_id OR n.id = a2.network_id OR a.login = ? OR a2.login = ?
      ORDER BY s.login ASC
    `,
    [login, r_login, login, r_login],
  )
    .finally(() => {
      span.finish();
    });
};

Repository.prototype.getNodeByLogin = function getNodeByLogin(login) {
  const span = tracer.startSpan('getNodeByLogin_repo');
  return this.queryOne(`
        SELECT login, balance_usd, network_id, subscribers_count FROM account WHERE login = ?
            `, [login])
    .finally(() => {
      span.finish();
    });
};

Repository.prototype.getNextNetwork = function getNextNetwork() {
  const span = tracer.startSpan('getNextNetwork_repo');
  return this.queryOne(
    'SELECT MAX(network_id)+1 network_id FROM account',
  ).finally(() => {
    span.finish();
  });
};

Repository.prototype.updateSubBalance = function updateSubBalance(balance) {
  const span = tracer.startSpan('updateSubBalance_repo');
  return this.query(
    `UPDATE account SET 
        balance_usd_sub = ?, network_id = ?, subscribers_count = ?
        WHERE login = ?`,
    [balance.balance_usd_sub, balance.network_id, balance.count, balance.login],
  )
    .finally(() => {
      span.finish();
    });
};

Repository.prototype.nullNetwork = function nullNetwork(login, r_login) {
  const span = tracer.startSpan('nullNetwork_repo');
  return this.query(
    'UPDATE account SET network_id = NULL, balance_usd_sub = 0, subscribers_count = 0 WHERE login IN (?, ?)',
    [login, r_login],
  ).finally(() => {
    span.finish();
  });
};

Repository.prototype.addSubscription = function addSubscription(subscription) {
  const span = tracer.startSpan('addSubscription_repo');
  return this.query(
    `INSERT INTO subscription
        (login, source, r_login, r_source)
        VALUES (?, ?, ?, ?)`,
    [subscription.login, subscription.source, subscription.r_login, subscription.r_source],
  ).finally(() => {
    span.finish();
  });
};

Repository.prototype.removeSubscription = function removeSubscription(subscription) {
  const span = tracer.startSpan('removeSubscription_repo');
  return this.query(
    `DELETE FROM subscription
        WHERE login = ? AND source = ? AND r_login = ? AND r_source = ?
        `,
    [subscription.login, subscription.source, subscription.r_login, subscription.r_source],
  ).finally(() => {
    span.finish();
  });
};

Repository.prototype.prepToRecalc = function prepToRecalc() {
  const span = tracer.startSpan('prepToRecalc_repo');
  return this.query(`UPDATE account SET 
        balance_usd_sub = 0, network_id = NULL, subscribers_count = 0`).finally(() => {
    span.finish();
  });
};

module.exports.Repository = Repository;
