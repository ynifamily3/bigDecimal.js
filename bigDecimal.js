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
        var under = this.numerator;
        if(this.isCirculating) {
            var length = this.circulating.length; // 1
            var letlng = Math.floor(BD.ROUND / length); // 6 / 1
            var woosuri = BD.ROUND % length;
            
            var woosuriElement = this.circulating.slice(0, woosuri);
            var tmp = this.circulating.repeat(letlng) + woosuriElement.slice(0, -1);
            var end = parseInt(woosuriElement.slice(-1));
            under += tmp + (end>= 5 ? end+1: end);
        }
        return this.integer + (this.isInteger?'':('.'+under));
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
