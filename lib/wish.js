const fs = require('fs');
const environment = function(){
  if(require.main){
    return "file";
  }else{
    return "console";
  }
}

module.exports = (function(){
  const messageConditionalMap = {"===": "to be equal(===) to",
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
    const regex = new RegExp(/^ *([!,\w]*) *$/);
    try{
      string.match(regex)[1];
    }catch (e) {
      return string;
    }
    return string.match(regex)[1];
  };

  function getSides(parts){
    const left = stripSpaces(parts[0]);
    const right = stripSpaces(parts[1]);
    return [left, right]
  };

   function formatMessage(left, inner, right){
    return "\n\tExpected \"" + left + "\" "+ inner + " \"" + right + "\".";
  };

  function getMessage(expression, operator){
    const parts = expression.split(operator);
    const innerMessage = composeInnerMessage(operator);
    const sides = getSides(parts);
    return formatMessage(sides[0], innerMessage, sides[1]);
  };

  function basicFalseyMessage(assertion){
    return "\n\texpression: \"" + stripSpaces(assertion) + "\" evaluated to falsey"
  }

  function composeMessage(assertion){
    const operators = ["===", "!==", "!=", "==", "<=", "<", ">=", ">"];
    var foundOperator = operators.find((element) => assertion.includes(element));
    if(foundOperator){
      return getMessage(assertion, foundOperator);
    } else {
      return basicFalseyMessage(assertion);
    }
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
    const parsedExpression = expression.match(/(.*),\W*true/)[1];
    return `${parsedExpression} evaluated to ${handleComplexTypes(evaled)}`;
  };

  function getUserHome(){
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  };

  function createLineFromErrorObject(){
      const stackLevel = 6;
      const line = {};
      line.full = getErrorObject().stack.split("\n")[stackLevel];
      if (process.platform != 'win32') {
          line.fileName = line.full.match(/(\/.*\.js)/)[1];
      } else { line.fileName = line.full.match(/(\\.*\.js)/)[1]; }
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

  function getExpression(){
    if(environment()==="file"){
      const line = createLineFromErrorObject();
      const content = fs.readFileSync(line.fileName, "utf8");
      return parseLine(content, line.number-1);
    } else{
      return getWishFromNodeHistory();
    };
  };

  function getWishFromNodeHistory(){
    return repl.repl.history[0].match(/(wish\((.*)\))/)[2]
  };

  function makeError(name, message){
    const error = new Error(message)
    error.name = name;
    return error;
  }

  function handleFalseWish(){
    const message = composeMessage(getExpression());
    return makeError("WishError", message);
  };

  function handleCharacterization(evaled){
    const message = characterizationMessage(getExpression(), evaled);
    return makeError("WishCharacterization", message);
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
