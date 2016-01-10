"use strict";

var TokenTypes = require('../constants/TokenTypes');
var FUNCTION_TYPES = TokenTypes.FUNCTION_TYPES;

class FunctionToken {

  constructor(
    functionType,
    params
  ) {
    this.functionType = functionType;
    this.params = params;
  }

  getType() {
    return TokenTypes.FUNCTION;
  }

  toString() {
    return `FUNCTION token: ${this.functionType}`;
  }

  isColumnLike() {
    // hrm. i guess yes?
    return true;
  }

  exportToQuery(prev, next) {
    var result = null;
    switch (this.functionType) {
      case FUNCTION_TYPES.MIN:
        result = 'MIN(' + this.params.colNames.join(',') + ')';
        break;
      case FUNCTION_TYPES.MAX:
        result = 'MAX(' + this.params.colNames.join(',') + ')';
        break;
      case FUNCTION_TYPES.COUNT:
        result = 'COUNT(' + this.params.countName + ')';
        break;
    }

    if (next && next.isColumnLike && next.isColumnLike()) {
      return result + ',';
    }
    return result;
  }
  
}

module.exports = FunctionToken;
