!function () {
var BD = {
    // Enums
    PLUS: 1,
    MINUS: 0
}
function BigDecimal(strExp) {
    strExp = !strExp ? "0" : strExp;
    if(this === window) return new BigDecimal(strExp);
    var state = {
        _isNaN: false, //숫자가 아님
        _isFinite: true, //유한수임
        reduced: false, // 통분 여부
        circulating: false, // 순환소수 여부
        sign: BD.PLUS, // 부호
        integer: '0', // 정수부
        denominator: '1', // 분모
        numerator: '0', // 분자
        reduced_denominator: '1', // (통분된)분모
        reduced_numerator: '0', // (통분된)분자
    };
    this.test = function() { return state; };
    if(typeof(strExp) === "string")
        parseNumber(strExp, state);
    else if(strExp instanceof BigDecimal) {
        // 객체의 깊은 복사 진행
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
            prop.denominator = '1';
        } else {
            prop.denominator = '1'+'0'.repeat(prop.numerator.length);
            prop.numerator = trimNumber_l(prop.numerator);
        }
    }
}

BigDecimal.prototype = {
    toString: function() {
      return "[BigDecimal Object]";
    }
};

BigDecimal.extend = function(props) {
	for (var prop in props) this[prop] = props[prop];
};

//Object 의 extend를 넣어 객체의 깊은 복사가 이루어지게 하면 될듯?

BigDecimal.extend({
    PI: 3.14
});

window.BigDecimal = BigDecimal;
}();
