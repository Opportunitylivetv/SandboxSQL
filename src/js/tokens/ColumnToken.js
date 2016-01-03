"use strict";

var TokenTypes = require('../constants/TokenTypes');

class ColumnToken {

  constructor(
   tableName,
   colInfo
  ) {
    this.tableName = tableName;
    this.colInfo = colInfo;
  }

  getType() {
    return TokenTypes.COLUMN;
  }

  toString() {
    return `
      COLUMN from Table "${this.tableName}" 
      info: ${JSON.stringify(this.colInfo)}`;
  }

  exportToQuery(prev, next) {
    if (next && next.getType() === TokenTypes.COLUMN) {
      return this.colInfo.name + ',';
    }
    return this.colInfo.name;
  }
}

module.exports = ColumnToken;
