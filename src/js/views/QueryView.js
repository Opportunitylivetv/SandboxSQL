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
var QueryResultView = require('../views/QueryResultView');

var database = DB.getMusicDB();

var QueryView = React.createClass({

  getInitialState: function() {
    return {
      isLoading: false,
      query: null,
      queryText: `SELECT * FROM Artist WHERE Name LIKE '%Aaron%'`,
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
          value={this.state.queryText}
          onChangeText={(queryText) => this.setState({queryText})}
        />
        <TouchableHighlight
          style={styles.execute}
          underlayColor="#005F6B"
          onPress={this.executeQuery}>
          <Text>
            Query dude!
          </Text>
        </TouchableHighlight>
        {!this.state.query ? null :
          <QueryResultView
            key={this.state.query}
            database={database}
            query={this.state.query}
          />
        }
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
    console.log('executing', this.state.queryText);
    this.setState({
      query: this.state.queryText,
    });
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
