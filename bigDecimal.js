//bigDecimal.js
!function() {
    
function BigDecimal(strExp) {
    if(typeof global !== 'undefined') {
        if(this == global) {
            return new BigDecimal(strExp);
        }
    } else if(typeof window !== 'undefined') {
        if(this == window) {
            return new BigDecimal(strExp);
        }
    }
    if(!strExp) return new BigDecimal("0");
      if(typeof(strExp) === 'object') {
          if(strExp instanceof BigDecimal) {
              return strExp;
          } else {
              //warn
              return new BigDecimal("0");
          }
      } else if(typeof(strExp) === 'string') {
          //기본형이므로 우선 구현
          this.val = strExp;
      } else if(typeof(strExp) === 'number') {
          return new BigDecimal(''+strExp);
      } else {
          //warn
          return new BigDecimal("0");
      }
}
BigDecimal.fn = BigDecimal.prototype = {
    init: function(Exp) {
      
    },
    toString: function() {
        return this.val;
    },
    add: function(other) {
        if(!other) return this;
        if(typeof(other) === 'object' && other instanceof BigDecimal) {
            return "환원됨 : " + other;
        }
        else return this.add(BigDecimal(other));
    }
};

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
