const BigDecimal = require('./bigDecimal');
const assert = require('assert');

var x = BigDecimal("00007.3");
var y = BigDecimal("0.0023");
var z = BigDecimal("-3.227", "3"); //순환소수이다. (3.227333333....)

describe('BigDecimal', function() {
    describe('데이터 저장 테스트', function() {
       it('integer값이 문자열 7인지 검증', function() {
           assert.equal('7', x.getState().integer);
       });
       it('denominator가 숫자 5인지, numerator가 문자열 0023인지 검증', function() {
          assert.equal(5, y.getState().denominator);
          assert.equal('0023', y.getState().numerator);
       });
       it('순환소수 테스트', function() {
           assert.equal('3', z.getState().integer);
           assert.equal(true, z.getState().circulating.isCirculating);
           assert.equal('3', z.getState().circulating.segment);
       })
    });
});
