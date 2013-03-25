Do you ever forget whether your assertion library syntax is "5.should eq(5)" or "should.equal(5, 5)" or "5.should.strictEqual(5)" or "should.be.ok(5, 5)"? 

I do. All the damn time.  _Wish_ lets you test code, not your memory of ever changing matcher syntax that varies from testing library to testing library.  

## Basic Usage
Wish assertions look like this:
wish(5 == 5);

No need to learn a new syntax in order to write assertions.

Wish takes one parameter: a JavaScript expression that will return true or false.  If it fails, the exception will be passed on to the testing framework.  If it passes, it will return true and no exception will be thrown.

## Supported assertion statements
Here are some of the ways that you could use wish with mocha for the contexts:

    suite('client tests', function(){
            test("all of these should be true", function(){
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
    
                //these will throw an error, because they are falsy
                //wish(null);
                //wish(undefined);
                //wish('');
                //wish("");
                //wish(NaN);
                //wish(0);
                //wish(false);
                //wish(!!0);
                //wish(!!false);
                //wish(!true);
            });
    });

## Contributing
Pull requests and comments are welcome.  Please write tests if you are so inclined.

Note: There is a bit of extra complexity that comes with having wish test itself.  The wish(wish(something) == something) meta assertions do not have fantastic errors along with their failures.  To keep things simple and avoid a more complex code parsing system, this is not a priority.  

## Considerations and Limitations
Although tests will still pass/fail appropriately, in order to see good error messages, wish statements should be on one line.  Arguably, you shouldn't have assertions that take up multiple lines anyways.

There are a lot of fancy tests that other assertion libraries perform.  All assertions inside of wish are just code, so if you want to test existence, if something will throw an error, or some other higher level idea, you will have to use one of those libraries, or write the functions to check for those yourself.  

Cheers,

-Evan

