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

var DBInfo = require('../data/DBInfo');
var Colors = require('../constants/Colors');
var KeywordKeyboardView = require('../views/KeywordKeyboardView');
var PartialQuery = require('../query/PartialQuery');
var ColumnToken = require('../tokens/ColumnToken');
var TableToken = require('../tokens/TableToken');

var QueryKeyboard = React.createClass({

  /**
   * @public methods
   */
  getQueryString: function() {
    return this.state.partialQuery.exportToStringQuery();
  },

  propTypes: {
    database: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      partialQuery: new PartialQuery(),
      insertIndex: 0,
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
    if (this.state.isLoadingTables) {
      return (
        <View style={[styles.wrapper, styles.loading]}>
          <ActivityIndicatorIOS
            size="large" 
            color="grey"
          />
        </View>
      );
    }

    return (
      <ScrollView style={styles.wrapper}>
        <Text style={styles.queryText}>
          {this.state.partialQuery.exportToStringQuery()}
        </Text>
        <KeywordKeyboardView
          onSelected={this._addToken}
        />
        <Text>
          {this.state.insertIndex}
        </Text>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={this._onLeftPressed}>
          <Text>
            {'<-'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={this._onRightPressed}>
          <Text>
            {'->'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={this._onDeletePressed}>
          <Text>
            {'X'}
          </Text>
        </TouchableOpacity>
        {this.state.tables.map(
          tableName => this.renderTable(tableName),
        )}
      </ScrollView>
    );
  },

  renderTable: function(tableName) {
    var cols = this.state.tableInfo[tableName];
    var content = null;
    if (!cols) {
      content = (
        <ActivityIndicatorIOS
          size="small"
          color="grey"
        />
      );
    } else {
      content = this.renderColumnsForTable(tableName, cols);
    }

    return (
      <View key={tableName}>
        <View style={styles.tableHeader}>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => this._onTablePressed(tableName)}>
            <View style={styles.tableWrapper}>
              <Text style={styles.tableName}>
                {tableName}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.columnsContainer}>
          {content}
        </View>
      </View>
    );
  },

  renderColumnsForTable: function(tableName, cols) {
    return cols.map(col =>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => this._onColPressed(tableName, col)}
        key={`${tableName}_${col.name}`}>
        <View style={styles.columnContainer}>
          <Text style={styles.columnText}>
            {col.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  _onDeletePressed: function() {
    if (this.state.partialQuery.getNumTokens() <= 0) {
      return;
    }

    this.state.partialQuery.deleteTokenAtIndex(
      // If we are all the way at the beginning,
      // just delete the token to the right.
      Math.max(
        this.state.insertIndex - 1,
        0,
      ),
    );
    this._onLeftPressed();
  },

  _onLeftPressed: function() {
    this.setState({
      insertIndex: Math.max(0, this.state.insertIndex -1),
    });
  },

  _onRightPressed: function() {
    this.setState({
      insertIndex: Math.min(
        this.state.partialQuery.getNumTokens(),
        this.state.insertIndex + 1,
      ),
    });
  },

  _addToken: function(token) {
    this.state.partialQuery.addTokenAtIndex(
      this.state.insertIndex,
      token,
    );
    this.setState({
      insertIndex: this.state.insertIndex + 1,
    });
  },

  _onTablePressed: function(tableName) {
    this._addToken(
      new TableToken(tableName),
    );
  },

  _onColPressed: function(tableName, colInfo) {
    this._addToken(
      new ColumnToken(tableName, colInfo),
    );
  },

});

var styles = StyleSheet.create({
  queryText: {
    color: Colors.TEXT_BASE,
  },
  columnsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  columnText: {
    color: Colors.TEXT_BASE,
  },
  columnContainer: {
    padding: 4,
    backgroundColor: Colors.SHADE2,
    borderRadius: 4,
    margin: 4,
  },
  tableWrapper: {
    backgroundColor: Colors.SHADE1,
    borderColor: Colors.SHADE2,
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    margin: 4,
  },
  tableHeader: {
    alignItems: 'center',
  },
  tableName: {
    color: Colors.TEXT_BASE,
  },
  wrapper: {
    flex: 1,
  },
  loading: {
    padding: 10,
  },
});

module.exports = QueryKeyboard;
