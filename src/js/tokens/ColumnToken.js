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

  isColumnLike() {
    return true;
  }

  exportToQuery(prev, next) {
    if (next && next.isColumnLike && next.isColumnLike()) {
      return this.colInfo.name + ',';
    }
    return this.colInfo.name;
  }
}

module.exports = ColumnToken;
