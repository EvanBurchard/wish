var fs = require('fs');
var wish = require("../index");

describe("wish tests", function(){
  test("should confirm true statements are wished as true", function(){
    wish(wish(5 == 5)==true);
    wish(wish(4 === 4)==true);
    wish(wish(5 != 4)==true);
    wish(wish(5 !== 4)==true);
    wish(wish(5 > 4)==true);
    wish(wish(4 >= 4)==true);
    wish(wish(9 >= 4)==true);
    wish(wish(2 < 4)==true);
    wish(wish(4 <= 4)==true);
    wish(wish(2 <= 4)==true);
  });

  test("give an error descibing the expression if no conditional operator is present (ie. false)", function(){
    var error = {};
    try{
      wish(false);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\texpression: "false" evaluated to falsey');
  });

  test("give an error descibing the expression if no conditional operator is present (ie. 0)", function(){
    var error = {};
    try{
      wish(0);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\texpression: "0" evaluated to falsey');
  });

  test("return a decent error for ==", function(){
    var error = {};
    try{
      wish(8 == 4);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\tExpected "8" to be equal(==) to "4".');
  });

  test("return a decent error for ===", function(){
    var error = {};
    try{
      wish(8 === 4);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\tExpected "8" to be equal(===) to "4".');
  });

  test("return a decent error for !=", function(){
    var error = {};
    try{
      wish(8 != 8);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\tExpected "8" not to be equal(!=) to "8".');
  });

  test("return a decent error for !==", function(){
    var error = {};
    try{
      wish(8 !== 8);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\tExpected "8" not to be equal(!==) to "8".');
  });

  test("return a decent error for <", function(){
    var error = {};
    try{
      wish(8 < 4);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\tExpected "8" to be less than(<) "4".');
  });

  test("return a decent error for <=", function(){
    var error = {};
    try{
      wish(8 <= 4);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\tExpected "8" to be less than or equal(<=) to "4".');
  });

  test("return a decent error for >", function(){
    var error = {};
    try{
      wish(2 > 4);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\tExpected "2" to be greater than(>) "4".');
  });

  test("return a decent error for >=", function(){
    var error = {};
    try{
      wish(2 >= 4);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\tExpected "2" to be greater than or equal(>=) to "4".');
  });

  test("provide a good message for null", function(){
    var error = {};
    try{
      wish(null);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\texpression: "null" evaluated to falsey');
  });

});

describe("characterization tests", function(){
  test("be useful for characterization tests of simple variables", function(){
    var error = {};
    var knownValue = 3;
    try{
      wish(knownValue, true);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name === 'WishCharacterization');
    wish(error.message === 'knownValue evaluated to 3');
  });
  //not handling this case
  //test("can parse when second argument and knownValue variable are complex", function(){
    //var error = {};
    //var knownValue = [8, 0];
    //try{
      //wish(knownValue,    !![2,3,4]);
    //}catch(e){
      //error.name = e.name;
      //error.message = e.message;
    //};
    //wish(error.name === 'WishCharacterization');
    //wish(error.message === 'knownValue evaluated to 8,0');
  //});
  test("can parse when characterizing a number", function(){
    var error = {};
    try{
      wish(3, true);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name === 'WishCharacterization');
    wish(error.message === '3 evaluated to 3');
  });
  test("can parse when characterizing a string", function(){
    var error = {};
    try{
      wish('hi', true);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name === 'WishCharacterization');
    wish(error.message === "'hi' evaluated to \"hi\"");
  });
  test("can ignore commas in strings", function(){
    var error = {};
    try{
      wish("hi, I'm a test", true);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name === 'WishCharacterization');
    wish(error.message === "\"hi, I'm a test\" evaluated to \"hi, I'm a test\"");
  });
  test("be useful for characterization tests of arrays", function(){
    var error = {};
    var knownValue = [4,5,6];
    try{
      wish(knownValue, true);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name === 'WishCharacterization');
    wish(error.message === 'knownValue evaluated to [4,5,6]');
  });
  test("be useful for characterization tests of objects", function(){
    var error = {};
    var knownValue = {a:4,b:5,c:6};
    try{
      wish(knownValue, true);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name === 'WishCharacterization');
    wish(error.message === "knownValue evaluated to {\"a\":4,\"b\":5,\"c\":6}");
  });
  test("be useful for characterization tests of maps", function(){
    var error = {};
    var map = new Map()
    map.set('key2', 'value2');
    try{
      wish(map, true);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name === 'WishCharacterization');
    wish(error.message === "map evaluated to [[\"key2\",\"value2\"]]");
  });
  test("be useful for characterization tests of sets", function(){
    var error = {};
    var set = new Set();
    set.add('value1');
    set.add('value2');
    try{
      wish(set, true);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name === 'WishCharacterization');
    wish(error.message === "set evaluated to [\"value1\",\"value2\"]");
  });
});

describe("environment", function(){
  let deepEqual = require('deep-equal');
  test("know when you're in a file", function(){
    if(require.main){
      wish(deepEqual(Object.create(require.main), {}));
    }
  });

});
