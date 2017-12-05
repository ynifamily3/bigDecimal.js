!function () {
var BD = {
    // Enum으로 사용하기 위해 정의해 놓았습니다.
    PLUS: 1,
    MINUS: 0,
    LFET_BIG: 1,
    RIGHT_BIG: -1,
    EQUAL: 0
};

function BigDecimal(strExp) {
    strExp = !strExp ? '0' : strExp;
    if(this === window) {
        return new BigDecimal(strExp);
    }
    // 이 라이브러리에서는 state 변수가 모든 숫자의 상태를 관리합니다.
    var state = {
     _isNaN: false, //숫자가 아님
     _isFinite: true, //유한수임
     reduced: false, // 통분 여부
     circulating: false, // 순환소수 여부
     sign: BD.PLUS, // 부호
     integer: '0', // 정수부
     denominator: 1, // 소숫점 이하 자리수+1 (ex : 0.0023의 경우 5가 저장됨)
     numerator: '0', // 소수부 정수 (ex : 0.0023의 경우 '23'이 저장됨)
    };
    if(typeof(strExp) === 'string' || typeof(strExp) === 'number') {
            parseNumber(''+strExp, state); // 사용자로부터 입력받은 식을 가지고 state를 정하기 위해 사용되었습니다.
            // JS는 Object의 경우에는 참조에 의한 전달로 이루어지므로 
            //ParseNumber 함수 내에서 state.XXX의 값을 수정해도 적용됩니다.
        }
        else if(strExp instanceof BigDecimal) {
            // 인자로 입력받은 표현식이 BigDecimal객체일 경우 그대로 리턴 (껍질을 벗김)
            // ex: BigDecimal(BigDecimal('3'))은 BigDecimal('3')이 된다.
            return strExp;
        }
        else {
            throw new Error("Unexpected Object...");
        }
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
    if(prop._isFinite && !prop._isNaN) { // if 가 성립하지 않을 경우 굳이 정수부와 소수부 판별 불필요
        if(container[0][0] == '-' || container[0][0] == '+')
            prop.integer = trimNumber_l(sliced); // '00007.3' 의 '00007'을 '7'로 고침
        else prop.integer = trimNumber_l(container[0]);
        
        // 소수부 판별
        if(container.length == 2) {
            prop.numerator = trimNumber_r(container[1]); // '0.3000'의 '3000'을 '3'으로 고침
            if(prop.numerator.length === 1 && prop.numerator[0] === '0') {
                prop.denominator = 1;
            } else {
                prop.denominator = prop.numerator.length + 1; // '0.007' 의 '007'을 보고 4(3+1)를 저장
                prop.numerator = trimNumber_l(prop.numerator); // '0.007' 의 '007'을 '7'로 고침
            }
        }
    }
}

// 밑의 두 함수들은 string 형의 숫자가 주어질 경우 앞뒤에 있는 0을 잘라내기 위해 따로 빼 두었습니다.
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
    
    window.BigDecimal = BigDecimal;
}();
