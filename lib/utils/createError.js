(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports", "babel-runtime/core-js/object/assign", "babel-runtime/helpers/objectWithoutProperties", "../const"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require("babel-runtime/core-js/object/assign"), require("babel-runtime/helpers/objectWithoutProperties"), require("../const"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.assign, global.objectWithoutProperties, global._const);
    global.createError = mod.exports;
  }
})(this, function (module, exports, _assign, _objectWithoutProperties2, _const) {
  "use strict";

  exports.__esModule = true;
  exports.default = createError;

  var _assign2 = _interopRequireDefault(_assign);

  var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

  var _const2 = _interopRequireDefault(_const);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var ERROR_TYPE = _const2["default"].ERROR_TYPE;

  var DEFAULT_ERROR_MSG = "undefined message";
  var DEFAULT_ERROR_TYPE = ERROR_TYPE.BUSINESS;

  /* 说明 */
  function createError(_ref) {
    var code = _ref.code,
        _ref$message = _ref.message,
        message = _ref$message === undefined ? DEFAULT_ERROR_MSG : _ref$message,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? ERROR_TYPE.BUSINESS : _ref$type,
        args = (0, _objectWithoutProperties3["default"])(_ref, ["code", "message", "type"]);

    // need a real Error
    var error = new Error(message);
    error.type = type;
    error.code = code;
    (0, _assign2["default"])(error, args);
    return error;
  }
  module.exports = exports["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jcmVhdGVFcnJvci5qcyJdLCJuYW1lcyI6WyJjcmVhdGVFcnJvciIsIkVSUk9SX1RZUEUiLCJERUZBVUxUX0VSUk9SX01TRyIsIkRFRkFVTFRfRVJST1JfVFlQRSIsIkJVU0lORVNTIiwiY29kZSIsIm1lc3NhZ2UiLCJ0eXBlIiwiYXJncyIsImVycm9yIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBUXdCQSxXOzs7Ozs7Ozs7Ozs7OztBQU54QixNQUFJQyxhQUFhLG1CQUFNQSxVQUF2Qjs7QUFFQSxNQUFNQyxvQkFBb0IsbUJBQTFCO0FBQ0EsTUFBTUMscUJBQXFCRixXQUFXRyxRQUF0Qzs7QUFFQTtBQUNlLFdBQVNKLFdBQVQsT0FLYjtBQUFBLFFBSkFLLElBSUEsUUFKQUEsSUFJQTtBQUFBLDRCQUhBQyxPQUdBO0FBQUEsUUFIQUEsT0FHQSxnQ0FIVUosaUJBR1Y7QUFBQSx5QkFGQUssSUFFQTtBQUFBLFFBRkFBLElBRUEsNkJBRk9OLFdBQVdHLFFBRWxCO0FBQUEsUUFER0ksSUFDSDs7QUFDQTtBQUNBLFFBQUlDLFFBQVEsSUFBSUMsS0FBSixDQUFVSixPQUFWLENBQVo7QUFDQUcsVUFBTUYsSUFBTixHQUFhQSxJQUFiO0FBQ0FFLFVBQU1KLElBQU4sR0FBYUEsSUFBYjtBQUNBLDZCQUFjSSxLQUFkLEVBQXFCRCxJQUFyQjtBQUNBLFdBQU9DLEtBQVA7QUFDRCIsImZpbGUiOiJjcmVhdGVFcnJvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb25zdCBmcm9tIFwiLi4vY29uc3RcIjtcblxudmFyIEVSUk9SX1RZUEUgPSBDb25zdC5FUlJPUl9UWVBFO1xuXG5jb25zdCBERUZBVUxUX0VSUk9SX01TRyA9IFwidW5kZWZpbmVkIG1lc3NhZ2VcIjtcbmNvbnN0IERFRkFVTFRfRVJST1JfVFlQRSA9IEVSUk9SX1RZUEUuQlVTSU5FU1M7XG5cbi8qIOivtOaYjiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlRXJyb3Ioe1xuICBjb2RlLFxuICBtZXNzYWdlID0gREVGQVVMVF9FUlJPUl9NU0csXG4gIHR5cGUgPSBFUlJPUl9UWVBFLkJVU0lORVNTLFxuICAuLi5hcmdzXG59KXtcbiAgLy8gbmVlZCBhIHJlYWwgRXJyb3JcbiAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICBlcnJvci50eXBlID0gdHlwZTtcbiAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIE9iamVjdC5hc3NpZ24oZXJyb3IsIGFyZ3MpO1xuICByZXR1cm4gZXJyb3I7XG59XG4iXX0=