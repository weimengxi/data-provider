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

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

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
        cacheKey = url + '_' + _querystring2['default'].stringify(params);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJBcHBDYWNoZSIsIm1peENvbmZpZyIsInJlcXVlc3RDb25maWciLCJnZXRDYWNoZUtleSIsInVybCIsIm1heEFnZSIsInBhcmFtcyIsImNhY2hlS2V5Iiwic3RyaW5naWZ5IiwiRGF0YVNvdXJjZSIsIndvcmtlckNvdW50IiwiaW50ZXJjZXB0b3JzIiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZXJyb3IiLCJyZXF1ZXN0RGVmZXJzIiwiaHR0cE1EIiwic3RhcnQiLCJ1c2UiLCJhcmdzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJwdXNoIiwiYXBwbHkiLCJzdG9wIiwicmVzb2x2ZSIsInJlamVjdCIsImlnbm9yZUV4cGlyZXMiLCJjYWNoZUl0ZW0iLCJkYXRhIiwic2VydmVyUmVxdWVzdCIsIml0ZW0iLCJnZXQiLCJ0aGVuIiwic2V0IiwiZXJyIiwibWlzc2lvbkNvbmZpZyIsInJlcXVlc3REZWZlciIsInJlZHVjZSIsImNvbmZpZ1Byb21pc2UiLCJpbnRlcmNlcHRvciIsImNvbmZpZyIsImludGVyY2VwdG9yRXJyb3IiLCJjb25zb2xlIiwibG9nIiwiRXJyb3IiLCJtZXNzYWdlIiwibWlzc2lvbiIsInB1dCIsInJlc3VsdCIsInJlc3VsdFByb21pc2UiLCJ0cmFuc2Zvcm1lZEVycm9yIiwiZXJyb3JQcm9taXNlIiwiZXJyb3JPckRhdGEiLCJoYW5kbGVyIiwiZXhjZXB0aW9uRXJyb3IiLCJwcm9taXNlIiwiRXJyb3JUeXBlIiwiRVJST1JfVFlQRSIsIkRlZmVycmVkIiwiY3JlYXRlRXJyb3IiLCJjcmVhdGVDb21ib1Byb21pc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxXQUFXLDJCQUFjLG1CQUFkLEVBQW1DLFFBQW5DLENBQWpC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O0FBQ0FaLDRCQUFRQyxHQUFSLENBQVksZ0NBQVosRUFBOENXLGNBQTlDO0FBQ0EsMEJBQU1BLGNBQU47QUFDSCxpQkFsQkw7QUFtQkgsYUEvQ0w7QUFnREgsU0FoRUwsV0FpRVcsZUFBTztBQUNWbEIseUJBQWFYLE1BQWIsQ0FBb0JTLEdBQXBCO0FBQ0gsU0FuRUw7O0FBcUVBLGVBQU9FLGFBQWFtQixPQUFwQjtBQUNILEtBNUVEO0FBNkVIOztBQUVEL0MsV0FBV2dELFNBQVgsR0FBdUIsbUJBQU1DLFVBQTdCO0FBQ0FqRCxXQUFXa0QsUUFBWDtBQUNBbEQsV0FBV21ELFdBQVg7QUFDQW5ELFdBQVdvRCxrQkFBWDs7cUJBRWVwRCxVIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHF1ZXJ5c3RyaW5nIGZyb20gJ3F1ZXJ5c3RyaW5nJztcblxuaW1wb3J0IERlZmVycmVkIGZyb20gJy4vdXRpbHMvRGVmZXJyZWQnO1xuaW1wb3J0IGNyZWF0ZUVycm9yIGZyb20gJy4vdXRpbHMvQ3JlYXRlRXJyb3InO1xuaW1wb3J0IGNyZWF0ZUNvbWJvUHJvbWlzZSBmcm9tICcuL3V0aWxzL0NvbWJvUHJvbWlzZSc7XG5cbmltcG9ydCBEZWZhdWx0Q29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBDb25zdCBmcm9tICcuL2NvbnN0JztcblxuaW1wb3J0IEh0dHBXb3JrZXJGYWN0b3J5IGZyb20gJy4vd29ya2Vycy9BamF4JztcbmltcG9ydCBIdHRwTWlzc2lvbiBmcm9tICcuL21pc3Npb25zL0h0dHAnO1xuXG5pbXBvcnQgTWlzc2lvbkRpc3BhdGNoZXIgZnJvbSAnLi9NaXNzaW9uRGlzcGF0Y2hlcic7XG5cbmltcG9ydCBDYWNoZURhdGEgZnJvbSAnLi9DYWNoZURhdGEnO1xuXG5jb25zdCBBcHBDYWNoZSA9IG5ldyBDYWNoZURhdGEoJ0RBVEFfU09VUkNFX1BST1hZJywgJ3YwLjAuMScpO1xuXG5mdW5jdGlvbiBtaXhDb25maWcocmVxdWVzdENvbmZpZykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0Q29uZmlnLCByZXF1ZXN0Q29uZmlnKTtcbn1cblxuLyog55Sf5oiQY2FjaGUga2V5Ki9cbmZ1bmN0aW9uIGdldENhY2hlS2V5KHsgdXJsLCBtYXhBZ2UsIHBhcmFtcyB9ID0gcmVxdWVzdENvbmZpZykge1xuXG4gICAgbGV0IGNhY2hlS2V5ID0gbnVsbDtcbiAgICBpZiAodHlwZW9mIG1heEFnZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgY2FjaGVLZXkgPSB1cmwgKyAnXycgKyBxdWVyeXN0cmluZy5zdHJpbmdpZnkocGFyYW1zKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlS2V5O1xufVxuXG5mdW5jdGlvbiBEYXRhU291cmNlKHdvcmtlckNvdW50ID0gMTApIHtcblxuICAgIHZhciBpbnRlcmNlcHRvcnMgPSB7XG4gICAgICAgIHJlcXVlc3Q6IFtdLFxuICAgICAgICByZXNwb25zZTogW10sXG4gICAgICAgIGVycm9yOiBbXVxuICAgIH07XG5cbiAgICB2YXIgcmVxdWVzdERlZmVycyA9IG5ldyBNYXAoKTtcblxuICAgIHZhciBodHRwTUQgPSBuZXcgTWlzc2lvbkRpc3BhdGNoZXIoSHR0cFdvcmtlckZhY3RvcnksIHdvcmtlckNvdW50KTtcbiAgICBodHRwTUQuc3RhcnQoKTtcblxuICAgIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgICAgICByZXF1ZXN0OiB7XG4gICAgICAgICAgICB1c2U6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoaW50ZXJjZXB0b3JzLnJlcXVlc3QsIGFyZ3MpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgICAgICB1c2U6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoaW50ZXJjZXB0b3JzLnJlc3BvbnNlLCBhcmdzKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgdXNlOiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGludGVyY2VwdG9ycy5lcnJvciwgYXJncylcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgdGhpcy5zdGFydCA9ICgpID0+IHtcbiAgICAgICAgaHR0cE1ELnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wID0gKCkgPT4ge1xuICAgICAgICBodHRwTUQuc3RvcCgpO1xuICAgIH1cblxuICAgIHRoaXMucmVxdWVzdCA9IChyZXF1ZXN0Q29uZmlnKSA9PiB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgbGV0IGNhY2hlS2V5ID0gZ2V0Q2FjaGVLZXkocmVxdWVzdENvbmZpZyk7XG4gICAgICAgICAgICBsZXQgeyBtYXhBZ2UsIGlnbm9yZUV4cGlyZXMgfSA9IHJlcXVlc3RDb25maWc7XG4gICAgICAgICAgICBsZXQgY2FjaGVJdGVtLCBkYXRhO1xuXG4gICAgICAgICAgICBpZiAoY2FjaGVLZXkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyDmsqHmnIltYXhBZ2XphY3nva7vvIznm7TmjqXlj5HotbdzZXJ2ZXJSZXF1ZXN0XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnNlcnZlclJlcXVlc3QocmVxdWVzdENvbmZpZykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDmnIltYXhBZ2XphY3nva7vvIzpnIDopoHlhYjmo4Dmn6VjYWNoZVxuICAgICAgICAgICAgICAgIGNhY2hlSXRlbSA9IEFwcENhY2hlLml0ZW0oY2FjaGVLZXksIHsgbWF4QWdlLCBpZ25vcmVFeHBpcmVzIH0pO1xuICAgICAgICAgICAgICAgIGRhdGEgPSBjYWNoZUl0ZW0uZ2V0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgY2FjaGXkuK3msqHlj5bliLDmlbDmja4gfHwg5pWw5o2u6L+H5pyfLCAg5Y+R6LW3c2VydmVyUmVxdWVzdFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcnZlclJlcXVlc3QocmVxdWVzdENvbmZpZylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlSXRlbS5zZXQoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWRveS4ree8k+WtmFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5cbiAgICB0aGlzLnNlcnZlclJlcXVlc3QgPSAocmVxdWVzdENvbmZpZykgPT4ge1xuXG4gICAgICAgIGxldCBtaXNzaW9uQ29uZmlnID0gbWl4Q29uZmlnKHJlcXVlc3RDb25maWcgfHwge30pO1xuICAgICAgICBsZXQgcmVxdWVzdERlZmVyID0gbmV3IERlZmVycmVkKCk7XG5cbiAgICAgICAgLy8gMS4gcmVxdWVzdEludGVyY2VwdG9yc1xuICAgICAgICBpbnRlcmNlcHRvcnMucmVxdWVzdC5yZWR1Y2UoKGNvbmZpZ1Byb21pc2UsIGludGVyY2VwdG9yKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ1Byb21pc2UudGhlbihpbnRlcmNlcHRvcik7XG4gICAgICAgICAgICB9LCBQcm9taXNlLnJlc29sdmUobWlzc2lvbkNvbmZpZykpXG4gICAgICAgICAgICAudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgICAgIH0sIChpbnRlcmNlcHRvckVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlcXVlc3QgSW50ZXJjZXB0IEZhaWwgLi4uICcsIGludGVyY2VwdG9yRXJyb3IpO1xuICAgICAgICAgICAgICAgIGlmICghaW50ZXJjZXB0b3JFcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVyY2VwdG9yRXJyb3IgPSBjcmVhdGVFcnJvcih7IG1lc3NhZ2U6IGludGVyY2VwdG9yRXJyb3IgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGludGVyY2VwdG9yRXJyb3I7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gMi4gZG9SZXF1ZXN0XG4gICAgICAgICAgICAudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIG1pc3Npb24gPSBuZXcgSHR0cE1pc3Npb24oY29uZmlnKTtcbiAgICAgICAgICAgICAgICAvLyAyLjEgZG9SZXF1ZXN0XG4gICAgICAgICAgICAgICAgaHR0cE1ELnB1dChtaXNzaW9uKVxuICAgICAgICAgICAgICAgICAgICAvLyAyLjIuIHJlc3BvbnNlIG9yIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDIuMi4xIHJlc3BvbnNlSW50ZXJjZXB0b3JzXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcmNlcHRvcnMucmVzcG9uc2UucmVkdWNlKChyZXN1bHRQcm9taXNlLCBpbnRlcmNlcHRvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0UHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcmNlcHRvcihyZXN1bHQsIHJlcXVlc3RDb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIFByb21pc2UucmVzb2x2ZShyZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdERlZmVyLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBUT0RPXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgcmVxdWVzdERlZmVyLnJlamVjdChlcnJvcik7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignUmVzcG9uc2UgSW50ZXJjZXB0IEV4Y2VwdGlvbiAuLi4gJywgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOa0l+aVsOaNriznuqblrprvvJogaW50ZXJjZXB0b3JFcnJvciBpbnN0YW5jZW9mIEVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHJhbnNmb3JtZWRFcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtZWRFcnJvciA9IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1lZEVycm9yID0gY3JlYXRlRXJyb3IoeyBtZXNzYWdlOiBlcnJvciB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDIuMi4yLiBlcnJvckludGVyY2VwdG9yc1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJjZXB0b3JzLmVycm9yLnJlZHVjZSgoZXJyb3JQcm9taXNlLCBpbnRlcmNlcHRvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3JQcm9taXNlLnRoZW4oKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJjZXB0b3IoZXJyb3IsIHJlcXVlc3RDb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIFByb21pc2UucmVzb2x2ZSh0cmFuc2Zvcm1lZEVycm9yKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoZXJyb3JPckRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICog44CQ5rOo5oSP77yB77yB77yB44CRXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAq44CA5aSE55CG6L+H55qE5byC5bi4LCBlcnJvckludGVyY2VwdG9y5Y+v6IO95oqKZXJyb3LovazmjaLkuLrmraPluLjnmoTmlbDmja4o6Z2eRXJyb3LnsbvlnospXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqICBlcnJvcijkuIDlrprmmK/kuIDkuKpFcnJvcuexu+Wei+eahOWunuS+iylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoYW5kbGVyID0gZXJyb3JPckRhdGEgaW5zdGFuY2VvZiBFcnJvciA/ICdyZWplY3QnIDogJ3Jlc29sdmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0RGVmZXJbaGFuZGxlcl0oZXJyb3JPckRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgKGV4Y2VwdGlvbkVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOacquWkhOeQhuW8guW4uFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIEludGVyY2VwdCBFeGNlcHRpb24gLi4uIFwiLCBleGNlcHRpb25FcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGV4Y2VwdGlvbkVycm9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdERlZmVyLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gcmVxdWVzdERlZmVyLnByb21pc2U7XG4gICAgfVxufVxuXG5EYXRhU291cmNlLkVycm9yVHlwZSA9IENvbnN0LkVSUk9SX1RZUEU7XG5EYXRhU291cmNlLkRlZmVycmVkID0gRGVmZXJyZWQ7XG5EYXRhU291cmNlLmNyZWF0ZUVycm9yID0gY3JlYXRlRXJyb3I7XG5EYXRhU291cmNlLmNyZWF0ZUNvbWJvUHJvbWlzZSA9IGNyZWF0ZUNvbWJvUHJvbWlzZTtcblxuZXhwb3J0IGRlZmF1bHQgRGF0YVNvdXJjZTtcbiJdfQ==