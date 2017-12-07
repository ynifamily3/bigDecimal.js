const BigDecimal = require('./bigDecimal');
const assert = require('assert');

var w = BigDecimal("-4.0000");
var x = BigDecimal("00007.3");
var y = BigDecimal("0.0023");
var z = BigDecimal("-7.29999927", "1289"); //순환소수이다. (3.299992712891289...)

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
           assert.equal('-7', z.integer);
           assert.equal('1234', z.circulating);
       });
       it('정수 테스트', function() {
           assert.equal('-4', w.integer);
           assert.equal(true, w.isInteger);
       })
    });
});
console.log("아 : " + w);
console.log("아 : " + x);
console.log("아 : " + y);
console.log("아 : " + z);
