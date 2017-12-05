var BD = {
    // Enum으로 사용하기 위해 정의해 놓았습니다.
    PLUS: 1,
    MINUS: 0,
    LFET_BIG: 1,
    RIGHT_BIG: -1,
    EQUAL: 0
};

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = BD;
} else {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return BD;
        });
    } else {
        window.BigDecimal = BD;
    }
}
