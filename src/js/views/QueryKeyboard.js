var React = require('react-native');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  PropTypes,
  TextInput,
} = React;

var DBInfo = require('../data/DBInfo');

var QueryKeyboard = React.createClass({

  propTypes: {
    database: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      isLoadingTables: true,
      isLoadingCols: true,
      tables: null,
      tableInfo: {},
    };
  },

  componentDidMount: function() {
    DBInfo.getTables(this.props.database, (tables) => {
      this.setState(
        {
          tables,
          isLoadingTables: false,
        },
        () => this.getCols(),
      );
    });
  },

  getCols: function() {
    this.state.tables.forEach((tableName) => {
      DBInfo.getColumnsForTable(
        this.props.database, 
        tableName,
        (cols) => {
          console.log(tableName, cols);
          var tableInfo = this.state.tableInfo;
          tableInfo[tableName] = cols;
          this.setState({
            tableInfo,
          }, () => {
            if (Object.keys(this.state.tableInfo).length ===
                this.state.tables.length) {
              this.setState({
                isLoadingCols: false,
              })
            }
          });
        },
      );
    });
  },

  render: function() {
    return (
      <View>
        <Text>
          is loading tables:
          {this.state.isLoadingTables ? 'true' : 'false'}
        </Text>
        <Text>
          is loading cols:
          {this.state.isLoadingCols ? 'true' : 'false'}
        </Text>
      </View>
    );
  },

});

var styles = StyleSheet.create({
});

module.exports = QueryKeyboard;
