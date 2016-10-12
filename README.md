Do you ever forget whether your assertion library syntax is "5.should eq(5)" or "should.equal(5, 5)" or "5.should.strictEqual(5)" or "should.be.ok(5, 5)"?

I do. All the damn time.  _Wish_ lets you test code, not your memory of ever changing matcher syntax that varies from testing library to testing library and project to project.

## Installation:
```
npm install wish
```

Then in your file or in a node REPL:

```
const wish = require('wish');
```

And wish away:

```
wish(five() === 5);
wish(thisFunctionShouldBeTrue());
```

## Basic Usage
Wish assertions look like this:

```
wish(5 === 5);
```
No need to learn a new syntax in order to write assertions.

Wish takes one parameter: a JavaScript expression that will return true or false.  If it fails, the exception will be passed on to the testing framework.  If it passes, it will return true and no exception will be thrown.

## Without external testing framework
You don't need a test framework like mocha to get benefit from wishing.  You can see if things are going wrong in your application by checking with a simple statement to make sure that the variable you are not sure about equals 5:

It's like console.assert, but with better error messages.

### Simple Assertions (1 paramter that is a JavaScript Expression)

```
wish(variable_that_should_be_five === 5);
```

### Characterization Mode (2 paramters: a JavaScript Expression and a true literal)

When you don't know what something does, you need a "characterization
test" to figure it out. Basically, this is like a logging output, but
makes it very clear by raising an error. Inside of the error, the value
will reveal itself for you to make a test for.

```
wish(whatDoesThisDo(), true);
```

You'll get an error like this:

```
WishCharacterization: whatDoesThisDo() evaluated to 3
```

Then it's easy to create an assertion (inside or outside of a test
framework):

```
wish(whatDoesThisDo() === 3);
```


## With Testing Framework
Here are some of the ways that you could use wish using mocha as an example.  Keep in mind that any test framework that fails tests when an error is thrown (all of them?) will work.

###
```
//with mocha
describe('client tests', function(){
  test("all of these should be true", function(){
    wish(5 == 5);
  });
});
```

```
//with tape
const test = require('tape');
test("all of these should be true", function(assert){
  wish(5 == 5);
  assert.pass();
  assert.end();
});
```

## Supported Assertions
Any normal JavaScript should work inside of a wish statement.  For example, these will all pass:

```
//simple checks
wish(5 == 5);
wish(4 === 4);
wish(3 < 4);
wish(9 >= 4);
wish(9 > 8);

//with variables
var x = 2;
wish(x != 8);

//with function called ahead of time
var y = function(){return 2};
wish(y() <= 4);

//with immediately executing functions
wish((function(){ return 4 })()!== 3);

//arrays objects, and functions will not throw an error, even if they are empty
wish([]);
wish({});
wish(function(){});

//any string with a length greater than 0 is also truthy, so these pass:
wish("hello");
wish("hi");
wish("h");

//Infinity and non-zero numbers are also truthy
wish(Infinity);
wish(433);
wish(4.33);

//You can also use !! syntax
wish(!![]);
wish(!!{});
wish(!!function(){});
wish(!!(9 >= 4));
wish(!!Infinity);
wish(!!433);
wish(!!4.33);
```

These will throw an error, because the values returned are falsy.  Their error messages will display the expression passed in.

```
wish(null);
wish(undefined);
wish('');
wish("");
wish(NaN);
wish(0);
wish(false);
wish(!!0);
wish(!!false);
wish(!true);
```

These will throw an error, because they are damned lies.  Their error messages will display the expression with an expectation in a human readable format.

```
wish(3 == 5);
wish(9 === 4);
wish(100 < 4);
wish(0 >= 4);
wish(4 != 4);
```


## Contributing
Pull requests and comments are welcome.

Note: There is a bit of extra complexity that comes with having wish test itself.  The wish(wish(something) == something) meta assertions do not yet have fantastic errors along with their failures.  To keep things simple and avoid a more complex code parsing system, this is not a priority.

## Roadmap
- Browser/browser REPL Support
- Multi-line Support

## Considerations and Limitations
Although tests will still pass/fail appropriately, in order to see good error messages, wish statements should be on one line.  Arguably, you shouldn't have assertions that take up multiple lines anyways.

There are a lot of fancy tests that other assertion libraries perform.  All assertions inside of wish are just code, so if you want to test existence, if something will throw an error, or some other higher level idea, you will have to use one of those libraries, or write the functions to check for those yourself.

In particular, you might miss ```assert.deepEqual``` for its ability to check
objects and arrays. You can import a standalone
library easily with npm install deep-equal and require it with
```deepEqual = require('deep-equal');```
Then use it in assertions like this:
```wish(deepEqual(arrayOrObjectOne, arrayOrObjectTwo));```

## Thanks

I hope you get some value out of wish.  If you want to get in touch outside of github, you can get in touch through [evanburchard.com/contact](http://evanburchard.com/contact).

Big thanks to khoomeister for his contributions of better modularity and alternative error messages (check out the wishe.js and get-expression.js files).

Cheers,

-Evan

