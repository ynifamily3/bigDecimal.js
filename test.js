var BigDecimal = require('./bigDecimal.js');
var assert = require('assert');

console.log(BigDecimal(0).add(0));
console.log(BigDecimal(1).add(1));
console.log(BigDecimal(00).add(00));
console.log(BigDecimal(1924).add(768));
console.log(BigDecimal(768).add(1024));

console.log(BigDecimal("03").add("000000000"));
console.log(BigDecimal("003").add("00"));
console.log(BigDecimal("9999999").add("9999999999999999999999"));
