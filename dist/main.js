/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(8);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  typeof document.createElement -> undefined
 */
function isStandardBrowserEnv() {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof document.createElement === 'function'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var Const = {
    NAMESPACE: 'MX',
    ERROR_TYPE: {
        BUSINESS: "businessError",
        NETWORK: "networkError",
        TIMEOUT: "timeoutError",
        ABORT: "abortError",
        PARSER: "parserError"
    }
};
exports.default = Const;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _querystring = __webpack_require__(5);

var _querystring2 = _interopRequireDefault(_querystring);

var _Deferred = __webpack_require__(3);

var _Deferred2 = _interopRequireDefault(_Deferred);

var _CreateError = __webpack_require__(6);

var _CreateError2 = _interopRequireDefault(_CreateError);

var _ComboPromise = __webpack_require__(7);

var _ComboPromise2 = _interopRequireDefault(_ComboPromise);

var _config = __webpack_require__(19);

var _config2 = _interopRequireDefault(_config);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

var _Ajax = __webpack_require__(20);

var _Ajax2 = _interopRequireDefault(_Ajax);

var _Http = __webpack_require__(40);

var _Http2 = _interopRequireDefault(_Http);

var _MissionDispatcher = __webpack_require__(42);

var _MissionDispatcher2 = _interopRequireDefault(_MissionDispatcher);

var _CacheData = __webpack_require__(44);

var _CacheData2 = _interopRequireDefault(_CacheData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AppCache = new _CacheData2.default('DATA_SOURCE_PROXY', 'v0.0.1');

function mixConfig(requestConfig) {
    return Object.assign({}, _config2.default, requestConfig);
}

/* 生成cache key*/
function getCacheKey({ url, maxAge, params } = requestConfig) {

    let cacheKey = null;
    if (typeof maxAge === 'number') {
        cacheKey = url + '_' + _querystring2.default.stringify(params);
    }
    return cacheKey;
}

function DataSource(workerCount = 10) {

    var interceptors = {
        request: [],
        response: [],
        error: []
    };

    var requestDefers = new Map();

    var httpMD = new _MissionDispatcher2.default(_Ajax2.default, workerCount);
    httpMD.start();

    this.interceptors = {
        request: {
            use: (...args) => {
                Array.prototype.push.apply(interceptors.request, args);
                return this;
            }
        },
        response: {
            use: (...args) => {
                Array.prototype.push.apply(interceptors.response, args);
                return this;
            }
        },
        error: {
            use: (...args) => {
                Array.prototype.push.apply(interceptors.error, args);
                return this;
            }
        }
    };

    this.start = () => {
        httpMD.start();
    };

    this.stop = () => {
        httpMD.stop();
    };

    this.request = requestConfig => {

        return new Promise((resolve, reject) => {

            let cacheKey = getCacheKey(requestConfig);
            let { maxAge, ignoreExpires } = requestConfig;
            let cacheItem, data;

            if (cacheKey === null) {
                // 没有maxAge配置，直接发起serverRequest
                resolve(this.serverRequest(requestConfig));
            } else {
                // 有maxAge配置，需要先检查cache
                cacheItem = AppCache.item(cacheKey, { maxAge, ignoreExpires });
                data = cacheItem.get();

                if (data === null) {
                    //  cache中没取到数据 || 数据过期,  发起serverRequest
                    this.serverRequest(requestConfig).then(data => {
                        cacheItem.set(data);
                        resolve(data);
                    }).catch(err => reject(err));
                } else {
                    // 命中缓存
                    resolve(data);
                }
            }
        });
    };

    this.serverRequest = requestConfig => {

        let missionConfig = mixConfig(requestConfig || {});
        let requestDefer = new _Deferred2.default();

        // 1. requestInterceptors
        interceptors.request.reduce((configPromise, interceptor) => {
            return configPromise.then(interceptor);
        }, Promise.resolve(missionConfig)).then(config => {
            return config;
        }, interceptorError => {
            console.log('Request Intercept Fail ... ', interceptorError);
            if (!interceptorError instanceof Error) {
                interceptorError = (0, _CreateError2.default)({ message: interceptorError });
            }
            throw interceptorError;
        })
        // 2. doRequest
        .then(config => {
            var mission = new _Http2.default(config);
            // 2.1 doRequest
            httpMD.put(mission)
            // 2.2. response or error
            .then(result => {
                // 2.2.1 responseInterceptors
                interceptors.response.reduce((resultPromise, interceptor) => {
                    return resultPromise.then(result => {
                        return interceptor(result, requestConfig);
                    });
                }, Promise.resolve(result)).then(result => {
                    requestDefer.resolve(result);
                }, error => {
                    /* 
                     * @TODO
                     * error instanceof Error && requestDefer.reject(error); 
                     */
                    console.error('Response Intercept Exception ... ', error);
                    throw error;
                });
            }, error => {
                // 洗数据,约定： interceptorError instanceof Error
                let transformedError;
                if (error instanceof Error) {
                    transformedError = error;
                } else {
                    transformedError = (0, _CreateError2.default)({ message: error });
                }
                // 2.2.2. errorInterceptors
                interceptors.error.reduce((errorPromise, interceptor) => {
                    return errorPromise.then(error => {
                        return interceptor(error, requestConfig);
                    });
                }, Promise.resolve(transformedError)).then(errorOrData => {
                    /*
                     * 【注意！！！】
                     *　处理过的异常, errorInterceptor可能把error转换为正常的数据(非Error类型)
                     *  error(一定是一个Error类型的实例)
                     */
                    let handler = errorOrData instanceof Error ? 'reject' : 'resolve';
                    requestDefer[handler](errorOrData);
                }, exceptionError => {
                    // 未处理异常
                    console.log("Error Intercept Exception ... ", exceptionError);
                    throw exceptionError;
                });
            });
        }).catch(err => {
            requestDefer.reject(err);
        });

        return requestDefer.promise;
    };
}

DataSource.ErrorType = _const2.default.ERROR_TYPE;
DataSource.Deferred = _Deferred2.default;
DataSource.createError = _CreateError2.default;
DataSource.createComboPromise = _ComboPromise2.default;

exports.default = DataSource;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
class Deferred {

    constructor() {
        this.promise = new Promise(function (resolve, reject) {
            this._resolve = resolve;
            this._reject = reject;
        }.bind(this));
    }

    resolve(value) {
        this._resolve.call(this.promise, value);
    }

    reject(reason) {
        this._reject.call(this.promise, reason);
    }
}

exports.default = Deferred;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(0);
var normalizeHeaderName = __webpack_require__(25);

var PROTECTION_PREFIX = /^\)\]\}',?\n/;
var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(10);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(10);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      data = data.replace(PROTECTION_PREFIX, '');
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMehtodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(17);
exports.encode = exports.stringify = __webpack_require__(18);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createError;

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var ERROR_TYPE = _const2.default.ERROR_TYPE;

