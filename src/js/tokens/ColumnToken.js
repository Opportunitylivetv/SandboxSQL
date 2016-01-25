"use strict";

var AbstractToken = require('../tokens/AbstractToken');
var TokenTypes = require('../constants/TokenTypes');

class ColumnToken extends AbstractToken {

  constructor(
   tableName,
   colInfo
  ) {
    super();
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

  exportToQuery() {
    var next = this.getNext();
    if (next && next.isColumnLike && next.isColumnLike()) {
      return this.colInfo.name + ',';
    }
    return this.colInfo.name;
  }
}

module.exports = ColumnToken;
