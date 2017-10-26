//bigDecimal.js
!function() {
    
function BigDecimal(strExp) {
    this.val = strExp;
    this.add = function(other) {
        
    };
}

BigDecimal.prototype.toString = function() {
    return this.val;
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