"use strict";

class AbstractToken {

  constructor(
  ) {
    this.prev = null;
    this.next = null;
  }

  getPrevious() {
    return this.prev;
  }

  getNext() {
    return this.next;
  }

}

module.exports = AbstractToken;