const DEFAULT_ERROR_MSG = 'undefined message';
const DEFAULT_ERROR_TYPE = ERROR_TYPE.BUSINESS;

/* 说明 */
function createError(_ref) {
    let { traceid, code, message = DEFAULT_ERROR_MSG, type = ERROR_TYPE.BUSINESS } = _ref,
        args = _objectWithoutProperties(_ref, ['traceid', 'code', 'message', 'type']);

    // need a real Error 
    var error = new Error(message);
    error.type = type;
    error.code = code;
    error.traceid = traceid;
    Object.assign(error, args);
    return error;
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createComboDefer = exports.createComboPromise = undefined;

var _Deferred = __webpack_require__(3);

var _Deferred2 = _interopRequireDefault(_Deferred);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let _runnings = {};

let comboDefersMap = new Map();

let comboPromisesMap = new Map();

const isFunction = value => {
    return Object.prototype.toString.call(value) === '[object Function]';
};

// 相同id的resolver, 将已有的promise返回， 不再创建新的promise
function createComboPromise(key, resolver) {

    let promise = comboPromisesMap.get(key);

    if (!(promise instanceof Promise)) {
        promise = new Promise(resolver);
        comboPromisesMap.set(key, promise);

        promise.then(data => {
            comboPromisesMap.delete(key);
        }, error => {
            comboPromisesMap.delete(key);
        });
    }

    return promise;
}

function createComboDefer(id) {

    let deferKey = id,
        comboDefer = comboDefersMap.get(deferKey);

    if (typeof comboDefer === 'undefined') {
        comboDefer = new _Deferred2.default();
        comboDefersMap.set(deferKey, comboDefer);
    }

    // 无论成功及失败， 都要删除对应的comboDefer, 然后再将成功或失败返回 
    comboDefer.promise.then(data => {
        comboDefersMap.delete(deferKey);
    }, error => {
        comboDefersMap.delete(deferKey);
    });

    return comboDefer;
}

exports.createComboPromise = createComboPromise;
exports.createComboDefer = createComboDefer;
exports.default = createComboPromise;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(0);
var settle = __webpack_require__(26);
var buildURL = __webpack_require__(28);
var parseHeaders = __webpack_require__(29);
var isURLSameOrigin = __webpack_require__(30);
var createError = __webpack_require__(11);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(31);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(32);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        if (request.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(27);

/**
 * Create an Error with the specified message, config, error code, and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 @ @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, response);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _proxy = __webpack_require__(15);

var _proxy2 = _interopRequireDefault(_proxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const API = {
    getMenu: 'api/menu.json'
};

const DataService = {
    // 获取最常使用的语言
    getMenu: function getMenu() {
        let result = _proxy2.default.get(API.getMenu);
        return result;
    }
};

const render = function render(data) {
    var $code = document.getElementsByTagName('code');
    $code[0].textContent = data;
};

DataService.getMenu().then(data => {
    console.log(data);return data.items || [];
}).then(render).catch(err => console.error(err));

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = __webpack_require__(16);

var _config2 = _interopRequireDefault(_config);

var _index = __webpack_require__(2);

var _index2 = _interopRequireDefault(_index);

var _FixParams = __webpack_require__(47);

var _FixParams2 = _interopRequireDefault(_FixParams);

var _ErrorProcessor = __webpack_require__(48);

var _ErrorProcessor2 = _interopRequireDefault(_ErrorProcessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseURL = _config2.default.BASE_URL;

var dataSource = new _index2.default();

// 面向切面: 按顺序组装拦截器


dataSource.interceptors.request.use(_FixParams2.default.request).interceptors.error.use(_ErrorProcessor2.default.error);

var DataSourceProxy = {

    post: function (uri, data) {
        var config = {
            url: uri,
            method: 'post',
            // to methods of that instance.
            baseURL: baseURL,
            // data仅用于post请求， 放在http请求体中
            data: data
        };

        return DataSourceProxy.request(config);
    },

    get: function (uri, params) {

        var config = {
            url: uri,
            // to methods of that instance.
            baseURL: baseURL,
            method: 'get',
            // params仅用于get请求， 会拼接在url后面
            params: params,
            // 默认get请求可合并
            comboRequestEnabled: true
        };

        return DataSourceProxy.request(config);
    },

    cacheFirstGet: function (uri, params, { maxAge, ignoreExpires } = { maxAge: 60 * 60 * 1000, ignoreExpires: false }) {
        var config = {
            url: uri,
            // to methods of that instance.
            baseURL: baseURL,
            method: 'get',
            // params仅用于get请求， 会拼接在url后面
            params: params,
            // 默认get请求可合并
            comboRequestEnabled: true,
            // ============= 新增缓存数据参数  ============
            // [Number|null] 缓存时间， 单位ms. 如果需要缓存 ，请给maxAge 赋一个数值
            maxAge: maxAge,
            // [Boolean] 是否忽略缓存过期
            ignoreExpires: ignoreExpires
        };

        return DataSourceProxy.request(config);
    },

    // let {url, baseURL, method, params, comboRequestEnabled, maxAge, ignoreExpires} = config
    request: function (config) {
        return new Promise((resolve, reject) => {
            dataSource.request(config).then(data => {
                resolve(data);
            }, err => {
                reject(err);
            });
        });
    },
    start: () => {
        dataSource.start();
    },
    stop: () => {
        dataSource.stop();
    }

    // 错误类型的定义
};DataSourceProxy.ErrorType = _index2.default.ErrorType; //{BUSINESS, NETWORK, TIMEOUT, ABORT, PARSER}
DataSourceProxy.createError = _index2.default.createError; //{BUSINESS, NETWORK, TIMEOUT, ABORT, PARSER}

exports.default = DataSourceProxy;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
const config = {
	// api请求的baseURL, 用于DataSourceGateWay
	// BASE_URL: '/web/',
	BASE_URL: 'https://www.easy-mock.com/mock/58ff1ae35e43ae5dbea5ef8c/'
};

exports.default = config;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
const DefaultConfig = {
    // `url` is the server URL that will be used for the request
    url: '',

    // `method` is the request method to be used when making the request
    method: 'get', // default

    // `baseURL` will be prepended to `url` unless `url` is absolute.
    // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
    // to methods of that instance.
    baseURL: '',

    // `headers` are custom headers to be sent
    headers: { 'X-Requested-With': 'XMLHttpRequest' },

    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    params: {},

    // `data` is the data to be sent as the request body
    // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
    // When no `transformRequest` is set, must be of one of the following types:
    // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
    // - Browser only: FormData, File, Blob
    // - Node only: Stream
    data: {},

    // `responseType` indicates the type of data that the server will respond with
    // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType: 'text',

    // `timeout` specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted.
    timeout: 5000, // default: 1000

    // `withCredentials` indicates whether or not cross-site Access-Control requests
    // should be made using credentials
    withCredentials: false, // default: false


    // 请求可合并
    comboRequestEnabled: false

};

exports.default = DefaultConfig;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _querystring = __webpack_require__(5);

var _querystring2 = _interopRequireDefault(_querystring);

var _axios = __webpack_require__(22);

var _axios2 = _interopRequireDefault(_axios);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

var _CreateError = __webpack_require__(6);

var _CreateError2 = _interopRequireDefault(_CreateError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'axios-response-logger';

var ERROR_TYPE = _const2.default.ERROR_TYPE;

var JSON = (typeof window === 'undefined' ? global : window).JSON || {};

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 * @refer https://github.com/mzabriskie/axios/blob/master/lib/utils.js
 */
function isObject(val) {
    return val !== null && typeof val === 'object';
}

function transformMissionConfig(config) {

    let transformedConfig = Object.assign({}, config);

    if (config.method === 'post' && isObject(transformedConfig.data)) {
        transformedConfig.data = _querystring2.default.stringify(transformedConfig.data);
    }

    return transformedConfig;
}

class AjaxWorkerFactory {

    do(mission) {
        return new Promise((resolve, reject) => {
            // axiosSchema: https://github.com/mzabriskie/axios
            let transformedConfig = transformMissionConfig(mission.config);

            _axios2.default.request(transformedConfig).then(({ data, status, statusText, headers, config, response }) => {
                if (Object.prototype.toString.call(data) !== "[object Object]") {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        let message = "response is not a instance of JSON ";
                        console.error("response of '%s' is not JSON ", config.url);
                        let parserError = (0, _CreateError2.default)({ message: message, type: ERROR_TYPE.PARSER });
                        reject(parserError);
                    }
                }

                // reslove 
                // [!important] 新增的 (data.code) 逻辑判断是为了兼容服务端api error返回结构争议
                if (data.error || data.code) {
                    // 2. bizError
                    let rawError = data.error || data;
                    let businessError = (0, _CreateError2.default)(rawError);
                    reject(businessError);
                } else {
                    resolve(data);
                }
            }, error => {
                if (_axios2.default.isCancel(error)) {
                    // abort error
                    console.log('Request canceled', error.message);
                    let abortError = (0, _CreateError2.default)({ message: error.message, type: ERROR_TYPE.ABORT, code: error.code, subcode: error.subcode });
                    reject(abortError);
                } else if (error.code === 'ECONNABORTED') {
                    // timeout error
                    let timeoutError = (0, _CreateError2.default)({ message: error.message, type: ERROR_TYPE.TIMEOUT, code: error.code, subcode: error.subcode });
                    reject(timeoutError);
                } else if (error.response) {
                    // network error 
                    // The request was made, but the server responded with a status code
                    // that falls out of the range of 2xx
                    let { status, statusText, headers, config } = error.response;
                    let networkError = (0, _CreateError2.default)({ message: statusText, type: ERROR_TYPE.NETWORK, code: status, subcode: error.subcode });
                    reject(networkError);
                } else {
                    console.error("another error: ", error);
                    let networkError1 = (0, _CreateError2.default)({ message: error.message, type: ERROR_TYPE.NETWORK });
                    reject(networkError1);
                }
            });
        });
    }
}

exports.default = AjaxWorkerFactory;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ }),
/* 21 */
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(23);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var bind = __webpack_require__(8);
var Axios = __webpack_require__(24);
var defaults = __webpack_require__(4);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(13);
axios.CancelToken = __webpack_require__(38);
axios.isCancel = __webpack_require__(12);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(39);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(4);
var utils = __webpack_require__(0);
var InterceptorManager = __webpack_require__(33);
var dispatchRequest = __webpack_require__(34);
var isAbsoluteURL = __webpack_require__(36);
var combineURLs = __webpack_require__(37);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(11);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response
    ));
  }
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 @ @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.response = response;
  return error;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var transformData = __webpack_require__(35);
