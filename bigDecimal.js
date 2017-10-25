(function(scope) {
    scope.bigDecimal = function(strExpNumber) {
        this.origin = strExpNumber;
        this.sign = 0; //부호 (0 : 마이너스, 1 : 플러스)
        this.integer = "0"; //정수부
        this.numerator = "0";//분자
        this.denominator = "1";//분모 (단, 분자/분모 < 1)
        var privateData = 3000;
        
        parseNumber.call(this, strExpNumber);
        
        
        function elemAdd(other) {
            //두 문자열숫자를 더한 결과를 리턴
        }
        
        this.add = function(other) {
            //http://programmerchoo.tistory.com/40 참고하여 구현
            //s.split("").reverse().join("")
            
            //0. 소수점 자리수를 통분
        };
        
        this.sub = function(other) {
            
        };
        
        this.multi = function(other) {
            
        };
        
        this.div = function(other) {
            
        };
        
        
        
        function parseNumber(strExpNumber) {
            var re = /[+-]?(Infinity|NaN|\d+)/g;
            var container = strExpNumber.match(re);
            if(!container || container.length == 0 || container.length > 2)
                throw new Error("Unexpected Number : " + strExpNumber);
            
            if(container[0][0] == '-') this.sign = 0;
            else this.sign = 1;
            if(container[0][0] == '-' || container[0][0] == '+')
                this.integer = container[0].slice(1);
            else this.integer = container[0];
            
            if(container.length == 2) {
                this.numerator = container[1];
                for(var i = 0; i < container[1].length; i++) this.denominator += "0";
                reduction_fraction.call(this);
            }
        }
        
        function reduction_fraction() {
            console.log("약분 실행");
        }
    };
})(Math);

var theBigNumber = new Math.bigDecimal("-1024");
var theBigNumber2 = new Math.bigDecimal("+768.30");
console.log(theBigNumber);
console.log(theBigNumber2);