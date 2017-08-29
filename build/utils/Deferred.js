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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Deferred = function () {
    function Deferred() {
        (0, _classCallCheck3["default"])(this, Deferred);

        this.promise = new _promise2["default"](function (resolve, reject) {
            this._resolve = resolve;
            this._reject = reject;
        }.bind(this));
    }

    (0, _createClass3["default"])(Deferred, [{
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

exports["default"] = Deferred;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9EZWZlcnJlZC5qcyJdLCJuYW1lcyI6WyJEZWZlcnJlZCIsInByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiX3Jlc29sdmUiLCJfcmVqZWN0IiwiYmluZCIsInZhbHVlIiwiY2FsbCIsInJlYXNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTUEsUTtBQUVGLHdCQUFjO0FBQUE7O0FBQ1YsYUFBS0MsT0FBTCxHQUFlLHlCQUFZLFVBQVNDLE9BQVQsRUFBa0JDLE1BQWxCLEVBQTBCO0FBQ2pELGlCQUFLQyxRQUFMLEdBQWdCRixPQUFoQjtBQUNBLGlCQUFLRyxPQUFMLEdBQWVGLE1BQWY7QUFDSCxTQUgwQixDQUd6QkcsSUFIeUIsQ0FHcEIsSUFIb0IsQ0FBWixDQUFmO0FBSUg7Ozs7Z0NBRU9DLEssRUFBTztBQUNkLGlCQUFLSCxRQUFMLENBQWNJLElBQWQsQ0FBbUIsS0FBS1AsT0FBeEIsRUFBaUNNLEtBQWpDO0FBQ0E7OzsrQkFFTUUsTSxFQUFRO0FBQ2QsaUJBQUtKLE9BQUwsQ0FBYUcsSUFBYixDQUFrQixLQUFLUCxPQUF2QixFQUFnQ1EsTUFBaEM7QUFDQTs7Ozs7cUJBR1VULFEiLCJmaWxlIjoiRGVmZXJyZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBEZWZlcnJlZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHRoaXMuX3JlamVjdCA9IHJlamVjdDtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICByZXNvbHZlKHZhbHVlKSB7XG4gICAgXHR0aGlzLl9yZXNvbHZlLmNhbGwodGhpcy5wcm9taXNlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmVqZWN0KHJlYXNvbikge1xuICAgIFx0dGhpcy5fcmVqZWN0LmNhbGwodGhpcy5wcm9taXNlLCByZWFzb24pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVmZXJyZWQ7XG4iXX0=