!function () {
var Util_func = require('./util_func');
var BD = require('./enums');

function BigDecimal(strExp) {
    strExp = !strExp ? '0' : strExp;
    if(typeof global !== 'undefined') {
            if(this == global) {
                return new BigDecimal(strExp);
            }
    }
    else if(typeof window !== 'undefined') {
        if(this == window) {
            return new BigDecimal(strExp);
        }
    }
    
    var state = {
     _isNaN: false, //숫자가 아님
     _isFinite: true, //유한수임
     reduced: false, // 통분 여부
     circulating: false, // 순환소수 여부
     sign: BD.PLUS, // 부호
     integer: '0', // 정수부
     denominator: 1, // 소숫점 이하 자리수+1 (ex : 0.0023의 경우 5가 저장됨)
     numerator: '0', // 소수부 정수 (ex : 0.0023의 경우 '23'이 저장됨)
    };
    
    
    if(typeof(strExp) === 'string' || typeof(strExp) === 'number') {
        Util_func.parseNumber(''+strExp, state);
    }
    else if(strExp instanceof BigDecimal) {
        return strExp;
    }
    else {
        throw new Error("Unexpected Object...");
    }
    
    this.getState = function() {
        var copyObj = {};
        for (var i in state) copyObj[i] = state[i];
        return copyObj;
    };
    
    this.add = function(other) {
        return 'add method';
    };
    
    
}
    
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = BigDecimal;
} else {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return BigDecimal;
        });
    } else {
        window.BigDecimal = BigDecimal;
    }
}
}();
