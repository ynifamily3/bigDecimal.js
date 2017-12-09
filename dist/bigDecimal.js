(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["BigDecimal"] = factory();
	else
		root["BigDecimal"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var BD = {
    // Enum으로 사용하기 위해 정의해 놓았습니다.
    PLUS: 1,
    MINUS: 0,
    LFET_BIG: 1,
    RIGHT_BIG: -1,
    EQUAL: 0,
    ROUND: 6
};

module.exports = BD;
var BD = {
    // Enum으로 사용하기 위해 정의해 놓았습니다.
    PLUS: 1,
    MINUS: 0,
    LFET_BIG: 1,
    RIGHT_BIG: -1,
    EQUAL: 0,
    ROUND: 6
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = BD;
} else {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return BD;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        window.BigDecimal = BD;
    }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!function () {
    var Util_func = __webpack_require__(3);
    var BD = __webpack_require__(0);

    function BigDecimal(strExp, circulating_segment) {
        strExp = !strExp ? '0' : strExp;
        if (typeof global !== 'undefined') {
            if (this == global) {
                return new BigDecimal(strExp, circulating_segment);
            }
        } else if (typeof window !== 'undefined') {
            if (this == window) {
                return new BigDecimal(strExp, circulating_segment);
            }
        }

        var state;

        if (typeof strExp === 'string' || typeof strExp === 'number') {
            state = Util_func.parseNumber(strExp, circulating_segment);
        } else if (strExp instanceof BigDecimal) {
            return strExp;
        } else {
            throw new Error("Unexpected Object...");
        }

        this.getState = function () {
            var copyObj = {};
            for (var i in state) {
                copyObj[i] = state[i];
            }return copyObj;
        };

        this.add = function (other) {
            return 'add method';
        };

        Object.defineProperties(this, {
            'isCirculating': {
                get: function get() {
                    if (state.circulating !== '0') return true;
                    return false;
                }
            },
            'circulating': {
                get: function get() {
                    if (this.isCirculating) return state.circulating;
                    return null;
                }
            },
            'isNaN': {
                get: function get() {
                    return state._isNaN;
                }
            },
            'isFinite': {
                get: function get() {
                    return state._isFinite;
                }
            },
            'sign': {
                get: function get() {
                    return state.sign === 0 ? '-' : '+';
                }
            },
            'integer': {
                get: function get() {
                    if (this.isNaN) return null;
                    if (!this.isFinite) return null;
                    return (this.sign === '+' ? '' : '-') + state.integer;
                }
            },
            'numerator': {
                get: function get() {
                    if (!state.numerator) return '';
                    return state.numerator;
                }
            },
            'denominator': {
                get: function get() {
                    return state.numerator.length + 1;
                }
            },
            'isInteger': {
                get: function get() {
                    if (this.isNaN || !this.isFinite || this.isCirculating) return false;
                    if (this.numerator) return false;
                    return true;
                }
            }
        });

        BigDecimal.prototype.toString = function () {
            if (this.isNaN) return 'NaN';
            if (!this.isFinite) return (this.sign === '+' ? '' : '-') + 'Infinity';
            var under = this.numerator.slice(0, BD.ROUND + 1);
            if (this.isCirculating && under.length < BD.ROUND) {
                var woosuri = BD.ROUND - under.length;
                for (var i = 0; i < woosuri; i++) {
                    under += this.circulating[i % this.circulating.length];
                }
            }
            // 반올림시 연쇄작용을 서술해야하므로 불편하다... 그냥 버리기로 (일단)
            return this.integer + (this.isInteger ? '' : '.' + under);
        };
    }

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = BigDecimal;
    } else {
        if (true) {
            !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
                return BigDecimal;
            }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else {
            window.BigDecimal = BigDecimal;
        }
    }
}();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BD = __webpack_require__(0);

var Util_func = {

    trimNumber_l: function trimNumber_l(strExpNumber) {
        for (var i = 0; i < strExpNumber.length; i++) {
            if (strExpNumber[i] !== '0') return strExpNumber.slice(i);
        }
        return '0';
    },

    trimNumber_r: function trimNumber_r(strExpNumber) {
        for (var i = strExpNumber.length - 1; i >= 0; i--) {
            if (strExpNumber[i] !== '0') return strExpNumber.slice(0, i + 1);
        }
        return '0';
    },

    parseNumber: function parseNumber(strExpNumber, circulating_segment) {
        var prop = {
            _isNaN: false,
            sign: BD.PLUS,
            _isFinite: true,
            integer: '0', // 정수
            circulating: '0', // 순환마디
            numerator: '' // 순환마디를 제외한 소수점 아래 수
        };
        var check = /[+-]?(Infinity|NaN|\d+)/g;
        var container = ('' + strExpNumber).match(check);
        if (!container) throw new Error("Unexpected Number");
        // NaN Check
        if (container[0] === 'NaN' || container[0] === '-NaN' || container[0] === '+NaN') {
            prop._isNaN = true;
            return prop;
        }
        // sign Check
        if (container[0][0] === '-') {
            prop.sign = BD.MINUS;
        }
        // cut sign
        var integer = container[0];
        if (container[0][0] === '-' || container[0][0] === '+') {
            integer = integer.slice(1);
        }
        // finite check
        if (integer === 'Infinity') {
            prop._isFinite = false;
            return prop;
        }
        // integer check
        prop.integer = this.trimNumber_l(integer);

        // circulating check
        if (circulating_segment) {
            check = /\d+/;
            var container2 = ('' + circulating_segment).match(check);
            if (container2.length === 1) {
                prop.circulating = this.trimNumber_l(container2[0]);
            }
        }

        // numerator check
        if (container.length === 2) {
            if (prop.circulating === '0') {
                // 순환하지 않으면
                prop.numerator = this.trimNumber_r(container[1]);
                // 전부 0이라면 없앰
                var flag = false;
                for (var i = 0; i < prop.numerator.length; i++) {
                    if (prop.numerator[i] !== '0') {
                        flag = true;
                    };
                }
                if (!flag) {
                    prop.numerator = '';
                }
            } else {
                // 순환하면
                prop.numerator = container[1];
            }
        }

        return prop;
    }

}; // end of Util_func

module.exports = Util_func;

/***/ })
/******/ ]);
});