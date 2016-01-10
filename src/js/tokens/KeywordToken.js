"use strict";

var TokenTypes = require('../constants/TokenTypes');

class KeywordToken {

  constructor(
    name
  ) {
    this.name = name;
  }

  getType() {
    return TokenTypes.KEYWORD;
  }

  toString() {
    return `KEYWORD "${this.name}"`;
  }

  exportToQuery(prev, next) {
    switch (this.name) {
      case 'DESC':
      case 'ASC':
        if (next && next.isColumnLike && next.isColumnLike()) {
          return this.name + ',';
        }
        break;
    }
    return this.name;
  }
}

module.exports = KeywordToken;
