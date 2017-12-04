(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports", "babel-runtime/core-js/promise", "babel-runtime/helpers/classCallCheck", "babel-runtime/core-js/object/assign", "babel-runtime/helpers/typeof", "../utils", "axios", "../const", "../utils/createError"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require("babel-runtime/core-js/promise"), require("babel-runtime/helpers/classCallCheck"), require("babel-runtime/core-js/object/assign"), require("babel-runtime/helpers/typeof"), require("../utils"), require("axios"), require("../const"), require("../utils/createError"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.promise, global.classCallCheck, global.assign, global._typeof, global.utils, global.axios, global._const, global.createError);
    global.Ajax = mod.exports;
  }
})(this, function (module, exports, _promise, _classCallCheck2, _assign, _typeof2, _utils, _axios, _const, _createError) {
  "use strict";

  exports.__esModule = true;

  var _promise2 = _interopRequireDefault(_promise);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _assign2 = _interopRequireDefault(_assign);

  var _typeof3 = _interopRequireDefault(_typeof2);

  var _axios2 = _interopRequireDefault(_axios);

  var _const2 = _interopRequireDefault(_const);

  var _createError2 = _interopRequireDefault(_createError);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var ERROR_TYPE = _const2["default"].ERROR_TYPE;
  var JSON = (typeof window === "undefined" ? global : window).JSON || {};
  // 异常数据结构
  var errorResponseStruct = { httpStatusCode: NaN, code: NaN, message: "" };
  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   * @refer https://github.com/mzabriskie/axios/blob/master/lib/utils.js
   */
  var isObject = function isObject(val) {
    return val !== null && (typeof val === "undefined" ? "undefined" : (0, _typeof3["default"])(val)) === "object";
  };
  var transformMissionConfig = function transformMissionConfig(config) {
    var paramSerializer = (0, _utils.getParamSerializer)(config.paramSerializerJQLikeEnabled);
    var transformedConfig = (0, _assign2["default"])({}, config);
    if (config.method === "post" && isObject(transformedConfig.data)) {
      transformedConfig.data = paramSerializer(transformedConfig.data);
    }
    return transformedConfig;
  };

  var AjaxWorkerFactory = function () {
    function AjaxWorkerFactory(strategy) {
      (0, _classCallCheck3["default"])(this, AjaxWorkerFactory);

      this.injectStrategy(strategy);
    }

    AjaxWorkerFactory.prototype.injectStrategy = function injectStrategy(strategy) {
      if (strategy != null) {
        if (strategy.businessError) {
          this.businessErrorStrategy = strategy.businessError;
        }
      }
    };

    AjaxWorkerFactory.prototype.isUnValidateStatus = function isUnValidateStatus(httpStatus) {
      // not 2xx or
      return httpStatus >= 300 || httpStatus < 200;
    };

    AjaxWorkerFactory.prototype.isErrorData = function isErrorData(data) {
      // code exist and != 0
      return data && (data.error || data.code && data.code !== 0);
    };

    AjaxWorkerFactory.prototype.defaultBizErrorStrategy = function defaultBizErrorStrategy(data, status, resolve, reject) {
      if (this.isUnValidateStatus(status) || this.isErrorData(data)) {
        var httpStatusCode = status;

        var _ref = data.error || data,
            code = _ref.code,
            message = _ref.message;

        var businessError = (0, _createError2["default"])({ code: code, message: message, httpStatusCode: httpStatusCode });
        reject(businessError);
      } else {
        resolve(data);
      }
    };

    AjaxWorkerFactory.prototype["do"] = function _do(mission) {
      var _this = this;

      return new _promise2["default"](function (resolve, reject) {
        // axiosSchema: https://github.com/mzabriskie/axios
        var transformedConfig = transformMissionConfig(mission.config);
        _axios2["default"].request(transformedConfig).then(function (_ref2) {
          var data = _ref2.data,
              status = _ref2.status,
              statusText = _ref2.statusText,
              headers = _ref2.headers,
              config = _ref2.config,
              response = _ref2.response;

          if (Object.prototype.toString.call(data) !== "[object Object]") {
            try {
              /*
               * @description  [补丁]
               * restful 接口 返回 204 时，data 为 空字符串， 直接返回空字符串， 否则JSON.parse("")会抛出异常
               */
              data = status === 204 ? data : JSON.parse(data);
            } catch (e) {
              var message = "response is not a instance of JSON ";
              console.error("response of '%s' is not JSON ", config.url);
              var parserError = (0, _createError2["default"])({
                message: message,
                type: ERROR_TYPE.PARSER
              });
              reject(parserError);
            }
          }
          //has data.error or data.code
          if (!_this.businessErrorStrategy) {
            _this.businessErrorStrategy = _this.defaultBizErrorStrategy;
          }
          _this.businessErrorStrategy(data, status, resolve, reject);
        })["catch"](function (error) {
          if (_axios2["default"].isCancel(error)) {
            // abort error
            // console.log('Request canceled', error.message);
            var abortError = (0, _createError2["default"])({
              message: error.message,
              type: ERROR_TYPE.ABORT,
              code: error.code
            });
            reject(abortError);
          } else if (error.code === "ECONNABORTED") {
            // timeout error
            var timeoutError = (0, _createError2["default"])({
              message: error.message,
              type: ERROR_TYPE.TIMEOUT,
              code: error.code
            });
            reject(timeoutError);
          } else if (error.response) {
            // biz error
            // The request was made, but the server responded with a status code
            // that falls out of the range of 2xx
            var networkError = void 0;
            var _error$response = error.response,
                status = _error$response.status,
                statusText = _error$response.statusText,
                headers = _error$response.headers,
                config = _error$response.config,
                data = _error$response.data;


            if (!_this.businessErrorStrategy) {
              _this.businessErrorStrategy = _this.defaultBizErrorStrategy;
            }
            _this.businessErrorStrategy(data, status, resolve, reject);

            var _ref3 = data || {},
                code = _ref3.code,
                message = _ref3.message;

            var responseDataError = data && data.error || {};
            var type = ERROR_TYPE.NETWORK,
                httpStatusCode = status;
            // 兼容data.code 和 data.error这两种标志异常的方式， 优先选用code
            code = code || responseDataError.code;
            message = message || responseDataError.message || statusText;
            networkError = (0, _createError2["default"])({ type: type, httpStatusCode: httpStatusCode, code: code, message: message });
            reject(networkError);
          } else {
            // The request was made but no response was received
            // Something happened in setting up the request that triggered an Error
            var requestError = (0, _createError2["default"])({
              message: error.message,
              type: ERROR_TYPE.NETWORK
            });
            reject(requestError);
          }
        });
      });
    };

    return AjaxWorkerFactory;
  }();

  exports["default"] = AjaxWorkerFactory;
  module.exports = exports["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93b3JrZXJzL0FqYXguanMiXSwibmFtZXMiOlsiRVJST1JfVFlQRSIsIkpTT04iLCJ3aW5kb3ciLCJnbG9iYWwiLCJlcnJvclJlc3BvbnNlU3RydWN0IiwiaHR0cFN0YXR1c0NvZGUiLCJOYU4iLCJjb2RlIiwibWVzc2FnZSIsImlzT2JqZWN0IiwidmFsIiwidHJhbnNmb3JtTWlzc2lvbkNvbmZpZyIsImNvbmZpZyIsInBhcmFtU2VyaWFsaXplciIsInBhcmFtU2VyaWFsaXplckpRTGlrZUVuYWJsZWQiLCJ0cmFuc2Zvcm1lZENvbmZpZyIsIm1ldGhvZCIsImRhdGEiLCJBamF4V29ya2VyRmFjdG9yeSIsInN0cmF0ZWd5IiwiaW5qZWN0U3RyYXRlZ3kiLCJidXNpbmVzc0Vycm9yIiwiYnVzaW5lc3NFcnJvclN0cmF0ZWd5IiwiaXNVblZhbGlkYXRlU3RhdHVzIiwiaHR0cFN0YXR1cyIsImlzRXJyb3JEYXRhIiwiZXJyb3IiLCJkZWZhdWx0Qml6RXJyb3JTdHJhdGVneSIsInN0YXR1cyIsInJlc29sdmUiLCJyZWplY3QiLCJtaXNzaW9uIiwicmVxdWVzdCIsInRoZW4iLCJzdGF0dXNUZXh0IiwiaGVhZGVycyIsInJlc3BvbnNlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwicGFyc2UiLCJlIiwiY29uc29sZSIsInVybCIsInBhcnNlckVycm9yIiwidHlwZSIsIlBBUlNFUiIsImlzQ2FuY2VsIiwiYWJvcnRFcnJvciIsIkFCT1JUIiwidGltZW91dEVycm9yIiwiVElNRU9VVCIsIm5ldHdvcmtFcnJvciIsInJlc3BvbnNlRGF0YUVycm9yIiwiTkVUV09SSyIsInJlcXVlc3RFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLE1BQU1BLGFBQWEsbUJBQU1BLFVBQXpCO0FBQ0EsTUFBTUMsT0FBTyxDQUFDLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0ND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QUFPMEIsWUFBUDtBQUNEO0FBQ0YsU0ExRUg7QUEyRUQsT0E5RU0sQ0FBUDtBQStFRCxLOzs7Ozt1QkFFWXRDLGlCIiwiZmlsZSI6IkFqYXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2dldFBhcmFtU2VyaWFsaXplcn0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgQ29uc3QgZnJvbSBcIi4uL2NvbnN0XCI7XG5pbXBvcnQgY3JlYXRlRXJyb3IgZnJvbSBcIi4uL3V0aWxzL2NyZWF0ZUVycm9yXCI7XG5jb25zdCBFUlJPUl9UWVBFID0gQ29uc3QuRVJST1JfVFlQRTtcbmNvbnN0IEpTT04gPSAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHdpbmRvdykuSlNPTiB8fCB7fTtcbi8vIOW8guW4uOaVsOaNrue7k+aehFxuY29uc3QgZXJyb3JSZXNwb25zZVN0cnVjdCA9IHtodHRwU3RhdHVzQ29kZTogTmFOLCBjb2RlOiBOYU4sIG1lc3NhZ2U6IFwiXCJ9O1xuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICogQHJlZmVyIGh0dHBzOi8vZ2l0aHViLmNvbS9temFicmlza2llL2F4aW9zL2Jsb2IvbWFzdGVyL2xpYi91dGlscy5qc1xuICovXG5jb25zdCBpc09iamVjdCA9IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbCl7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIjtcbn07XG5jb25zdCB0cmFuc2Zvcm1NaXNzaW9uQ29uZmlnID0gZnVuY3Rpb24gdHJhbnNmb3JtTWlzc2lvbkNvbmZpZyhjb25maWcpe1xuICBjb25zdCBwYXJhbVNlcmlhbGl6ZXIgPSBnZXRQYXJhbVNlcmlhbGl6ZXIoXG4gICAgY29uZmlnLnBhcmFtU2VyaWFsaXplckpRTGlrZUVuYWJsZWRcbiAgKTtcbiAgbGV0IHRyYW5zZm9ybWVkQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnKTtcbiAgaWYgKGNvbmZpZy5tZXRob2QgPT09IFwicG9zdFwiICYmIGlzT2JqZWN0KHRyYW5zZm9ybWVkQ29uZmlnLmRhdGEpKSB7XG4gICAgdHJhbnNmb3JtZWRDb25maWcuZGF0YSA9IHBhcmFtU2VyaWFsaXplcih0cmFuc2Zvcm1lZENvbmZpZy5kYXRhKTtcbiAgfVxuICByZXR1cm4gdHJhbnNmb3JtZWRDb25maWc7XG59O1xuY2xhc3MgQWpheFdvcmtlckZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihzdHJhdGVneSkge1xuICAgIHRoaXMuaW5qZWN0U3RyYXRlZ3koc3RyYXRlZ3kpO1xuICB9XG5cbiAgaW5qZWN0U3RyYXRlZ3koc3RyYXRlZ3kpIHtcbiAgICBpZiAoc3RyYXRlZ3kgIT0gbnVsbCkge1xuICAgICAgaWYgKHN0cmF0ZWd5LmJ1c2luZXNzRXJyb3IpIHtcbiAgICAgICAgdGhpcy5idXNpbmVzc0Vycm9yU3RyYXRlZ3kgPSBzdHJhdGVneS5idXNpbmVzc0Vycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzVW5WYWxpZGF0ZVN0YXR1cyhodHRwU3RhdHVzKSB7XG4gICAgLy8gbm90IDJ4eCBvclxuICAgIHJldHVybiBodHRwU3RhdHVzID49IDMwMCB8fCBodHRwU3RhdHVzIDwgMjAwO1xuICB9XG5cbiAgaXNFcnJvckRhdGEoZGF0YSkge1xuICAgIC8vIGNvZGUgZXhpc3QgYW5kICE9IDBcbiAgICByZXR1cm4gZGF0YSAmJiAoZGF0YS5lcnJvciB8fCAoZGF0YS5jb2RlICYmIGRhdGEuY29kZSAhPT0gMCkpO1xuICB9XG5cbiAgZGVmYXVsdEJpekVycm9yU3RyYXRlZ3koZGF0YSwgc3RhdHVzLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAodGhpcy5pc1VuVmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB8fCB0aGlzLmlzRXJyb3JEYXRhKGRhdGEpKSB7XG4gICAgICBsZXQgaHR0cFN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gICAgICBsZXQge2NvZGUsIG1lc3NhZ2V9ID0gZGF0YS5lcnJvciB8fCBkYXRhO1xuXG4gICAgICBsZXQgYnVzaW5lc3NFcnJvciA9IGNyZWF0ZUVycm9yKHtjb2RlLCBtZXNzYWdlLCBodHRwU3RhdHVzQ29kZX0pO1xuICAgICAgcmVqZWN0KGJ1c2luZXNzRXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNvbHZlKGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIGRvKG1pc3Npb24pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gYXhpb3NTY2hlbWE6IGh0dHBzOi8vZ2l0aHViLmNvbS9temFicmlza2llL2F4aW9zXG4gICAgICBsZXQgdHJhbnNmb3JtZWRDb25maWcgPSB0cmFuc2Zvcm1NaXNzaW9uQ29uZmlnKG1pc3Npb24uY29uZmlnKTtcbiAgICAgIGF4aW9zXG4gICAgICAgIC5yZXF1ZXN0KHRyYW5zZm9ybWVkQ29uZmlnKVxuICAgICAgICAudGhlbigoe2RhdGEsIHN0YXR1cywgc3RhdHVzVGV4dCwgaGVhZGVycywgY29uZmlnLCByZXNwb25zZX0pID0+IHtcbiAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGEpICE9PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgKiBAZGVzY3JpcHRpb24gIFvooaXkuIFdXG4gICAgICAgICAgICAgICAqIHJlc3RmdWwg5o6l5Y+jIOi/lOWbniAyMDQg5pe277yMZGF0YSDkuLog56m65a2X56ym5Liy77yMIOebtOaOpei/lOWbnuepuuWtl+espuS4su+8jCDlkKbliJlKU09OLnBhcnNlKFwiXCIp5Lya5oqb5Ye65byC5bi4XG4gICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICBkYXRhID0gc3RhdHVzID09PSAyMDQgPyBkYXRhIDogSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBcInJlc3BvbnNlIGlzIG5vdCBhIGluc3RhbmNlIG9mIEpTT04gXCI7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZXNwb25zZSBvZiAnJXMnIGlzIG5vdCBKU09OIFwiLCBjb25maWcudXJsKTtcbiAgICAgICAgICAgICAgbGV0IHBhcnNlckVycm9yID0gY3JlYXRlRXJyb3Ioe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgdHlwZTogRVJST1JfVFlQRS5QQVJTRVJcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJlamVjdChwYXJzZXJFcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vaGFzIGRhdGEuZXJyb3Igb3IgZGF0YS5jb2RlXG4gICAgICAgICAgaWYgKCF0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneSkge1xuICAgICAgICAgICAgdGhpcy5idXNpbmVzc0Vycm9yU3RyYXRlZ3kgPSB0aGlzLmRlZmF1bHRCaXpFcnJvclN0cmF0ZWd5O1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneShkYXRhLCBzdGF0dXMsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgaWYgKGF4aW9zLmlzQ2FuY2VsKGVycm9yKSkge1xuICAgICAgICAgICAgLy8gYWJvcnQgZXJyb3JcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdSZXF1ZXN0IGNhbmNlbGVkJywgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICBsZXQgYWJvcnRFcnJvciA9IGNyZWF0ZUVycm9yKHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgICAgICAgdHlwZTogRVJST1JfVFlQRS5BQk9SVCxcbiAgICAgICAgICAgICAgY29kZTogZXJyb3IuY29kZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZWplY3QoYWJvcnRFcnJvcik7XG4gICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5jb2RlID09PSBcIkVDT05OQUJPUlRFRFwiKSB7XG4gICAgICAgICAgICAvLyB0aW1lb3V0IGVycm9yXG4gICAgICAgICAgICBsZXQgdGltZW91dEVycm9yID0gY3JlYXRlRXJyb3Ioe1xuICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICAgICAgICB0eXBlOiBFUlJPUl9UWVBFLlRJTUVPVVQsXG4gICAgICAgICAgICAgIGNvZGU6IGVycm9yLmNvZGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVqZWN0KHRpbWVvdXRFcnJvcik7XG4gICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5yZXNwb25zZSkge1xuICAgICAgICAgICAgLy8gYml6IGVycm9yXG4gICAgICAgICAgICAvLyBUaGUgcmVxdWVzdCB3YXMgbWFkZSwgYnV0IHRoZSBzZXJ2ZXIgcmVzcG9uZGVkIHdpdGggYSBzdGF0dXMgY29kZVxuICAgICAgICAgICAgLy8gdGhhdCBmYWxscyBvdXQgb2YgdGhlIHJhbmdlIG9mIDJ4eFxuICAgICAgICAgICAgbGV0IG5ldHdvcmtFcnJvcjtcbiAgICAgICAgICAgIGxldCB7c3RhdHVzLCBzdGF0dXNUZXh0LCBoZWFkZXJzLCBjb25maWcsIGRhdGF9ID0gZXJyb3IucmVzcG9uc2U7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5idXNpbmVzc0Vycm9yU3RyYXRlZ3kpIHtcbiAgICAgICAgICAgICAgdGhpcy5idXNpbmVzc0Vycm9yU3RyYXRlZ3kgPSB0aGlzLmRlZmF1bHRCaXpFcnJvclN0cmF0ZWd5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5idXNpbmVzc0Vycm9yU3RyYXRlZ3koZGF0YSwgc3RhdHVzLCByZXNvbHZlLCByZWplY3QpO1xuXG4gICAgICAgICAgICBsZXQge2NvZGUsIG1lc3NhZ2V9ID0gZGF0YSB8fCB7fTtcbiAgICAgICAgICAgIGxldCByZXNwb25zZURhdGFFcnJvciA9IChkYXRhICYmIGRhdGEuZXJyb3IpIHx8IHt9O1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBFUlJPUl9UWVBFLk5FVFdPUkssXG4gICAgICAgICAgICAgIGh0dHBTdGF0dXNDb2RlID0gc3RhdHVzO1xuICAgICAgICAgICAgLy8g5YW85a65ZGF0YS5jb2RlIOWSjCBkYXRhLmVycm9y6L+Z5Lik56eN5qCH5b+X5byC5bi455qE5pa55byP77yMIOS8mOWFiOmAieeUqGNvZGVcbiAgICAgICAgICAgIGNvZGUgPSBjb2RlIHx8IHJlc3BvbnNlRGF0YUVycm9yLmNvZGU7XG4gICAgICAgICAgICBtZXNzYWdlID0gbWVzc2FnZSB8fCByZXNwb25zZURhdGFFcnJvci5tZXNzYWdlIHx8IHN0YXR1c1RleHQ7XG4gICAgICAgICAgICBuZXR3b3JrRXJyb3IgPSBjcmVhdGVFcnJvcih7dHlwZSwgaHR0cFN0YXR1c0NvZGUsIGNvZGUsIG1lc3NhZ2V9KTtcbiAgICAgICAgICAgIHJlamVjdChuZXR3b3JrRXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUaGUgcmVxdWVzdCB3YXMgbWFkZSBidXQgbm8gcmVzcG9uc2Ugd2FzIHJlY2VpdmVkXG4gICAgICAgICAgICAvLyBTb21ldGhpbmcgaGFwcGVuZWQgaW4gc2V0dGluZyB1cCB0aGUgcmVxdWVzdCB0aGF0IHRyaWdnZXJlZCBhbiBFcnJvclxuICAgICAgICAgICAgbGV0IHJlcXVlc3RFcnJvciA9IGNyZWF0ZUVycm9yKHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgICAgICAgdHlwZTogRVJST1JfVFlQRS5ORVRXT1JLXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0RXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEFqYXhXb3JrZXJGYWN0b3J5O1xuIl19