(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.index = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  exports.__esModule = true;
  var Const = {
    NAMESPACE: "MX",
    ERROR_TYPE: {
      BUSINESS: "businessError",
      NETWORK: "networkError",
      TIMEOUT: "timeoutError",
      ABORT: "abortError",
      PARSER: "parserError"
    }
  };
  exports["default"] = Const;
  module.exports = exports["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdC9pbmRleC5qcyJdLCJuYW1lcyI6WyJDb25zdCIsIk5BTUVTUEFDRSIsIkVSUk9SX1RZUEUiLCJCVVNJTkVTUyIsIk5FVFdPUksiLCJUSU1FT1VUIiwiQUJPUlQiLCJQQVJTRVIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFJQSxRQUFRO0FBQ1ZDLGVBQVcsSUFERDtBQUVWQyxnQkFBWTtBQUNWQyxnQkFBVSxlQURBO0FBRVZDLGVBQVMsY0FGQztBQUdWQyxlQUFTLGNBSEM7QUFJVkMsYUFBTyxZQUpHO0FBS1ZDLGNBQVE7QUFMRTtBQUZGLEdBQVo7dUJBVWVQLEsiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQ29uc3QgPSB7XG4gIE5BTUVTUEFDRTogXCJNWFwiLFxuICBFUlJPUl9UWVBFOiB7XG4gICAgQlVTSU5FU1M6IFwiYnVzaW5lc3NFcnJvclwiLFxuICAgIE5FVFdPUks6IFwibmV0d29ya0Vycm9yXCIsXG4gICAgVElNRU9VVDogXCJ0aW1lb3V0RXJyb3JcIixcbiAgICBBQk9SVDogXCJhYm9ydEVycm9yXCIsXG4gICAgUEFSU0VSOiBcInBhcnNlckVycm9yXCJcbiAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IENvbnN0O1xuIl19