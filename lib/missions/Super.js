(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports", "babel-runtime/core-js/json/stringify", "babel-runtime/helpers/classCallCheck"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require("babel-runtime/core-js/json/stringify"), require("babel-runtime/helpers/classCallCheck"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.stringify, global.classCallCheck);
    global.Super = mod.exports;
  }
})(this, function (module, exports, _stringify, _classCallCheck2) {
  "use strict";

  exports.__esModule = true;

  var _stringify2 = _interopRequireDefault(_stringify);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Mission = function Mission(type, config) {
    (0, _classCallCheck3["default"])(this, Mission);

    this.type = type;
    this.config = config;
    //假设JSON.stringify序列化结果是稳定得
    this.signature = (0, _stringify2["default"])({ type: type, config: config });
    this.createTime = Date.now();
  };

  exports["default"] = Mission;
  module.exports = exports["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXNzaW9ucy9TdXBlci5qcyJdLCJuYW1lcyI6WyJNaXNzaW9uIiwidHlwZSIsImNvbmZpZyIsInNpZ25hdHVyZSIsImNyZWF0ZVRpbWUiLCJEYXRlIiwibm93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFBTUEsTyxHQUNKLGlCQUFZQyxJQUFaLEVBQWtCQyxNQUFsQixFQUEwQjtBQUFBOztBQUN4QixTQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDQTtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsNEJBQWUsRUFBQ0YsTUFBTUEsSUFBUCxFQUFhQyxRQUFRQSxNQUFyQixFQUFmLENBQWpCO0FBQ0EsU0FBS0UsVUFBTCxHQUFrQkMsS0FBS0MsR0FBTCxFQUFsQjtBQUNELEc7O3VCQUdZTixPIiwiZmlsZSI6IlN1cGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTWlzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIGNvbmZpZykge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgLy/lgYforr5KU09OLnN0cmluZ2lmeeW6j+WIl+WMlue7k+aenOaYr+eos+WumuW+l1xuICAgIHRoaXMuc2lnbmF0dXJlID0gSlNPTi5zdHJpbmdpZnkoe3R5cGU6IHR5cGUsIGNvbmZpZzogY29uZmlnfSk7XG4gICAgdGhpcy5jcmVhdGVUaW1lID0gRGF0ZS5ub3coKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNaXNzaW9uO1xuIl19