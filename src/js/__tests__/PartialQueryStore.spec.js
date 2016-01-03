var assert = require('assert');

var PartialQueryActions = require('../actions/PartialQueryActions');
var PartialQueryStore = require('../stores/PartialQueryStore');
var ColumnToken = require('../tokens/ColumnToken');
var KeywordToken = require('../tokens/KeywordToken');
var TableToken = require('../tokens/TableToken');

function _addToken(token) {
  PartialQueryActions.addToken(token);
}

function _colToken(name) {
  return new ColumnToken(name || 'Foo', {});
}

describe('partial query store', () => {

  describe('insertIndex', () => {
    it('can increment and decrement', function() {
      assert.equal(PartialQueryStore.getInsertIndex(), 0);
      PartialQueryActions.incrementInsertIndex();
      // since no tokens yet
      assert.equal(PartialQueryStore.getInsertIndex(), 0);
      _addToken(_colToken());
      _addToken(_colToken());
      // we added two
      assert.equal(PartialQueryStore.getInsertIndex(), 2);
      PartialQueryActions.incrementInsertIndex();
      // its maxed
      assert.equal(PartialQueryStore.getInsertIndex(), 2);
      PartialQueryActions.decrementInsertIndex();
      assert.equal(PartialQueryStore.getInsertIndex(), 1);
      PartialQueryActions.decrementInsertIndex();
      assert.equal(PartialQueryStore.getInsertIndex(), 0);
      PartialQueryActions.decrementInsertIndex();
      assert.equal(PartialQueryStore.getInsertIndex(), 0);
    });
  })

});
