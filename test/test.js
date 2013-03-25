var wish = require("../index");
fs = require('fs');

suite("wish tests", function(){
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
    wish(error.name == "WishError" && error.message == '\n\texpression: "false" evaluated to false');
  });

  test("give an error descibing the expression if no conditional operator is present (ie. 0)", function(){
    var error = {};
    try{
      wish(0);
    }catch(e){
      error.name = e.name;
      error.message = e.message;
    };
    wish(error.name == "WishError" && error.message == '\n\texpression: "0" evaluated to false');
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
});
