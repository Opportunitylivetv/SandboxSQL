"use strict";

var AbstractToken = require('../tokens/AbstractToken');
var TokenTypes = require('../constants/TokenTypes');

class AliasToken extends AbstractToken {
  constructor(
    subToken,
    aliasName
  ) {
    super();
    this.subToken = subToken;
    this.aliasName = aliasName;
  }

  getType() {
    return TokenTypes.ALIAS;
  }

  toString() {
    return `
      TOKEN ALIAS 
      aliasName: "${this.aliasName}"`;
  }

  isColumnLike() {
    // maybe this will not always be true?
    return true;
  }

  exportToQuery() {
    var next = this.getNext();

    var subText = this.subToken.exportToQuery(null, null);
    var result = `${subText} as ${this.aliasName}`;
    if (next && next.isColumnLike && next.isColumnLike()) {
      return result + ',';
    }
    return result;
  }
}

module.exports = AliasToken;
