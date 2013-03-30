var fs = require('fs');
var wishe = require('../lib/wishe');

function assertErrorMessage(expectedMessage, thrower) {
  var error = {};
  try{
    thrower();
  }catch(e){
    error.name = e.name;
    error.message = e.message;
  };
  wishe(error.name === 'WishError');
  wishe(error.message === expectedMessage);
}

suite("wishe tests", function(){
  test("should confirm true statements are wished as true", function(){
    wishe(wishe(4 == 4)==true);
    wishe(wishe(4 === 4)==true);
    wishe(wishe(5 != 4)==true);
    wishe(wishe(5 !== 4)==true);
    wishe(wishe(5 > 4)==true);
    wishe(wishe(4 >= 4)==true);
    wishe(wishe(9 >= 4)==true);
    wishe(wishe(2 < 4)==true);
    wishe(wishe(4 <= 4)==true);
    wishe(wishe(2 <= 4)==true);
  });

  test("give an error describing the expression if no conditional operator is present (ie. false)", function(){
    assertErrorMessage('Assertion failed: "false"', function() {
      wishe(false);
    });
  });

  test("give an error descibing the expression if no conditional operator is present (ie. 0)", function(){
    assertErrorMessage('Assertion failed: "0"', function() {
      wishe(0);
    });
  });

  test("return a decent error for ==", function(){
    assertErrorMessage('Assertion failed: "8 == 4"', function() {
      wishe(8 == 4);
    });
  });

  test("return a decent error for ===", function(){
    assertErrorMessage('Assertion failed: "8 === 4"', function() {
      wishe(8 === 4);
    });
  });

  test("TODO: inspect variables", function(){
    var temp = 24;
    assertErrorMessage('Assertion failed: "temp === 42"', function() {
      wishe(temp === 42);
    });
  });
});