'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _querystringEs = require('querystring-es3');

var _querystringEs2 = _interopRequireDefault(_querystringEs);

var _Deferred = require('./utils/Deferred');

var _Deferred2 = _interopRequireDefault(_Deferred);

var _CreateError = require('./utils/CreateError');

var _CreateError2 = _interopRequireDefault(_CreateError);

var _ComboPromise = require('./utils/ComboPromise');

var _ComboPromise2 = _interopRequireDefault(_ComboPromise);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

var _Ajax = require('./workers/Ajax');

var _Ajax2 = _interopRequireDefault(_Ajax);

var _Http = require('./missions/Http');

var _Http2 = _interopRequireDefault(_Http);

var _MissionDispatcher = require('./MissionDispatcher');

var _MissionDispatcher2 = _interopRequireDefault(_MissionDispatcher);

var _CacheData = require('./CacheData');

var _CacheData2 = _interopRequireDefault(_CacheData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var AppCache = new _CacheData2['default']('DATA_SOURCE_PROXY', 'v0.0.1');

function mixConfig(requestConfig) {
    return (0, _assign2['default'])({}, _config2['default'], requestConfig);
}

/* 生成cache key*/
function getCacheKey() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requestConfig,
        url = _ref.url,
        maxAge = _ref.maxAge,
        params = _ref.params;

    var cacheKey = null;
    if (typeof maxAge === 'number') {
        cacheKey = url + '_' + _querystringEs2['default'].stringify(params);
    }
    return cacheKey;
}

function DataSource() {
    var _this = this;

    var workerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;


    var interceptors = {
        request: [],
        response: [],
        error: []
    };

    var requestDefers = new _map2['default']();

    var httpMD = new _MissionDispatcher2['default'](_Ajax2['default'], workerCount);
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

        return new _promise2['default'](function (resolve, reject) {

            var cacheKey = getCacheKey(requestConfig);
            var maxAge = requestConfig.maxAge,
                ignoreExpires = requestConfig.ignoreExpires;

            var cacheItem = void 0,
                data = void 0;

            if (cacheKey === null) {
                // 没有maxAge配置，直接发起serverRequest
                resolve(_this.serverRequest(requestConfig));
            } else {
                // 有maxAge配置，需要先检查cache
                cacheItem = AppCache.item(cacheKey, { maxAge: maxAge, ignoreExpires: ignoreExpires });
                data = cacheItem.get();

                if (data === null) {
                    //  cache中没取到数据 || 数据过期,  发起serverRequest
                    _this.serverRequest(requestConfig).then(function (data) {
                        cacheItem.set(data);
                        resolve(data);
                    })['catch'](function (err) {
                        return reject(err);
                    });
                } else {
                    // 命中缓存
                    resolve(data);
                }
            }
        });
    };

    this.serverRequest = function (requestConfig) {

        var missionConfig = mixConfig(requestConfig || {});
        var requestDefer = new _Deferred2['default']();

        // 1. requestInterceptors
        interceptors.request.reduce(function (configPromise, interceptor) {
            return configPromise.then(interceptor);
        }, _promise2['default'].resolve(missionConfig)).then(function (config) {
            return config;
        }, function (interceptorError) {
            console.log('Request Intercept Fail ... ', interceptorError);
            if (!interceptorError instanceof Error) {
                interceptorError = (0, _CreateError2['default'])({ message: interceptorError });
            }
            throw interceptorError;
        })
        // 2. doRequest
        .then(function (config) {
            var mission = new _Http2['default'](config);
            // 2.1 doRequest
            httpMD.put(mission)
            // 2.2. response or error
            .then(function (result) {
                // 2.2.1 responseInterceptors
                interceptors.response.reduce(function (resultPromise, interceptor) {
                    return resultPromise.then(function (result) {
                        return interceptor(result, requestConfig);
                    });
                }, _promise2['default'].resolve(result)).then(function (result) {
                    requestDefer.resolve(result);
                }, function (error) {
                    /* 
                     * @TODO
                     * error instanceof Error && requestDefer.reject(error); 
                     */
                    console.error('Response Intercept Exception ... ', error);
                    throw error;
                });
            }, function (error) {
                // 洗数据,约定： interceptorError instanceof Error
                var transformedError = void 0;
                if (error instanceof Error) {
                    transformedError = error;
                } else {
                    transformedError = (0, _CreateError2['default'])({ message: error });
                }
                // 2.2.2. errorInterceptors
                interceptors.error.reduce(function (errorPromise, interceptor) {
                    return errorPromise.then(function (error) {
                        return interceptor(error, requestConfig);
                    });
                }, _promise2['default'].resolve(transformedError)).then(function (errorOrData) {
                    /*
                     * 【注意！！！】
                     *　处理过的异常, errorInterceptor可能把error转换为正常的数据(非Error类型)
                     *  error(一定是一个Error类型的实例)
                     */
                    var handler = errorOrData instanceof Error ? 'reject' : 'resolve';
                    requestDefer[handler](errorOrData);
                }, function (exceptionError) {
                    // 未处理异常
                    console.log("Error Intercept Exception ... ", exceptionError);
                    throw exceptionError;
                });
            });
        })['catch'](function (err) {
            requestDefer.reject(err);
        });

        return requestDefer.promise;
    };
}

