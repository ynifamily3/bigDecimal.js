var BigDecimal = require('./bigDecimal.js');
var assert = require('assert');

var number1 = BigDecimal("10.25");
var number2 = BigDecimal("23.33");
number1.add(1);
number1.add("1");
number1.add(BigDecimal("30"));
number1.add(function(){});
/*
describe('Array', function() {
    describe("#indexOf()", function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});
*/