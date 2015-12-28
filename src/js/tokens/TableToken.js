var TokenTypes = require('../constants/TokenTypes');

class TableToken {

  constructor(
    tableName,
  ) {
    this.tableName = tableName;
  }

  getType() {
    return TokenTypes.TABLE;
  }

  toString() {
    return `Table "${this.tableName}"`;
  }

  exportToQuery(prev, next) {
    return this.tableName;
  }
}

module.exports = TableToken;