var isCancel = __webpack_require__(12);
var defaults = __webpack_require__(4);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(13);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Super = __webpack_require__(41);

var _Super2 = _interopRequireDefault(_Super);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HttpMission extends _Super2.default {

    constructor(config) {
        super('http', config);
    }
}

exports.default = HttpMission;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
class Mission {

    constructor(type, config) {
        this.type = type;
        this.config = config;
        //假设JSON.stringify序列化结果是稳定得
        this.signature = JSON.stringify({ type: type, config: config });
        this.createTime = Date.now();
    }
}

exports.default = Mission;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Deferred = __webpack_require__(3);

var _Deferred2 = _interopRequireDefault(_Deferred);

var _ComboPromise = __webpack_require__(7);

var _events = __webpack_require__(43);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 会不会溢出？
let serialNumber = 0;

function makeMissionKey(mission) {
    let missionKey = mission.config.comboRequestEnabled ? mission.signature : serialNumber++;
    return missionKey;
}

/*
 * @param {WorkerFactory|Function} 生成worker的工厂
 * @param {count|countber} 生成worker的数量 
 */
class MissionDispatcher {

    constructor(WorkerFactory, count) {
        this._context = {
            workers: [], // worker队列
            missionQueue: [], // 任务队列 
            // 持有相同defer的mission, 结构类似{missionDefer: mission} 
            missionDefers: new Map(),
            isRunning: false, // controller的运行状态 
            emitter: new _events.EventEmitter()
        };

        for (let i = 0; i < count; i++) {
            let worker = new WorkerFactory();
            worker.id = i;
            this._context.workers.push(worker);
        }

        this._context.emitter.on('mission:put', run.bind(this._context));
        this._context.emitter.on('worker:add', run.bind(this._context));
    }

