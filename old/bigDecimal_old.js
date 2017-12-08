//bigDecimal.js
!function() {
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
              if(strExp.opcreated) {
                  this.init(strExp);
                  //구문해석으로 값을 그대로 집어넣을수 있게 한다. {val:~,props:{~}}
                  this.val = strExp.val;
                  this.setProp("sign", strExp.prop.sign);
                  this.setProp("integer", strExp.prop.integer);
                  this.setProp("numerator", strExp.prop.numerator);
                  this.setProp("denominator", strExp.prop.denominator);
              }
              else return new BigDecimal("0");
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
        if(!Exp.opcreated)
            this.val = Exp;
        var prop = {
            sign: 1,
            integer : "0",
            numerator : "0",
            denominator : "1"
        };
        //내부적인 값으로 사용하고 싶은데, 다른 오브젝트와 상호작용하려면 그 값이 필요한 모순?
        this.getProp = function() { return prop; };
        this.setProp = function(propName, propValue) {
            if(Exp.opcreated)
                prop[propName]=propValue; //변경완료 후 얼리기
            else
                throw new Error("수정불가");
            
        };
        if(!Exp.opcreated) {
            parseNumber.call(this, Exp, this.getProp());
        }
    },
    toString: function() {
        var props = this.getProp();
        return (props.sign == 0 ? "-":"") + props.integer + (props.numerator != 0 ? (" + " + props.numerator + "/" + props.denominator):"");
    },
    add: function(other) {
        if(other != 0 && !other) return this;
        if(typeof(other) === 'object' && other instanceof BigDecimal) {
            var prop1 = this.getProp();
            var prop2 = other.getProp();
            var result = {opcreated:true, prop:{}};
            if(prop1.sign === prop2.sign) {
                //부호 같음 상태
                if(prop1.denominator.length === prop2.denominator.length) {
                    //통분된 상태
                    result.prop.sign = prop1.sign;
                    result.prop.integer = string_add(prop1.integer, prop2.integer);
                    result.prop.numerator = string_add(prop1.numerator, prop2.numerator);
                    result.prop.denominator = prop1.denominator;
                    result.val = ''+result.prop.integer+'.'+result.prop.numerator; //dbg
                    if(compare(prop1.denominator, result.prop.numerator) == 1) {
                        //결과의 분자 분모 비교하여  분자가 더작으면
                        //그대로 덧셈 (아무것도 안한다.)
                    }
                    //dbg(다른 case 연구 해야됨.)
                    return new BigDecimal(result);
                }
            }
        }
        else return this.add(new BigDecimal(other));
    },
    sub: function(other) {
        if(other != 0 && !other) return this;
        if(typeof(other) === 'object' && other instanceof BigDecimal) {
            return new BigDecimal(string_sub(this.val, other.val));//dbg
        }
        else return this.sub(new BigDecimal(other));
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
    //1.0, sign,integer ~~~~~
    var re = /[+-]?(Infinity|NaN|\d+)/g;
    var container = strExpNumber.match(re);
    if(!container || container.length == 0 || container.length > 2) {
        throw new Error("Unexpected Number : " + strExpNumber);
    }
    
    if(container[0][0] == '-') prop.sign = 0;
    else prop.sign = 1;
    if(container[0][0] == '-' || container[0][0] == '+')
        prop.integer = container[0].slice(1);
    else prop.integer = container[0];
    prop.integer = trim_zero_l(prop.integer);
    if(container.length == 2) {
        prop.numerator = trim_zero_r(container[1].split("")).join("");
        prop.denominator = "1"+"0".repeat(prop.numerator.length);
        prop.numerator = trim_zero_l(prop.numerator.split("")).join("");
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

function compare(strExp1, strExp2) {
    //왼쪽이 크면 1 오른쪽이 크면 -1 같으면 0
    if(strExp1.length>strExp2.length) return 1;
    else if(strExp1.length<strExp2.length) return -1;
    for(var i = 0; i < strExp1.length; i++) {
        if(strExp1[i] < strExp1[i]) return -1;
        else if(strExp1[i]>strExp1[i]) return 1;
    }
    return 0;
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
    //항상 strExp1 >= strExp2 임을 가정한다.
    var lptr = strExp1.length - 1;
    var rptr = strExp2.length - 1;
    var carry = 0;
    var n1 = strExp1.split("").map(function(x){return Number(x)});
    var n2 = strExp2.split("").map(function(x){return Number(x)});
    while(lptr >= 0 && rptr >= 0) {
        var ln = n1[lptr];
        var rn = n2[rptr];
        var res;
        if(ln >= rn) {
            res = (10 * carry + ln - rn) % 10;
            n1[lptr] = res;
        } else {
            var moving = 1;
            carry = 1;
            while(lptr - moving >= 0) {
                if(n1[lptr - moving] != 0) {
                    n1[lptr - moving]--;
                    break;
                }
                else {
                    n1[lptr-moving] = 9;
                    moving++;
                    continue;
                }
            }
            res = (10 * carry + ln - rn) % 10;
            n1[lptr] = res;
        }
        lptr--;
        rptr--;
    }
    return trim_zero_l(n1).join("");
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
