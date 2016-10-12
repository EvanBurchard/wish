var fs = require('fs');

var environment = function(){
  if(require.main){
    return "file";
  }else{
    return "console";
  }
}
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
function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var getWishFromNodeHistory = function(){
  return fs.readFileSync(`${getUserHome()}/.node_repl_history`, "utf8").match(/(wish\((.*)\))/)[2]
}

module.exports = function(){
  if(environment()==="file"){
    var line = createLineFromErrorObject();
    var content = fs.readFileSync(line.fileName, "utf8");
    //return Promise.resolve(parseLine(content, line.number-1));
    return parseLine(content, line.number-1);
  }else{
    //return new Promise.resolve(getWishFromNodeHistory());
    return getWishFromNodeHistory();
  }
};
