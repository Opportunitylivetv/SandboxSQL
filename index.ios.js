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
  TouchableOpacity,
  RecyclerViewBackedScrollView,
  TextInput,
  ListView,
} = React;
var QueryView = require('./src/js/views/QueryView');
var AlbumsView = require('./src/js/views/AlbumsView');
var AllArtistsView = require('./src/js/views/AllArtistsView');
var Routes = require('./src/js/constants/Routes');
var Colors = require('./src/js/constants/Colors');

var NAV_BAR_HEIGHT = 44;
var SPACER_HEIGHT = 24;

var INITIAL_ROUTE = Routes.QUERY;

var _navBarRouteMapper = {

  Title: function(route, navigator) {
    var content = this.getTitleForRoute(route, navigator);
    return (
      <View style={{paddingTop: 10}}>
        {content}
      </View>
    );
  },

  getTitleForRoute: function(route, navigator) {
    switch (route.id) {
      case Routes.ALL_ARTISTS:
        return <Text>Artists</Text>;
      case Routes.QUERY:
        return <Text>Query DB</Text>;
      case Routes.ALBUMS:
        return <Text>Albums</Text>;
    }
    throw new Error('No title for route' + route.id);
  },

  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }
    var belowRoute = navState.routeStack[index-1];
    return (
      <TouchableOpacity onPress={() => navigator.popToRoute(belowRoute)}>
        <View style={{paddingTop: 10, paddingLeft: 10}}>
          <Text style={{color: '#0076FF'}}>
            {_navBarRouteMapper.getTitleForRoute(belowRoute)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator) {
  },
};

var SQLiteExample = React.createClass({

  renderScene: function(route, navigator) {
    return (
      <View style={styles.viewContainer}>
        {this.renderSceneImpl(route, navigator)}
      </View>
    );
  },

  sceneNeedsSpacer: function(route) {
    switch (route.id) {
      case Routes.QUERY:
        return true;
    }
    return false;
  },
 
  renderSceneImpl: function(route, navigator) {
    switch (route.id) {
      case Routes.ALL_ARTISTS:
        return <AllArtistsView navigator={navigator} />;
      case Routes.QUERY:
        return <QueryView navigator={navigator} />;
      case Routes.ALBUMS:
        return (
          <AlbumsView
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
        navigationBar={
          <Navigator.NavigationBar 
            style={styles.navBarContainer}
            routeMapper={_navBarRouteMapper}
          />
        }
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: {
    marginTop: 44 + 20,
    flex: 1,
  },
  navBarContainer: {
    backgroundColor: Colors.SHADE2,
  },
});

AppRegistry.registerComponent('SQLiteExample', () => SQLiteExample);
