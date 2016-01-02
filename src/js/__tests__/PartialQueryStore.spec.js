var assert = require('assert');

var PartialQueryActions = require('../actions/PartialQueryActions');
var PartialQueryStore = require('../stores/PartialQueryStore');

describe('partial query store', () => {

  describe('insertIndex', () => {
    it('can increment and decrement', function() {
      assert.equal(PartialQueryStore.getInsertIndex(), 0);
    });
  })

});