    // 【!!!约定】 以下划线开头的是私有变量，请不要调用 


    put(mission) {

        let missionKey = makeMissionKey(mission),
            missionDefer = (0, _ComboPromise.createComboDefer)(missionKey),
            missionInQueue = Object.assign({}, mission, { defer: missionDefer });

        if (this._context.missionDefers.has(missionDefer) === false) {
            this._context.missionDefers.set(missionDefer, missionInQueue);
            this._context.missionQueue.push(missionInQueue);
            this._context.emitter.emit('mission:put', run);
        }

        return missionDefer.promise;
    }

    start() {
        if (this._context.isRunning === false) {
            this._context.isRunning = true;
            run.bind(this._context)();
        } else {
            console.log(' MissionDispatcher is already Running ... ');
        }
    }

    stop() {
        this._context.isRunning = false;
    }

}

function run() {

    let threadsCount,
        context = this;

    if (context.isRunning === false) {
        console.warn(' MissionDispatcher is stopped ... ');
        return;
    }

    if (context.missionQueue.length === 0) {
        console.log(' No Mission ...  ');
        return;
    }

    if (context.workers.length === 0) {
        console.log(' No Avaliable workers ...  ');
        return;
    }

    // realDo Mission ====
    threadsCount = Math.min(context.workers.length, context.missionQueue.length);

    while (threadsCount > 0) {
        // 从map里出第一个
        dispatch(context.workers.shift(), context.missionQueue.shift()); // FIFO
        threadsCount--;
    }

    // 给worker分配任务, 合并请求
    function dispatch(worker, mission) {

        //console.log("%cSTART: workerId: %s, missionSignature: %s", "color:green", worker.id, mission.signature);

        var finishHandler = function () {
            // 归还worker
            context.workers.push(worker);
            context.emitter.emit("worker:add");
            // 删除 执行过的 missionDefer
            context.missionDefers.delete(mission.defer);
        };

        worker.do(mission).then(function (data) {
            mission.defer.resolve(data);
            // console.log("%cResolve: m %s, w %s ", "color:blue", mission, worker.id);
            finishHandler();
        }, function (reason) {
            mission.defer.reject(reason);
            // console.log("%cReject: m %s, w %s ", "color:red", mission, worker.id);
            finishHandler();
        });
    }
}

