var BigDecimal = require('./bigDecimal.js');
var assert = require('assert');

var number1 = new BigDecimal("10.25");
var number2 = new BigDecimal("23.33");

var number3 = number1.add(number2);

/*
describe('Array', function() {
    describe("#indexOf()", function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});
*/