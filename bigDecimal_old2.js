!function () {
var BD = {
    // Enums
    PLUS: 1,
    MINUS: 0,
    LFET_BIG: 1,
    RIGHT_BIG: -1,
    EQUAL: 0
};

function BigDecimal(strExp) {
    strExp = !strExp ? '0' : strExp;
    if(this === window) return new BigDecimal(strExp);
    var state = {
        _isNaN: false, //숫자가 아님
        _isFinite: true, //유한수임
        reduced: false, // 통분 여부
        circulating: false, // 순환소수 여부
        sign: BD.PLUS, // 부호
        integer: '0', // 정수부
        denominator: 1, // 분모(의 길이) -> 비순환소수 대응
        numerator: '0', // 분자(소수부) -> 비순환소수 대응
        reduced_denominator: '1', // (통분된)분모 -> 순환소수 대응
        reduced_numerator: '0', // (통분된)분자 -> 순환소수 대응
    };
    
    this.setState = function(nstate) {
        if(isValidState(state))
            state = nstate;
        else
            throw new Error("Invalid state!!")
    }
    
    this.getState = function() {
        /*
        var copyObj = {};
        for (var i in state) copyObj[i] = state[i];
        return copyObj;
        */
        // debug 목적 (state가 수정될 수 있음!)
        return state;
    };
    
    this.isZero = function() {
        if(state._isNaN) return false;
        if(!state._isFinite) return false;
        if(state.circulating) return false;
        if(state.integer !== '0') return false;
        return true;
    };
    
    this.add = function(other) {
        if(!other) return this;
        if(!(other instanceof BigDecimal))
            return this.add(BigDecimal(other));
        if(other.isZero()) return this;
        var otherState = other.getState();
        if(state._isNaN || otherState._isNaN) return other;
        if(!state._isFinite) {
            if(otherState._isFinite) return this;
            else {
                if(state.sign === otherState.sign) return this;
                return new BigDecimal("NaN"); // stored object로 최적화 가능
            }
        }
        
        var retObject = new BigDecimal();
        var retState = this.getState(); //새로운 값을 위한 state
        
        if(!state.circulating && !otherState.circulating) {
            // 1) 비순환소수 + 비순환소수
            if(state.denominator === otherState.denominator) {
                //분모가 같은경우
                
                //부호를 본다. 부호가 다르면 빼고(큰쪽에서 작은쪽) 같으면 더하고
                if(state.sign === otherState.sign) {
                    //전체적으로 바로 아래 소스에서 문제 발생 (repeat 함수가 음수)
                   var r_sum = string_add(state.integer+'0'.repeat(state.denominator-state.numerator.length-1)+state.numerator,
                   otherState.integer+'0'.repeat(otherState.denominator-otherState.numerator.length-1)+otherState.numerator);
                   retState.integer = r_sum.slice(0, -state.denominator+1);
                   retState.numerator = trimNumber_l(trimNumber_r(r_sum.slice(-state.denominator+1)));
                }
                else {
                    //부호가 다름. (일단 절댓값 큰수 - 작은수) -> 절댓값 큰수쪽의 부호를 따름
                    var cp1 = state.integer+'0'.repeat(state.denominator-state.numerator.length-1)+state.numerator;
                    var cp2 = otherState.integer+'0'.repeat(otherState.denominator-otherState.numerator.length-1)+otherState.numerator;
                    var d_sum;
                    var compare = string_compare(cp1, cp2);
                    if (compare === BD.LEFT_BIG) {
                         d_sum = string_sub(cp1, cp2);
                         retState.integer = r_sum.slice(0, -state.denominator+1);
                         retState.numerator = trimNumber_l(trimNumber_r(r_sum.slice(-state.denominator+1)));
                         
                    } else {
                         d_sum = string_sub(cp2, cp1);
                         retState.integer = r_sum.slice(0, -state.denominator+1);
                         retState.numerator = trimNumber_l(trimNumber_r(r_sum.slice(-state.denominator+1)));
                    }
                }
                
                
            } else {
                // 분모가 다를 경우
                //분모를 맞춰주고 (작은쪽에서 큰쪽으로) 분자에 0을 그만큼 더한 뒤, 위에랑 똑같은 과정을 한다.
                
            }
        } else if(state.circulating && otherState.circulating) {
            // 2) 순환소수 + 순환소수
        }
        retObject.setState(retState);
        return retObject;
    };
    
    this.sub = function(other) {
        
    };
    
    this.multi = function(other) {
        
    };
    
    this.div = function(other) {
        
    };
    
    
    if(typeof(strExp) === 'string' || typeof(strExp) === 'number') {
        parseNumber(''+strExp, state);
    }
    else if(strExp instanceof BigDecimal) {
        return strExp; // BigDecimal(BigDecimal(1).add(2)) 등
    }
    else {
        throw new Error("Unexpected Object...");
    }
}

function isValidState(state) {
    // state의 유효성 검사
    return true;
}

function parseNumber(strExpNumber, prop) {
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
    if(prop._isFinite && !prop._isNaN) {
        if(container[0][0] == '-' || container[0][0] == '+')
            prop.integer = trimNumber_l(sliced);
        else prop.integer = trimNumber_l(container[0]);
        
        // 소수부 판별
        if(container.length == 2) {
            prop.numerator = trimNumber_r(container[1]);
            if(prop.numerator.length === 1 && prop.numerator[0] === '0') {
                prop.denominator = 1;
            } else {
                prop.denominator = prop.numerator.length + 1;
                prop.numerator = trimNumber_l(prop.numerator);
            }
        }
    }
}

function trimNumber_l(strExpNumber) {
    for(var i = 0; i < strExpNumber.length; i++) {
        if(strExpNumber[i] !== '0') return strExpNumber.slice(i);
    }
    return '0';
}
function trimNumber_r(strExpNumber) {
    for(var i = strExpNumber.length-1; i >= 0; i--) {
        if(strExpNumber[i] !== '0') return strExpNumber.slice(0, i+1);
    }
    return '0';
}

function trim_zero_l(arrExp) {
    for(var i = 0; i < arrExp.length; i++) {
        if(arrExp[i] != 0) {
            return arrExp.slice(i);
        }
    }
    return arrExp;
}

function trim_zero_r(arrExp) {
    for(var i = arrExp.length-1; i >= 0; i--) {
        if(arrExp[i] != 0) {
            arrExp.length = i+1;
            break;
        }
    }
    return arrExp;
}

function string_compare(strExp1, strExp2) {
    // x.xx 이런 대소를 파악 가능함 (절댓값으로)
    var str1 = strExp1.split('.');
    var str2 = strExp2.split('.');
    if(str1[0].length > str2[0].length) return BD.LEFT_BIG;
    if(str1[0].length < str2[0].length) return BD.RIGHT_BIG;
    
    for(var i = 0; i < str1[0].length; i++) {
        if(str1[0][i] > str2[0][i]) return BD.LEFT_BIG;
        if(str1[0][i] < str2[0][i]) return BD.RIGHT_BIG;
    }
    
    //소수점 이하의 비교에서는 length로 판별 불가 (0.0077 < 0.3)
    //길이가 작은 거 기준으로 비교한다.
    var lengthmin = str1[1].length > str2[1].length ? str2[1].length : str2[0].length;
    for(var i = 0; i < lengthmin; i++) {
        if(str1[1][i] > str2[1][i]) return BD.LEFT_BIG;
        if(str1[1][i] < str2[1][i]) return BD.RIGHT_BIG;
    }
    return BD.EQUAL;
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

window.BigDecimal = BigDecimal;
}();
