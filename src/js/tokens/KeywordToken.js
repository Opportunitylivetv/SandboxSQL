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
    return this.name;
  }
}

module.exports = KeywordToken;
