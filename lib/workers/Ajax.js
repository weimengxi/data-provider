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

    AjaxWorkerFactory.prototype.defaultBizErrorStrategy = function defaultBizErrorStrategy(data, status, resolve, reject) {
      if (data !== null && data.code) {
        // 2. bizError
        var httpStatusCode = status;
        var rawError = (0, _assign2["default"])({}, data.error || data, {
          httpStatusCode: httpStatusCode
        });
        var businessError = (0, _createError2["default"])(rawError);
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
        _axios2["default"].request(transformedConfig).then(function (_ref) {
          var data = _ref.data,
              status = _ref.status,
              statusText = _ref.statusText,
              headers = _ref.headers,
              config = _ref.config,
              response = _ref.response;

          if (Object.prototype.toString.call(data) !== "[object Object]") {
            try {
              data = JSON.parse(data);
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
          // reslove
          // data可能是null
          if (!_this.businessErrorStrategy) {
            _this.businessErrorStrategy = _this.defaultBizErrorStrategy;
          }
          _this.businessErrorStrategy(data, status, resolve, reject);
        }, function (error) {
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
            // network error
            // The request was made, but the server responded with a status code
            // that falls out of the range of 2xx
            var networkError = void 0;
            var _error$response = error.response,
                status = _error$response.status,
                statusText = _error$response.statusText,
                headers = _error$response.headers,
                config = _error$response.config,
                _error$response$data = _error$response.data,
                data = _error$response$data === undefined ? {} : _error$response$data;


            if (!_this.businessErrorStrategy) {
              _this.businessErrorStrategy = _this.defaultBizErrorStrategy;
            }
            _this.businessErrorStrategy(data, status, resolve, reject);

            var code = data.code,
                message = data.message;

            var responseDataError = data.error || {};
            var type = ERROR_TYPE.NETWORK,
                httpStatusCode = status;
            // 兼容data.code 和 data.error这两种标志异常的方式， 优先选用code
            code = code || responseDataError.code;
            message = message || responseDataError.message || statusText;
            networkError = (0, _createError2["default"])({ type: type, httpStatusCode: httpStatusCode, code: code, message: message });
            reject(networkError);
          } else {
            // console.error("unknown axios request error: ", error);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93b3JrZXJzL0FqYXguanMiXSwibmFtZXMiOlsiRVJST1JfVFlQRSIsIkpTT04iLCJ3aW5kb3ciLCJnbG9iYWwiLCJlcnJvclJlc3BvbnNlU3RydWN0IiwiaHR0cFN0YXR1c0NvZGUiLCJOYU4iLCJjb2RlIiwibWVzc2FnZSIsImlzT2JqZWN0IiwidmFsIiwidHJhbnNmb3JtTWlzc2lvbkNvbmZpZyIsImNvbmZpZyIsInBhcmFtU2VyaWFsaXplciIsInBhcmFtU2VyaWFsaXplckpRTGlrZUVuYWJsZWQiLCJ0cmFuc2Zvcm1lZENvbmZpZyIsIm1ldGhvZCIsImRhdGEiLCJBamF4V29ya2VyRmFjdG9yeSIsInN0cmF0ZWd5IiwiaW5qZWN0U3RyYXRlZ3kiLCJidXNpbmVzc0Vycm9yIiwiYnVzaW5lc3NFcnJvclN0cmF0ZWd5IiwiZGVmYXVsdEJpekVycm9yU3RyYXRlZ3kiLCJzdGF0dXMiLCJyZXNvbHZlIiwicmVqZWN0IiwicmF3RXJyb3IiLCJlcnJvciIsIm1pc3Npb24iLCJyZXF1ZXN0IiwidGhlbiIsInN0YXR1c1RleHQiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJwYXJzZSIsImUiLCJjb25zb2xlIiwidXJsIiwicGFyc2VyRXJyb3IiLCJ0eXBlIiwiUEFSU0VSIiwiaXNDYW5jZWwiLCJhYm9ydEVycm9yIiwiQUJPUlQiLCJ0aW1lb3V0RXJyb3IiLCJUSU1FT1VUIiwibmV0d29ya0Vycm9yIiwicmVzcG9uc2VEYXRhRXJyb3IiLCJORVRXT1JLIiwicmVxdWVzdEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsTUFBTUEsYUFBYSxtQkFBTUEsVUFBekI7QUFDQSxNQUFNQyxPQUFPLENBQUMsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQ0MsTUFBaEMsR0FBeUNELE1BQTFDLEVBQWtERCxJQUFsRCxJQUEw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Q0Q7QUFDRCxrQkFBS0QscUJBQUwsQ0FBMkJMLElBQTNCLEVBQWlDTyxNQUFqQyxFQUF5Q0MsT0FBekMsRUFBa0RDLE1BQWxEOztBQWhCeUIsZ0JBbUJwQm5CLElBbkJvQixHQW1CSFUsSUFuQkcsQ0FtQnBCVixJQW5Cb0I7QUFBQSxnQkFtQmRDLE9BbkJjLEdBbUJIUyxJQW5CRyxDQW1CZFQsT0FuQmM7O0FBb0J6QixnQkFBSTRDLG9CQUFvQm5DLEtBQUtXLEtBQUwsSUFBYyxFQUF0QztBQUNBLGdCQUFJZ0IsT0FBTzVDLFdBQVdxRCxPQUF0QjtBQUFBLGdCQUNFaEQsaUJBQWlCbUIsTUFEbkI7QUFFQTtBQUNBakIsbUJBQU9BLFFBQVE2QyxrQkFBa0I3QyxJQUFqQztBQUNBQyxzQkFBVUEsV0FBVzRDLGtCQUFrQjVDLE9BQTdCLElBQXdDd0IsVUFBbEQ7QUFDQW1CLDJCQUFlLDhCQUFZLEVBQUNQLFVBQUQsRUFBT3ZDLDhCQUFQLEVBQXVCRSxVQUF2QixFQUE2QkMsZ0JBQTdCLEVBQVosQ0FBZjtBQUNBa0IsbUJBQU95QixZQUFQO0FBQ0QsV0E1Qk0sTUE0QkE7QUFDTDtBQUNBLGdCQUFJRyxlQUFlLDhCQUFZO0FBQzdCOUMsdUJBQVNvQixNQUFNcEIsT0FEYztBQUU3Qm9DLG9CQUFNNUMsV0FBV3FEO0FBRlksYUFBWixDQUFuQjtBQUlBM0IsbUJBQU80QixZQUFQO0FBQ0Q7QUFDRixTQTVFSDtBQThFRCxPQWpGTSxDQUFQO0FBa0ZELEs7Ozs7O3VCQUVZcEMsaUIiLCJmaWxlIjoiQWpheC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Z2V0UGFyYW1TZXJpYWxpemVyfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcbmltcG9ydCBDb25zdCBmcm9tIFwiLi4vY29uc3RcIjtcbmltcG9ydCBjcmVhdGVFcnJvciBmcm9tIFwiLi4vdXRpbHMvY3JlYXRlRXJyb3JcIjtcbmNvbnN0IEVSUk9SX1RZUEUgPSBDb25zdC5FUlJPUl9UWVBFO1xuY29uc3QgSlNPTiA9ICh0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogd2luZG93KS5KU09OIHx8IHt9O1xuLy8g5byC5bi45pWw5o2u57uT5p6EXG5jb25zdCBlcnJvclJlc3BvbnNlU3RydWN0ID0ge2h0dHBTdGF0dXNDb2RlOiBOYU4sIGNvZGU6IE5hTiwgbWVzc2FnZTogXCJcIn07XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKiBAcmVmZXIgaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3MvYmxvYi9tYXN0ZXIvbGliL3V0aWxzLmpzXG4gKi9cbmNvbnN0IGlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3QodmFsKXtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiO1xufTtcbmNvbnN0IHRyYW5zZm9ybU1pc3Npb25Db25maWcgPSBmdW5jdGlvbiB0cmFuc2Zvcm1NaXNzaW9uQ29uZmlnKGNvbmZpZyl7XG4gIGNvbnN0IHBhcmFtU2VyaWFsaXplciA9IGdldFBhcmFtU2VyaWFsaXplcihcbiAgICBjb25maWcucGFyYW1TZXJpYWxpemVySlFMaWtlRW5hYmxlZFxuICApO1xuICBsZXQgdHJhbnNmb3JtZWRDb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBjb25maWcpO1xuICBpZiAoY29uZmlnLm1ldGhvZCA9PT0gXCJwb3N0XCIgJiYgaXNPYmplY3QodHJhbnNmb3JtZWRDb25maWcuZGF0YSkpIHtcbiAgICB0cmFuc2Zvcm1lZENvbmZpZy5kYXRhID0gcGFyYW1TZXJpYWxpemVyKHRyYW5zZm9ybWVkQ29uZmlnLmRhdGEpO1xuICB9XG4gIHJldHVybiB0cmFuc2Zvcm1lZENvbmZpZztcbn07XG5jbGFzcyBBamF4V29ya2VyRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKHN0cmF0ZWd5KXtcbiAgICB0aGlzLmluamVjdFN0cmF0ZWd5KHN0cmF0ZWd5KTtcbiAgfVxuXG4gIGluamVjdFN0cmF0ZWd5KHN0cmF0ZWd5KXtcbiAgICBpZihzdHJhdGVneSAhPSBudWxsKXtcbiAgICAgIGlmKHN0cmF0ZWd5LmJ1c2luZXNzRXJyb3Ipe1xuICAgICAgICB0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneSA9IHN0cmF0ZWd5LmJ1c2luZXNzRXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVmYXVsdEJpekVycm9yU3RyYXRlZ3koZGF0YSwgc3RhdHVzLCByZXNvbHZlLCByZWplY3Qpe1xuICAgIGlmIChkYXRhICE9PSBudWxsICYmIGRhdGEuY29kZSkge1xuICAgICAgLy8gMi4gYml6RXJyb3JcbiAgICAgIGxldCBodHRwU3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgICAgIGxldCByYXdFcnJvciA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEuZXJyb3IgfHwgZGF0YSwge1xuICAgICAgICBodHRwU3RhdHVzQ29kZVxuICAgICAgfSk7XG4gICAgICBsZXQgYnVzaW5lc3NFcnJvciA9IGNyZWF0ZUVycm9yKHJhd0Vycm9yKTtcbiAgICAgIHJlamVjdChidXNpbmVzc0Vycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICB9XG4gIH1cblxuICBkbyhtaXNzaW9uKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIGF4aW9zU2NoZW1hOiBodHRwczovL2dpdGh1Yi5jb20vbXphYnJpc2tpZS9heGlvc1xuICAgICAgbGV0IHRyYW5zZm9ybWVkQ29uZmlnID0gdHJhbnNmb3JtTWlzc2lvbkNvbmZpZyhtaXNzaW9uLmNvbmZpZyk7XG4gICAgICBheGlvcy5yZXF1ZXN0KHRyYW5zZm9ybWVkQ29uZmlnKS50aGVuKFxuICAgICAgICAoe2RhdGEsIHN0YXR1cywgc3RhdHVzVGV4dCwgaGVhZGVycywgY29uZmlnLCByZXNwb25zZX0pID0+IHtcbiAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGEpICE9PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBcInJlc3BvbnNlIGlzIG5vdCBhIGluc3RhbmNlIG9mIEpTT04gXCI7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZXNwb25zZSBvZiAnJXMnIGlzIG5vdCBKU09OIFwiLCBjb25maWcudXJsKTtcbiAgICAgICAgICAgICAgbGV0IHBhcnNlckVycm9yID0gY3JlYXRlRXJyb3Ioe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgdHlwZTogRVJST1JfVFlQRS5QQVJTRVJcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJlamVjdChwYXJzZXJFcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHJlc2xvdmVcbiAgICAgICAgICAvLyBkYXRh5Y+v6IO95pivbnVsbFxuICAgICAgICAgIGlmKCF0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneSl7XG4gICAgICAgICAgICB0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneSA9IHRoaXMuZGVmYXVsdEJpekVycm9yU3RyYXRlZ3k7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYnVzaW5lc3NFcnJvclN0cmF0ZWd5KGRhdGEsIHN0YXR1cywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgIGlmIChheGlvcy5pc0NhbmNlbChlcnJvcikpIHtcbiAgICAgICAgICAgIC8vIGFib3J0IGVycm9yXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnUmVxdWVzdCBjYW5jZWxlZCcsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgbGV0IGFib3J0RXJyb3IgPSBjcmVhdGVFcnJvcih7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgIHR5cGU6IEVSUk9SX1RZUEUuQUJPUlQsXG4gICAgICAgICAgICAgIGNvZGU6IGVycm9yLmNvZGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVqZWN0KGFib3J0RXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IuY29kZSA9PT0gXCJFQ09OTkFCT1JURURcIikge1xuICAgICAgICAgICAgLy8gdGltZW91dCBlcnJvclxuICAgICAgICAgICAgbGV0IHRpbWVvdXRFcnJvciA9IGNyZWF0ZUVycm9yKHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgICAgICAgdHlwZTogRVJST1JfVFlQRS5USU1FT1VULFxuICAgICAgICAgICAgICBjb2RlOiBlcnJvci5jb2RlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlamVjdCh0aW1lb3V0RXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IucmVzcG9uc2UpIHtcbiAgICAgICAgICAgIC8vIG5ldHdvcmsgZXJyb3JcbiAgICAgICAgICAgIC8vIFRoZSByZXF1ZXN0IHdhcyBtYWRlLCBidXQgdGhlIHNlcnZlciByZXNwb25kZWQgd2l0aCBhIHN0YXR1cyBjb2RlXG4gICAgICAgICAgICAvLyB0aGF0IGZhbGxzIG91dCBvZiB0aGUgcmFuZ2Ugb2YgMnh4XG4gICAgICAgICAgICBsZXQgbmV0d29ya0Vycm9yO1xuICAgICAgICAgICAgbGV0IHtcbiAgICAgICAgICAgICAgc3RhdHVzLFxuICAgICAgICAgICAgICBzdGF0dXNUZXh0LFxuICAgICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICAgIGRhdGEgPSB7fVxuICAgICAgICAgICAgfSA9IGVycm9yLnJlc3BvbnNlO1xuXG4gICAgICAgICAgICBpZighdGhpcy5idXNpbmVzc0Vycm9yU3RyYXRlZ3kpe1xuICAgICAgICAgICAgICB0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneSA9IHRoaXMuZGVmYXVsdEJpekVycm9yU3RyYXRlZ3k7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneShkYXRhLCBzdGF0dXMsIHJlc29sdmUsIHJlamVjdCk7XG5cblxuICAgICAgICAgICAgbGV0IHtjb2RlLCBtZXNzYWdlfSA9IGRhdGE7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2VEYXRhRXJyb3IgPSBkYXRhLmVycm9yIHx8IHt9O1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBFUlJPUl9UWVBFLk5FVFdPUkssXG4gICAgICAgICAgICAgIGh0dHBTdGF0dXNDb2RlID0gc3RhdHVzO1xuICAgICAgICAgICAgLy8g5YW85a65ZGF0YS5jb2RlIOWSjCBkYXRhLmVycm9y6L+Z5Lik56eN5qCH5b+X5byC5bi455qE5pa55byP77yMIOS8mOWFiOmAieeUqGNvZGVcbiAgICAgICAgICAgIGNvZGUgPSBjb2RlIHx8IHJlc3BvbnNlRGF0YUVycm9yLmNvZGU7XG4gICAgICAgICAgICBtZXNzYWdlID0gbWVzc2FnZSB8fCByZXNwb25zZURhdGFFcnJvci5tZXNzYWdlIHx8IHN0YXR1c1RleHQ7XG4gICAgICAgICAgICBuZXR3b3JrRXJyb3IgPSBjcmVhdGVFcnJvcih7dHlwZSwgaHR0cFN0YXR1c0NvZGUsIGNvZGUsIG1lc3NhZ2V9KTtcbiAgICAgICAgICAgIHJlamVjdChuZXR3b3JrRXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwidW5rbm93biBheGlvcyByZXF1ZXN0IGVycm9yOiBcIiwgZXJyb3IpO1xuICAgICAgICAgICAgbGV0IHJlcXVlc3RFcnJvciA9IGNyZWF0ZUVycm9yKHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgICAgICAgdHlwZTogRVJST1JfVFlQRS5ORVRXT1JLXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0RXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQWpheFdvcmtlckZhY3Rvcnk7XG4iXX0=