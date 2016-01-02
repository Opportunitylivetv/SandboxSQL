var TokenTypes = require('../constants/TokenTypes');

class PartialQuery {

  constructor(
  ) {
    this.tokens = [];
    this.insertIndex = 0;
  }

  getNumTokens() {
    return this.tokens.length;
  }

  getInsertIndex() {
    return this.insertIndex;
  }

  decrementInsertIndex() {
    this.insertIndex = Math.max(0, this.insertIndex -1);
  }

  incrementInsertIndex() {
    this.insertIndex = Math.min(
      this.getNumTokens(),
      this.insertIndex + 1,
    );
  }

  addToken(token) {
    var index = this.insertIndex;
    var before = this.tokens.slice(0, index);
    var after = this.tokens.slice(index);
    before.push(token);
    this.tokens = before.concat(after);

    this.incrementInsertIndex();
  }

  deleteToken(index) {
    if (!this.getNumTokens()) {
      return;
    }

    // If we are all the way at the beginning,
    // just delete the token to the right.
    var index = Math.max(
      0,
      this.insertIndex - 1,
    );
    var before = this.tokens.slice(0, index + 1);
    var after = this.tokens.slice(index + 1);
    before.pop();
    this.tokens = before.concat(after);

    this.decrementInsertIndex();
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
