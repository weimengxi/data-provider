(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports", "babel-runtime/helpers/classCallCheck", "babel-runtime/helpers/possibleConstructorReturn", "babel-runtime/helpers/inherits", "./Super"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require("babel-runtime/helpers/classCallCheck"), require("babel-runtime/helpers/possibleConstructorReturn"), require("babel-runtime/helpers/inherits"), require("./Super"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.classCallCheck, global.possibleConstructorReturn, global.inherits, global.Super);
    global.Http = mod.exports;
  }
})(this, function (module, exports, _classCallCheck2, _possibleConstructorReturn2, _inherits2, _Super) {
  "use strict";

  exports.__esModule = true;

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

  var _inherits3 = _interopRequireDefault(_inherits2);

  var _Super2 = _interopRequireDefault(_Super);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var HttpMission = function (_Mission) {
    (0, _inherits3["default"])(HttpMission, _Mission);

    function HttpMission(config) {
      (0, _classCallCheck3["default"])(this, HttpMission);
      return (0, _possibleConstructorReturn3["default"])(this, _Mission.call(this, "http", config));
    }

    return HttpMission;
  }(_Super2["default"]);

  exports["default"] = HttpMission;
  module.exports = exports["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXNzaW9ucy9IdHRwLmpzIl0sIm5hbWVzIjpbIkh0dHBNaXNzaW9uIiwiY29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BRU1BLFc7OztBQUNKLHlCQUFZQyxNQUFaLEVBQW9CO0FBQUE7QUFBQSwrREFDbEIsb0JBQU0sTUFBTixFQUFjQSxNQUFkLENBRGtCO0FBRW5COzs7Ozt1QkFHWUQsVyIsImZpbGUiOiJIdHRwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1pc3Npb24gZnJvbSBcIi4vU3VwZXJcIjtcblxuY2xhc3MgSHR0cE1pc3Npb24gZXh0ZW5kcyBNaXNzaW9uIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoXCJodHRwXCIsIGNvbmZpZyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSHR0cE1pc3Npb247XG4iXX0=