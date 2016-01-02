"use strict";

var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var ActionTypes = AppConstants.ActionTypes;
class PartialQueryActions {
  addToken(token) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.ADD_TOKEN,
      token: token,
    });
  }

  deleteToken(token) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.DELETE_TOKEN,
      token: token,
    });
  }

  incrementInsertIndex() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.INCREMENT_INSERT_INDEX,
      token: token,
    });
  }

  decrementInsertIndex() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.DECREMENT_INSERT_INDEX,
      token: token,
    });
  }
  
}

module.exports = PartialQueryActions;
