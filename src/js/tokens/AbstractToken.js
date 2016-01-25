"use strict";

class AbstractToken {

  constructor(
  ) {
    this.prev = null;
    this.next = null;
    // hacky abstract check
    if (new.target === 'AbstractToken') {
      throw new TypeError('cannot instantiate directly');
    }
    if (this.getType === undefined) {
      throw new TypeError('must implemented getType');
    }
  }

  setPrevious(prev) {
    this.prev = prev;
  }

  setNext(next) {
    this.next = next;
  }

  getPrevious() {
    return this.prev;
  }

  getNext() {
    return this.next;
  }

}

module.exports = AbstractToken;
