var React = require('react-native');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  PropTypes,
  TextInput,
  ScrollView,
} = React;

var Colors = require('../constants/Colors');
var PartialQueryStore = require('../stores/PartialQueryStore');
var StoreSubscribeMixin = require('../utils/StoreSubscribeMixin');

var PartialQueryView = React.createClass({

  mixins: [StoreSubscribeMixin([
    PartialQueryStore,
  ])],

  storeChanged: function() {
    // This is probably acceptable for now
    this.forceUpdate();
  },

  render: function() {
    return (
      <View>
        <Text style={styles.queryText}>
          {PartialQueryStore.exportToStringQuery()}
        </Text>
      </View>
    );
  },
 
});

var styles = StyleSheet.create({
  queryText: {
    color: Colors.TEXT_BASE,
  },
});

module.exports = PartialQueryView;
