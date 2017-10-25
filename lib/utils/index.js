(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "querystring-es3", "jquery-param"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("querystring-es3"), require("jquery-param"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.querystringEs3, global.jqueryParam);
    global.index = mod.exports;
  }
})(this, function (exports, _querystringEs, _jqueryParam) {
  "use strict";

  exports.__esModule = true;
  exports.getParamSerializer = getParamSerializer;

  var _querystringEs2 = _interopRequireDefault(_querystringEs);

  var _jqueryParam2 = _interopRequireDefault(_jqueryParam);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /*
   * @desc 序列化请求参数的方式
   * @param Boolean
   * @ret Function
   */
  function getParamSerializer(paramSerializerJQLikeEnabled) {
    var paramSerializerFn = paramSerializerJQLikeEnabled ? _jqueryParam2["default"] : _querystringEs2["default"].stringify;
    return paramSerializerFn;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9pbmRleC5qcyJdLCJuYW1lcyI6WyJnZXRQYXJhbVNlcmlhbGl6ZXIiLCJwYXJhbVNlcmlhbGl6ZXJKUUxpa2VFbmFibGVkIiwicGFyYW1TZXJpYWxpemVyRm4iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7VUFRZ0JBLGtCLEdBQUFBLGtCOzs7Ozs7Ozs7Ozs7QUFMaEI7Ozs7O0FBS08sV0FBU0Esa0JBQVQsQ0FBNEJDLDRCQUE1QixFQUF5RDtBQUM5RCxRQUFJQyxvQkFBb0JELDBEQUVwQiwyQkFBWUUsU0FGaEI7QUFHQSxXQUFPRCxpQkFBUDtBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHF1ZXJ5c3RyaW5nIGZyb20gXCJxdWVyeXN0cmluZy1lczNcIjtcbmltcG9ydCBwYXJhbSBmcm9tIFwianF1ZXJ5LXBhcmFtXCI7XG5cbi8qXG4gKiBAZGVzYyDluo/liJfljJbor7fmsYLlj4LmlbDnmoTmlrnlvI9cbiAqIEBwYXJhbSBCb29sZWFuXG4gKiBAcmV0IEZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJhbVNlcmlhbGl6ZXIocGFyYW1TZXJpYWxpemVySlFMaWtlRW5hYmxlZCl7XG4gIGxldCBwYXJhbVNlcmlhbGl6ZXJGbiA9IHBhcmFtU2VyaWFsaXplckpRTGlrZUVuYWJsZWRcbiAgICA/IHBhcmFtXG4gICAgOiBxdWVyeXN0cmluZy5zdHJpbmdpZnk7XG4gIHJldHVybiBwYXJhbVNlcmlhbGl6ZXJGbjtcbn1cbiJdfQ==