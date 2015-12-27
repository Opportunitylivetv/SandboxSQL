var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
} = React;
var DB = require('../data/DB');
var DBInfo = require('../data/DBInfo');
var Routes = require('../constants/Routes');

var database = DB.getMusicDB();

var QueryView = React.createClass({

  getInitialState: function() {
    return {
      isLoading: false,
      error: null,
      query: `SELECT * FROM Artist WHERE Name LIKE '%Aaron%'`,
      rows: [],
      tables: null,
      tableInfo: null,
    };
  },

  componentDidMount: function() {
    DBInfo.getTables(database, (tables) => {
      this.setState(
        {tables},
        () => this._getCols(),
      );
    });
  },

  _getCols: function() {
    this.state.tables.forEach(function(tableName) {
      DBInfo.getColumnsForTable(database, tableName, () => {
        console.log('done getting cols for ', tableName);
      });
    });
  },

  render: function() {
    return (
      <View style={styles.wrapper}>
        <Text>
          Enter a query:
        </Text>
        <TextInput
          style={styles.textInput}
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
          {!this.state.tables ? 'Loading Tables...' : this.state.tables.join(',')}
        </Text>
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
    this.props.navigator.push(
      Routes.getRouteForID(Routes.ALL_ARTISTS),
    );
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
  textInput: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1,
  },
  execute: {
    backgroundColor: '#D1E7F9',
  },
  wrapper: {
    backgroundColor: '#F8F9E7',
    flex: 1,
  },
});

module.exports = QueryView;
