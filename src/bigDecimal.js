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
      window.BigDecimal = BigDecimal; //브라우저 fiy?
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
