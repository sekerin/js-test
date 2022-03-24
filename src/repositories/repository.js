function Repository(connection) {
  this.connection = connection;
}

Repository.prototype.getAll = function getAll() {
  return new Promise((resolve, reject) => {
    this.connection.query(`SELECT s.login, s.r_login, a.balance_usd, a2.balance_usd r_balance_usd  
            FROM subscription s
            JOIN account a ON a.login = s.login
            JOIN account a2 ON a2.login = s.r_login
            ORDER BY s.login ASC`, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

Repository.prototype.getRaiting = function getRaiting() {
  return new Promise((resolve, reject) => {
    this.connection.query(`SELECT a.source, a.login, a.balance_usd, a.balance_usd_sub, a.subscribers_count
            FROM account a
            ORDER BY a.balance_usd_sub DESC`, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

Repository.prototype.getNetworkByLogin = function getNetworkByLogin(login, r_login) {
  return new Promise((resolve, reject) => {
    this.connection.query(`
        WITH network AS (SELECT network_id id FROM account WHERE login IN (?, ?))
            SELECT DISTINCT s.login, s.r_login, a.balance_usd, a2.balance_usd r_balance_usd, a.network_id
            FROM subscription s
            JOIN account a ON a.login = s.login
            JOIN account a2 ON a2.login = s.r_login
            JOIN network n ON n.id = a.network_id OR n.id = a2.network_id OR a.login = ? OR a2.login = ?
            ORDER BY s.login ASC
            `, [login, r_login, login, r_login], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

Repository.prototype.getNodeByLogin = function getNodeByLogin(login) {
  return new Promise((resolve, reject) => {
    this.connection.query(`
        SELECT login, balance_usd, network_id, subscribers_count FROM account WHERE login = ?
            `, [login], (error, results) => {
      if (error) {
        reject(error);
      }
      if (results.length > 0) {
        resolve(results[0]);
      }
      reject(Error('Not found'));
    });
  });
};

Repository.prototype.getNextNetwork = function getNextNetwork() {
  return new Promise((resolve, reject) => {
    this.connection.query(
      'SELECT MAX(network_id)+1 network_id FROM account',
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results.length > 0) {
          resolve(results[0].network_id);
        }
        resolve(0);
      },
    );
  });
};

Repository.prototype.updateSubBalance = function updateSubBalance(balance) {
  return new Promise((resolve, reject) => {
    this.connection.query(`UPDATE account SET 
        balance_usd_sub = ?, network_id = ?, subscribers_count = ?
        WHERE login = ?`, [balance.balance_usd_sub, balance.network_id, balance.count, balance.login], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

Repository.prototype.nullNetwork = function nullNetwork(login, r_login) {
  return new Promise((resolve, reject) => {
    this.connection.query(
      `
            UPDATE account SET network_id = NULL, balance_usd_sub = 0, subscribers_count = 0 WHERE login IN (?, ?)
        `,
      [login, r_login],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      },
    );
  });
};

Repository.prototype.addSubscription = function addSubscription(subscription) {
  return new Promise((resolve, reject) => {
    this.connection.query(
      `INSERT INTO subscription
        (login, source, r_login, r_source)
        VALUES (?, ?, ?, ?)`,
      [subscription.login, subscription.source, subscription.r_login, subscription.r_source],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      },
    );
  });
};

Repository.prototype.removeSubscription = function removeSubscription(subscription) {
  return new Promise((resolve, reject) => {
    this.connection.query(
      `DELETE FROM subscription
        WHERE login = ? AND source = ? AND r_login = ? AND r_source = ?
        `,
      [subscription.login, subscription.source, subscription.r_login, subscription.r_source],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      },
    );
  });
};

Repository.prototype.prepToRecalc = function prepToRecalc() {
  return new Promise((resolve, reject) => {
    this.connection.query(`UPDATE account SET 
        balance_usd_sub = 0, network_id = NULL, subscribers_count = 0`, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

module.exports.Repository = Repository;
