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

var _querystringEs = require('querystring-es3');

var _querystringEs2 = _interopRequireDefault(_querystringEs);

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
        transformedConfig.data = _querystringEs2['default'].stringify(transformedConfig.data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93b3JrZXJzL0FqYXguanMiXSwibmFtZXMiOlsiRVJST1JfVFlQRSIsIkpTT04iLCJ3aW5kb3ciLCJnbG9iYWwiLCJlcnJvclJlc3BvbnNlU3RydWN0IiwiaHR0cFN0YXR1c0NvZGUiLCJOYU4iLCJjb2RlIiwibWVzc2FnZSIsImlzT2JqZWN0IiwidmFsIiwidHJhbnNmb3JtTWlzc2lvbkNvbmZpZyIsImNvbmZpZyIsInRyYW5zZm9ybWVkQ29uZmlnIiwibWV0aG9kIiwiZGF0YSIsInN0cmluZ2lmeSIsIkFqYXhXb3JrZXJGYWN0b3J5IiwibWlzc2lvbiIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0IiwidGhlbiIsInN0YXR1cyIsInN0YXR1c1RleHQiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJwYXJzZSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJ1cmwiLCJwYXJzZXJFcnJvciIsInR5cGUiLCJQQVJTRVIiLCJyYXdFcnJvciIsImJ1c2luZXNzRXJyb3IiLCJpc0NhbmNlbCIsImFib3J0RXJyb3IiLCJBQk9SVCIsInRpbWVvdXRFcnJvciIsIlRJTUVPVVQiLCJuZXR3b3JrRXJyb3IiLCJyZXNwb25zZURhdGFFcnJvciIsIk5FVFdPUksiLCJyZXF1ZXN0RXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7OztBQUhBOztBQUtBLElBQU1BLGFBQWEsbUJBQU1BLFVBQXpCOztBQUVBLElBQU1DLE9BQU8sQ0FBQyxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDQyxNQUFoQyxHQUF5Q0QsTUFBMUMsRUFBa0RELElBQWxELElBQTBELEVBQXZFOztBQUVBO0FBQ0EsSUFBTUcsc0JBQXNCLEVBQUVDLGdCQUFnQkMsR0FBbEIsRUFBdUJDLE1BQU1ELEdBQTdCLEVBQWtDRSxTQUFTLEVB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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCBxdWVyeXN0cmluZyBmcm9tICdxdWVyeXN0cmluZy1lczMnO1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbi8vIGltcG9ydCAnYXhpb3MtcmVzcG9uc2UtbG9nZ2VyJztcblxuaW1wb3J0IENvbnN0IGZyb20gJy4uL2NvbnN0JztcbmltcG9ydCBjcmVhdGVFcnJvciBmcm9tICcuLi91dGlscy9DcmVhdGVFcnJvcic7XG5cbmNvbnN0IEVSUk9SX1RZUEUgPSBDb25zdC5FUlJPUl9UWVBFO1xuXG5jb25zdCBKU09OID0gKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93KS5KU09OIHx8IHt9O1xuXG4vLyDlvILluLjmlbDmja7nu5PmnoRcbmNvbnN0IGVycm9yUmVzcG9uc2VTdHJ1Y3QgPSB7IGh0dHBTdGF0dXNDb2RlOiBOYU4sIGNvZGU6IE5hTiwgbWVzc2FnZTogJycgfTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICogQHJlZmVyIGh0dHBzOi8vZ2l0aHViLmNvbS9temFicmlza2llL2F4aW9zL2Jsb2IvbWFzdGVyL2xpYi91dGlscy5qc1xuICovXG5jb25zdCBpc09iamVjdCA9IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICAgIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbmNvbnN0IHRyYW5zZm9ybU1pc3Npb25Db25maWcgPSBmdW5jdGlvbiB0cmFuc2Zvcm1NaXNzaW9uQ29uZmlnKGNvbmZpZykge1xuXG4gICAgbGV0IHRyYW5zZm9ybWVkQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnKVxuXG4gICAgaWYgKGNvbmZpZy5tZXRob2QgPT09ICdwb3N0JyAmJiBpc09iamVjdCh0cmFuc2Zvcm1lZENvbmZpZy5kYXRhKSkge1xuICAgICAgICB0cmFuc2Zvcm1lZENvbmZpZy5kYXRhID0gcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHRyYW5zZm9ybWVkQ29uZmlnLmRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB0cmFuc2Zvcm1lZENvbmZpZztcbn1cblxuY2xhc3MgQWpheFdvcmtlckZhY3Rvcnkge1xuXG4gICAgZG8obWlzc2lvbikge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgLy8gYXhpb3NTY2hlbWE6IGh0dHBzOi8vZ2l0aHViLmNvbS9temFicmlza2llL2F4aW9zXG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtZWRDb25maWcgPSB0cmFuc2Zvcm1NaXNzaW9uQ29uZmlnKG1pc3Npb24uY29uZmlnKTtcblxuICAgICAgICAgICAgYXhpb3MucmVxdWVzdCh0cmFuc2Zvcm1lZENvbmZpZykudGhlbigoeyBkYXRhLCBzdGF0dXMsIHN0YXR1c1RleHQsIGhlYWRlcnMsIGNvbmZpZywgcmVzcG9uc2UgfSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgIT09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IFwicmVzcG9uc2UgaXMgbm90IGEgaW5zdGFuY2Ugb2YgSlNPTiBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZXNwb25zZSBvZiAnJXMnIGlzIG5vdCBKU09OIFwiLCBjb25maWcudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJzZXJFcnJvciA9IGNyZWF0ZUVycm9yKHsgbWVzc2FnZTogbWVzc2FnZSwgdHlwZTogRVJST1JfVFlQRS5QQVJTRVIgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocGFyc2VyRXJyb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyByZXNsb3ZlIFxuICAgICAgICAgICAgICAgIC8vIFshaW1wb3J0YW50XSDmlrDlop7nmoQgKGRhdGEuY29kZSkg6YC76L6R5Yik5pat5piv5Li65LqG5YW85a655pyN5Yqh56uvYXBpIGVycm9y6L+U5Zue57uT5p6E5LqJ6K6uXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuZXJyb3IgfHwgZGF0YS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDIuIGJpekVycm9yXG4gICAgICAgICAgICAgICAgICAgIGxldCBodHRwU3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJhd0Vycm9yID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YS5lcnJvciB8fCBkYXRhLCB7IGh0dHBTdGF0dXNDb2RlIH0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYnVzaW5lc3NFcnJvciA9IGNyZWF0ZUVycm9yKHJhd0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGJ1c2luZXNzRXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYXhpb3MuaXNDYW5jZWwoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFib3J0IGVycm9yXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdSZXF1ZXN0IGNhbmNlbGVkJywgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhYm9ydEVycm9yID0gY3JlYXRlRXJyb3IoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLCB0eXBlOiBFUlJPUl9UWVBFLkFCT1JULCBjb2RlOiBlcnJvci5jb2RlIH0pO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoYWJvcnRFcnJvcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5jb2RlID09PSAnRUNPTk5BQk9SVEVEJykge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aW1lb3V0IGVycm9yXG4gICAgICAgICAgICAgICAgICAgIGxldCB0aW1lb3V0RXJyb3IgPSBjcmVhdGVFcnJvcih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsIHR5cGU6IEVSUk9SX1RZUEUuVElNRU9VVCwgY29kZTogZXJyb3IuY29kZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRpbWVvdXRFcnJvcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5yZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBuZXR3b3JrIGVycm9yIFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcmVxdWVzdCB3YXMgbWFkZSwgYnV0IHRoZSBzZXJ2ZXIgcmVzcG9uZGVkIHdpdGggYSBzdGF0dXMgY29kZVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGF0IGZhbGxzIG91dCBvZiB0aGUgcmFuZ2Ugb2YgMnh4XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXR3b3JrRXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7IHN0YXR1cywgc3RhdHVzVGV4dCwgaGVhZGVycywgY29uZmlnLCBkYXRhID0ge30gfSA9IGVycm9yLnJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgeyBjb2RlLCBtZXNzYWdlIH0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VEYXRhRXJyb3IgPSBkYXRhLmVycm9yIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IEVSUk9SX1RZUEUuTkVUV09SSyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBTdGF0dXNDb2RlID0gc3RhdHVzO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOWFvOWuuWRhdGEuY29kZSDlkowgZGF0YS5lcnJvcui/meS4pOenjeagh+W/l+W8guW4uOeahOaWueW8j++8jCDkvJjlhYjpgInnlKhjb2RlXG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPSBjb2RlIHx8IHJlc3BvbnNlRGF0YUVycm9yLmNvZGU7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlIHx8IHJlc3BvbnNlRGF0YUVycm9yLm1lc3NhZ2UgfHwgc3RhdHVzVGV4dDtcblxuICAgICAgICAgICAgICAgICAgICBuZXR3b3JrRXJyb3IgPSBjcmVhdGVFcnJvcih7IHR5cGUsIGh0dHBTdGF0dXNDb2RlLCBjb2RlLCBtZXNzYWdlIH0pO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV0d29ya0Vycm9yKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcInVua25vd24gYXhpb3MgcmVxdWVzdCBlcnJvcjogXCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlcXVlc3RFcnJvciA9IGNyZWF0ZUVycm9yKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSwgdHlwZTogRVJST1JfVFlQRS5ORVRXT1JLIH0pO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdEVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFqYXhXb3JrZXJGYWN0b3J5OyJdfQ==