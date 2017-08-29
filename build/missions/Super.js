"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Mission = function Mission(type, config) {
    (0, _classCallCheck3["default"])(this, Mission);

    this.type = type;
    this.config = config;
    //假设JSON.stringify序列化结果是稳定得
    this.signature = (0, _stringify2["default"])({ type: type, config: config });
    this.createTime = Date.now();
};

exports["default"] = Mission;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXNzaW9ucy9TdXBlci5qcyJdLCJuYW1lcyI6WyJNaXNzaW9uIiwidHlwZSIsImNvbmZpZyIsInNpZ25hdHVyZSIsImNyZWF0ZVRpbWUiLCJEYXRlIiwibm93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBQU1BLE8sR0FFRixpQkFBWUMsSUFBWixFQUFrQkMsTUFBbEIsRUFBMEI7QUFBQTs7QUFDdEIsU0FBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0E7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLDRCQUFlLEVBQUVGLE1BQU1BLElBQVIsRUFBY0MsUUFBUUEsTUFBdEIsRUFBZixDQUFqQjtBQUNBLFNBQUtFLFVBQUwsR0FBa0JDLEtBQUtDLEdBQUwsRUFBbEI7QUFDSCxDOztxQkFHVU4sTyIsImZpbGUiOiJTdXBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1pc3Npb24ge1xuXG4gICAgY29uc3RydWN0b3IodHlwZSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICAvL+WBh+iuvkpTT04uc3RyaW5naWZ55bqP5YiX5YyW57uT5p6c5piv56iz5a6a5b6XXG4gICAgICAgIHRoaXMuc2lnbmF0dXJlID0gSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiB0eXBlLCBjb25maWc6IGNvbmZpZyB9KTtcbiAgICAgICAgdGhpcy5jcmVhdGVUaW1lID0gRGF0ZS5ub3coKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1pc3Npb247XG4iXX0=