DataSource.ErrorType = _const2['default'].ERROR_TYPE;
DataSource.Deferred = _Deferred2['default'];
DataSource.createError = _CreateError2['default'];
DataSource.createComboPromise = _ComboPromise2['default'];

exports['default'] = DataSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJBcHBDYWNoZSIsIm1peENvbmZpZyIsInJlcXVlc3RDb25maWciLCJnZXRDYWNoZUtleSIsInVybCIsIm1heEFnZSIsInBhcmFtcyIsImNhY2hlS2V5Iiwic3RyaW5naWZ5IiwiRGF0YVNvdXJjZSIsIndvcmtlckNvdW50IiwiaW50ZXJjZXB0b3JzIiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZXJyb3IiLCJyZXF1ZXN0RGVmZXJzIiwiaHR0cE1EIiwic3RhcnQiLCJ1c2UiLCJhcmdzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJwdXNoIiwiYXBwbHkiLCJzdG9wIiwicmVzb2x2ZSIsInJlamVjdCIsImlnbm9yZUV4cGlyZXMiLCJjYWNoZUl0ZW0iLCJkYXRhIiwic2VydmVyUmVxdWVzdCIsIml0ZW0iLCJnZXQiLCJ0aGVuIiwic2V0IiwiZXJyIiwibWlzc2lvbkNvbmZpZyIsInJlcXVlc3REZWZlciIsInJlZHVjZSIsImNvbmZpZ1Byb21pc2UiLCJpbnRlcmNlcHRvciIsImNvbmZpZyIsImludGVyY2VwdG9yRXJyb3IiLCJjb25zb2xlIiwibG9nIiwiRXJyb3IiLCJtZXNzYWdlIiwibWlzc2lvbiIsInB1dCIsInJlc3VsdCIsInJlc3VsdFByb21pc2UiLCJ0cmFuc2Zvcm1lZEVycm9yIiwiZXJyb3JQcm9taXNlIiwiZXJyb3JPckRhdGEiLCJoYW5kbGVyIiwiZXhjZXB0aW9uRXJyb3IiLCJwcm9taXNlIiwiRXJyb3JUeXBlIiwiRVJST1JfVFlQRSIsIkRlZmVycmVkIiwiY3JlYXRlRXJyb3IiLCJjcmVhdGVDb21ib1Byb21pc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxXQUFXLDJCQUFjLG1CQUFkLEVBQW1DLFFBQW5DLENBQWpC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O0FBQ0FaLDRCQUFRQyxHQUFSLENBQVksZ0NBQVosRUFBOENXLGNBQTlDO0FBQ0EsMEJBQU1BLGNBQU47QUFDSCxpQkFsQkw7QUFtQkgsYUEvQ0w7QUFnREgsU0FoRUwsV0FpRVcsZUFBTztBQUNWbEIseUJBQWFYLE1BQWIsQ0FBb0JTLEdBQXBCO0FBQ0gsU0FuRUw7O0FBcUVBLGVBQU9FLGFBQWFtQixPQUFwQjtBQUNILEtBNUVEO0FBNkVIOztBQUVEL0MsV0FBV2dELFNBQVgsR0FBdUIsbUJBQU1DLFVBQTdCO0FBQ0FqRCxXQUFXa0QsUUFBWDtBQUNBbEQsV0FBV21ELFdBQVg7QUFDQW5ELFdBQVdvRCxrQkFBWDs7cUJBRWVwRCxVIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHF1ZXJ5c3RyaW5nIGZyb20gJ3F1ZXJ5c3RyaW5nLWVzMyc7XG5cbmltcG9ydCBEZWZlcnJlZCBmcm9tICcuL3V0aWxzL0RlZmVycmVkJztcbmltcG9ydCBjcmVhdGVFcnJvciBmcm9tICcuL3V0aWxzL0NyZWF0ZUVycm9yJztcbmltcG9ydCBjcmVhdGVDb21ib1Byb21pc2UgZnJvbSAnLi91dGlscy9Db21ib1Byb21pc2UnO1xuXG5pbXBvcnQgRGVmYXVsdENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgQ29uc3QgZnJvbSAnLi9jb25zdCc7XG5cbmltcG9ydCBIdHRwV29ya2VyRmFjdG9yeSBmcm9tICcuL3dvcmtlcnMvQWpheCc7XG5pbXBvcnQgSHR0cE1pc3Npb24gZnJvbSAnLi9taXNzaW9ucy9IdHRwJztcblxuaW1wb3J0IE1pc3Npb25EaXNwYXRjaGVyIGZyb20gJy4vTWlzc2lvbkRpc3BhdGNoZXInO1xuXG5pbXBvcnQgQ2FjaGVEYXRhIGZyb20gJy4vQ2FjaGVEYXRhJztcblxuY29uc3QgQXBwQ2FjaGUgPSBuZXcgQ2FjaGVEYXRhKCdEQVRBX1NPVVJDRV9QUk9YWScsICd2MC4wLjEnKTtcblxuZnVuY3Rpb24gbWl4Q29uZmlnKHJlcXVlc3RDb25maWcpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgRGVmYXVsdENvbmZpZywgcmVxdWVzdENvbmZpZyk7XG59XG5cbi8qIOeUn+aIkGNhY2hlIGtleSovXG5mdW5jdGlvbiBnZXRDYWNoZUtleSh7IHVybCwgbWF4QWdlLCBwYXJhbXMgfSA9IHJlcXVlc3RDb25maWcpIHtcblxuICAgIGxldCBjYWNoZUtleSA9IG51bGw7XG4gICAgaWYgKHR5cGVvZiBtYXhBZ2UgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGNhY2hlS2V5ID0gdXJsICsgJ18nICsgcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHBhcmFtcyk7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZUtleTtcbn1cblxuZnVuY3Rpb24gRGF0YVNvdXJjZSh3b3JrZXJDb3VudCA9IDEwKSB7XG5cbiAgICB2YXIgaW50ZXJjZXB0b3JzID0ge1xuICAgICAgICByZXF1ZXN0OiBbXSxcbiAgICAgICAgcmVzcG9uc2U6IFtdLFxuICAgICAgICBlcnJvcjogW11cbiAgICB9O1xuXG4gICAgdmFyIHJlcXVlc3REZWZlcnMgPSBuZXcgTWFwKCk7XG5cbiAgICB2YXIgaHR0cE1EID0gbmV3IE1pc3Npb25EaXNwYXRjaGVyKEh0dHBXb3JrZXJGYWN0b3J5LCB3b3JrZXJDb3VudCk7XG4gICAgaHR0cE1ELnN0YXJ0KCk7XG5cbiAgICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICAgICAgcmVxdWVzdDoge1xuICAgICAgICAgICAgdXNlOiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGludGVyY2VwdG9ycy5yZXF1ZXN0LCBhcmdzKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXNwb25zZToge1xuICAgICAgICAgICAgdXNlOiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGludGVyY2VwdG9ycy5yZXNwb25zZSwgYXJncylcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIHVzZTogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShpbnRlcmNlcHRvcnMuZXJyb3IsIGFyZ3MpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHRoaXMuc3RhcnQgPSAoKSA9PiB7XG4gICAgICAgIGh0dHBNRC5zdGFydCgpO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcCA9ICgpID0+IHtcbiAgICAgICAgaHR0cE1ELnN0b3AoKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlcXVlc3QgPSAocmVxdWVzdENvbmZpZykgPT4ge1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBjYWNoZUtleSA9IGdldENhY2hlS2V5KHJlcXVlc3RDb25maWcpO1xuICAgICAgICAgICAgbGV0IHsgbWF4QWdlLCBpZ25vcmVFeHBpcmVzIH0gPSByZXF1ZXN0Q29uZmlnO1xuICAgICAgICAgICAgbGV0IGNhY2hlSXRlbSwgZGF0YTtcblxuICAgICAgICAgICAgaWYgKGNhY2hlS2V5ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8g5rKh5pyJbWF4QWdl6YWN572u77yM55u05o6l5Y+R6LW3c2VydmVyUmVxdWVzdFxuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5zZXJ2ZXJSZXF1ZXN0KHJlcXVlc3RDb25maWcpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5pyJbWF4QWdl6YWN572u77yM6ZyA6KaB5YWI5qOA5p+lY2FjaGVcbiAgICAgICAgICAgICAgICBjYWNoZUl0ZW0gPSBBcHBDYWNoZS5pdGVtKGNhY2hlS2V5LCB7IG1heEFnZSwgaWdub3JlRXhwaXJlcyB9KTtcbiAgICAgICAgICAgICAgICBkYXRhID0gY2FjaGVJdGVtLmdldCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gIGNhY2hl5Lit5rKh5Y+W5Yiw5pWw5o2uIHx8IOaVsOaNrui/h+acnywgIOWPkei1t3NlcnZlclJlcXVlc3RcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXJSZXF1ZXN0KHJlcXVlc3RDb25maWcpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZUl0ZW0uc2V0KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDlkb3kuK3nvJPlrZhcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH1cblxuXG4gICAgdGhpcy5zZXJ2ZXJSZXF1ZXN0ID0gKHJlcXVlc3RDb25maWcpID0+IHtcblxuICAgICAgICBsZXQgbWlzc2lvbkNvbmZpZyA9IG1peENvbmZpZyhyZXF1ZXN0Q29uZmlnIHx8IHt9KTtcbiAgICAgICAgbGV0IHJlcXVlc3REZWZlciA9IG5ldyBEZWZlcnJlZCgpO1xuXG4gICAgICAgIC8vIDEuIHJlcXVlc3RJbnRlcmNlcHRvcnNcbiAgICAgICAgaW50ZXJjZXB0b3JzLnJlcXVlc3QucmVkdWNlKChjb25maWdQcm9taXNlLCBpbnRlcmNlcHRvcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWdQcm9taXNlLnRoZW4oaW50ZXJjZXB0b3IpO1xuICAgICAgICAgICAgfSwgUHJvbWlzZS5yZXNvbHZlKG1pc3Npb25Db25maWcpKVxuICAgICAgICAgICAgLnRoZW4oKGNvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgICAgICB9LCAoaW50ZXJjZXB0b3JFcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXF1ZXN0IEludGVyY2VwdCBGYWlsIC4uLiAnLCBpbnRlcmNlcHRvckVycm9yKTtcbiAgICAgICAgICAgICAgICBpZiAoIWludGVyY2VwdG9yRXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcmNlcHRvckVycm9yID0gY3JlYXRlRXJyb3IoeyBtZXNzYWdlOiBpbnRlcmNlcHRvckVycm9yIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBpbnRlcmNlcHRvckVycm9yO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIDIuIGRvUmVxdWVzdFxuICAgICAgICAgICAgLnRoZW4oKGNvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBtaXNzaW9uID0gbmV3IEh0dHBNaXNzaW9uKGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgLy8gMi4xIGRvUmVxdWVzdFxuICAgICAgICAgICAgICAgIGh0dHBNRC5wdXQobWlzc2lvbilcbiAgICAgICAgICAgICAgICAgICAgLy8gMi4yLiByZXNwb25zZSBvciBlcnJvclxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAyLjIuMSByZXNwb25zZUludGVyY2VwdG9yc1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJjZXB0b3JzLnJlc3BvbnNlLnJlZHVjZSgocmVzdWx0UHJvbWlzZSwgaW50ZXJjZXB0b3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJjZXB0b3IocmVzdWx0LCByZXF1ZXN0Q29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBQcm9taXNlLnJlc29sdmUocmVzdWx0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3REZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAVE9ET1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmIHJlcXVlc3REZWZlci5yZWplY3QoZXJyb3IpOyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Jlc3BvbnNlIEludGVyY2VwdCBFeGNlcHRpb24gLi4uICcsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmtJfmlbDmja4s57qm5a6a77yaIGludGVyY2VwdG9yRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRyYW5zZm9ybWVkRXJyb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybWVkRXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtZWRFcnJvciA9IGNyZWF0ZUVycm9yKHsgbWVzc2FnZTogZXJyb3IgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAyLjIuMi4gZXJyb3JJbnRlcmNlcHRvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVyY2VwdG9ycy5lcnJvci5yZWR1Y2UoKGVycm9yUHJvbWlzZSwgaW50ZXJjZXB0b3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yUHJvbWlzZS50aGVuKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludGVyY2VwdG9yKGVycm9yLCByZXF1ZXN0Q29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBQcm9taXNlLnJlc29sdmUodHJhbnNmb3JtZWRFcnJvcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGVycm9yT3JEYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIOOAkOazqOaEj++8ge+8ge+8geOAkVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKuOAgOWkhOeQhui/h+eahOW8guW4uCwgZXJyb3JJbnRlcmNlcHRvcuWPr+iDveaKimVycm9y6L2s5o2i5Li65q2j5bi455qE5pWw5o2uKOmdnkVycm9y57G75Z6LKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiAgZXJyb3Io5LiA5a6a5piv5LiA5LiqRXJyb3LnsbvlnovnmoTlrp7kvospXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaGFuZGxlciA9IGVycm9yT3JEYXRhIGluc3RhbmNlb2YgRXJyb3IgPyAncmVqZWN0JyA6ICdyZXNvbHZlJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdERlZmVyW2hhbmRsZXJdKGVycm9yT3JEYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIChleGNlcHRpb25FcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmnKrlpITnkIblvILluLhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBJbnRlcmNlcHQgRXhjZXB0aW9uIC4uLiBcIiwgZXhjZXB0aW9uRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBleGNlcHRpb25FcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIHJlcXVlc3REZWZlci5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHJlcXVlc3REZWZlci5wcm9taXNlO1xuICAgIH1cbn1cblxuRGF0YVNvdXJjZS5FcnJvclR5cGUgPSBDb25zdC5FUlJPUl9UWVBFO1xuRGF0YVNvdXJjZS5EZWZlcnJlZCA9IERlZmVycmVkO1xuRGF0YVNvdXJjZS5jcmVhdGVFcnJvciA9IGNyZWF0ZUVycm9yO1xuRGF0YVNvdXJjZS5jcmVhdGVDb21ib1Byb21pc2UgPSBjcmVhdGVDb21ib1Byb21pc2U7XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFTb3VyY2U7XG4iXX0=