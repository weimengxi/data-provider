'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _const = require('../const');

var _const2 = _interopRequireDefault(_const);

var _CreateError = require('../utils/CreateError');

var _CreateError2 = _interopRequireDefault(_CreateError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// import 'axios-response-logger';

var ERROR_TYPE = _const2['default'].ERROR_TYPE;

var JSON = (typeof window === 'undefined' ? global : window).JSON || {};

// 异常数据结构
var errorResponseStruct = { httpStatusCode: NaN, code: NaN, message: '' };

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 * @refer https://github.com/mzabriskie/axios/blob/master/lib/utils.js
 */
var isObject = function isObject(val) {
    return val !== null && (typeof val === 'undefined' ? 'undefined' : (0, _typeof3['default'])(val)) === 'object';
};

var transformMissionConfig = function transformMissionConfig(config) {

    var transformedConfig = (0, _assign2['default'])({}, config);

    if (config.method === 'post' && isObject(transformedConfig.data)) {
        transformedConfig.data = _querystring2['default'].stringify(transformedConfig.data);
    }

    return transformedConfig;
};

var AjaxWorkerFactory = function () {
    function AjaxWorkerFactory() {
        (0, _classCallCheck3['default'])(this, AjaxWorkerFactory);
    }

    (0, _createClass3['default'])(AjaxWorkerFactory, [{
        key: 'do',
        value: function _do(mission) {
            return new _promise2['default'](function (resolve, reject) {
                // axiosSchema: https://github.com/mzabriskie/axios
                var transformedConfig = transformMissionConfig(mission.config);

                _axios2['default'].request(transformedConfig).then(function (_ref) {
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
                            var parserError = (0, _CreateError2['default'])({ message: message, type: ERROR_TYPE.PARSER });
                            reject(parserError);
                        }
                    }

                    // reslove 
                    // [!important] 新增的 (data.code) 逻辑判断是为了兼容服务端api error返回结构争议
                    if (data.error || data.code) {
                        // 2. bizError
                        var httpStatusCode = status;
                        var rawError = (0, _assign2['default'])({}, data.error || data, { httpStatusCode: httpStatusCode });
                        var businessError = (0, _CreateError2['default'])(rawError);
                        reject(businessError);
                    } else {
                        resolve(data);
                    }
                }, function (error) {
                    if (_axios2['default'].isCancel(error)) {
                        // abort error
                        // console.log('Request canceled', error.message);
                        var abortError = (0, _CreateError2['default'])({ message: error.message, type: ERROR_TYPE.ABORT, code: error.code });
                        reject(abortError);
                    } else if (error.code === 'ECONNABORTED') {
                        // timeout error
                        var timeoutError = (0, _CreateError2['default'])({ message: error.message, type: ERROR_TYPE.TIMEOUT, code: error.code });
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
                        var code = data.code,
                            message = data.message;

                        var responseDataError = data.error || {};
                        var type = ERROR_TYPE.NETWORK,
                            httpStatusCode = status;

                        // 兼容data.code 和 data.error这两种标志异常的方式， 优先选用code
                        code = code || responseDataError.code;
                        message = message || responseDataError.message || statusText;

                        networkError = (0, _CreateError2['default'])({ type: type, httpStatusCode: httpStatusCode, code: code, message: message });
                        reject(networkError);
                    } else {

                        // console.error("unknown axios request error: ", error);
                        var requestError = (0, _CreateError2['default'])({ message: error.message, type: ERROR_TYPE.NETWORK });
                        reject(requestError);
                    }
                });
            });
        }
    }]);
    return AjaxWorkerFactory;
}();

