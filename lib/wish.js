var fs = require('fs');
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

  function composeInnerMessage(operator){
    return messageConditionalMap[operator];
  };

  function stripSpaces(string){
    var regex = new RegExp(/^ *([!,\w]*) *$/);
    try{
      string.match(regex)[1];
    }catch (e) {
      return string;
    }
    return string.match(regex)[1];
  };

  function getSides(parts){
    var left = stripSpaces(parts[0]);
    var right = stripSpaces(parts[1]);
    return [left, right]
  };

   function formatMessage(left, inner, right){
    return "\n\tExpected \"" + left + "\" "+ inner + " \"" + right + "\".";
  };

  function getMessage(expression, operator){
    var parts = expression.split(operator);
    var innerMessage = composeInnerMessage(operator);
    var sides = getSides(parts);
    return formatMessage(sides[0], innerMessage, sides[1]);
  };

  function bareFalseAssertion(assertion){
    return stripSpaces(assertion);
  };

  function composeMessage(assertion){
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

  function handleComplexTypes(actual){
    if(actual instanceof Map){
      return JSON.stringify(Array.from(actual.entries()));
    } else if(actual instanceof Set){
      return JSON.stringify(Array.from(actual.values()));
    } else {
      return JSON.stringify(actual);
    }
  }

  function characterizationMessage(expression, evaled){
    var parsedExpression = expression.match(/(.*),\W*true/)[1];
    return `${parsedExpression} evaluated to ${handleComplexTypes(evaled)}`;
  };

  function getUserHome(){
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  };

  function getWishFromNodeHistory(){
    return fs.readFileSync(`${getUserHome()}/.node_repl_history`, "utf8").match(/(wish\((.*)\))/)[2]
  };

  function getTheExpression(){
    if(environment()==="file"){
      var line = createLineFromErrorObject();
      var content = fs.readFileSync(line.fileName, "utf8");
      return parseLine(content, line.number-1);
    } else{
      //throw(getWishFromNodeHistory());
      //return Promise.resolve(getWishFromNodeHistory());
      return getWishFromNodeHistory();
    };
  };

  function createLineFromErrorObject(){
      var stackLevel = 7;
      var line = {};
      line.full = getErrorObject().stack.split("\n")[stackLevel];
      line.fileName = line.full.match(/(\/.*\.js)/)[1];
      line.number = line.full.match(/.js:([0-9]*)/)[1];
      return line;
  };

  function getErrorObject(){
    try {
      throw Error('');
    } catch(err) {
      return err;
    }
  };

  function parseLine(content, lineNumber){
    return content.split("\n")[lineNumber].match(/\((.*)\)/)[1];
  };

  function handleFalseWish(){
    var message = composeMessage(getTheExpression());
    var error = new Error(message);
    error.name = "WishError";
    return error;
  };

  function handleCharacterization(evaled){
    var message = characterizationMessage(getTheExpression(), evaled);
    var error = new Error(message);
    error.name = "WishCharacterization";
    return error;
  };

  function throwIt(error){
    throw error;
  }

  return function wish(evaled, characterizing = false){
    if (characterizing){
      throwIt(handleCharacterization(evaled));
    } else if (!(evaled)){
      throwIt(handleFalseWish());
    }
    else{
      return true;
    }
  };
})();

module.exports = wish;
