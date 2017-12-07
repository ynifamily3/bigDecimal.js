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
                if(!state._isNaN)
                    return state.integer;
                return 'NaN';
            }
        },
        'numerator': {
            get: function() {
                if(!state.numerator) return null;
                return state.numerator;
            }
        },
        'denominator': {
            get: function() {
                return state.numerator.length + 1;
            }
        }
    });
    
    BigDecimal.prototype.toString = function() {
        if(this.isNaN) return 'NaN';
        if(!this.isFinite) return this.sign==='+'?'':'-' + 'Infinity';
        return this.sign + "투스트링";
    }
    
    
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
