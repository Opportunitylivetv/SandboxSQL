

var rethrowOr = require('../utils/rethrowOr');
var AlbumsView = React.createClass({
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
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: '#F8F9E7',
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

