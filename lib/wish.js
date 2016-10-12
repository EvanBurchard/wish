var getExpression = require('./get-expression')
var environment = function(){
  if(require.main){
    return "file";
  }else{
    return "console";
  }
}

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
    return "\n\texpression: \"" + bareFalseAssertion(assertion) + "\" evaluated to falsey";
  };

  var getIt = function(){
    return getExpression();
  }
  var handleError = function(actual){
    var expression = getIt();
    var message = composeMessage(expression);
    var error = new Error(message);
    error.name = "WishError";
    throw error;
  };

  var characterizationError = function(expression, actual){
    var parsedExpression = expression.match(/(.*),\W*true/)[1];
    var serializedIfNeeded;
    if(actual instanceof Map){
      serializedIfNeeded = JSON.stringify(Array.from(actual.entries()));
    } else if(actual instanceof Set){
      serializedIfNeeded = JSON.stringify(Array.from(actual.values()));
    } else {
      serializedIfNeeded = JSON.stringify(actual);
    }
    return new Error(`${parsedExpression} evaluated to ${serializedIfNeeded}`);
  };

  var handleCharacterization = function(actual){
    var expression = getIt();
    var error = characterizationError(expression, actual);
    error.name = "WishCharacterization";
    throw error;
  };

  return function wish(assertion, characterizing = false, _again = true){
    if (characterizing){
      handleCharacterization(assertion);
    } else if (!(assertion)){
      handleError(assertion);
    }
    else{
      return true;
    }
  };
})();

module.exports = wish;
