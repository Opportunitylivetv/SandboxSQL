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
  return new ColumnToken('foo_table', {name: name || 'bar'});
}

function _keywordToken(name) {
  return new KeywordToken(name);
}

function _tableToken(name) {
  return new TableToken(name);
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
      PartialQueryActions.clearTokens();
    });
  });

  describe('can add and remove tokens', () => {
    PartialQueryActions.addToken(
      _keywordToken('SELECT')
    );
    PartialQueryActions.addToken(
      _colToken('*')
    );
    PartialQueryActions.addToken(
      _colToken('name')
    );
    PartialQueryActions.addToken(
      _keywordToken('FROM')
    );
    PartialQueryActions.addToken(
      _tableToken('foo_table')
    );
    assert.equal(
      PartialQueryStore.exportToStringQuery(),
      'SELECT *, name FROM foo_table'
    );
    PartialQueryActions.clearTokens();
  });

});
