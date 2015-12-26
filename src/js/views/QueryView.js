var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
} = React;
var DB = require('../data/DB');

var SQLite = require('react-native-sqlite');
var database = DB.getMusicDB();

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

var styles = StyleSheet.create({
  execute: {
    backgroundColor: '#D1E7F9',
  },
  wrapper: {
    backgroundColor: '#F8F9E7',
    flex: 1,
    justifyContent: 'center',
  },
});

module.exports = QueryView;
