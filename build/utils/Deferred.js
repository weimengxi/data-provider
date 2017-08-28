"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Deferred = function () {
    function Deferred() {
        (0, _classCallCheck3.default)(this, Deferred);

        this.promise = new _promise2.default(function (resolve, reject) {
            this._resolve = resolve;
            this._reject = reject;
        }.bind(this));
    }

    (0, _createClass3.default)(Deferred, [{
        key: "resolve",
        value: function resolve(value) {
            this._resolve.call(this.promise, value);
        }
    }, {
        key: "reject",
        value: function reject(reason) {
            this._reject.call(this.promise, reason);
        }
    }]);
    return Deferred;
}();

exports.default = Deferred;
//# sourceMappingURL=Deferred.js.map