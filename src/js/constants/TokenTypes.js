var keyMirror = require('../utils/keyMirror');

/**
 * Still not clear how we will handle
 * things like ORDER BY Country ASC, CustomerName DESC
 * ...
 */

module.exports = keyMirror({
  // Stuff like SELECT, FROM, JOIN, etc
  KEYWORD: null,
  // +, -, etc
  OPERATOR: null,
  // Column names. Probably will need to add
  // a concept for column aliases in a bit...
  COLUMN: null,
  // MIN(), MAX(), COUNT(), etc
  FUNCTION: null,
});
