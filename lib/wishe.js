var getExpression = require('./get-expression');

var handleError = function(actual){
  var message = 'Assertion failed: "' + getExpression() + '"';
  var error = new Error(message);
  error.name = "WishError";
  throw error;
};

module.exports = function(assertion){
  if (!assertion){
    handleError();
  } else {
    return true;
  }
};