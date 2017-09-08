'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParamSerializer = getParamSerializer;

var _querystringEs = require('querystring-es3');

var _querystringEs2 = _interopRequireDefault(_querystringEs);

var _jqueryParam = require('jquery-param');

var _jqueryParam2 = _interopRequireDefault(_jqueryParam);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * @desc 序列化请求参数的方式
 * @param Boolean
 * @ret Function
 */
function getParamSerializer(paramSerializerJQLikeEnabled) {

  var paramSerializerFn = paramSerializerJQLikeEnabled ? _jqueryParam2['default'] : _querystringEs2['default'].stringify;
  return paramSerializerFn;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9pbmRleC5qcyJdLCJuYW1lcyI6WyJnZXRQYXJhbVNlcmlhbGl6ZXIiLCJwYXJhbVNlcmlhbGl6ZXJKUUxpa2VFbmFibGVkIiwicGFyYW1TZXJpYWxpemVyRm4iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7O1FBUWdCQSxrQixHQUFBQSxrQjs7QUFSaEI7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7O0FBS08sU0FBU0Esa0JBQVQsQ0FBNEJDLDRCQUE1QixFQUEwRDs7QUFFN0QsTUFBSUMsb0JBQW9CRCwwREFBdUMsMkJBQVlFLFNBQTNFO0FBQ0EsU0FBT0QsaUJBQVA7QUFFSCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBxdWVyeXN0cmluZyBmcm9tICdxdWVyeXN0cmluZy1lczMnO1xuaW1wb3J0IHBhcmFtIGZyb20gJ2pxdWVyeS1wYXJhbSc7XG5cbi8qXG4gKiBAZGVzYyDluo/liJfljJbor7fmsYLlj4LmlbDnmoTmlrnlvI9cbiAqIEBwYXJhbSBCb29sZWFuXG4gKiBAcmV0IEZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJhbVNlcmlhbGl6ZXIocGFyYW1TZXJpYWxpemVySlFMaWtlRW5hYmxlZCkge1xuXG4gICAgbGV0IHBhcmFtU2VyaWFsaXplckZuID0gcGFyYW1TZXJpYWxpemVySlFMaWtlRW5hYmxlZCA/IHBhcmFtIDogcXVlcnlzdHJpbmcuc3RyaW5naWZ5O1xuICAgIHJldHVybiBwYXJhbVNlcmlhbGl6ZXJGbjtcblxufSJdfQ==