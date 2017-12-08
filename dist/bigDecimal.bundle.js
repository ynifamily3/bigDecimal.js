(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function () {
var Util_func = require('./util_func');
var BD = require('./enums');

function BigDecimal(strExp, circulating_segment) {
    strExp = !strExp ? '0' : strExp;
    if(typeof global !== 'undefined') {
            if(this == global) {
                return new BigDecimal(strExp, circulating_segment);
            }
    }
    else if(typeof window !== 'undefined') {
        if(this == window) {
            return new BigDecimal(strExp, circulating_segment);
        }
    }
    
    var state;
    
    if(typeof(strExp) === 'string' || typeof(strExp) === 'number') {
        state = Util_func.parseNumber(strExp, circulating_segment);
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
    
    Object.defineProperties(this, {
        'isCirculating': {
            get: function() { 
                if(state.circulating !== '0')
                    return true;
                return false;
            }
        },
        'circulating': {
            get: function() {
                if(this.isCirculating) return state.circulating;
                return null;
            }
        },
        'isNaN': {
            get: function() {
                return state._isNaN;
            }
        },
        'isFinite': {
            get: function() {
                return state._isFinite;
            }
        },
        'sign': {
            get: function() {
                return state.sign === 0 ? '-':'+';
            }
        },
        'integer': {
            get: function() {
                if(this.isNaN) return null;
                if(!this.isFinite) return null;
                return (this.sign==='+'?'':'-') + state.integer;
            }
        },
        'numerator': {
            get: function() {
                if(!state.numerator) return '';
                return state.numerator;
            }
        },
        'denominator': {
            get: function() {
                return state.numerator.length + 1;
            }
        },
        'isInteger': {
            get: function() {
                if(this.isNaN || !this.isFinite || this.isCirculating)
                    return false;
                if(this.numerator) return false;
                return true;
            }
        }
    });
    
    BigDecimal.prototype.toString = function() {
        if(this.isNaN) return 'NaN';
        if(!this.isFinite) return (this.sign==='+'?'':'-') + 'Infinity';
        var under = this.numerator.slice(0, BD.ROUND + 1);
        if(this.isCirculating && under.length < BD.ROUND) {
            var woosuri = BD.ROUND - under.length;
            for(var i = 0; i < woosuri; i++) {
                under += this.circulating[i%this.circulating.length];
            }
        }
        // 반올림시 연쇄작용을 서술해야하므로 불편하다... 그냥 버리기로 (일단)
        return this.integer + (this.isInteger?'':('.'+under));
    }
    
    
}
      window.BigDecimal = BigDecimal;
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./enums":2,"./util_func":3}],2:[function(require,module,exports){
var BD = {
    // Enum으로 사용하기 위해 정의해 놓았습니다.
    PLUS: 1,
    MINUS: 0,
    LFET_BIG: 1,
    RIGHT_BIG: -1,
    EQUAL: 0,
    ROUND: 6
};

module.exports = BD;
var BD = {
    // Enum으로 사용하기 위해 정의해 놓았습니다.
    PLUS: 1,
    MINUS: 0,
    LFET_BIG: 1,
    RIGHT_BIG: -1,
    EQUAL: 0,
    ROUND: 6
};

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = BD;
} else {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return BD;
        });
    } else {
        window.BigDecimal = BD;
    }
}

},{}],3:[function(require,module,exports){
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

module.exports = Util_func;

},{"./enums":2}]},{},[1]);
