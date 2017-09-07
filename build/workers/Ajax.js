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

require('./Fetch');

var _CreateError = require('../utils/CreateError');

var _CreateError2 = _interopRequireDefault(_CreateError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// import 'axios-response-logger';

console.log('watching .... ');


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93b3JrZXJzL0FqYXguanMiXSwibmFtZXMiOlsiY29uc29sZSIsImxvZyIsIkVSUk9SX1RZUEUiLCJKU09OIiwid2luZG93IiwiZ2xvYmFsIiwiZXJyb3JSZXNwb25zZVN0cnVjdCIsImh0dHBTdGF0dXNDb2RlIiwiTmFOIiwiY29kZSIsIm1lc3NhZ2UiLCJpc09iamVjdCIsInZhbCIsInRyYW5zZm9ybU1pc3Npb25Db25maWciLCJjb25maWciLCJ0cmFuc2Zvcm1lZENvbmZpZyIsIm1ldGhvZCIsImRhdGEiLCJzdHJpbmdpZnkiLCJBamF4V29ya2VyRmFjdG9yeSIsIm1pc3Npb24iLCJyZXNvbHZlIiwicmVqZWN0IiwicmVxdWVzdCIsInRoZW4iLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwiaGVhZGVycyIsInJlc3BvbnNlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwicGFyc2UiLCJlIiwiZXJyb3IiLCJ1cmwiLCJwYXJzZXJFcnJvciIsInR5cGUiLCJQQVJTRVIiLCJyYXdFcnJvciIsImJ1c2luZXNzRXJyb3IiLCJpc0NhbmNlbCIsImFib3J0RXJyb3IiLCJBQk9SVCIsInRpbWVvdXRFcnJvciIsIlRJTUVPVVQiLCJuZXR3b3JrRXJyb3IiLCJyZXNwb25zZURhdGFFcnJvciIsIk5FVFdPUksiLCJyZXF1ZXN0RXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUdBOzs7O0FBRUE7O0FBRUE7Ozs7OztBQU5BOztBQUtBQSxRQUFRQyxHQUFSLENBQVksZ0JBQVo7OztBQUdBLElBQU1DLGFBQWEsbUJBQU1BLFVBQXpCOztBQUVBLElBQU1DLE9BQU8sQ0FBQyxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDQyxNQUFoQyxHQUF5Q0QsTUFBMUMsRUFBa0RELElBQWxELElBQTBELEVBQXZFOztBQUVBO0FBQ0EsSUFBTUcsc0JBQXNCLEVBQUVDLGdCQUFn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O0FBaUVIOzs7OztxQkFHVS9CLGlCIiwiZmlsZSI6IkFqYXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcXVlcnlzdHJpbmcgZnJvbSAncXVlcnlzdHJpbmcnO1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbi8vIGltcG9ydCAnYXhpb3MtcmVzcG9uc2UtbG9nZ2VyJztcblxuaW1wb3J0IENvbnN0IGZyb20gJy4uL2NvbnN0JztcblxuaW1wb3J0ICcuL0ZldGNoJztcbmNvbnNvbGUubG9nKCd3YXRjaGluZyAuLi4uICcpO1xuaW1wb3J0IGNyZWF0ZUVycm9yIGZyb20gJy4uL3V0aWxzL0NyZWF0ZUVycm9yJztcblxuY29uc3QgRVJST1JfVFlQRSA9IENvbnN0LkVSUk9SX1RZUEU7XG5cbmNvbnN0IEpTT04gPSAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB3aW5kb3cpLkpTT04gfHwge307XG5cbi8vIOW8guW4uOaVsOaNrue7k+aehFxuY29uc3QgZXJyb3JSZXNwb25zZVN0cnVjdCA9IHsgaHR0cFN0YXR1c0NvZGU6IE5hTiwgY29kZTogTmFOLCBtZXNzYWdlOiAnJyB9O1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKiBAcmVmZXIgaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3MvYmxvYi9tYXN0ZXIvbGliL3V0aWxzLmpzXG4gKi9cbmNvbnN0IGlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gICAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuY29uc3QgdHJhbnNmb3JtTWlzc2lvbkNvbmZpZyA9IGZ1bmN0aW9uIHRyYW5zZm9ybU1pc3Npb25Db25maWcoY29uZmlnKSB7XG5cbiAgICBsZXQgdHJhbnNmb3JtZWRDb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBjb25maWcpXG5cbiAgICBpZiAoY29uZmlnLm1ldGhvZCA9PT0gJ3Bvc3QnICYmIGlzT2JqZWN0KHRyYW5zZm9ybWVkQ29uZmlnLmRhdGEpKSB7XG4gICAgICAgIHRyYW5zZm9ybWVkQ29uZmlnLmRhdGEgPSBxdWVyeXN0cmluZy5zdHJpbmdpZnkodHJhbnNmb3JtZWRDb25maWcuZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRyYW5zZm9ybWVkQ29uZmlnO1xufVxuXG5jbGFzcyBBamF4V29ya2VyRmFjdG9yeSB7XG5cbiAgICBkbyhtaXNzaW9uKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAvLyBheGlvc1NjaGVtYTogaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3NcbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZENvbmZpZyA9IHRyYW5zZm9ybU1pc3Npb25Db25maWcobWlzc2lvbi5jb25maWcpO1xuXG4gICAgICAgICAgICBheGlvcy5yZXF1ZXN0KHRyYW5zZm9ybWVkQ29uZmlnKS50aGVuKCh7IGRhdGEsIHN0YXR1cywgc3RhdHVzVGV4dCwgaGVhZGVycywgY29uZmlnLCByZXNwb25zZSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRhKSAhPT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gXCJyZXNwb25zZSBpcyBub3QgYSBpbnN0YW5jZSBvZiBKU09OIFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcInJlc3BvbnNlIG9mICclcycgaXMgbm90IEpTT04gXCIsIGNvbmZpZy51cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnNlckVycm9yID0gY3JlYXRlRXJyb3IoeyBtZXNzYWdlOiBtZXNzYWdlLCB0eXBlOiBFUlJPUl9UWVBFLlBBUlNFUiB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChwYXJzZXJFcnJvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJlc2xvdmUgXG4gICAgICAgICAgICAgICAgLy8gWyFpbXBvcnRhbnRdIOaWsOWinueahCAoZGF0YS5jb2RlKSDpgLvovpHliKTmlq3mmK/kuLrkuoblhbzlrrnmnI3liqHnq69hcGkgZXJyb3Lov5Tlm57nu5PmnoTkuonorq5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5lcnJvciB8fCBkYXRhLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gMi4gYml6RXJyb3JcbiAgICAgICAgICAgICAgICAgICAgbGV0IGh0dHBTdGF0dXNDb2RlID0gc3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmF3RXJyb3IgPSBPYmplY3QuYXNzaWduKHt9LCBkYXRhLmVycm9yIHx8IGRhdGEsIHsgaHR0cFN0YXR1c0NvZGUgfSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBidXNpbmVzc0Vycm9yID0gY3JlYXRlRXJyb3IocmF3RXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoYnVzaW5lc3NFcnJvcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChheGlvcy5pc0NhbmNlbChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWJvcnQgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1JlcXVlc3QgY2FuY2VsZWQnLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFib3J0RXJyb3IgPSBjcmVhdGVFcnJvcih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsIHR5cGU6IEVSUk9SX1RZUEUuQUJPUlQsIGNvZGU6IGVycm9yLmNvZGUgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChhYm9ydEVycm9yKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLmNvZGUgPT09ICdFQ09OTkFCT1JURUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRpbWVvdXQgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRpbWVvdXRFcnJvciA9IGNyZWF0ZUVycm9yKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSwgdHlwZTogRVJST1JfVFlQRS5USU1FT1VULCBjb2RlOiBlcnJvci5jb2RlIH0pO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QodGltZW91dEVycm9yKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5ldHdvcmsgZXJyb3IgXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSByZXF1ZXN0IHdhcyBtYWRlLCBidXQgdGhlIHNlcnZlciByZXNwb25kZWQgd2l0aCBhIHN0YXR1cyBjb2RlXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoYXQgZmFsbHMgb3V0IG9mIHRoZSByYW5nZSBvZiAyeHhcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ldHdvcmtFcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHsgc3RhdHVzLCBzdGF0dXNUZXh0LCBoZWFkZXJzLCBjb25maWcsIGRhdGEgPSB7fSB9ID0gZXJyb3IucmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7IGNvZGUsIG1lc3NhZ2UgfSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZURhdGFFcnJvciA9IGRhdGEuZXJyb3IgfHwge307XG4gICAgICAgICAgICAgICAgICAgIGxldCB0eXBlID0gRVJST1JfVFlQRS5ORVRXT1JLLFxuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cFN0YXR1c0NvZGUgPSBzdGF0dXM7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5YW85a65ZGF0YS5jb2RlIOWSjCBkYXRhLmVycm9y6L+Z5Lik56eN5qCH5b+X5byC5bi455qE5pa55byP77yMIOS8mOWFiOmAieeUqGNvZGVcbiAgICAgICAgICAgICAgICAgICAgY29kZSA9IGNvZGUgfHwgcmVzcG9uc2VEYXRhRXJyb3IuY29kZTtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgcmVzcG9uc2VEYXRhRXJyb3IubWVzc2FnZSB8fCBzdGF0dXNUZXh0O1xuXG4gICAgICAgICAgICAgICAgICAgIG5ldHdvcmtFcnJvciA9IGNyZWF0ZUVycm9yKHsgdHlwZSwgaHR0cFN0YXR1c0NvZGUsIGNvZGUsIG1lc3NhZ2UgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXR3b3JrRXJyb3IpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwidW5rbm93biBheGlvcyByZXF1ZXN0IGVycm9yOiBcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdEVycm9yID0gY3JlYXRlRXJyb3IoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLCB0eXBlOiBFUlJPUl9UWVBFLk5FVFdPUksgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0RXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWpheFdvcmtlckZhY3Rvcnk7Il19