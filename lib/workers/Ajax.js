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
    /**
     * @PATCH 
     * 
     * @description 支持传入自定义headers, 配置axios.default.headers
     * @date 2017-12-07
     * @author weimengxi   
     */

    var defaultHeaders = _axios2["default"].defaults.headers;
    var headers = config.headers;
    var specialMethods = ['post', 'put', 'patch'];

    if (isObject(headers)) {
      specialMethods.forEach(function (method) {
        (0, _assign2["default"])(defaultHeaders[method], headers);
      });
    }

    var paramSerializer = (0, _utils.getParamSerializer)(config.paramSerializerJQLikeEnabled);

    var transformedConfig = (0, _assign2["default"])({}, config);
    if (specialMethods.indexOf(config.method) > -1 && isObject(transformedConfig.data)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93b3JrZXJzL0FqYXguanMiXSwibmFtZXMiOlsiRVJST1JfVFlQRSIsIkpTT04iLCJ3aW5kb3ciLCJnbG9iYWwiLCJlcnJvclJlc3BvbnNlU3RydWN0IiwiaHR0cFN0YXR1c0NvZGUiLCJOYU4iLCJjb2RlIiwibWVzc2FnZSIsImlzT2JqZWN0IiwidmFsIiwidHJhbnNmb3JtTWlzc2lvbkNvbmZpZyIsImNvbmZpZyIsImRlZmF1bHRIZWFkZXJzIiwiZGVmYXVsdHMiLCJoZWFkZXJzIiwic3BlY2lhbE1ldGhvZHMiLCJmb3JFYWNoIiwibWV0aG9kIiwicGFyYW1TZXJpYWxpemVyIiwicGFyYW1TZXJpYWxpemVySlFMaWtlRW5hYmxlZCIsInRyYW5zZm9ybWVkQ29uZmlnIiwiaW5kZXhPZiIsImRhdGEiLCJBamF4V29ya2VyRmFjdG9yeSIsInN0cmF0ZWd5IiwiaW5qZWN0U3RyYXRlZ3kiLCJidXNpbmVzc0Vycm9yIiwiYnVzaW5lc3NFcnJvclN0cmF0ZWd5IiwiaXNVblZhbGlkYXRlU3RhdHVzIiwiaHR0cFN0YXR1cyIsImlzRXJyb3JEYXRhIiwiZXJyb3IiLCJkZWZhdWx0Qml6RXJyb3JTdHJhdGVneSIsInN0YXR1cyIsInJlc29sdmUiLCJyZWplY3QiLCJtaXNzaW9uIiwicmVxdWVzdCIsInRoZW4iLCJzdGF0dXNUZXh0IiwicmVzcG9uc2UiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJwYXJzZSIsImUiLCJjb25zb2xlIiwidXJsIiwicGFyc2VyRXJyb3IiLCJ0eXBlIiwiUEFSU0VSIiwiaXNDYW5jZWwiLCJhYm9ydEVycm9yIiwiQUJPUlQiLCJ0aW1lb3V0RXJyb3IiLCJUSU1FT1VUIiwibmV0d29ya0Vycm9yIiwicmVzcG9uc2VEYXRhRXJyb3IiLCJORVRXT1JLIiwicmVxdWVzdEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsTUFBTUEsYUFBYSxtQkFBTUEsVUFBekI7QUFDQSxNQUFNQyxPQUFPLENBQUMsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQ0MsTUFBaEMsR0FBeUNELE1BQTFDLEVBQWtERCxJQUFsRCxJQUEwRCxFQUF2RTtBQUNBO0FBQ0EsTUFBTUcsc0JBQXNCLEVBQUNDLGdCQUFnQkMsR0FBakIsRUFBc0JDLE1BQU1ELEdBQTVCLEVBQWlDRSxTQUFTLEVBQTFDLEVBQTVCO0FBQ0E7Ozs7Ozs7QUFPQSxNQUFNQyxXQUFXLFNBQVNBLFFBQVQsQ0FBa0JDLEdBQWxCLEVBQXNCO0FBQ3JDLFdBQU9BLFFBQVEsSUFBUixJQUFnQixRQUFPQSxHQUFQLDBEQUFPQSxHQUFQLE9BQWUsUUFBdEM7QUFDRCxHQUZEOztBQUlBLE1BQU1DLHlCQUF5QixTQUFTQSxzQkFBVCxDQUFnQ0MsTUFBaEMsRUFBdUM7QUFDcEU7Ozs7Ozs7O0FBUUEsUUFBSUMsaUJBQWlCLG1CQUFNQyxRQUFOLENBQWVDLE9BQXBDO0FBQ0EsUUFBSUEsVUFBVUgsT0FBT0csT0FBckI7QUFDQSxRQUFJQyxpQkFBaUIsQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixPQUFoQixDQUFyQjs7QUFFQSxRQUFHUCxTQUFTTSxPQUFULENBQUgsRUFBc0I7QUFDcEJDLHFCQUFlQyxPQUFmLENBQXdCLGtCQUFVO0FBQ2hDLGlDQUFjSixlQUFlSyxNQUFmLENBQWQsRUFBdUNILE9BQXZDO0FBQ0QsT0FGRDtBQUdEOztBQUVELFFBQU1JLGtCQUFrQiwrQkFDdEJQLE9BQU9RLDRCQURlLENBQXhCOztBQUlBLFFBQUlDLG9CQUFvQix5QkFBYyxFQUFkLEVBQWtCVCxNQUFsQixDQUF4QjtBQUNBLFFBQUlJLGVBQWVNLE9BQWYsQ0FBdUJWLE9BQU9NLE1BQTlCLElBQXdDLENBQUMsQ0FBekMsSUFBOENULFNBQVNZLGtCQUFrQkUsSUFBM0IsQ0FBbEQsRUFBb0Y7QUFDbEZGLHdCQUFrQkUsSUFBbEIsR0FBeUJKLGdCQUFnQkUsa0JBQWtCRSxJQUFsQyxDQUF6QjtBQUNEO0FBQ0QsV0FBT0YsaUJBQVA7QUFDRCxHQTVCRDs7TUE4Qk1HLGlCO0FBQ0osK0JBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFDcEIsV0FBS0MsY0FBTCxDQUFvQkQsUUFBcEI7QUFDRDs7Z0NBRURDLGMsMkJBQWVELFEsRUFBVTtBQUN2QixVQUFJQSxZQUFZLElBQWhCLEVBQXNCO0FBQ3BCLFlBQUlBLFNBQVNFLGFBQWIsRUFBNEI7QUFDMUIsZUFBS0MscUJBQUwsR0FBNkJILFNBQVNFLGFBQXRDO0FBQ0Q7QUFDRjtBQUNGLEs7O2dDQUVERSxrQiwrQkFBbUJDLFUsRUFBWTtBQUM3QjtBQUNBLGFBQU9BLGNBQWMsR0FBZCxJQUFxQkEsYUFBYSxHQUF6QztBQUNELEs7O2dDQUVEQyxXLHdCQUFZUixJLEVBQU07QUFDaEI7QUFDQSxhQUFPQSxTQUFTQSxLQUFLUyxLQUFMLElBQWVULEtBQUtoQixJQUFMLElBQWFnQixLQUFLaEIsSUFBTCxLQUFjLENBQW5ELENBQVA7QUFDRCxLOztnQ0FFRDBCLHVCLG9DQUF3QlYsSSxFQUFNVyxNLEVBQVFDLE8sRUFBU0MsTSxFQUFRO0FBQ3JELFVBQUksS0FBS1Asa0JBQUwsQ0FBd0JLLE1BQXhCLEtBQW1DLEtBQUtILFdBQUwsQ0FBaUJSLElBQWpCLENBQXZDLEVBQStEO0FBQzdELFlBQUlsQixpQkFBaUI2QixNQUFyQjs7QUFENkQsbUJBRXZDWCxLQUFLUyxLQUFMLElBQWNULElBRnlCO0FBQUEsWUFFeERoQixJQUZ3RCxRQUV4REEsSUFGd0Q7QUFBQSxZQUVsREMsT0FGa0QsUUFFbERBLE9BRmtEOztBQUk3RCxZQUFJbUIsZ0JBQWdCLDhCQUFZLEVBQUNwQixVQUFELEVBQU9DLGdCQUFQLEVBQWdCSCw4QkFBaEIsRUFBWixDQUFwQjtBQUNBK0IsZUFBT1QsYUFBUDtBQUNELE9BTkQsTUFNTztBQUNMUSxnQkFBUVosSUFBUjtBQUNEO0FBQ0YsSzs7cURBRUVjLE8sRUFBUztBQUFBOztBQUNWLGFBQU8seUJBQVksVUFBQ0YsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDO0FBQ0EsWUFBSWYsb0JBQW9CVix1QkFBdUIwQixRQUFRekIsTUFBL0IsQ0FBeEI7QUFDQSwyQkFDRzBCLE9BREgsQ0FDV2pCLGlCQURYLEVBRUdrQixJQUZILENBRVEsaUJBQTJEO0FBQUEsY0FBekRoQixJQUF5RCxTQUF6REEsSUFBeUQ7QUFBQSxjQUFuRFcsTUFBbUQsU0FBbkRBLE1BQW1EO0FBQUEsY0FBM0NNLFVBQTJDLFNBQTNDQSxVQUEyQztBQUFBLGNBQS9CekIsT0FBK0IsU0FBL0JBLE9BQStCO0FBQUEsY0FBdEJILE1BQXNCLFNBQXRCQSxNQUFzQjtBQUFBLGNBQWQ2QixRQUFjLFNBQWRBLFFBQWM7O0FBQy9ELGNBQUlDLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQnRCLElBQS9CLE1BQXlDLGlCQUE3QyxFQUFnRTtBQUM5RCxnQkFBSTtBQUNGOzs7O0FBSUFBLHFCQUFPVyxXQUFXLEdBQVgsR0FBaUJYLElBQWpCLEdBQXdCdEIsS0FBSzZDLEtBQUwsQ0FBV3ZCLElBQVgsQ0FBL0I7QUFDRCxhQU5ELENBTUUsT0FBT3dCLENBQVAsRUFBVTtBQUNWLGtCQUFJdkMsVUFBVSxxQ0FBZDtBQUNBd0Msc0JBQVFoQixLQUFSLENBQWMsK0JBQWQsRUFBK0NwQixPQUFPcUMsR0FBdEQ7QUFDQSxrQkFBSUMsY0FBYyw4QkFBWTtBQUM1QjFDLHlCQUFTQSxPQURtQjtBQUU1QjJDLHNCQUFNbkQsV0FBV29EO0FBRlcsZUFBWixDQUFsQjtBQUlBaEIscUJBQU9jLFdBQVA7QUFDRDtBQUNGO0FBQ0Q7QUFDQSxjQUFJLENBQUMsTUFBS3RCLHFCQUFWLEVBQWlDO0FBQy9CLGtCQUFLQSxxQkFBTCxHQUE2QixNQUFLSyx1QkFBbEM7QUFDRDtBQUNELGdCQUFLTCxxQkFBTCxDQUEyQkwsSUFBM0IsRUFBaUNXLE1BQWpDLEVBQXlDQyxPQUF6QyxFQUFrREMsTUFBbEQ7QUFDRCxTQXpCSCxXQTBCUyxpQkFBUztBQUNkLGNBQUksbUJBQU1pQixRQUFOLENBQWVyQixLQUFmLENBQUosRUFBMkI7QUFDekI7QUFDQTtBQUNBLGdCQUFJc0IsYUFBYSw4QkFBWTtBQUMzQjlDLHVCQUFTd0IsTUFBTXhCLE9BRFk7QUFFM0IyQyxvQkFBTW5ELFdBQVd1RCxLQUZVO0FBRzNCaEQsb0JBQU15QixNQUFNekI7QUFIZSxhQUFaLENBQWpCO0FBS0E2QixtQkFBT2tCLFVBQVA7QUFDRCxXQVRELE1BU08sSUFBSXRCLE1BQU16QixJQUFOLEtBQWUsY0FBbkIsRUFBbUM7QUFDeEM7QUFDQSxnQkFBSWlELGVBQWUsOEJBQVk7QUFDN0JoRCx1QkFBU3dCLE1BQU14QixPQURjO0FBRTdCMkMsb0JBQU1uRCxXQUFXeUQsT0FGWTtBQUc3QmxELG9CQUFNeUIsTUFBTXpCO0FBSGlCLGFBQVosQ0FBbkI7QUFLQTZCLG1CQUFPb0IsWUFBUDtBQUNELFdBUk0sTUFRQSxJQUFJeEIsTUFBTVMsUUFBVixFQUFvQjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxnQkFBSWlCLHFCQUFKO0FBSnlCLGtDQUt5QjFCLE1BQU1TLFFBTC9CO0FBQUEsZ0JBS3BCUCxNQUxvQixtQkFLcEJBLE1BTG9CO0FBQUEsZ0JBS1pNLFVBTFksbUJBS1pBLFVBTFk7QUFBQSxnQkFLQXpCLE9BTEEsbUJBS0FBLE9BTEE7QUFBQSxnQkFLU0gsTUFMVCxtQkFLU0EsTUFMVDtBQUFBLGdCQUtpQlcsSUFMakIsbUJBS2lCQSxJQUxqQjs7O0FBT3pCLGdCQUFJLENBQUMsTUFBS0sscUJBQVYsRUFBaUM7QUFDL0Isb0JBQUtBLHFCQUFMLEdBQTZCLE1BQUtLLHVCQUFsQztBQUNEO0FBQ0Qsa0JBQUtMLHFCQUFMLENBQTJCTCxJQUEzQixFQUFpQ1csTUFBakMsRUFBeUNDLE9BQXpDLEVBQWtEQyxNQUFsRDs7QUFWeUIsd0JBWUhiLFFBQVEsRUFaTDtBQUFBLGdCQVlwQmhCLElBWm9CLFNBWXBCQSxJQVpvQjtBQUFBLGdCQVlkQyxPQVpjLFNBWWRBLE9BWmM7O0FBYXpCLGdCQUFJbUQsb0JBQXFCcEMsUUFBUUEsS0FBS1MsS0FBZCxJQUF3QixFQUFoRDtBQUNBLGdCQUFJbUIsT0FBT25ELFdBQVc0RCxPQUF0QjtBQUFBLGdCQUNFdkQsaUJBQWlCNkIsTUFEbkI7QUFFQTtBQUNBM0IsbUJBQU9BLFFBQVFvRCxrQkFBa0JwRCxJQUFqQztBQUNBQyxzQkFBVUEsV0FBV21ELGtCQUFrQm5ELE9BQTdCLElBQXdDZ0MsVUFBbEQ7QUFDQWtCLDJCQUFlLDhCQUFZLEVBQUNQLFVBQUQsRUFBTzlDLDhCQUFQLEVBQXVCRSxVQUF2QixFQUE2QkMsZ0JBQTdCLEVBQVosQ0FBZjtBQUNBNEIsbUJBQU9zQixZQUFQO0FBQ0QsV0FyQk0sTUFxQkE7QUFDTDtBQUNBO0FBQ0EsZ0JBQUlHLGVBQWUsOEJBQVk7QUFDN0JyRCx1QkFBU3dCLE1BQU14QixPQURjO0FBRTdCMkMsb0JBQU1uRCxXQUFXNEQ7QUFGWSxhQUFaLENBQW5CO0FBSUF4QixtQkFBT3lCLFlBQVA7QUFDRDtBQUNGLFNBMUVIO0FBMkVELE9BOUVNLENBQVA7QUErRUQsSzs7Ozs7dUJBRVlyQyxpQiIsImZpbGUiOiJBamF4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtnZXRQYXJhbVNlcmlhbGl6ZXJ9IGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IENvbnN0IGZyb20gXCIuLi9jb25zdFwiO1xuaW1wb3J0IGNyZWF0ZUVycm9yIGZyb20gXCIuLi91dGlscy9jcmVhdGVFcnJvclwiO1xuY29uc3QgRVJST1JfVFlQRSA9IENvbnN0LkVSUk9SX1RZUEU7XG5jb25zdCBKU09OID0gKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB3aW5kb3cpLkpTT04gfHwge307XG4vLyDlvILluLjmlbDmja7nu5PmnoRcbmNvbnN0IGVycm9yUmVzcG9uc2VTdHJ1Y3QgPSB7aHR0cFN0YXR1c0NvZGU6IE5hTiwgY29kZTogTmFOLCBtZXNzYWdlOiBcIlwifTtcbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqIEByZWZlciBodHRwczovL2dpdGh1Yi5jb20vbXphYnJpc2tpZS9heGlvcy9ibG9iL21hc3Rlci9saWIvdXRpbHMuanNcbiAqL1xuY29uc3QgaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdCh2YWwpe1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCI7XG59O1xuXG5jb25zdCB0cmFuc2Zvcm1NaXNzaW9uQ29uZmlnID0gZnVuY3Rpb24gdHJhbnNmb3JtTWlzc2lvbkNvbmZpZyhjb25maWcpe1xuICAvKipcbiAgICogQFBBVENIIFxuICAgKiBcbiAgICogQGRlc2NyaXB0aW9uIOaUr+aMgeS8oOWFpeiHquWumuS5iWhlYWRlcnMsIOmFjee9rmF4aW9zLmRlZmF1bHQuaGVhZGVyc1xuICAgKiBAZGF0ZSAyMDE3LTEyLTA3XG4gICAqIEBhdXRob3Igd2VpbWVuZ3hpICAgXG4gICAqL1xuXG4gIGxldCBkZWZhdWx0SGVhZGVycyA9IGF4aW9zLmRlZmF1bHRzLmhlYWRlcnM7XG4gIGxldCBoZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG4gIGxldCBzcGVjaWFsTWV0aG9kcyA9IFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXTtcblxuICBpZihpc09iamVjdChoZWFkZXJzKSkge1xuICAgIHNwZWNpYWxNZXRob2RzLmZvckVhY2goIG1ldGhvZCA9PiB7XG4gICAgICBPYmplY3QuYXNzaWduKGRlZmF1bHRIZWFkZXJzW21ldGhvZF0sICBoZWFkZXJzKTtcbiAgICB9KVxuICB9XG4gIFxuICBjb25zdCBwYXJhbVNlcmlhbGl6ZXIgPSBnZXRQYXJhbVNlcmlhbGl6ZXIoXG4gICAgY29uZmlnLnBhcmFtU2VyaWFsaXplckpRTGlrZUVuYWJsZWRcbiAgKTtcblxuICBsZXQgdHJhbnNmb3JtZWRDb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBjb25maWcpO1xuICBpZiAoc3BlY2lhbE1ldGhvZHMuaW5kZXhPZihjb25maWcubWV0aG9kKSA+IC0xICYmIGlzT2JqZWN0KHRyYW5zZm9ybWVkQ29uZmlnLmRhdGEpKSB7XG4gICAgdHJhbnNmb3JtZWRDb25maWcuZGF0YSA9IHBhcmFtU2VyaWFsaXplcih0cmFuc2Zvcm1lZENvbmZpZy5kYXRhKTtcbiAgfVxuICByZXR1cm4gdHJhbnNmb3JtZWRDb25maWc7XG59O1xuXG5jbGFzcyBBamF4V29ya2VyRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKHN0cmF0ZWd5KSB7XG4gICAgdGhpcy5pbmplY3RTdHJhdGVneShzdHJhdGVneSk7XG4gIH1cblxuICBpbmplY3RTdHJhdGVneShzdHJhdGVneSkge1xuICAgIGlmIChzdHJhdGVneSAhPSBudWxsKSB7XG4gICAgICBpZiAoc3RyYXRlZ3kuYnVzaW5lc3NFcnJvcikge1xuICAgICAgICB0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneSA9IHN0cmF0ZWd5LmJ1c2luZXNzRXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNVblZhbGlkYXRlU3RhdHVzKGh0dHBTdGF0dXMpIHtcbiAgICAvLyBub3QgMnh4IG9yXG4gICAgcmV0dXJuIGh0dHBTdGF0dXMgPj0gMzAwIHx8IGh0dHBTdGF0dXMgPCAyMDA7XG4gIH1cblxuICBpc0Vycm9yRGF0YShkYXRhKSB7XG4gICAgLy8gY29kZSBleGlzdCBhbmQgIT0gMFxuICAgIHJldHVybiBkYXRhICYmIChkYXRhLmVycm9yIHx8IChkYXRhLmNvZGUgJiYgZGF0YS5jb2RlICE9PSAwKSk7XG4gIH1cblxuICBkZWZhdWx0Qml6RXJyb3JTdHJhdGVneShkYXRhLCBzdGF0dXMsIHJlc29sdmUsIHJlamVjdCkge1xuICAgIGlmICh0aGlzLmlzVW5WYWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHx8IHRoaXMuaXNFcnJvckRhdGEoZGF0YSkpIHtcbiAgICAgIGxldCBodHRwU3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgICAgIGxldCB7Y29kZSwgbWVzc2FnZX0gPSBkYXRhLmVycm9yIHx8IGRhdGE7XG5cbiAgICAgIGxldCBidXNpbmVzc0Vycm9yID0gY3JlYXRlRXJyb3Ioe2NvZGUsIG1lc3NhZ2UsIGh0dHBTdGF0dXNDb2RlfSk7XG4gICAgICByZWplY3QoYnVzaW5lc3NFcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgZG8obWlzc2lvbikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBheGlvc1NjaGVtYTogaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3NcbiAgICAgIGxldCB0cmFuc2Zvcm1lZENvbmZpZyA9IHRyYW5zZm9ybU1pc3Npb25Db25maWcobWlzc2lvbi5jb25maWcpO1xuICAgICAgYXhpb3NcbiAgICAgICAgLnJlcXVlc3QodHJhbnNmb3JtZWRDb25maWcpXG4gICAgICAgIC50aGVuKCh7ZGF0YSwgc3RhdHVzLCBzdGF0dXNUZXh0LCBoZWFkZXJzLCBjb25maWcsIHJlc3BvbnNlfSkgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgIT09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvbiAgW+ihpeS4gV1cbiAgICAgICAgICAgICAgICogcmVzdGZ1bCDmjqXlj6Mg6L+U5ZueIDIwNCDml7bvvIxkYXRhIOS4uiDnqbrlrZfnrKbkuLLvvIwg55u05o6l6L+U5Zue56m65a2X56ym5Liy77yMIOWQpuWImUpTT04ucGFyc2UoXCJcIinkvJrmipvlh7rlvILluLhcbiAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgIGRhdGEgPSBzdGF0dXMgPT09IDIwNCA/IGRhdGEgOiBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IFwicmVzcG9uc2UgaXMgbm90IGEgaW5zdGFuY2Ugb2YgSlNPTiBcIjtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcInJlc3BvbnNlIG9mICclcycgaXMgbm90IEpTT04gXCIsIGNvbmZpZy51cmwpO1xuICAgICAgICAgICAgICBsZXQgcGFyc2VyRXJyb3IgPSBjcmVhdGVFcnJvcih7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBFUlJPUl9UWVBFLlBBUlNFUlxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmVqZWN0KHBhcnNlckVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy9oYXMgZGF0YS5lcnJvciBvciBkYXRhLmNvZGVcbiAgICAgICAgICBpZiAoIXRoaXMuYnVzaW5lc3NFcnJvclN0cmF0ZWd5KSB7XG4gICAgICAgICAgICB0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneSA9IHRoaXMuZGVmYXVsdEJpekVycm9yU3RyYXRlZ3k7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYnVzaW5lc3NFcnJvclN0cmF0ZWd5KGRhdGEsIHN0YXR1cywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICBpZiAoYXhpb3MuaXNDYW5jZWwoZXJyb3IpKSB7XG4gICAgICAgICAgICAvLyBhYm9ydCBlcnJvclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1JlcXVlc3QgY2FuY2VsZWQnLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGxldCBhYm9ydEVycm9yID0gY3JlYXRlRXJyb3Ioe1xuICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICAgICAgICB0eXBlOiBFUlJPUl9UWVBFLkFCT1JULFxuICAgICAgICAgICAgICBjb2RlOiBlcnJvci5jb2RlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlamVjdChhYm9ydEVycm9yKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLmNvZGUgPT09IFwiRUNPTk5BQk9SVEVEXCIpIHtcbiAgICAgICAgICAgIC8vIHRpbWVvdXQgZXJyb3JcbiAgICAgICAgICAgIGxldCB0aW1lb3V0RXJyb3IgPSBjcmVhdGVFcnJvcih7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgIHR5cGU6IEVSUk9SX1RZUEUuVElNRU9VVCxcbiAgICAgICAgICAgICAgY29kZTogZXJyb3IuY29kZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZWplY3QodGltZW91dEVycm9yKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICAvLyBiaXogZXJyb3JcbiAgICAgICAgICAgIC8vIFRoZSByZXF1ZXN0IHdhcyBtYWRlLCBidXQgdGhlIHNlcnZlciByZXNwb25kZWQgd2l0aCBhIHN0YXR1cyBjb2RlXG4gICAgICAgICAgICAvLyB0aGF0IGZhbGxzIG91dCBvZiB0aGUgcmFuZ2Ugb2YgMnh4XG4gICAgICAgICAgICBsZXQgbmV0d29ya0Vycm9yO1xuICAgICAgICAgICAgbGV0IHtzdGF0dXMsIHN0YXR1c1RleHQsIGhlYWRlcnMsIGNvbmZpZywgZGF0YX0gPSBlcnJvci5yZXNwb25zZTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneSkge1xuICAgICAgICAgICAgICB0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneSA9IHRoaXMuZGVmYXVsdEJpekVycm9yU3RyYXRlZ3k7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJ1c2luZXNzRXJyb3JTdHJhdGVneShkYXRhLCBzdGF0dXMsIHJlc29sdmUsIHJlamVjdCk7XG5cbiAgICAgICAgICAgIGxldCB7Y29kZSwgbWVzc2FnZX0gPSBkYXRhIHx8IHt9O1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlRGF0YUVycm9yID0gKGRhdGEgJiYgZGF0YS5lcnJvcikgfHwge307XG4gICAgICAgICAgICBsZXQgdHlwZSA9IEVSUk9SX1RZUEUuTkVUV09SSyxcbiAgICAgICAgICAgICAgaHR0cFN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gICAgICAgICAgICAvLyDlhbzlrrlkYXRhLmNvZGUg5ZKMIGRhdGEuZXJyb3Lov5nkuKTnp43moIflv5flvILluLjnmoTmlrnlvI/vvIwg5LyY5YWI6YCJ55SoY29kZVxuICAgICAgICAgICAgY29kZSA9IGNvZGUgfHwgcmVzcG9uc2VEYXRhRXJyb3IuY29kZTtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlIHx8IHJlc3BvbnNlRGF0YUVycm9yLm1lc3NhZ2UgfHwgc3RhdHVzVGV4dDtcbiAgICAgICAgICAgIG5ldHdvcmtFcnJvciA9IGNyZWF0ZUVycm9yKHt0eXBlLCBodHRwU3RhdHVzQ29kZSwgY29kZSwgbWVzc2FnZX0pO1xuICAgICAgICAgICAgcmVqZWN0KG5ldHdvcmtFcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRoZSByZXF1ZXN0IHdhcyBtYWRlIGJ1dCBubyByZXNwb25zZSB3YXMgcmVjZWl2ZWRcbiAgICAgICAgICAgIC8vIFNvbWV0aGluZyBoYXBwZW5lZCBpbiBzZXR0aW5nIHVwIHRoZSByZXF1ZXN0IHRoYXQgdHJpZ2dlcmVkIGFuIEVycm9yXG4gICAgICAgICAgICBsZXQgcmVxdWVzdEVycm9yID0gY3JlYXRlRXJyb3Ioe1xuICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICAgICAgICB0eXBlOiBFUlJPUl9UWVBFLk5FVFdPUktcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3RFcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQWpheFdvcmtlckZhY3Rvcnk7XG4iXX0=