var SQLite = require('react-native-sqlite');

var rethrowOr = require('../utils/rethrowOr');

var _dbToTables = {};
var _tableToCols = {};

var DBInfo = {
  getTables: function(database, callback) {
    var dbName = database.getName();
    console.log('the dbname', dbName);
    if (_dbToTables[dbName]) {
      callback(dbName);
      return;
    }

    var tables = [];
    database.executeSQL(
      `SELECT name FROM sqlite_master where type='table'`,
      [], 
      (row) => tables.push(row.name),
      rethrowOr(() => {
        _dbToTables[dbName] = tables;
        callback(tables);
      }),
    );
  },

  getColumnsForTable: function(database, tableName, callback) {
    var key = `${database.getName()}_${tableName}`;
    if (_tableToCols[key]) {
      callback(key);
      return;
    }

    var cols = [];
    database.executeSQL(
      `PRAGMA table_info(${tableName})`,
      [],
      (row) => {console.log('the row', row); },
      rethrowOr(() => {
        _tableToCols[key] = cols;
        callback(cols);
      }),
    );
  },
};

module.exports = DBInfo;
