const BigDecimal = require('./bigDecimal');
const assert = require('assert');

var x = BigDecimal("00007.3");
var y = BigDecimal("0.0023");
var z = BigDecimal("-7.227", "3"); //순환소수이다. (3.227333333....)

describe('BigDecimal', function() {
    describe('데이터 저장 테스트', function() {
       it('integer값이 문자열 7인지 검증', function() {
           assert.equal('7', x.integer);
       });
       it('denominator가 숫자 5인지, numerator가 문자열 0023인지 검증', function() {
          assert.equal(5, y.denominator);
          assert.equal('0023', y.numerator);
       });
       it('순환소수 테스트', function() {
           assert.equal(true, z.isCirculating);
           assert.equal('7', z.integer);
           assert.equal('3', z.circulating);
       })
    });
});

console.log("아 : " + x);
console.log("아 : " + y);
console.log("아 : " + z);