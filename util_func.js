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

parseNumber: function (strExpNumber, circulating_segment) {
    var prop = {
        _isNaN: false,
        sign: BD.PLUS,
        _isFinite: true,
        integer: '0', // 정수
        circulating: '0', // 순환마디
        numerator: '' // 순환마디를 제외한 소수점 아래 수
    };
    var check = /[+-]?(Infinity|NaN|\d+)/g;
    var container = (''+strExpNumber).match(check);
    if(!container) throw new Error("Unexpected Number");
    // NaN Check
    if(container[0] === 'NaN' || container[0] === '-NaN' || container[0] === '+NaN') {
        prop._isNaN = true;
        return prop;
    }
    // sign Check
    if(container[0][0] === '-') {
        prop.sign = BD.MINUS;
    }
    // cut sign
    var integer = container[0];
    if(container[0][0] === '-' || container[0][0] === '+') {
        integer = integer.slice(1);
    }
    // finite check
    if(integer === 'Infinity') {
        prop._isFinite = false;
        return prop;
    }
    // integer check
    prop.integer = this.trimNumber_l(integer);

    // circulating check
    if(circulating_segment) {
        check = /\d+/;
        var container2 = (''+circulating_segment).match(check);
        if(container2.length === 1) {
            prop.circulating = this.trimNumber_l(container2[0]);
        }
    }
    
    // numerator check
    if(container.length === 2) {
        if(prop.circulating === '0') {
            // 순환하지 않으면
            prop.numerator = this.trimNumber_r(container[1]);
            // 전부 0이라면 없앰
            var flag = false;
            for(var i = 0; i < prop.numerator.length; i++) {
                if(prop.numerator[i] !== '0') {
                    flag = true;
                };
            }
            if(!flag) {
                prop.numerator = '';
            }
        }
        else {
            // 순환하면
            prop.numerator = container[1];
        }
    }
    
    return prop;
}


}; // end of Util_func


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