exports.default = MissionDispatcher;

/***/ }),
/* 43 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Storage = __webpack_require__(45);

var _Storage2 = _interopRequireDefault(_Storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ins = {};

class CacheData {

    constructor(ns, signature = '', isMemory = false) {

        let id = ns + "_" + signature;
        // Singleton Pattern
        if (!(_ins[id] instanceof CacheData)) {
            _ins[id] = this;
        } else {
            return _ins[id];
        }

        this.id = id;
        this.signature = signature;
        //CacheData中只采取持久存储方案
        this.storage = new _Storage2.default(ns, isMemory);
    }

    clear() {
        this.storage.clear();
    }

    item(key, opts) {
        opts = opts || {};
        return new CacheDataItem(this.storage, this.signature, key, opts);
    }
}

class CacheDataItem {

    constructor(storage, signature, key, opts) {

        // eg: url+参数序列化
        this.key = key;
        // 就是具体的存储方案， 调用它来clear, get , set
        this.storage = storage;
        // eg, v2.0
        this.signature = signature;

        this.maxAge = opts.maxAge || opts.maxage || null;

        this.ignoreExpires = opts.ignoreExpires;

        this.dataFormatter = {
            getter: null,
            setter: null
        };
    }

    setFormatter(setter, getter) {
        this.dataFormatter = {
            setter: setter || null,
            getter: getter || null
        };
    }

    set(data) {
        if (this.dataFormatter && this.dataFormatter.setter) {
            data = this.dataFormatter.setter(data);
        }
        var value = {
            data: data,
            time: new Date().getTime(),
            signature: this.signature
        };
        if (this.maxAge) {
            value.expires = new Date().getTime() + this.maxAge;
        }
        if (value.data) {
            this.storage.set(this.key, value);
        }
    }

    get() {
        var data = this.storage.get(this.key);
        if (data && data.signature === this.signature && (this.ignoreExpires || !data.expires || new Date().getTime() < data.expires)) {
            data = data.data;

            if (this.dataFormatter && this.dataFormatter.getter) {
                data = this.dataFormatter.getter(data);
            }
            return data;
        }
        return null;
    }

    remove() {
        this.storage.remove(this.key);
    }

    isExpired() {
        var data = this.storage.get(this.key);
        return !!data && !!data.expires && new Date().getTime() >= data.expires;
    }

    getUpdatedTime() {
        var data = this.storage.get(this.key);
        return data && data.time - 0;
    }

    getExpires() {
        var data = this.storage.get(this.key);
        return data && data.expires;
    }

}

exports.default = CacheData;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Solution = __webpack_require__(46);

var _Solution2 = _interopRequireDefault(_Solution);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [Storage description]
 * @param {[string]}  id       [惟一标识]
 * @param {Boolean} isMemory [是否使用内存级存储，默认为flase 即持久存储]
 */
