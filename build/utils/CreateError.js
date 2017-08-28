'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = createError;

var _const = require('../const');

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ERROR_TYPE = _const2.default.ERROR_TYPE;

var DEFAULT_ERROR_MSG = 'undefined message';
var DEFAULT_ERROR_TYPE = ERROR_TYPE.BUSINESS;

/* 说明 */
function createError(_ref) {
    var traceid = _ref.traceid,
        code = _ref.code,
        _ref$message = _ref.message,
        message = _ref$message === undefined ? DEFAULT_ERROR_MSG : _ref$message,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? ERROR_TYPE.BUSINESS : _ref$type,
        args = (0, _objectWithoutProperties3.default)(_ref, ['traceid', 'code', 'message', 'type']);

    // need a real Error 
    var error = new Error(message);
    error.type = type;
    error.code = code;
    error.traceid = traceid;
    (0, _assign2.default)(error, args);
    return error;
}
//# sourceMappingURL=CreateError.js.map