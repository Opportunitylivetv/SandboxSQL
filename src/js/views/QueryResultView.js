var React = require('react-native');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  Text,
  View,
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
    return {
      isLoading: true,
      error: null,
      rows: [],
    };
  },

  componentDidMount: function() {
    var rows = [];
    this.props.database.executeSQL(
      this.props.query,
      this.props.params || [],
      (row) => rows.push(row),
      (error) => {
        this.setState({
          isLoading: false,
          error,
          rows,
        });
      },
    );
  },

  render: function() {
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

    return (
      <View style={styles.wrapper}>
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
      </View>
    );
  },

});

var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  loading: {
    padding: 10,
  },
});

module.exports = QueryResultView;