var _ins = {};
var prefix = _const2.default.NAMESPACE;

class Storage {

    constructor(id, isMemory = false) {
        // Singleton pattern
        if (!(_ins[id] instanceof Storage)) {
            _ins[id] = this;
        } else {
            return _ins[id];
        }

        this.id = id;
        this.ns = prefix + "_" + id + "_";

        this._methods = isMemory ? _Solution2.default.memory.methods : function () {
            if (_Solution2.default.localStorage.test()) {
                return _Solution2.default.localStorage.methods;
            }
            if (_Solution2.default.userData.test()) {
                return _Solution2.default.userData.methods;
            }
            return {
                init: function () {},
                get: function () {},
                set: function () {},
                remove: function () {},
                clear: function () {}
            };
        }();

        if (this._methods) {
            this._methods.init(this.ns);
        }
    }

    encode(data) {
        return window.JSON ? JSON.stringify(data) : data;
    }

    decode(data) {
        return window.JSON ? JSON.parse(data) : data;
    }

    set(key, value) {
        try {
            this._methods.set(this.ns, key, this.encode(value));
            return true;
        } catch (e) {
            return false;
        }
    }

    get(key) {
        try {
            return this.decode(this._methods.get(this.ns, key));
        } catch (e) {}
    }

    remove(key) {
        try {
            this._methods.remove(this.ns, key);
        } catch (e) {}
    }

