/**
 * Example of using react-native-sqlite
 */
'use strict';

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight,
  RecyclerViewBackedScrollView,
  TextInput,
  ListView,
} = React;

var SQLite = require('react-native-sqlite');

// Open the Chinook sample database from the Apache foundation.
// This is included in the bundle in xcode but will be copied to the
// app sandbox's documents directory on first use.
var database = SQLite.open("chinook.sqlite");

var rethrowOr = (cb) => {
  return (err) => {
    if (err) {
      throw err;
    }
    cb && cb();
  };
};

var SQLiteExample = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          component: QueryView,
          title: 'Query',
        }}
      />
    );
  }
});

var QueryView = React.createClass({

  getInitialState: function() {
    return {
      isLoading: false,
      error: null,
      query: `SELECT * FROM Artist WHERE Name LIKE '%Aaron%'`,
      rows: [],
    };
  },

  render: function() {
    return (
      <View style={styles.wrapper}>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          multiline={true}
          value={this.state.query}
          onChangeText={(query) => this.setState({query})}
        />
        <Text>
          Execute:
          {this.state.query}
          ?
        </Text>
        <TouchableHighlight
          style={styles.execute}
          underlayColor="#005F6B"
          onPress={this.executeQuery}>
          <Text>
            Query bro!
          </Text>
        </TouchableHighlight>
        <Text>
          Num Rows:
          {this.state.rows.length}
          {this.state.rows.map(
            row => JSON.stringify(row)
          ).join(', ')}
        </Text>
        <Text>
          {!this.state.error ? null : this.state.error.toString()}
        </Text>
        <TouchableHighlight
          underlayColor="#005F6B"
          onPress={this.navToArtists}>
          <Text>
            All Artists
          </Text>
        </TouchableHighlight>
      </View>
    );
  },

  navToArtists: function() {
    this.props.navigator.push({
      title: 'Artists',
      component: Artists,
    });
  },

  executeQuery: function() {
    var rows = [];
    database.executeSQL(
      this.state.query, 
      [], 
      (row) => rows.push(row),
      (err) => {
        this.setState({
          error: err,
          rows,
        });
      },
    );
  },

});

var Artists = React.createClass({
  render: function () {
    return (
      <View style={styles.wrapper}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderArtist}
          renderScrollComponent={
            props => <RecyclerViewBackedScrollView {...props} />
          }
        />
      </View>
    );
  },

  getInitialState: function () {
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.name !== r2.name }
    );
    return { 
      dataSource,
      manualQuery: '',
    };
  },

  componentDidMount: function () {
    var artists = [];
    database.executeSQL(
      `
      SELECT
        Artist.ArtistId, 
        Artist.Name, 
        count(DISTINCT Album.AlbumId) as AlbumCount, 
        count(DISTINCT Track.TrackId) as TrackCount 
      FROM Artist
      JOIN Album ON Album.ArtistId = Artist.ArtistId
      JOIN Track ON Track.AlbumId = Album.AlbumId
      GROUP BY Artist.ArtistId
      ORDER BY Artist.Name
      `,
      [],
      (row) => {
        artists.push(row);
      },
      rethrowOr(() => this.setState({dataSource: this.state.dataSource.cloneWithRows(artists)})),
    );
  },

  _renderArtist: function (artist) {
    return (
      <TouchableHighlight onPress={() => this._selectArtist(artist)}>
        <View>
          <View style={styles.listItem}>
            <Text style={styles.listItemTitle}>{artist.Name}</Text>
            <Text style={styles.listItemSubtitle}>{artist.AlbumCount} albums, {artist.TrackCount} songs</Text>
          </View>
          <View style={styles.seperator}/>
        </View>
      </TouchableHighlight>
    );
  },

  _selectArtist: function (artist) {
    this.props.navigator.push({
      title: artist.Name,
      component: Albums,
      passProps: {artistId: artist.ArtistId}
    });
  }
});

var Albums = React.createClass({
  render: function () {
    return (
      <View style={styles.wrapper}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderTrack}
          renderSectionHeader={this._renderSectionHeader}
          />
      </View>
    );
  },

  getInitialState: function () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds
    };
  },

  componentDidMount: function () {
    var tracks = {};
    database.executeSQL(
      `
      SELECT 
        Album.Title as AlbumName, 
        Track.TrackId, 
        Track.Name 
      FROM Track
      JOIN Album ON Album.AlbumId = Track.AlbumId
      WHERE Album.ArtistId = ?
      ORDER BY Album.Title, Track.Name
      `,
      [this.props.artistId],
      (row) => {
        tracks[row.AlbumName] = tracks[row.AlbumName] || [];
        tracks[row.AlbumName].push(row);
      },
      (error) => {
        if (error) {
          throw error;
        } else {
          this.setState({dataSource: this.state.dataSource.cloneWithRowsAndSections(tracks)});
        }
      });
  },

  _renderTrack: function (track) {
    return (
      <TouchableHighlight onPress={() => this._selectTrack(track)}>
        <View>
          <View style={styles.listItem}>
            <Text style={styles.listItemTitle}>{track.Name}</Text>
          </View>
          <View style={styles.seperator}/>
        </View>
      </TouchableHighlight>
    );
  },

  _renderSectionHeader: function (sectionData, sectionId) {
    return (
      <View>
        <View style={styles.albumHeading}><Text>{{ sectionId }}</Text></View>
        <View style={styles.seperator}/>
      </View>
    );
  },

  _selectTrack: function (track) {
    this.props.navigator.push({
      title: track.Name,
      component: Track,
      passProps: {trackId: track.TrackId}
    });
  }
});


var Track = React.createClass({
  render: function () {
    return (
      <View style={styles.wrapper}>
        <Text>{this.state.track.Name} composed by {this.state.track.Composer || 'unknown'} is {this.state.track.Milliseconds}ms long</Text>
      </View>
    );
  },

  getInitialState: function () {
    return {
      track: {}
    };
  },

  componentDidMount: function () {
    var tracks = {};
    database.executeSQL(
      `
      SELECT * FROM Track WHERE TrackId = ?
      `,
      [this.props.trackId],
      (row) => {
        this.setState({track: row});
      },
      rethrowOr(),
    );
  }
});

var styles = StyleSheet.create({
  execute: {
    backgroundColor: '#D1E7F9',
  },
  container: {
    flex: 1,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  seperator: {
    height: 1,
    backgroundColor: 'black'
  },
  listItem: {
    padding: 10
  },
  listItemSubtitle: {
    fontStyle: 'italic',
    fontSize: 10
  },
  albumHeading: {
    padding: 3,
    backgroundColor: "#ccc",
  }
});


AppRegistry.registerComponent('SQLiteExample', () => SQLiteExample);
