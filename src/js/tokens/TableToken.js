"use strict";

var AbstractToken = require('../tokens/AbstractToken');
var TokenTypes = require('../constants/TokenTypes');

class TableToken extends AbstractToken {

  constructor(
    tableName
  ) {
    super();
    this.tableName = tableName;
  }

  getType() {
    return TokenTypes.TABLE;
  }

  toString() {
    return `Table "${this.tableName}"`;
  }

  shouldExportSpace() {
    var next = this.getNext();

    if (this._isBeforeColumn()) {
      // Actually want to output something like
      // table.foo
      return false;
    }
    return true;
  }

  isColumnLike() {
    // We are if we are concatted with a column
    return this._isBeforeColumn();
  }

  exportToQuery() {
    var next = this.getNext();

    if (this._isBeforeColumn()) {
      // We are referencing a specific column probably
      return this.tableName + '.';
    }
    return this.tableName;
  }

  _isBeforeColumn() {
    var next = this.getNext();
    return next && next.isColumnLike && next.isColumnLike();
  }

}

module.exports = TableToken;
