"use strict";

var TokenTypes = require('../constants/TokenTypes');

class TableToken {

  constructor(
    tableName
  ) {
    this.tableName = tableName;
  }

  getType() {
    return TokenTypes.TABLE;
  }

  toString() {
    return `Table "${this.tableName}"`;
  }

  shouldExportSpace(prev, next) {
    if (next && next.isColumnLike && next.isColumnLike()) {
      // Actually want to output something like
      // table.foo
      return false;
    }
    return true;
  }

  exportToQuery(prev, next) {
    if (next && next.isColumnLike && next.isColumnLike()) {
      // We are referencing a specific column probably
      return this.tableName + '.';
    }
    return this.tableName;
  }
}

module.exports = TableToken;
