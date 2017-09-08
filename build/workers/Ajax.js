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

var _utils = require('../utils');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _const = require('../const');

var _const2 = _interopRequireDefault(_const);

var _CreateError = require('../utils/CreateError');

var _CreateError2 = _interopRequireDefault(_CreateError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

    var paramSerializer = (0, _utils.getParamSerializer)(config.paramSerializerJQLikeEnabled);
    var transformedConfig = (0, _assign2['default'])({}, config);

    if (config.method === 'post' && isObject(transformedConfig.data)) {
        transformedConfig.data = paramSerializer(transformedConfig.data);
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
                    if (data.code) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93b3JrZXJzL0FqYXguanMiXSwibmFtZXMiOlsiRVJST1JfVFlQRSIsIkpTT04iLCJ3aW5kb3ciLCJnbG9iYWwiLCJlcnJvclJlc3BvbnNlU3RydWN0IiwiaHR0cFN0YXR1c0NvZGUiLCJOYU4iLCJjb2RlIiwibWVzc2FnZSIsImlzT2JqZWN0IiwidmFsIiwidHJhbnNmb3JtTWlzc2lvbkNvbmZpZyIsImNvbmZpZyIsInBhcmFtU2VyaWFsaXplciIsInBhcmFtU2VyaWFsaXplckpRTGlrZUVuYWJsZWQiLCJ0cmFuc2Zvcm1lZENvbmZpZyIsIm1ldGhvZCIsImRhdGEiLCJBamF4V29ya2VyRmFjdG9yeSIsIm1pc3Npb24iLCJyZXNvbHZlIiwicmVqZWN0IiwicmVxdWVzdCIsInRoZW4iLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwiaGVhZGVycyIsInJlc3BvbnNlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwicGFyc2UiLCJlIiwiY29uc29sZSIsImVycm9yIiwidXJsIiwicGFyc2VyRXJyb3IiLCJ0eXBlIiwiUEFSU0VSIiwicmF3RXJyb3IiLCJidXNpbmVzc0Vycm9yIiwiaXNDYW5jZWwiLCJhYm9ydEVycm9yIiwiQUJPUlQiLCJ0aW1lb3V0RXJyb3IiLCJUSU1FT1VUIiwibmV0d29ya0Vycm9yIiwicmVzcG9uc2VEYXRhRXJyb3IiLCJORVRXT1JLIiwicmVxdWVzdEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxtQkFBTUEsVUFBekI7O0FBRUEsSUFBTUMsT0FBTyxDQUFDLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0NDLE1BQWhDLEdBQXlDRCxNQUExQyxFQUFrREQsSUFBbEQsSUFBMEQsRUFBdkU7O0FBRUE7QUFDQSxJQUFNRyxzQkFBc0IsRUFBRUMsZ0JBQWdCQyxHQUFsQixFQUF1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QVA7QUFpRUg7Ozs7O3FCQUdVaEMsaUIiLCJmaWxlIjoiQWpheC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFBhcmFtU2VyaWFsaXplciB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5cbmltcG9ydCBDb25zdCBmcm9tICcuLi9jb25zdCc7XG5pbXBvcnQgY3JlYXRlRXJyb3IgZnJvbSAnLi4vdXRpbHMvQ3JlYXRlRXJyb3InO1xuXG5jb25zdCBFUlJPUl9UWVBFID0gQ29uc3QuRVJST1JfVFlQRTtcblxuY29uc3QgSlNPTiA9ICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdykuSlNPTiB8fCB7fTtcblxuLy8g5byC5bi45pWw5o2u57uT5p6EXG5jb25zdCBlcnJvclJlc3BvbnNlU3RydWN0ID0geyBodHRwU3RhdHVzQ29kZTogTmFOLCBjb2RlOiBOYU4sIG1lc3NhZ2U6ICcnIH07XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqIEByZWZlciBodHRwczovL2dpdGh1Yi5jb20vbXphYnJpc2tpZS9heGlvcy9ibG9iL21hc3Rlci9saWIvdXRpbHMuanNcbiAqL1xuY29uc3QgaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG5jb25zdCB0cmFuc2Zvcm1NaXNzaW9uQ29uZmlnID0gZnVuY3Rpb24gdHJhbnNmb3JtTWlzc2lvbkNvbmZpZyhjb25maWcpIHtcblxuICAgIGNvbnN0IHBhcmFtU2VyaWFsaXplciA9IGdldFBhcmFtU2VyaWFsaXplcihjb25maWcucGFyYW1TZXJpYWxpemVySlFMaWtlRW5hYmxlZCk7XG4gICAgbGV0IHRyYW5zZm9ybWVkQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnKVxuXG4gICAgaWYgKGNvbmZpZy5tZXRob2QgPT09ICdwb3N0JyAmJiBpc09iamVjdCh0cmFuc2Zvcm1lZENvbmZpZy5kYXRhKSkge1xuICAgICAgICB0cmFuc2Zvcm1lZENvbmZpZy5kYXRhID0gcGFyYW1TZXJpYWxpemVyKHRyYW5zZm9ybWVkQ29uZmlnLmRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB0cmFuc2Zvcm1lZENvbmZpZztcbn1cblxuY2xhc3MgQWpheFdvcmtlckZhY3Rvcnkge1xuXG4gICAgZG8obWlzc2lvbikge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgLy8gYXhpb3NTY2hlbWE6IGh0dHBzOi8vZ2l0aHViLmNvbS9temFicmlza2llL2F4aW9zXG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtZWRDb25maWcgPSB0cmFuc2Zvcm1NaXNzaW9uQ29uZmlnKG1pc3Npb24uY29uZmlnKTtcblxuICAgICAgICAgICAgYXhpb3MucmVxdWVzdCh0cmFuc2Zvcm1lZENvbmZpZykudGhlbigoeyBkYXRhLCBzdGF0dXMsIHN0YXR1c1RleHQsIGhlYWRlcnMsIGNvbmZpZywgcmVzcG9uc2UgfSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgIT09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IFwicmVzcG9uc2UgaXMgbm90IGEgaW5zdGFuY2Ugb2YgSlNPTiBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZXNwb25zZSBvZiAnJXMnIGlzIG5vdCBKU09OIFwiLCBjb25maWcudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJzZXJFcnJvciA9IGNyZWF0ZUVycm9yKHsgbWVzc2FnZTogbWVzc2FnZSwgdHlwZTogRVJST1JfVFlQRS5QQVJTRVIgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocGFyc2VyRXJyb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyByZXNsb3ZlIFxuICAgICAgICAgICAgICAgIC8vIFshaW1wb3J0YW50XSDmlrDlop7nmoQgKGRhdGEuY29kZSkg6YC76L6R5Yik5pat5piv5Li65LqG5YW85a655pyN5Yqh56uvYXBpIGVycm9y6L+U5Zue57uT5p6E5LqJ6K6uXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuY29kZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAyLiBiaXpFcnJvclxuICAgICAgICAgICAgICAgICAgICBsZXQgaHR0cFN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgIGxldCByYXdFcnJvciA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEuZXJyb3IgfHwgZGF0YSwgeyBodHRwU3RhdHVzQ29kZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1c2luZXNzRXJyb3IgPSBjcmVhdGVFcnJvcihyYXdFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChidXNpbmVzc0Vycm9yKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGF4aW9zLmlzQ2FuY2VsKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBhYm9ydCBlcnJvclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnUmVxdWVzdCBjYW5jZWxlZCcsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYWJvcnRFcnJvciA9IGNyZWF0ZUVycm9yKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSwgdHlwZTogRVJST1JfVFlQRS5BQk9SVCwgY29kZTogZXJyb3IuY29kZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGFib3J0RXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IuY29kZSA9PT0gJ0VDT05OQUJPUlRFRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGltZW91dCBlcnJvclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGltZW91dEVycm9yID0gY3JlYXRlRXJyb3IoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLCB0eXBlOiBFUlJPUl9UWVBFLlRJTUVPVVQsIGNvZGU6IGVycm9yLmNvZGUgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCh0aW1lb3V0RXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IucmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbmV0d29yayBlcnJvciBcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHJlcXVlc3Qgd2FzIG1hZGUsIGJ1dCB0aGUgc2VydmVyIHJlc3BvbmRlZCB3aXRoIGEgc3RhdHVzIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhhdCBmYWxscyBvdXQgb2YgdGhlIHJhbmdlIG9mIDJ4eFxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV0d29ya0Vycm9yO1xuICAgICAgICAgICAgICAgICAgICBsZXQgeyBzdGF0dXMsIHN0YXR1c1RleHQsIGhlYWRlcnMsIGNvbmZpZywgZGF0YSA9IHt9IH0gPSBlcnJvci5yZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHsgY29kZSwgbWVzc2FnZSB9ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlRGF0YUVycm9yID0gZGF0YS5lcnJvciB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBFUlJPUl9UWVBFLk5FVFdPUkssXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwU3RhdHVzQ29kZSA9IHN0YXR1cztcblxuICAgICAgICAgICAgICAgICAgICAvLyDlhbzlrrlkYXRhLmNvZGUg5ZKMIGRhdGEuZXJyb3Lov5nkuKTnp43moIflv5flvILluLjnmoTmlrnlvI/vvIwg5LyY5YWI6YCJ55SoY29kZVxuICAgICAgICAgICAgICAgICAgICBjb2RlID0gY29kZSB8fCByZXNwb25zZURhdGFFcnJvci5jb2RlO1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gbWVzc2FnZSB8fCByZXNwb25zZURhdGFFcnJvci5tZXNzYWdlIHx8IHN0YXR1c1RleHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgbmV0d29ya0Vycm9yID0gY3JlYXRlRXJyb3IoeyB0eXBlLCBodHRwU3RhdHVzQ29kZSwgY29kZSwgbWVzc2FnZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldHdvcmtFcnJvcik7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJ1bmtub3duIGF4aW9zIHJlcXVlc3QgZXJyb3I6IFwiLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0RXJyb3IgPSBjcmVhdGVFcnJvcih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsIHR5cGU6IEVSUk9SX1RZUEUuTkVUV09SSyB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3RFcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBamF4V29ya2VyRmFjdG9yeTsiXX0=