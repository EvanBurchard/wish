fs = require('fs');
wish = (function(){
  var messageConditionalMap = {"===": "to be equal(===) to",
                          "!==": "not to be equal(!==) to",
                          "!=": "not to be equal(!=) to",
                          "==": "to be equal(==) to",
                          "<=": "to be less than or equal(<=) to",
                          "<": "to be less than(<)",
                          ">=": "to be greater than or equal(>=) to",
                          ">": "to be greater than(>)"};

  var composeInnerMessage = function(operator){
    return messageConditionalMap[operator];
  };

  var stripSpaces = function(string){
    var regex = new RegExp(/^ *([!,\w]*) *$/);
    try{
      string.match(regex)[1];
    }catch (e) {
      return string;
    }
    return string.match(regex)[1];
  };

  var getSides = function(parts){
    var left = stripSpaces(parts[0]);
    var right = stripSpaces(parts[1]);
    return [left, right]
  };

  var formatMessage = function(left, inner, right){
    return "\n\tExpected \"" + left + "\" "+ inner + " \"" + right + "\".";
  };

  var getMessage = function(expression, operator){
    var parts = expression.split(operator);
    var innerMessage = composeInnerMessage(operator);
    var sides = getSides(parts);
    return formatMessage(sides[0], innerMessage, sides[1]);
  };

  var bareFalseAssertion = function(assertion){
    return stripSpaces(assertion);
  };

  var composeMessage = function(assertion){
    var operators = ["===", "!==", "!=", "==", "<=", "<", ">=", ">"];
    var operator;
    for(var i = 0; i < operators.length; i++){
      operator = new RegExp(operators[i]);
      if (operator.test(assertion)){
        return getMessage(assertion, operators[i]);
      };
    };
    return "\n\texpression: \"" + bareFalseAssertion(assertion) + "\" evaluated to false";
  };

  var getErrorObject = function(){
    try { throw Error('') } catch(err) { return err; }
  };

  var setLineExpression = function(line, expression){
    line.expression = expression;
    return line;
  }

  var createLineFromErrorObject = function(){
    var stackLevel = 7;
    var line = {};
    line.full = getErrorObject().stack.split("\n")[stackLevel];
    line.fileName = line.full.match(/(\/.*\.js)/)[1];
    line.number = line.full.match(/.js:([0-9]*)/)[1];
    return line;
  };

  var parseLine = function(content, lineNumber){
    return content.split("\n")[lineNumber].match(/\((.*)\)/)[1];
  };

  var getExpression = function(){
    var line = createLineFromErrorObject();
    var content = fs.readFileSync(line.fileName, "utf8")
    return parseLine(content, line.number-1)
  };

  var handleError = function(actual){
    var expression = getExpression();
    var message = composeMessage(expression);
    var error = new Error(message);
    error.name = "WishError";
    throw error;
  };

  return function(assertion){
    if (!!(assertion)){
      return true;
    }
    else{
      handleError();
    }
  };
})();

module.exports = wish;
