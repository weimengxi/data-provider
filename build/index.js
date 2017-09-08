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

var _utils = require('./utils');

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
        params = _ref.params,
        paramSerializerJQLikeEnabled = _ref.paramSerializerJQLikeEnabled;

    var paramSerializer = (0, _utils.getParamSerializer)(paramSerializerJQLikeEnabled);
    var cacheKey = null;
    if (typeof maxAge === 'number') {
        cacheKey = url + '_' + paramSerializer(params);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJBcHBDYWNoZSIsIm1peENvbmZpZyIsInJlcXVlc3RDb25maWciLCJnZXRDYWNoZUtleSIsInVybCIsIm1heEFnZSIsInBhcmFtcyIsInBhcmFtU2VyaWFsaXplckpRTGlrZUVuYWJsZWQiLCJwYXJhbVNlcmlhbGl6ZXIiLCJjYWNoZUtleSIsIkRhdGFTb3VyY2UiLCJ3b3JrZXJDb3VudCIsImludGVyY2VwdG9ycyIsInJlcXVlc3QiLCJyZXNwb25zZSIsImVycm9yIiwicmVxdWVzdERlZmVycyIsImh0dHBNRCIsInN0YXJ0IiwidXNlIiwiYXJncyIsIkFycmF5IiwicHJvdG90eXBlIiwicHVzaCIsImFwcGx5Iiwic3RvcCIsInJlc29sdmUiLCJyZWplY3QiLCJpZ25vcmVFeHBpcmVzIiwiY2FjaGVJdGVtIiwiZGF0YSIsInNlcnZlclJlcXVlc3QiLCJpdGVtIiwiZ2V0IiwidGhlbiIsInNldCIsImVyciIsIm1pc3Npb25Db25maWciLCJyZXF1ZXN0RGVmZXIiLCJyZWR1Y2UiLCJjb25maWdQcm9taXNlIiwiaW50ZXJjZXB0b3IiLCJjb25maWciLCJpbnRlcmNlcHRvckVycm9yIiwiY29uc29sZSIsImxvZyIsIkVycm9yIiwibWVzc2FnZSIsIm1pc3Npb24iLCJwdXQiLCJyZXN1bHQiLCJyZXN1bHRQcm9taXNlIiwidHJhbnNmb3JtZWRFcnJvciIsImVycm9yUHJvbWlzZSIsImVycm9yT3JEYXRhIiwiaGFuZGxlciIsImV4Y2VwdGlvbkVycm9yIiwicHJvbWlzZSIsIkVycm9yVHlwZSIsIkVSUk9SX1RZUEUiLCJEZWZlcnJlZCIsImNyZWF0ZUVycm9yIiwiY3JlYXRlQ29tYm9Qcm9taXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7QUFFQTs7Ozs7O0FB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QXVCUixLQUF2QixHQUErQixRQUEvQixHQUEwQyxTQUF4RDtBQUNBUixpQ0FBYWlCLE9BQWIsRUFBc0JELFdBQXRCO0FBRUgsaUJBZEwsRUFjTyxVQUFDRSxjQUFELEVBQW9CO0FBQ25CO0FBQ0FaLDRCQUFRQyxHQUFSLENBQVksZ0NBQVosRUFBOENXLGNBQTlDO0FBQ0EsMEJBQU1BLGNBQU47QUFDSCxpQkFsQkw7QUFtQkgsYUEvQ0w7QUFnREgsU0FoRUwsV0FpRVcsZUFBTztBQUNWbEIseUJBQWFYLE1BQWIsQ0FBb0JTLEdBQXBCO0FBQ0gsU0FuRUw7O0FBcUVBLGVBQU9FLGFBQWFtQixPQUFwQjtBQUNILEtBNUVEO0FBNkVIOztBQUVEL0MsV0FBV2dELFNBQVgsR0FBdUIsbUJBQU1DLFVBQTdCO0FBQ0FqRCxXQUFXa0QsUUFBWDtBQUNBbEQsV0FBV21ELFdBQVg7QUFDQW5ELFdBQVdvRCxrQkFBWDs7cUJBRWVwRCxVIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHF1ZXJ5c3RyaW5nIGZyb20gJ3F1ZXJ5c3RyaW5nLWVzMyc7XG5cbmltcG9ydCBEZWZlcnJlZCBmcm9tICcuL3V0aWxzL0RlZmVycmVkJztcbmltcG9ydCBjcmVhdGVFcnJvciBmcm9tICcuL3V0aWxzL0NyZWF0ZUVycm9yJztcbmltcG9ydCBjcmVhdGVDb21ib1Byb21pc2UgZnJvbSAnLi91dGlscy9Db21ib1Byb21pc2UnO1xuXG5pbXBvcnQgRGVmYXVsdENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgQ29uc3QgZnJvbSAnLi9jb25zdCc7XG5cbmltcG9ydCBIdHRwV29ya2VyRmFjdG9yeSBmcm9tICcuL3dvcmtlcnMvQWpheCc7XG5pbXBvcnQgSHR0cE1pc3Npb24gZnJvbSAnLi9taXNzaW9ucy9IdHRwJztcblxuaW1wb3J0IE1pc3Npb25EaXNwYXRjaGVyIGZyb20gJy4vTWlzc2lvbkRpc3BhdGNoZXInO1xuaW1wb3J0IHsgZ2V0UGFyYW1TZXJpYWxpemVyIH0gZnJvbSAnLi91dGlscyc7XG5cbmltcG9ydCBDYWNoZURhdGEgZnJvbSAnLi9DYWNoZURhdGEnO1xuXG5jb25zdCBBcHBDYWNoZSA9IG5ldyBDYWNoZURhdGEoJ0RBVEFfU09VUkNFX1BST1hZJywgJ3YwLjAuMScpO1xuXG5mdW5jdGlvbiBtaXhDb25maWcocmVxdWVzdENvbmZpZykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0Q29uZmlnLCByZXF1ZXN0Q29uZmlnKTtcbn1cblxuLyog55Sf5oiQY2FjaGUga2V5Ki9cbmZ1bmN0aW9uIGdldENhY2hlS2V5KHsgdXJsLCBtYXhBZ2UsIHBhcmFtcywgcGFyYW1TZXJpYWxpemVySlFMaWtlRW5hYmxlZCB9ID0gcmVxdWVzdENvbmZpZykge1xuICAgIGNvbnN0IHBhcmFtU2VyaWFsaXplciA9IGdldFBhcmFtU2VyaWFsaXplcihwYXJhbVNlcmlhbGl6ZXJKUUxpa2VFbmFibGVkKTtcbiAgICBsZXQgY2FjaGVLZXkgPSBudWxsO1xuICAgIGlmICh0eXBlb2YgbWF4QWdlID09PSAnbnVtYmVyJykge1xuICAgICAgICBjYWNoZUtleSA9IHVybCArICdfJyArIHBhcmFtU2VyaWFsaXplcihwYXJhbXMpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVLZXk7XG59XG5cbmZ1bmN0aW9uIERhdGFTb3VyY2Uod29ya2VyQ291bnQgPSAxMCkge1xuXG4gICAgdmFyIGludGVyY2VwdG9ycyA9IHtcbiAgICAgICAgcmVxdWVzdDogW10sXG4gICAgICAgIHJlc3BvbnNlOiBbXSxcbiAgICAgICAgZXJyb3I6IFtdXG4gICAgfTtcblxuICAgIHZhciByZXF1ZXN0RGVmZXJzID0gbmV3IE1hcCgpO1xuXG4gICAgdmFyIGh0dHBNRCA9IG5ldyBNaXNzaW9uRGlzcGF0Y2hlcihIdHRwV29ya2VyRmFjdG9yeSwgd29ya2VyQ291bnQpO1xuICAgIGh0dHBNRC5zdGFydCgpO1xuXG4gICAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgICAgIHJlcXVlc3Q6IHtcbiAgICAgICAgICAgIHVzZTogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShpbnRlcmNlcHRvcnMucmVxdWVzdCwgYXJncylcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAgIHVzZTogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShpbnRlcmNlcHRvcnMucmVzcG9uc2UsIGFyZ3MpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICB1c2U6ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoaW50ZXJjZXB0b3JzLmVycm9yLCBhcmdzKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICB0aGlzLnN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICBodHRwTUQuc3RhcnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3AgPSAoKSA9PiB7XG4gICAgICAgIGh0dHBNRC5zdG9wKCk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXF1ZXN0ID0gKHJlcXVlc3RDb25maWcpID0+IHtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgY2FjaGVLZXkgPSBnZXRDYWNoZUtleShyZXF1ZXN0Q29uZmlnKTtcbiAgICAgICAgICAgIGxldCB7IG1heEFnZSwgaWdub3JlRXhwaXJlcyB9ID0gcmVxdWVzdENvbmZpZztcbiAgICAgICAgICAgIGxldCBjYWNoZUl0ZW0sIGRhdGE7XG5cbiAgICAgICAgICAgIGlmIChjYWNoZUtleSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIOayoeaciW1heEFnZemFjee9ru+8jOebtOaOpeWPkei1t3NlcnZlclJlcXVlc3RcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuc2VydmVyUmVxdWVzdChyZXF1ZXN0Q29uZmlnKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIOaciW1heEFnZemFjee9ru+8jOmcgOimgeWFiOajgOafpWNhY2hlXG4gICAgICAgICAgICAgICAgY2FjaGVJdGVtID0gQXBwQ2FjaGUuaXRlbShjYWNoZUtleSwgeyBtYXhBZ2UsIGlnbm9yZUV4cGlyZXMgfSk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGNhY2hlSXRlbS5nZXQoKTtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICBjYWNoZeS4reayoeWPluWIsOaVsOaNriB8fCDmlbDmja7ov4fmnJ8sICDlj5HotbdzZXJ2ZXJSZXF1ZXN0XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyUmVxdWVzdChyZXF1ZXN0Q29uZmlnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVJdGVtLnNldChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gcmVqZWN0KGVycikpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5ZG95Lit57yT5a2YXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxuICAgIHRoaXMuc2VydmVyUmVxdWVzdCA9IChyZXF1ZXN0Q29uZmlnKSA9PiB7XG5cbiAgICAgICAgbGV0IG1pc3Npb25Db25maWcgPSBtaXhDb25maWcocmVxdWVzdENvbmZpZyB8fCB7fSk7XG4gICAgICAgIGxldCByZXF1ZXN0RGVmZXIgPSBuZXcgRGVmZXJyZWQoKTtcblxuICAgICAgICAvLyAxLiByZXF1ZXN0SW50ZXJjZXB0b3JzXG4gICAgICAgIGludGVyY2VwdG9ycy5yZXF1ZXN0LnJlZHVjZSgoY29uZmlnUHJvbWlzZSwgaW50ZXJjZXB0b3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnUHJvbWlzZS50aGVuKGludGVyY2VwdG9yKTtcbiAgICAgICAgICAgIH0sIFByb21pc2UucmVzb2x2ZShtaXNzaW9uQ29uZmlnKSlcbiAgICAgICAgICAgIC50aGVuKChjb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICAgICAgfSwgKGludGVyY2VwdG9yRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVxdWVzdCBJbnRlcmNlcHQgRmFpbCAuLi4gJywgaW50ZXJjZXB0b3JFcnJvcik7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnRlcmNlcHRvckVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJjZXB0b3JFcnJvciA9IGNyZWF0ZUVycm9yKHsgbWVzc2FnZTogaW50ZXJjZXB0b3JFcnJvciB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgaW50ZXJjZXB0b3JFcnJvcjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvLyAyLiBkb1JlcXVlc3RcbiAgICAgICAgICAgIC50aGVuKChjb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgbWlzc2lvbiA9IG5ldyBIdHRwTWlzc2lvbihjb25maWcpO1xuICAgICAgICAgICAgICAgIC8vIDIuMSBkb1JlcXVlc3RcbiAgICAgICAgICAgICAgICBodHRwTUQucHV0KG1pc3Npb24pXG4gICAgICAgICAgICAgICAgICAgIC8vIDIuMi4gcmVzcG9uc2Ugb3IgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMi4yLjEgcmVzcG9uc2VJbnRlcmNlcHRvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVyY2VwdG9ycy5yZXNwb25zZS5yZWR1Y2UoKHJlc3VsdFByb21pc2UsIGludGVyY2VwdG9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRQcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludGVyY2VwdG9yKHJlc3VsdCwgcmVxdWVzdENvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0RGVmZXIucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQFRPRE9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiByZXF1ZXN0RGVmZXIucmVqZWN0KGVycm9yKTsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdSZXNwb25zZSBJbnRlcmNlcHQgRXhjZXB0aW9uIC4uLiAnLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5rSX5pWw5o2uLOe6puWumu+8miBpbnRlcmNlcHRvckVycm9yIGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZEVycm9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1lZEVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybWVkRXJyb3IgPSBjcmVhdGVFcnJvcih7IG1lc3NhZ2U6IGVycm9yIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMi4yLjIuIGVycm9ySW50ZXJjZXB0b3JzXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcmNlcHRvcnMuZXJyb3IucmVkdWNlKChlcnJvclByb21pc2UsIGludGVyY2VwdG9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlcnJvclByb21pc2UudGhlbigoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcmNlcHRvcihlcnJvciwgcmVxdWVzdENvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgUHJvbWlzZS5yZXNvbHZlKHRyYW5zZm9ybWVkRXJyb3IpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChlcnJvck9yRGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiDjgJDms6jmhI/vvIHvvIHvvIHjgJFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICrjgIDlpITnkIbov4fnmoTlvILluLgsIGVycm9ySW50ZXJjZXB0b3Llj6/og73mioplcnJvcui9rOaNouS4uuato+W4uOeahOaVsOaNrijpnZ5FcnJvcuexu+WeiylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogIGVycm9yKOS4gOWumuaYr+S4gOS4qkVycm9y57G75Z6L55qE5a6e5L6LKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhhbmRsZXIgPSBlcnJvck9yRGF0YSBpbnN0YW5jZW9mIEVycm9yID8gJ3JlamVjdCcgOiAncmVzb2x2ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3REZWZlcltoYW5kbGVyXShlcnJvck9yRGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAoZXhjZXB0aW9uRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pyq5aSE55CG5byC5bi4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgSW50ZXJjZXB0IEV4Y2VwdGlvbiAuLi4gXCIsIGV4Y2VwdGlvbkVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXhjZXB0aW9uRXJyb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0RGVmZXIucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiByZXF1ZXN0RGVmZXIucHJvbWlzZTtcbiAgICB9XG59XG5cbkRhdGFTb3VyY2UuRXJyb3JUeXBlID0gQ29uc3QuRVJST1JfVFlQRTtcbkRhdGFTb3VyY2UuRGVmZXJyZWQgPSBEZWZlcnJlZDtcbkRhdGFTb3VyY2UuY3JlYXRlRXJyb3IgPSBjcmVhdGVFcnJvcjtcbkRhdGFTb3VyY2UuY3JlYXRlQ29tYm9Qcm9taXNlID0gY3JlYXRlQ29tYm9Qcm9taXNlO1xuXG5leHBvcnQgZGVmYXVsdCBEYXRhU291cmNlOyJdfQ==