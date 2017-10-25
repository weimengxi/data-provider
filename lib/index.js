(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports", "babel-runtime/core-js/promise", "babel-runtime/core-js/object/assign", "./utils/Deferred", "./utils/createError", "./utils/comboPromise", "./config", "./const", "./workers/Ajax", "./missions/Http", "./MissionDispatcher"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require("babel-runtime/core-js/promise"), require("babel-runtime/core-js/object/assign"), require("./utils/Deferred"), require("./utils/createError"), require("./utils/comboPromise"), require("./config"), require("./const"), require("./workers/Ajax"), require("./missions/Http"), require("./MissionDispatcher"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.promise, global.assign, global.Deferred, global.createError, global.comboPromise, global.config, global._const, global.Ajax, global.Http, global.MissionDispatcher);
    global.index = mod.exports;
  }
})(this, function (module, exports, _promise, _assign, _Deferred, _createError, _comboPromise, _config, _const, _Ajax, _Http, _MissionDispatcher) {
  "use strict";

  exports.__esModule = true;

  var _promise2 = _interopRequireDefault(_promise);

  var _assign2 = _interopRequireDefault(_assign);

  var _Deferred2 = _interopRequireDefault(_Deferred);

  var _createError2 = _interopRequireDefault(_createError);

  var _comboPromise2 = _interopRequireDefault(_comboPromise);

  var _config2 = _interopRequireDefault(_config);

  var _const2 = _interopRequireDefault(_const);

  var _Ajax2 = _interopRequireDefault(_Ajax);

  var _Http2 = _interopRequireDefault(_Http);

  var _MissionDispatcher2 = _interopRequireDefault(_MissionDispatcher);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function mixConfig(requestConfig) {
    return (0, _assign2["default"])({}, _config2["default"], requestConfig);
  }

  function DataSource() {

    console.log("enter ");
    var _this = this;

    var workerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    var strategy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var interceptors = {
      request: [],
      response: [],
      error: []
    };

    //var requestDefers = new Map();

    var httpMD = new _MissionDispatcher2["default"](_Ajax2["default"], workerCount, strategy);
    httpMD.start();

    this.interceptors = {
      request: {
        use: function use() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          Array.prototype.push.apply(interceptors.request, args);
          return _this;
        }
      },
      response: {
        use: function use() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          Array.prototype.push.apply(interceptors.response, args);
          return _this;
        }
      },
      error: {
        use: function use() {
          for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          Array.prototype.push.apply(interceptors.error, args);
          return _this;
        }
      }
    };

    this.start = function () {
      httpMD.start();
    };

    this.stop = function () {
      httpMD.stop();
    };

    this.request = function (requestConfig) {
      var missionConfig = mixConfig(requestConfig || {});
      var requestDefer = new _Deferred2["default"]();

      // 1. requestInterceptors
      interceptors.request.reduce(function (configPromise, interceptor) {
        return configPromise.then(interceptor);
      }, _promise2["default"].resolve(missionConfig)).then(function (config) {
        return config;
      }, function (interceptorError) {
        console.log("Request Intercept Fail ... ", interceptorError);
        if (!interceptorError instanceof Error) {
          interceptorError = (0, _createError2["default"])({
            message: interceptorError
          });
        }
        throw interceptorError;
      })
      // 2. doRequest
      .then(function (config) {
        var mission = new _Http2["default"](config);
        // 2.1 doRequest
        httpMD.put(mission)
        // 2.2. response or error
        .then(function (result) {
          // 2.2.1 responseInterceptors
          interceptors.response.reduce(function (resultPromise, interceptor) {
            return resultPromise.then(function (result) {
              return interceptor(result, requestConfig);
            });
          }, _promise2["default"].resolve(result)).then(function (result) {
            requestDefer.resolve(result);
          }, function (error) {
            /*
            * @TODO
            * error instanceof Error && requestDefer.reject(error);
            */
            console.error("Response Intercept Exception ... ", error);
            throw error;
          });
        }, function (error) {
          // 洗数据,约定： interceptorError instanceof Error
          var transformedError = void 0;
          if (error instanceof Error) {
            transformedError = error;
          } else {
            transformedError = (0, _createError2["default"])({
              message: error
            });
          }
          // 2.2.2. errorInterceptors
          interceptors.error.reduce(function (errorPromise, interceptor) {
            return errorPromise.then(function (error) {
              return interceptor(error, requestConfig);
            });
          }, _promise2["default"].resolve(transformedError)).then(function (errorOrData) {
            /*
            * 【注意！！！】
            *　处理过的异常, errorInterceptor可能把error转换为正常的数据(非Error类型)
            *  error(一定是一个Error类型的实例)
            */
            var handler = errorOrData instanceof Error ? "reject" : "resolve";
            requestDefer[handler](errorOrData);
          }, function (exceptionError) {
            // 未处理异常
            console.log("Error Intercept Exception ... ", exceptionError);
            throw exceptionError;
          });
        });
      })["catch"](function (err) {
        requestDefer.reject(err);
      });

      return requestDefer.promise;
    };
  }

  DataSource.ErrorType = _const2["default"].ERROR_TYPE;
  DataSource.Deferred = _Deferred2["default"];
  DataSource.createError = _createError2["default"];
  DataSource.createComboPromise = _comboPromise2["default"];

  exports["default"] = DataSource;
  module.exports = exports["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJtaXhDb25maWciLCJyZXF1ZXN0Q29uZmlnIiwiRGF0YVNvdXJjZSIsIndvcmtlckNvdW50Iiwic3RyYXRlZ3kiLCJpbnRlcmNlcHRvcnMiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJlcnJvciIsImh0dHBNRCIsInN0YXJ0IiwidXNlIiwiYXJncyIsIkFycmF5IiwicHJvdG90eXBlIiwicHVzaCIsImFwcGx5Iiwic3RvcCIsIm1pc3Npb25Db25maWciLCJyZXF1ZXN0RGVmZXIiLCJyZWR1Y2UiLCJjb25maWdQcm9taXNlIiwiaW50ZXJjZXB0b3IiLCJ0aGVuIiwicmVzb2x2ZSIsImNvbmZpZyIsImNvbnNvbGUiLCJsb2ciLCJpbnRlcmNlcHRvckVycm9yIiwiRXJyb3IiLCJtZXNzYWdlIiwibWlzc2lvbiIsInB1dCIsInJlc3VsdFByb21pc2UiLCJyZXN1bHQiLCJ0cmFuc2Zvcm1lZEVycm9yIiwiZXJyb3JQcm9taXNlIiwiaGFuZGxlciIsImVycm9yT3JEYXRhIiwiZXhjZXB0aW9uRXJyb3IiLCJyZWplY3QiLCJlcnIiLCJwcm9taXNlIiwiRXJyb3JUeXBlIiwiRVJST1JfVFlQRSIsIkRlZmVycmVkIiwiY3JlYXRlRXJyb3IiLCJjcmVhdGVDb21ib1Byb21pc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZQSxXQUFTQSxTQUFULENBQW1CQyxhQUFuQixFQUFpQztBQUMvQixXQUFPLHlCQUFjLEVBQWQsdUJBQWlDQSxhQUFqQyxDQUFQO0FBQ0Q7O0FBRUQsV0FBU0MsVUFBVCxHQUFzRDtBQUFBOztBQUFBLFFBQWxDQyxXQUFrQyx1RUFBcEIsRUFBb0I7QUFBQSxRQUFoQkMsUUFBZ0IsdUVBQUwsSUFBSzs7QUFDcEQsUUFBSUMsZUFBZTtBQUNqQkMsZUFBUyxFQURRO0FBRWpCQyxnQkFBVSxFQUZPO0FBR2pCQyxhQUFPO0FBSFUsS0FBbkI7O0FB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K0JBQW1CLDhCQUFZO0FBQzdCTCx1QkFBU3RCO0FBRG9CLGFBQVosQ0FBbkI7QUFHRDtBQUNEO0FBQ0FILHVCQUFhRyxLQUFiLENBQ0dZLE1BREgsQ0FDVSxVQUFDZ0IsWUFBRCxFQUFlZCxXQUFmLEVBQStCO0FBQ3JDLG1CQUFPYyxhQUFhYixJQUFiLENBQWtCLGlCQUFTO0FBQ2hDLHFCQUFPRCxZQUFZZCxLQUFaLEVBQW1CUCxhQUFuQixDQUFQO0FBQ0QsYUFGTSxDQUFQO0FBR0QsV0FMSCxFQUtLLHFCQUFRdUIsT0FBUixDQUFnQlcsZ0JBQWhCLENBTEwsRUFNR1osSUFOSCxDQU9JLHVCQUFlO0FBQ2I7Ozs7O0FBS0EsZ0JBQUljLFVBQ0ZDLHVCQUF1QlQsS0FBdkIsR0FBK0IsUUFBL0IsR0FBMEMsU0FENUM7QUFFQVYseUJBQWFrQixPQUFiLEVBQXNCQyxXQUF0QjtBQUNELFdBaEJMLEVBaUJJLDBCQUFrQjtBQUNoQjtBQUNBWixvQkFBUUMsR0FBUixDQUNFLGdDQURGLEVBRUVZLGNBRkY7QUFJQSxrQkFBTUEsY0FBTjtBQUNELFdBeEJMO0FBMEJELFNBL0RMO0FBaUVELE9BdkZILFdBd0ZTLGVBQU87QUFDWnBCLHFCQUFhcUIsTUFBYixDQUFvQkMsR0FBcEI7QUFDRCxPQTFGSDs7QUE0RkEsYUFBT3RCLGFBQWF1QixPQUFwQjtBQUNELEtBbEdEO0FBbUdEOztBQUVEeEMsYUFBV3lDLFNBQVgsR0FBdUIsbUJBQU1DLFVBQTdCO0FBQ0ExQyxhQUFXMkMsUUFBWDtBQUNBM0MsYUFBVzRDLFdBQVg7QUFDQTVDLGFBQVc2QyxrQkFBWDs7dUJBRWU3QyxVIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERlZmVycmVkIGZyb20gXCIuL3V0aWxzL0RlZmVycmVkXCI7XG5pbXBvcnQgY3JlYXRlRXJyb3IgZnJvbSBcIi4vdXRpbHMvY3JlYXRlRXJyb3JcIjtcbmltcG9ydCBjcmVhdGVDb21ib1Byb21pc2UgZnJvbSBcIi4vdXRpbHMvY29tYm9Qcm9taXNlXCI7XG5cbmltcG9ydCBEZWZhdWx0Q29uZmlnIGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IENvbnN0IGZyb20gXCIuL2NvbnN0XCI7XG5cbmltcG9ydCBIdHRwV29ya2VyRmFjdG9yeSBmcm9tIFwiLi93b3JrZXJzL0FqYXhcIjtcbmltcG9ydCBIdHRwTWlzc2lvbiBmcm9tIFwiLi9taXNzaW9ucy9IdHRwXCI7XG5cbmltcG9ydCBNaXNzaW9uRGlzcGF0Y2hlciBmcm9tIFwiLi9NaXNzaW9uRGlzcGF0Y2hlclwiO1xuXG5mdW5jdGlvbiBtaXhDb25maWcocmVxdWVzdENvbmZpZyl7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0Q29uZmlnLCByZXF1ZXN0Q29uZmlnKTtcbn1cblxuZnVuY3Rpb24gRGF0YVNvdXJjZSh3b3JrZXJDb3VudCA9IDEwLCBzdHJhdGVneSA9IG51bGwpe1xuICB2YXIgaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IFtdLFxuICAgIHJlc3BvbnNlOiBbXSxcbiAgICBlcnJvcjogW11cbiAgfTtcblxuICAvL3ZhciByZXF1ZXN0RGVmZXJzID0gbmV3IE1hcCgpO1xuXG4gIHZhciBodHRwTUQgPSBuZXcgTWlzc2lvbkRpc3BhdGNoZXIoSHR0cFdvcmtlckZhY3RvcnksIHdvcmtlckNvdW50LCBzdHJhdGVneSk7XG4gIGh0dHBNRC5zdGFydCgpO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IHtcbiAgICAgIHVzZTogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoaW50ZXJjZXB0b3JzLnJlcXVlc3QsIGFyZ3MpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlc3BvbnNlOiB7XG4gICAgICB1c2U6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGludGVyY2VwdG9ycy5yZXNwb25zZSwgYXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH0sXG4gICAgZXJyb3I6IHtcbiAgICAgIHVzZTogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoaW50ZXJjZXB0b3JzLmVycm9yLCBhcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuc3RhcnQgPSAoKSA9PiB7XG4gICAgaHR0cE1ELnN0YXJ0KCk7XG4gIH07XG5cbiAgdGhpcy5zdG9wID0gKCkgPT4ge1xuICAgIGh0dHBNRC5zdG9wKCk7XG4gIH07XG5cbiAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdENvbmZpZyA9PiB7XG4gICAgbGV0IG1pc3Npb25Db25maWcgPSBtaXhDb25maWcocmVxdWVzdENvbmZpZyB8fCB7fSk7XG4gICAgbGV0IHJlcXVlc3REZWZlciA9IG5ldyBEZWZlcnJlZCgpO1xuXG4gICAgLy8gMS4gcmVxdWVzdEludGVyY2VwdG9yc1xuICAgIGludGVyY2VwdG9ycy5yZXF1ZXN0XG4gICAgICAucmVkdWNlKChjb25maWdQcm9taXNlLCBpbnRlcmNlcHRvcikgPT4ge1xuICAgICAgICByZXR1cm4gY29uZmlnUHJvbWlzZS50aGVuKGludGVyY2VwdG9yKTtcbiAgICAgIH0sIFByb21pc2UucmVzb2x2ZShtaXNzaW9uQ29uZmlnKSlcbiAgICAgIC50aGVuKFxuICAgICAgICBjb25maWcgPT4ge1xuICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgIH0sXG4gICAgICAgIGludGVyY2VwdG9yRXJyb3IgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdCBJbnRlcmNlcHQgRmFpbCAuLi4gXCIsIGludGVyY2VwdG9yRXJyb3IpO1xuICAgICAgICAgIGlmICghaW50ZXJjZXB0b3JFcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICBpbnRlcmNlcHRvckVycm9yID0gY3JlYXRlRXJyb3Ioe1xuICAgICAgICAgICAgICBtZXNzYWdlOiBpbnRlcmNlcHRvckVycm9yXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgaW50ZXJjZXB0b3JFcnJvcjtcbiAgICAgICAgfVxuICAgICAgKVxuICAgICAgLy8gMi4gZG9SZXF1ZXN0XG4gICAgICAudGhlbihjb25maWcgPT4ge1xuICAgICAgICB2YXIgbWlzc2lvbiA9IG5ldyBIdHRwTWlzc2lvbihjb25maWcpO1xuICAgICAgICAvLyAyLjEgZG9SZXF1ZXN0XG4gICAgICAgIGh0dHBNRFxuICAgICAgICAgIC5wdXQobWlzc2lvbilcbiAgICAgICAgICAvLyAyLjIuIHJlc3BvbnNlIG9yIGVycm9yXG4gICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICByZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAvLyAyLjIuMSByZXNwb25zZUludGVyY2VwdG9yc1xuICAgICAgICAgICAgICBpbnRlcmNlcHRvcnMucmVzcG9uc2VcbiAgICAgICAgICAgICAgICAucmVkdWNlKChyZXN1bHRQcm9taXNlLCBpbnRlcmNlcHRvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFByb21pc2UudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJjZXB0b3IocmVzdWx0LCByZXF1ZXN0Q29uZmlnKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIFByb21pc2UucmVzb2x2ZShyZXN1bHQpKVxuICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdERlZmVyLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogQFRPRE9cbiAgICAgICAgICAgICAgICAgKiBlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmIHJlcXVlc3REZWZlci5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUmVzcG9uc2UgSW50ZXJjZXB0IEV4Y2VwdGlvbiAuLi4gXCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vIOa0l+aVsOaNriznuqblrprvvJogaW50ZXJjZXB0b3JFcnJvciBpbnN0YW5jZW9mIEVycm9yXG4gICAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZEVycm9yO1xuICAgICAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybWVkRXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1lZEVycm9yID0gY3JlYXRlRXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyAyLjIuMi4gZXJyb3JJbnRlcmNlcHRvcnNcbiAgICAgICAgICAgICAgaW50ZXJjZXB0b3JzLmVycm9yXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoZXJyb3JQcm9taXNlLCBpbnRlcmNlcHRvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yUHJvbWlzZS50aGVuKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludGVyY2VwdG9yKGVycm9yLCByZXF1ZXN0Q29uZmlnKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIFByb21pc2UucmVzb2x2ZSh0cmFuc2Zvcm1lZEVycm9yKSlcbiAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgIGVycm9yT3JEYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiDjgJDms6jmhI/vvIHvvIHvvIHjgJFcbiAgICAgICAgICAgICAgICAgKuOAgOWkhOeQhui/h+eahOW8guW4uCwgZXJyb3JJbnRlcmNlcHRvcuWPr+iDveaKimVycm9y6L2s5o2i5Li65q2j5bi455qE5pWw5o2uKOmdnkVycm9y57G75Z6LKVxuICAgICAgICAgICAgICAgICAqICBlcnJvcijkuIDlrprmmK/kuIDkuKpFcnJvcuexu+Wei+eahOWunuS+iylcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgbGV0IGhhbmRsZXIgPVxuICAgICAgICAgICAgICAgICAgICAgIGVycm9yT3JEYXRhIGluc3RhbmNlb2YgRXJyb3IgPyBcInJlamVjdFwiIDogXCJyZXNvbHZlXCI7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3REZWZlcltoYW5kbGVyXShlcnJvck9yRGF0YSk7XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgZXhjZXB0aW9uRXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyDmnKrlpITnkIblvILluLhcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgXCJFcnJvciBJbnRlcmNlcHQgRXhjZXB0aW9uIC4uLiBcIixcbiAgICAgICAgICAgICAgICAgICAgICBleGNlcHRpb25FcnJvclxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBleGNlcHRpb25FcnJvcjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIHJlcXVlc3REZWZlci5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcXVlc3REZWZlci5wcm9taXNlO1xuICB9O1xufVxuXG5EYXRhU291cmNlLkVycm9yVHlwZSA9IENvbnN0LkVSUk9SX1RZUEU7XG5EYXRhU291cmNlLkRlZmVycmVkID0gRGVmZXJyZWQ7XG5EYXRhU291cmNlLmNyZWF0ZUVycm9yID0gY3JlYXRlRXJyb3I7XG5EYXRhU291cmNlLmNyZWF0ZUNvbWJvUHJvbWlzZSA9IGNyZWF0ZUNvbWJvUHJvbWlzZTtcblxuZXhwb3J0IGRlZmF1bHQgRGF0YVNvdXJjZTtcbiJdfQ==
