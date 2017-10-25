(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports", "babel-runtime/core-js/promise", "babel-runtime/helpers/classCallCheck"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require("babel-runtime/core-js/promise"), require("babel-runtime/helpers/classCallCheck"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.promise, global.classCallCheck);
    global.Deferred = mod.exports;
  }
})(this, function (module, exports, _promise, _classCallCheck2) {
  "use strict";

  exports.__esModule = true;

  var _promise2 = _interopRequireDefault(_promise);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Deferred = function () {
    function Deferred() {
      (0, _classCallCheck3["default"])(this, Deferred);

      this.promise = new _promise2["default"](function (resolve, reject) {
        this._resolve = resolve;
        this._reject = reject;
      }.bind(this));
    }

    Deferred.prototype.resolve = function resolve(value) {
      this._resolve.call(this.promise, value);
    };

    Deferred.prototype.reject = function reject(reason) {
      this._reject.call(this.promise, reason);
    };

    return Deferred;
  }();

  exports["default"] = Deferred;
  module.exports = exports["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9EZWZlcnJlZC5qcyJdLCJuYW1lcyI6WyJEZWZlcnJlZCIsInByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiX3Jlc29sdmUiLCJfcmVqZWN0IiwiYmluZCIsInZhbHVlIiwiY2FsbCIsInJlYXNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BQU1BLFE7QUFDSix3QkFBYztBQUFBOztBQUNaLFdBQUtDLE9BQUwsR0FBZSx5QkFDYixVQUFTQyxPQUFULEVBQWtCQyxNQUFsQixFQUF5QjtBQUN2QixhQUFLQyxRQUFMLEdBQWdCRixPQUFoQjtBQUNBLGFBQUtHLE9BQUwsR0FBZUYsTUFBZjtBQUNELE9BSEQsQ0FHRUcsSUFIRixDQUdPLElBSFAsQ0FEYSxDQUFmO0FBTUQ7O3VCQUVESixPLG9CQUFRSyxLLEVBQU87QUFDYixXQUFLSCxRQUFMLENBQWNJLElBQWQsQ0FBbUIsS0FBS1AsT0FBeEIsRUFBaUNNLEtBQWpDO0FBQ0QsSzs7dUJBRURKLE0sbUJBQU9NLE0sRUFBUTtBQUNiLFdBQUtKLE9BQUwsQ0FBYUcsSUFBYixDQUFrQixLQUFLUCxPQUF2QixFQUFnQ1EsTUFBaEM7QUFDRCxLOzs7Ozt1QkFHWVQsUSIsImZpbGUiOiJEZWZlcnJlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIERlZmVycmVkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoXG4gICAgICBmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgICB0aGlzLl9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgdGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIHJlc29sdmUodmFsdWUpIHtcbiAgICB0aGlzLl9yZXNvbHZlLmNhbGwodGhpcy5wcm9taXNlLCB2YWx1ZSk7XG4gIH1cblxuICByZWplY3QocmVhc29uKSB7XG4gICAgdGhpcy5fcmVqZWN0LmNhbGwodGhpcy5wcm9taXNlLCByZWFzb24pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlZmVycmVkO1xuIl19