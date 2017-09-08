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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93b3JrZXJzL0FqYXguanMiXSwibmFtZXMiOlsiRVJST1JfVFlQRSIsIkpTT04iLCJ3aW5kb3ciLCJnbG9iYWwiLCJlcnJvclJlc3BvbnNlU3RydWN0IiwiaHR0cFN0YXR1c0NvZGUiLCJOYU4iLCJjb2RlIiwibWVzc2FnZSIsImlzT2JqZWN0IiwidmFsIiwidHJhbnNmb3JtTWlzc2lvbkNvbmZpZyIsImNvbmZpZyIsInBhcmFtU2VyaWFsaXplciIsInBhcmFtU2VyaWFsaXplckpRTGlrZUVuYWJsZWQiLCJ0cmFuc2Zvcm1lZENvbmZpZyIsIm1ldGhvZCIsImRhdGEiLCJBamF4V29ya2VyRmFjdG9yeSIsIm1pc3Npb24iLCJyZXNvbHZlIiwicmVqZWN0IiwicmVxdWVzdCIsInRoZW4iLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwiaGVhZGVycyIsInJlc3BvbnNlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwicGFyc2UiLCJlIiwiY29uc29sZSIsImVycm9yIiwidXJsIiwicGFyc2VyRXJyb3IiLCJ0eXBlIiwiUEFSU0VSIiwicmF3RXJyb3IiLCJidXNpbmVzc0Vycm9yIiwiaXNDYW5jZWwiLCJhYm9ydEVycm9yIiwiQUJPUlQiLCJ0aW1lb3V0RXJyb3IiLCJUSU1FT1VUIiwibmV0d29ya0Vycm9yIiwicmVzcG9uc2VEYXRhRXJyb3IiLCJORVRXT1JLIiwicmVxdWVzdEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRUE7Ozs7QUFFQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxtQkFBTUEsVUFBekI7O0FBRUEsSUFBTUMsT0FBTyxDQUFDLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0NDLE1BQWhDLEdBQXlDRCxNQUExQyxFQUFrREQsSUFBbEQsSUFBMEQsRUFBdkU7O0FBRUE7QUFDQSxJQUFNRyxzQkFBc0IsRUFBRUMsZ0JBQWdCQyxHQUFsQixFQUF1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QVA7QUFpRUg7Ozs7O3FCQUdVaEMsaUIiLCJmaWxlIjoiQWpheC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFBhcmFtU2VyaWFsaXplciB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5cbmltcG9ydCBDb25zdCBmcm9tICcuLi9jb25zdCc7XG5cbmltcG9ydCBjcmVhdGVFcnJvciBmcm9tICcuLi91dGlscy9DcmVhdGVFcnJvcic7XG5cbmNvbnN0IEVSUk9SX1RZUEUgPSBDb25zdC5FUlJPUl9UWVBFO1xuXG5jb25zdCBKU09OID0gKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93KS5KU09OIHx8IHt9O1xuXG4vLyDlvILluLjmlbDmja7nu5PmnoRcbmNvbnN0IGVycm9yUmVzcG9uc2VTdHJ1Y3QgPSB7IGh0dHBTdGF0dXNDb2RlOiBOYU4sIGNvZGU6IE5hTiwgbWVzc2FnZTogJycgfTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICogQHJlZmVyIGh0dHBzOi8vZ2l0aHViLmNvbS9temFicmlza2llL2F4aW9zL2Jsb2IvbWFzdGVyL2xpYi91dGlscy5qc1xuICovXG5jb25zdCBpc09iamVjdCA9IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICAgIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbmNvbnN0IHRyYW5zZm9ybU1pc3Npb25Db25maWcgPSBmdW5jdGlvbiB0cmFuc2Zvcm1NaXNzaW9uQ29uZmlnKGNvbmZpZykge1xuXG4gICAgY29uc3QgcGFyYW1TZXJpYWxpemVyID0gZ2V0UGFyYW1TZXJpYWxpemVyKGNvbmZpZy5wYXJhbVNlcmlhbGl6ZXJKUUxpa2VFbmFibGVkKTtcbiAgICBsZXQgdHJhbnNmb3JtZWRDb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBjb25maWcpXG5cbiAgICBpZiAoY29uZmlnLm1ldGhvZCA9PT0gJ3Bvc3QnICYmIGlzT2JqZWN0KHRyYW5zZm9ybWVkQ29uZmlnLmRhdGEpKSB7XG4gICAgICAgIHRyYW5zZm9ybWVkQ29uZmlnLmRhdGEgPSBwYXJhbVNlcmlhbGl6ZXIodHJhbnNmb3JtZWRDb25maWcuZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRyYW5zZm9ybWVkQ29uZmlnO1xufVxuXG5jbGFzcyBBamF4V29ya2VyRmFjdG9yeSB7XG5cbiAgICBkbyhtaXNzaW9uKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAvLyBheGlvc1NjaGVtYTogaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3NcbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZENvbmZpZyA9IHRyYW5zZm9ybU1pc3Npb25Db25maWcobWlzc2lvbi5jb25maWcpO1xuXG4gICAgICAgICAgICBheGlvcy5yZXF1ZXN0KHRyYW5zZm9ybWVkQ29uZmlnKS50aGVuKCh7IGRhdGEsIHN0YXR1cywgc3RhdHVzVGV4dCwgaGVhZGVycywgY29uZmlnLCByZXNwb25zZSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRhKSAhPT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gXCJyZXNwb25zZSBpcyBub3QgYSBpbnN0YW5jZSBvZiBKU09OIFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcInJlc3BvbnNlIG9mICclcycgaXMgbm90IEpTT04gXCIsIGNvbmZpZy51cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnNlckVycm9yID0gY3JlYXRlRXJyb3IoeyBtZXNzYWdlOiBtZXNzYWdlLCB0eXBlOiBFUlJPUl9UWVBFLlBBUlNFUiB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChwYXJzZXJFcnJvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJlc2xvdmUgXG4gICAgICAgICAgICAgICAgLy8gWyFpbXBvcnRhbnRdIOaWsOWinueahCAoZGF0YS5jb2RlKSDpgLvovpHliKTmlq3mmK/kuLrkuoblhbzlrrnmnI3liqHnq69hcGkgZXJyb3Lov5Tlm57nu5PmnoTkuonorq5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDIuIGJpekVycm9yXG4gICAgICAgICAgICAgICAgICAgIGxldCBodHRwU3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJhd0Vycm9yID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YS5lcnJvciB8fCBkYXRhLCB7IGh0dHBTdGF0dXNDb2RlIH0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYnVzaW5lc3NFcnJvciA9IGNyZWF0ZUVycm9yKHJhd0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGJ1c2luZXNzRXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYXhpb3MuaXNDYW5jZWwoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFib3J0IGVycm9yXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdSZXF1ZXN0IGNhbmNlbGVkJywgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhYm9ydEVycm9yID0gY3JlYXRlRXJyb3IoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLCB0eXBlOiBFUlJPUl9UWVBFLkFCT1JULCBjb2RlOiBlcnJvci5jb2RlIH0pO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoYWJvcnRFcnJvcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5jb2RlID09PSAnRUNPTk5BQk9SVEVEJykge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aW1lb3V0IGVycm9yXG4gICAgICAgICAgICAgICAgICAgIGxldCB0aW1lb3V0RXJyb3IgPSBjcmVhdGVFcnJvcih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsIHR5cGU6IEVSUk9SX1RZUEUuVElNRU9VVCwgY29kZTogZXJyb3IuY29kZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRpbWVvdXRFcnJvcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5yZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBuZXR3b3JrIGVycm9yIFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcmVxdWVzdCB3YXMgbWFkZSwgYnV0IHRoZSBzZXJ2ZXIgcmVzcG9uZGVkIHdpdGggYSBzdGF0dXMgY29kZVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGF0IGZhbGxzIG91dCBvZiB0aGUgcmFuZ2Ugb2YgMnh4XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXR3b3JrRXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7IHN0YXR1cywgc3RhdHVzVGV4dCwgaGVhZGVycywgY29uZmlnLCBkYXRhID0ge30gfSA9IGVycm9yLnJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgeyBjb2RlLCBtZXNzYWdlIH0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VEYXRhRXJyb3IgPSBkYXRhLmVycm9yIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IEVSUk9SX1RZUEUuTkVUV09SSyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBTdGF0dXNDb2RlID0gc3RhdHVzO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOWFvOWuuWRhdGEuY29kZSDlkowgZGF0YS5lcnJvcui/meS4pOenjeagh+W/l+W8guW4uOeahOaWueW8j++8jCDkvJjlhYjpgInnlKhjb2RlXG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPSBjb2RlIHx8IHJlc3BvbnNlRGF0YUVycm9yLmNvZGU7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlIHx8IHJlc3BvbnNlRGF0YUVycm9yLm1lc3NhZ2UgfHwgc3RhdHVzVGV4dDtcblxuICAgICAgICAgICAgICAgICAgICBuZXR3b3JrRXJyb3IgPSBjcmVhdGVFcnJvcih7IHR5cGUsIGh0dHBTdGF0dXNDb2RlLCBjb2RlLCBtZXNzYWdlIH0pO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV0d29ya0Vycm9yKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcInVua25vd24gYXhpb3MgcmVxdWVzdCBlcnJvcjogXCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlcXVlc3RFcnJvciA9IGNyZWF0ZUVycm9yKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSwgdHlwZTogRVJST1JfVFlQRS5ORVRXT1JLIH0pO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVxdWVzdEVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFqYXhXb3JrZXJGYWN0b3J5OyJdfQ==