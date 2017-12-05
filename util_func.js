var BD = require('./enums');

var Util_func = {
trimNumber_l: function (strExpNumber) {
    for(var i = 0; i < strExpNumber.length; i++) {
        if(strExpNumber[i] !== '0') return strExpNumber.slice(i);
    }
    return '0';
},

trimNumber_r: function (strExpNumber) {
    for(var i = strExpNumber.length-1; i >= 0; i--) {
        if(strExpNumber[i] !== '0') return strExpNumber.slice(0, i+1);
    }
    return '0';
},
parseNumber: function (strExpNumber, prop) {
    var re = /[+-]?(Infinity|NaN|\d+)/g;
    var container = strExpNumber.match(re);
    if(!container || container.length == 0 || container.length > 2) {
        throw new Error("Unexpected Number : " + strExpNumber);
    }
    
    var sliced = container[0].slice(1);
    // 부호 판별
    if(container[0][0] == '-') prop.sign = BD.MINUS;
    
    //특수 판별
    if(container[0] === 'Infinity' || sliced === 'Infinity') {
        prop._isFinite = false;
    }
    else if(container[0] === 'NaN' || sliced === 'NaN') {
        prop._isNaN = true;
    }
    
    // 정수부 판별
    if(prop._isFinite && !prop._isNaN) { // if 가 성립하지 않을 경우 굳이 정수부와 소수부 판별 불필요
        if(container[0][0] == '-' || container[0][0] == '+')
            prop.integer = this.trimNumber_l(sliced); // '00007.3' 의 '00007'을 '7'로 고침
        else prop.integer = this.trimNumber_l(container[0]);
        
        // 소수부 판별
        if(container.length == 2) {
            prop.numerator = this.trimNumber_r(container[1]); // '0.3000'의 '3000'을 '3'으로 고침
            if(prop.numerator.length === 1 && prop.numerator[0] === '0') {
                prop.denominator = 1;
            } else {
                prop.denominator = prop.numerator.length + 1; // '0.007' 의 '007'을 보고 4(3+1)를 저장
                prop.numerator = this.trimNumber_l(prop.numerator); // '0.007' 의 '007'을 '7'로 고침
            }
        }
    }
}
};


if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Util_func;
} else {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return Util_func;
        });
    } else {
        window.BigDecimal = Util_func;
    }
}
