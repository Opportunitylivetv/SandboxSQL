/**
 * Example of using react-native-sqlite
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  RecyclerViewBackedScrollView,
  TextInput,
  ListView,
} = React;
var QueryView = require('./src/js/views/QueryView');
var AllArtistsView = require('./src/js/views/AllArtistsView');
var Routes = require('./src/js/constants/Routes.js');

var INITIAL_ROUTE = Routes.ALL_ARTISTS;
var SQLiteExample = React.createClass({
  
  renderScene: function(route, navigator) {
    switch (route.id) {
      case Routes.ALL_ARTISTS:
        return <AllArtistsView navigator={navigator} />;
      case Routes.QUERY:
        return <QueryView navigator={navigator} />;
      case Routes.ARTIST:
        return (
          <ArtistView 
            navigator={navigator} 
            artistID={route.artistID}
          />
        );
    }
    throw new Error('No route found for ' + route.id);
  },

  render: function() {
    return (
      <Navigator
        style={styles.container}
        renderScene={this.renderScene}
        initialRoute={Routes.getRouteForID(INITIAL_ROUTE)}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('SQLiteExample', () => SQLiteExample);
