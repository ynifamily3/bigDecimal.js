!function () {
var BD = {
    // Enums
    PLUS: 1,
    MINUS: 0
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
        denominator: 1, // 분모(의 길이)
        numerator: '0', // 분자
        reduced_denominator: '1', // (통분된)분모 -> 순환소수 대응
        reduced_numerator: '0', // (통분된)분자 -> 순환소수 대응
    };
    
    this.getState = function() {
        var copyObj = {};
        for (var i in state)
	        copyObj[i] = state[i];
        return copyObj;
    };
    
    this.isZero = function() {
        if(state._isNaN) return false;
        if(!state._isFinite) return false;
        if(state.circulating) return false;
        if(state.integer !== '0') return false;
        return true;
    }
    
    this.add = function(other) {
        if(!other) return this;
        if(!(other instanceof BigDecimal))
            return this.add(BigDecimal(other));
        if(other.isZero()) return this;
        var otherState = other.getState();
        if(otherState._isNaN) return other;
        // NaN과의 계산결과는 NaN
        
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

function parseNumber(strExpNumber, prop) {
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
    
    var re = /[+-]?(Infinity|NaN|\d+)/g;
    var container = strExpNumber.match(re);
    if(!container || container.length == 0 || container.length > 2) {
        throw new Error("Unexpected Number : " + strExpNumber);
    }
    
    // 부호 판별
    if(container[0][0] == '-') prop.sign = BD.MINUS;
    
    // 정수부 판별
    if(container[0][0] == '-' || container[0][0] == '+')
        prop.integer = trimNumber_l(container[0].slice(1));
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

window.BigDecimal = BigDecimal;
}();
