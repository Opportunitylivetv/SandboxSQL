"use strict";

var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var ActionTypes = AppConstants.ActionTypes;

var assign = require('object-assign');

/**
 * This store holds partial queries that are
 * based on tokens.
 *
 * Right now there is only one "global" query but
 * that might change in the future.
 */

var _tokens;
var _insertIndex;
var _resetState = function() {
  _tokens = [];
  _insertIndex = 0;
};
_resetState();

var _incrementInsertIndex = function() {
  _insertIndex = Math.min(
    _tokens.length,
    _insertIndex + 1
  );
};

var _decrementInsertIndex = function() {
  _insertIndex = Math.max(0, _insertIndex -1);
};

var PartialQueryStore = assign(
{},
EventEmitter.prototype,
AppConstants.StoreSubscribePrototype,
{
 
  getNumTokens() {
    return _tokens.length;
  },

  getInsertIndex() {
    return _insertIndex;
  },

  getTokens() {
    return _tokens.slice();
  },

  exportToStringQuery() {
    var exports = [];
    for (var i = 0; i < _tokens.length; i++) {
      var prev = _tokens[i-1];
      var curr = _tokens[i];
      var next = _tokens[i+1];
      exports.push(curr.exportToQuery(prev, next));
    }
    return exports.join(' ');
  },

  dispatchToken: AppDispatcher.register((payload) => {
    var action = payload.action;
    var shouldInform = false;

    switch (action.type) {
      case ActionTypes.ADD_TOKEN:
        shouldInform = true;
        var token = action.token;
        var before = _tokens.slice(0, _insertIndex);
        var after = _tokens.slice(_insertIndex);
        before.push(token);
        _tokens = before.concat(after);
        _incrementInsertIndex();
        break;

      case ActionTypes.DELETE_TOKEN:
        if (!_tokens.length) {
          break;
        }
        shouldInform = true;

        // If we are all the way at the beginning,
        // just delete the token to the right.
        var index = Math.max(
          0,
          _insertIndex - 1
        );
        var before = _tokens.slice(0, index + 1);
        var after = _tokens.slice(index + 1);
        before.pop();
        _tokens = before.concat(after);
        _decrementInsertIndex();
        break;

      case ActionTypes.INCREMENT_INSERT_INDEX:
        shouldInform = true;
        _incrementInsertIndex();
        break;

      case ActionTypes.DECREMENT_INSERT_INDEX:
        shouldInform = true;
        _decrementInsertIndex();
        break;
    }

    if (shouldInform) {
      this.emit(AppConstants.CHANGE_EVENT);
    }
  }),
});

module.exports = PartialQueryStore;
