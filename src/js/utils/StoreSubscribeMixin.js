"use strict";

/**
 * Implement "this.storeChanged" for this mixin.
 */
var StoreSubscribeMixin = (stores) => {
  return {
    componentDidMount() {
      stores.forEach(store =>
        store.subscribe(this._handleStoresChanged)
      );
    },

    componentWillUnmount() {
      stores.forEach(store =>
        store.unsubscribe(this._handleStoresChanged)
      );
    },

    _handleStoresChanged() {
      if (this.isMounted()) {
				this.storeChanged();
      }
    }
  };
};

module.exports = StoreSubscribeMixin;