    clear() {
        try {
            this._methods.clear(this.ns);
        } catch (e) {}
    }

}

exports.default = Storage;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//存储服务
var Solution = {};
var _memoryStorage = {};

Solution["localStorage"] = {
    test: function () {
        try {
            return window.localStorage ? true : false;
        } catch (e) {
            return false;
        }
    },
    methods: {
        init: function (ns) {},
        set: function (ns, key, value) {
            try {
                localStorage.setItem(ns + key, value);
            } catch (e) {
                throw e;
            }
        }, //throw
        get: function (ns, key) {
            return localStorage.getItem(ns + key);
        },
        remove: function (ns, key) {
            localStorage.removeItem(ns + key);
        },
        clear: function (ns) {
            if (!ns) {
                localStorage.clear();
            } else {
                for (var i = localStorage.length - 1, key; key = localStorage.key(i--);) {
                    if (key && key.indexOf(ns) === 0) {
                        localStorage.removeItem(key);
                    }
                }
            }
        }
    }
};
Solution["userData"] = {
    test: function () {
        try {
            return window.ActiveXObject && document.documentElement.addBehavior ? true : false;
        } catch (e) {
            return false;
        }
    },
    methods: {
        _owners: {},
        init: function (ns) {
            if (!this._owners[ns]) {
                if (document.getElementById(ns)) {
                    this._owners[ns] = document.getElementById(ns);
                } else {
                    var el = document.createElement('script'),
                        head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                    el.id = ns;
                    el.style.display = 'none';
                    el.addBehavior('#default#userdata');
                    head.insertBefore(el, head.firstChild);
                    this._owners[ns] = el;
                }
                try {
                    this._owners[ns].load(ns);
                } catch (e) {}
                var _self = this;
                window.attachEvent("onunload", function () {
                    _self._owners[ns] = null;
                });
            }
        },
        set: function (ns, key, value) {
            if (this._owners[ns]) {
                try {
                    this._owners[ns].setAttribute(key, value);
                    this._owners[ns].save(ns);
                } catch (e) {
                    throw e;
                }
            }
        },
        get: function (ns, key) {
            if (this._owners[ns]) {
                this._owners[ns].load(ns);
                return this._owners[ns].getAttribute(key) || null;
            }
            return null;
        },
        remove: function (ns, key) {
            if (this._owners[ns]) {
                this._owners[ns].removeAttribute(key);
                this._owners[ns].save(ns);
            }
        },
        clear: function (ns) {
            if (this._owners[ns]) {
                var attributes = this._owners[ns].XMLDocument.documentElement.attributes;
                this._owners[ns].load(ns);
                for (var i = 0, attr; attr = attributes[i]; i++) {
                    this._owners[ns].removeAttribute(attr.name);
                }
                this._owners[ns].save(ns);
            }
        }
    }
};

Solution["memory"] = {
    test: function () {
        return true;
    },
    methods: {
        init: function (ns) {
            _memoryStorage[ns] = {};
        },
        get: function (ns, key) {
            return _memoryStorage[ns][key];
        },
        set: function (ns, key, value) {
            _memoryStorage[ns][key] = value;
        },
        remove: function (ns, key) {
            delete _memoryStorage[ns][key];
        },
        clear: function (ns) {
            delete _memoryStorage[ns];
        }
    }
};

