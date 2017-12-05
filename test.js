const BigDecimal = require('./blog.js');
const assert = require('assert');

var x = BigDecimal("00007.3");
var y = BigDecimal("0.007");

describe('BigDecimal', function() {
    describe('데이터 저장 테스트', function() {
       it('integer값이 문자열 7인지 검증', function() {
           assert.equal('7', x.getState().integer);
       });
       it('denominator가 숫자 4인지, numerator가 문자열 7인지 검증', function() {
          assert.equal(4, y.getState().denominator);
          assert.equal('7', y.getState().numerator);
       });
    });
});