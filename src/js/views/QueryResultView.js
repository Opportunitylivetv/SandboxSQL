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

var rethrowOr = require('../utils/rethrowOr');

var QueryResultView = React.createClass({

  propTypes: {
    database: PropTypes.object.isRequired,
    query: PropTypes.string.isRequired,
    params: PropTypes.array,
  },

  getInitialState: function() {
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.name !== r2.name }
    );

    return {
      isLoading: true,
      error: null,
      rows: [],
      firstRow: null,
      dataSource,
    };
  },

  render: function () {
    if (this.state.isLoading) {
      return (
        <View style={[styles.wrapper, styles.loading]}>
          <ActivityIndicatorIOS 
            size="large" 
            color="grey"
          />
        </View>
      );
    }

    if (this.state.error) {
      return (
        <Text>
          {this.state.error.toString()}
        </Text>
      );
    }

    if (!this.state.firstRow) {
      return (
        <Text>
          Sorry, your query returned no results.
        </Text>
      );
    }

    return (
      <View style={styles.wrapper}>
        {this.renderColumnHeader()}
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          renderRow={this._renderCol}
        />
      </View>
    );
  },

  renderColumnHeader: function() {
    var values = [];
    Object.keys(this.state.firstRow).forEach(function(key) {
      values.push(
        <View style={styles.columnHeader} key={key}>
          <Text>
            {key}
          </Text>
        </View>
      );
    })
    return (
      <View style={styles.columnHeaderContainer}>
        {values}
      </View>
    );
  },

  _renderCol: function(col) {
    var values = [];
    Object.keys(col).forEach(function(key) {
      values.push(
        <View style={styles.column} key={key}>
          <Text>
            {col[key]}
          </Text>
        </View>
      );
    })
    return (
      <View style={styles.colContainer}>
        {values}
      </View>
    );
  },

  componentDidMount: function() {
    var rows = [];
    var firstRow = null;
    this.props.database.executeSQL(
      this.props.query,
      this.props.params || [],
      (row) => {
        firstRow = firstRow || row;
        rows.push(row);
      },
      (error) => {
        this.setState({
          isLoading: false,
          firstRow,
          error,
          rows,
          dataSource: this.state.dataSource.cloneWithRows(rows),
        });
      },
    );
  },
});

var styles = StyleSheet.create({
  colContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  columnHeaderContainer: {
    flexDirection: 'row',
  },
  columnHeader: {
    padding: 5,
    backgroundColor: '#0066cc',
    borderColor: 'grey',
    borderWidth: 1,
    flex: 1,
  },
  column: {
    padding: 5,
    borderColor: 'grey',
    borderWidth: 1,
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  loading: {
    padding: 10,
  },
});

module.exports = QueryResultView;
