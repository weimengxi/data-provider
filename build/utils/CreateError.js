'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports['default'] = createError;

var _const = require('../const');

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ERROR_TYPE = _const2['default'].ERROR_TYPE;

var DEFAULT_ERROR_MSG = 'undefined message';
var DEFAULT_ERROR_TYPE = ERROR_TYPE.BUSINESS;

/* 说明 */
function createError(_ref) {
    var code = _ref.code,
        _ref$message = _ref.message,
        message = _ref$message === undefined ? DEFAULT_ERROR_MSG : _ref$message,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? ERROR_TYPE.BUSINESS : _ref$type,
        args = (0, _objectWithoutProperties3['default'])(_ref, ['code', 'message', 'type']);

    // need a real Error 
    var error = new Error(message);
    error.type = type;
    error.code = code;
    (0, _assign2['default'])(error, args);
    return error;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9DcmVhdGVFcnJvci5qcyJdLCJuYW1lcyI6WyJjcmVhdGVFcnJvciIsIkVSUk9SX1RZUEUiLCJERUZBVUxUX0VSUk9SX01TRyIsIkRFRkFVTFRfRVJST1JfVFlQRSIsIkJVU0lORVNTIiwiY29kZSIsIm1lc3NhZ2UiLCJ0eXBlIiwiYXJncyIsImVycm9yIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3FCQVF3QkEsVzs7QUFSeEI7Ozs7OztBQUVBLElBQUlDLGFBQWEsbUJBQU1BLFVBQXZCOztBQUVBLElBQU1DLG9CQUFvQixtQkFBMUI7QUFDQSxJQUFNQyxxQkFBcUJGLFdBQVdHLFFBQXRDOztBQUVBO0FBQ2UsU0FBU0osV0FBVCxPQUFpRztBQUFBLFFBQTFFSyxJQUEwRSxRQUExRUEsSUFBMEU7QUFBQSw0QkFBcEVDLE9BQW9FO0FBQUEsUUFBcEVBLE9BQW9FLGdDQUExREosaUJBQTBEO0FBQUEseUJBQXZDSyxJQUF1QztBQUFBLFFBQXZDQSxJQUF1Qyw2QkFBaENOLFdBQVdHLFFBQXFCO0FBQUEsUUFBUkksSUFBUTs7QUFDNUc7QUFDQSxRQUFJQyxRQUFRLElBQUlDLEtBQUosQ0FBVUosT0FBVixDQUFaO0FBQ0FHLFVBQU1GLElBQU4sR0FBYUEsSUFBYjtBQUNBRSxVQUFNSixJQUFOLEdBQWFBLElBQWI7QUFDQSw2QkFBY0ksS0FBZCxFQUFxQkQsSUFBckI7QUFDQSxXQUFPQyxLQUFQO0FBQ0giLCJmaWxlIjoiQ3JlYXRlRXJyb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29uc3QgZnJvbSAnLi4vY29uc3QnO1xuXG52YXIgRVJST1JfVFlQRSA9IENvbnN0LkVSUk9SX1RZUEU7XG5cbmNvbnN0IERFRkFVTFRfRVJST1JfTVNHID0gJ3VuZGVmaW5lZCBtZXNzYWdlJztcbmNvbnN0IERFRkFVTFRfRVJST1JfVFlQRSA9IEVSUk9SX1RZUEUuQlVTSU5FU1M7XG5cbi8qIOivtOaYjiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlRXJyb3IoeyBjb2RlLCBtZXNzYWdlID0gREVGQVVMVF9FUlJPUl9NU0csIHR5cGUgPSBFUlJPUl9UWVBFLkJVU0lORVNTLCAuLi5hcmdzIH0pIHtcbiAgICAvLyBuZWVkIGEgcmVhbCBFcnJvciBcbiAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgZXJyb3IudHlwZSA9IHR5cGU7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gICAgT2JqZWN0LmFzc2lnbihlcnJvciwgYXJncyk7XG4gICAgcmV0dXJuIGVycm9yO1xufVxuIl19