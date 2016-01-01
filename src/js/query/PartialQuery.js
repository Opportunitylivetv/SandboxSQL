var TokenTypes = require('../constants/TokenTypes');

class PartialQuery {

  constructor(
  ) {
    this.tokens = [];
  }

  addToken(token) {
    this.tokens.push(token);
  }

  getNumTokens() {
    return this.tokens.length;
  }

  addTokenAtIndex(index, token) {
    var before = this.tokens.slice(0, index);
    var after = this.tokens.slice(index);
    before.push(token);
    this.tokens = before.concat(after);
  }

  deleteTokenAtIndex(index) {
    var before = this.tokens.slice(0, index + 1);
    var after = this.tokens.slice(index + 1);
    before.pop();
    this.tokens = before.concat(after);
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