exports.default = Solution;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    request: (() => {
        var _ref = _asyncToGenerator(function* (config) {
            // 给所有的get请求添加一个_t参数 
            let baseParams = {
                _t: +new Date() //1314
            };

            return new Promise(function (resolve, reject) {
                let assignTarget = config.method === 'get' ? 'params' : 'data';
                config[assignTarget] = config[assignTarget] || {};
                Object.assign(config[assignTarget], baseParams);
                resolve(config);
            });
        });

        return function request(_x) {
            return _ref.apply(this, arguments);
        };
    })()
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = __webpack_require__(2);

var _index2 = _interopRequireDefault(_index);

var _locale = __webpack_require__(49);

var _locale2 = _interopRequireDefault(_locale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ErrorLocales = _locale2.default.Errors;
const { ErrorType, Deferred, createComboPromise } = _index2.default;
const BizCommonErrorLocales = ErrorLocales[ErrorType.BUSINESS]['COMMON'];
const BizModulesErrorLocales = ErrorLocales[ErrorType.BUSINESS]['MODULES'];

/* 给error 增加一个locale字段 */
exports.default = {
    request: config => {
        return Promise.resolve(config);
    },
    response: (result, config) => {},
    error: (error, config) => {

        let defer = new Deferred();
        let resolveDefer = () => {
            defer.resolve(error);
        };

        if (error.type === ErrorType.NETWORK) {
            error.locale = ErrorLocales[error.type]['default'];
        } else if (error.type === ErrorType.TIMEOUT) {

            error.locale = ErrorLocales[error.type]['default'];
        } else if (error.type === ErrorType.ABORT) {
            error.locale = ErrorLocales[error.type]['default'];
        } else if (error.type === ErrorType.PARSER) {

            error.locale = ErrorLocales[error.type]['default'];
        } else {
            // business Error
            let locale;

            if (error.code && error.subcode) {
                // biz-modules 模块操作错误
                let module = config.url.split('/')[0],
                    moduleErrorLocales = BizModulesErrorLocales[module.toUpperCase()] || {};
                locale = moduleErrorLocales[error.subcode] || moduleErrorLocales['default'];
            } else if (error.code) {
                // biz-common错误
                locale = BizCommonErrorLocales[error.code];
            } else {
                // 兜底文案
                locale = error.submessage || error.message || BizCommonErrorLocales['default'];
            }

            error.locale = locale;
        }
        resolveDefer(error);

        return defer.promise;
    }
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = __webpack_require__(2);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { ErrorType, Deferred, createComboPromise } = _index2.default;

/* 业务-[通用|模块}'错误提示信息 */
//本地化文案

const Errors = {
    // 网络异常
    [ErrorType.NETWORK]: {
        // 'default': '亲爱的用户现在网络异常，请检查网络连接或稍后重试!' 
        'default': '亲爱的用户现在网络异常，请稍后重试!'
    },
    // 取消
    [ErrorType.ABORT]: {
        'default': '请求取消'
    },
    // 前端址时
    [ErrorType.TIMEOUT]: {
        'default': '请求超时，请稍后重试'
    },
    // 解析错误， 返回数据结构异常
    [ErrorType.PARSER]: {
        'default': '数据解析失败，请稍后重试'
    },
    [ErrorType.BUSINESS]: {
        // 通用错误, code, 首字符代表错误级别：4代表请求端错误，5带面server段发生错误）
        COMMON: {
            400: '参数内容错误', // 参数内容错误
            401: '缺少必要参数', // 缺少必要参数
            402: '未登录，请先登录', // 未登录
            403: '表单重复提交', // 表单重复提交
            404: '请求资源不存在', // 请求资源不存在
            405: '无权操作', // 无权操作，受限
            406: '', // 资源不满足请求条件
            408: '请求超时，请稍后重试', // 请求超时
            409: '', // 操作不满足超限(limit)
            410: '请求的资源不可用', // 请求的资源不可用
            502: '系统发生异常，请稍后重试', // 依赖的服务报错
            503: '系统发生异常，请稍后重试', // 系统发生临时错误
            504: '系统发生异常，请稍后重试', //系统发生致命错误
            'default': '操作失败，请稍后重试' // 兜底文案
        },
        // 模块级错误， subcode
        MODULES: {
            // 商品
            GOODS: {
                1901: '商品不存在' // 商品不存在
            }
        }
    }

};

exports.default = {
    Errors
};

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map