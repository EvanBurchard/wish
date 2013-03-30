var fs = require('fs');

var createLineFromErrorObject = function(){
  var stackLevel = 7;
  var line = {};
  line.full = getErrorObject().stack.split("\n")[stackLevel];
  line.fileName = line.full.match(/(\/.*\.js)/)[1];
  line.number = line.full.match(/.js:([0-9]*)/)[1];
  return line;
};

var getErrorObject = function(){
  try {
    throw Error('');
  } catch(err) {
    return err;
  }
};

var parseLine = function(content, lineNumber){
  // TODO: fix for lines with multiple function calls (e.g. func1(); test(); func3(); )
  return content.split("\n")[lineNumber].match(/\((.*)\)/)[1];
};

module.exports = function(){
  var line = createLineFromErrorObject();
  var content = fs.readFileSync(line.fileName, "utf8");
  return parseLine(content, line.number-1);
};