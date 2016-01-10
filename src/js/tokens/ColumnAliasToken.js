"use strict";

var TokenTypes = require('../constants/TokenTypes');

class ColumnAliasToken {
  constructor(
    tableName,
    colInfo,
    aliasName
  ) {
    this.tableName = tableName;
    this.colInfo = colInfo;
    this.aliasName = aliasName;
  }

  getType() {
    return TokenTypes.COLUMN_ALIAS;
  }

  toString() {
    return `
      COLUMN alias from Table "${this.tableName}" 
      aliasName: "${this.aliasName}"
      info: ${JSON.stringify(this.colInfo)}`;
  }

  isColumnLike() {
    return true;
  }

  exportToQuery(prev, next) {
    console.log('the col info', this.colInfo);
    console.log(this.toString());
    var colText = `${this.colInfo.name} as ${this.aliasName}`;
    if (next && next.isColumnLike && next.isColumnLike()) {
      return colText + ',';
    }
    return colText;
  }
}

module.exports = ColumnAliasToken;
