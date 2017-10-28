//bigDecimal.js
!function() {
 var bGlobal = this;   
function BigDecimal(strExp) {
    //check execution environment
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
    
    //nomalize BigDecimal Object Creation
    if(!strExp) return new BigDecimal("0");
    
    if(typeof(strExp) === 'string') {
          this.init(strExp);
    }
    else if(typeof(strExp) === 'object') {
        if(strExp instanceof BigDecimal) {
              return strExp;
          } else {
              return new BigDecimal("0");
          }
        }
        else if(typeof(strExp) === 'number') {
            return new BigDecimal(''+strExp);
        }
        else {
            return new BigDecimal("0");
        }
}

BigDecimal.fn = BigDecimal.prototype = {
    init: function(Exp) {
        this.val = Exp;
        this.prop = {
            numerator : "0",
            denominator : "1"
        }; //dbg, this->var
        parseNumber.call(this, Exp, this.prop); //dbg, this(2nd)->delete this.
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

BigDecimal.extend = BigDecimal.fn.extend = function(obj, prop) {
	if (!prop) { 
	    prop = obj;
	    obj = this;
	}
	for (var i in prop)
	    obj[i] = prop[i];
	//return Object.freeze(obj);
	return obj;
};

//const value, method
BigDecimal.extend({
    PI: 3.14
});

function parseNumber(strExpNumber, prop) {
    var re = /[+-]?(Infinity|NaN|\d+)/g;
    var container = strExpNumber.match(re);
    if(!container || container.length == 0 || container.length > 2)
        throw new Error("Unexpected Number : " + strExpNumber);
    
    if(container[0][0] == '-') prop.sign = 0;
    else prop.sign = 1;
    if(container[0][0] == '-' || container[0][0] == '+')
        prop.integer = container[0].slice(1);
    else prop.integer = container[0];
    prop.integer = trim_zero_l(prop.integer);
    if(container.length == 2) {
        prop.numerator = trim_zero_l(container[1].split("")).join("");
        prop.denominator = "1"+"0".repeat(container[1].length);
    }
}

function trim_zero_l(arrExp) {
    //왼쪽 끝 0 잘라냄
    for(var i = 0; i < arrExp.length; i++) {
        if(arrExp[i] != 0) {
            return arrExp.slice(i);
        }
    }
    return arrExp;
}

function trim_zero_r(arrExp) {
    //오른쪽 끝 0 잘라냄
    for(var i = arrExp.length-1; i >= 0; i--) {
        if(arrExp[i] != 0) {
            arrExp.length = i+1;
            break;
        }
    }
    return arrExp;
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
    return trim_zero_r(n3).reverse().join("");
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
