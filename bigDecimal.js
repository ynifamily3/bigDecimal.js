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
        if(other != 0 && !other) return this;
        if(typeof(other) === 'object' && other instanceof BigDecimal) {
            return string_add(this.val, other.val);//dbg
        }
        else return this.add(BigDecimal(other));
    }
};

function times(item, n) {
    if(n<0) return "";
    var ret = "";
    while(n--) ret += item;
    return ret;
}

function string_add(strExp1, strExp2) {
    var length1 = strExp1.length;
    var length2 = strExp2.length;
    //padding zero & reverse
    if(length1 < length2) {
        strExp1 = "0".repeat(length2-length1) + strExp1;
    }
    else {
        strExp2 = "0".repeat(length1-length2) + strExp2;
    }
    var n1 = strExp1.split("").reverse().map(function(x){return Number(x)});
    var n2 = strExp2.split("").reverse().map(function(x){return Number(x)});
    var n3 = new Array(n1.length);
    var carry = 0;
    for(var i = 0; i < n1.length; i++) {
        var piece = n1[i] + n2[i] + carry;
        n3[i] = piece % 10;
        carry = piece >= 10 ? 1 : 0;
    }
    if(carry > 0) n3.push(carry);
    for(var i = n3.length-1; i >= 0; i--) {
        if(n3[i] != 0) {
            n3.length = i+1;
            break;
        }
    }
    return n3.reverse().join("");
}

function string_sub(strExp1, strExp2) {
    
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
