var TokenTypes = require('../constants/TokenTypes');

class PartialQuery {

  constructor(
  ) {
    this.tokens = [];
  }

  addToken(token) {
    this.tokens.push(token);
  }

  exportToStringQuery() {
    var exports = [];
    for (var i = 0; i < this.tokens.length; i++) {
      var prev = this.tokens[i-1];
      var curr = this.tokens[i];
      var next = this.tokens[i+1];
      exports.push(curr.exportToQuery(prev, next));
    }
    return exports.join(' ');
  }

}

module.exports = PartialQuery;
