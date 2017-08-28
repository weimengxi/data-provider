'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Super = require('./Super');

var _Super2 = _interopRequireDefault(_Super);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var HttpMission = function (_Mission) {
    (0, _inherits3['default'])(HttpMission, _Mission);

    function HttpMission(config) {
        (0, _classCallCheck3['default'])(this, HttpMission);
        return (0, _possibleConstructorReturn3['default'])(this, (HttpMission.__proto__ || (0, _getPrototypeOf2['default'])(HttpMission)).call(this, 'http', config));
    }

    return HttpMission;
}(_Super2['default']);

exports['default'] = HttpMission;
//# sourceMappingURL=Http.js.map