exports['default'] = AjaxWorkerFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93b3JrZXJzL0FqYXguanMiXSwibmFtZXMiOlsiRVJST1JfVFlQRSIsIkpTT04iLCJ3aW5kb3ciLCJnbG9iYWwiLCJlcnJvclJlc3BvbnNlU3RydWN0IiwiaHR0cFN0YXR1c0NvZGUiLCJOYU4iLCJjb2RlIiwibWVzc2FnZSIsImlzT2JqZWN0IiwidmFsIiwidHJhbnNmb3JtTWlzc2lvbkNvbmZpZyIsImNvbmZpZyIsInRyYW5zZm9ybWVkQ29uZmlnIiwibWV0aG9kIiwiZGF0YSIsInN0cmluZ2lmeSIsIkFqYXhXb3JrZXJGYWN0b3J5IiwibWlzc2lvbiIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0IiwidGhlbiIsInN0YXR1cyIsInN0YXR1c1RleHQiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJwYXJzZSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJ1cmwiLCJwYXJzZXJFcnJvciIsInR5cGUiLCJQQVJTRVIiLCJyYXdFcnJvciIsImJ1c2luZXNzRXJyb3IiLCJpc0NhbmNlbCIsImFib3J0RXJyb3IiLCJBQk9SVCIsInRpbWVvdXRFcnJvciIsIlRJTUVPVVQiLCJuZXR3b3JrRXJyb3IiLCJyZXNwb25zZURhdGFFcnJvciIsIk5FVFdPUksiLCJyZXF1ZXN0RXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUdBOzs7O0FBRUE7Ozs7OztBQUpBOztBQU1BLElBQU1BLGFBQWEsbUJBQU1BLFVBQXpCOztBQUVBLElBQU1DLE9BQU8sQ0FBQyxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDQyxNQUFoQyxHQUF5Q0QsTUFBMUMsRUFBa0RELElBQWxELElBQTBELEVBQXZFOztBQUVBO0FBQ0EsSUFBTUcsc0JBQXNCLEVBQUVDLGdCQUFnQkMsR0FBbEIsRUFBdUJDLE1BQU1ELEdBQTdCLEVBQWtDRSxTQUFTLEVB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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCBxdWVyeXN0cmluZyBmcm9tICdxdWVyeXN0cmluZyc7XG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuLy8gaW1wb3J0ICdheGlvcy1yZXNwb25zZS1sb2dnZXInO1xuXG5pbXBvcnQgQ29uc3QgZnJvbSAnLi4vY29uc3QnO1xuXG5pbXBvcnQgY3JlYXRlRXJyb3IgZnJvbSAnLi4vdXRpbHMvQ3JlYXRlRXJyb3InO1xuXG5jb25zdCBFUlJPUl9UWVBFID0gQ29uc3QuRVJST1JfVFlQRTtcblxuY29uc3QgSlNPTiA9ICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdykuSlNPTiB8fCB7fTtcblxuLy8g5byC5bi45pWw5o2u57uT5p6EXG5jb25zdCBlcnJvclJlc3BvbnNlU3RydWN0ID0geyBodHRwU3RhdHVzQ29kZTogTmFOLCBjb2RlOiBOYU4sIG1lc3NhZ2U6ICcnIH07XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqIEByZWZlciBodHRwczovL2dpdGh1Yi5jb20vbXphYnJpc2tpZS9heGlvcy9ibG9iL21hc3Rlci9saWIvdXRpbHMuanNcbiAqL1xuY29uc3QgaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG5jb25zdCB0cmFuc2Zvcm1NaXNzaW9uQ29uZmlnID0gZnVuY3Rpb24gdHJhbnNmb3JtTWlzc2lvbkNvbmZpZyhjb25maWcpIHtcblxuICAgIGxldCB0cmFuc2Zvcm1lZENvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZylcblxuICAgIGlmIChjb25maWcubWV0aG9kID09PSAncG9zdCcgJiYgaXNPYmplY3QodHJhbnNmb3JtZWRDb25maWcuZGF0YSkpIHtcbiAgICAgICAgdHJhbnNmb3JtZWRDb25maWcuZGF0YSA9IHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeSh0cmFuc2Zvcm1lZENvbmZpZy5kYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtZWRDb25maWc7XG59XG5cbmNsYXNzIEFqYXhXb3JrZXJGYWN0b3J5IHtcblxuICAgIGRvKG1pc3Npb24pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIC8vIGF4aW9zU2NoZW1hOiBodHRwczovL2dpdGh1Yi5jb20vbXphYnJpc2tpZS9heGlvc1xuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybWVkQ29uZmlnID0gdHJhbnNmb3JtTWlzc2lvbkNvbmZpZyhtaXNzaW9uLmNvbmZpZyk7XG5cbiAgICAgICAgICAgIGF4aW9zLnJlcXVlc3QodHJhbnNmb3JtZWRDb25maWcpLnRoZW4oKHsgZGF0YSwgc3RhdHVzLCBzdGF0dXNUZXh0LCBoZWFkZXJzLCBjb25maWcsIHJlc3BvbnNlIH0pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGEpICE9PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBcInJlc3BvbnNlIGlzIG5vdCBhIGluc3RhbmNlIG9mIEpTT04gXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwicmVzcG9uc2Ugb2YgJyVzJyBpcyBub3QgSlNPTiBcIiwgY29uZmlnLnVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyc2VyRXJyb3IgPSBjcmVhdGVFcnJvcih7IG1lc3NhZ2U6IG1lc3NhZ2UsIHR5cGU6IEVSUk9SX1RZUEUuUEFSU0VSIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHBhcnNlckVycm9yKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcmVzbG92ZSBcbiAgICAgICAgICAgICAgICAvLyBbIWltcG9ydGFudF0g5paw5aKe55qEIChkYXRhLmNvZGUpIOmAu+i+keWIpOaWreaYr+S4uuS6huWFvOWuueacjeWKoeerr2FwaSBlcnJvcui/lOWbnue7k+aehOS6ieiurlxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmVycm9yIHx8IGRhdGEuY29kZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAyLiBiaXpFcnJvclxuICAgICAgICAgICAgICAgICAgICBsZXQgaHR0cFN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgIGxldCByYXdFcnJvciA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEuZXJyb3IgfHwgZGF0YSwgeyBodHRwU3RhdHVzQ29kZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1c2luZXNzRXJyb3IgPSBjcmVhdGVFcnJvcihyYXdFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChidXNpbmVzc0Vycm9yKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGF4aW9zLmlzQ2FuY2VsKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBhYm9ydCBlcnJvclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnUmVxdWVzdCBjYW5jZWxlZCcsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYWJvcnRFcnJvciA9IGNyZWF0ZUVycm9yKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSwgdHlwZTogRVJST1JfVFlQRS5BQk9SVCwgY29kZTogZXJyb3IuY29kZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGFib3J0RXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IuY29kZSA9PT0gJ0VDT05OQUJPUlRFRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGltZW91dCBlcnJvclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGltZW91dEVycm9yID0gY3JlYXRlRXJyb3IoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLCB0eXBlOiBFUlJPUl9UWVBFLlRJTUVPVVQsIGNvZGU6IGVycm9yLmNvZGUgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCh0aW1lb3V0RXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IucmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbmV0d29yayBlcnJvciBcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHJlcXVlc3Qgd2FzIG1hZGUsIGJ1dCB0aGUgc2VydmVyIHJlc3BvbmRlZCB3aXRoIGEgc3RhdHVzIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhhdCBmYWxscyBvdXQgb2YgdGhlIHJhbmdlIG9mIDJ4eFxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV0d29ya0Vycm9yO1xuICAgICAgICAgICAgICAgICAgICBsZXQgeyBzdGF0dXMsIHN0YXR1c1RleHQsIGhlYWRlcnMsIGNvbmZpZywgZGF0YSA9IHt9IH0gPSBlcnJvci5yZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHsgY29kZSwgbWVzc2FnZSB9ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlRGF0YUVycm9yID0gZGF0YS5lcnJvciB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBFUlJPUl9UWVBFLk5FVFdPUkssXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwU3RhdHVzQ29kZSA9IHN0YXR1cztcblxuICAgICAgICAgICAgICAgICAgICAvLyDlhbzlrrlkYXRhLmNvZGUg5ZKMIGRhdGEuZXJyb3Lov5nkuKTnp43moIflv5flvILluLjnmoTmlrnlvI/vvIwg5LyY5YWI6YCJ55SoY29kZVxuICAgICAgICAgICAgICAgICAgICBjb2RlID0gY29kZSB8fCByZXNwb25zZURhdGFFcnJvci5jb2RlO1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gbWVzc2FnZSB8fCByZXNwb25zZURhdGFFcnJvci5tZXNzYWdlIHx8IHN0YXR1c1RleHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgbmV0d29ya0Vycm9yID0gY3JlYXRlRXJyb3IoeyB0eXBlLCBodHRwU3RhdHVzQ29kZSwgY29kZSwgbWVzc2FnZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldHdvcmtFcnJvcik7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJ1bmtub3duIGF4aW9zIHJlcXVlc3QgZXJyb3I6IFwiLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0RXJyb3IgPSBjcmVhdGVFcnJvcih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsIHR5cGU6IEVSUk9SX1RZUEUuTkVUV09SSyB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3RFcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBamF4V29ya2VyRmFjdG9yeTsiXX0=