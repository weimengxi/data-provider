'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createComboDefer = exports.createComboPromise = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _Deferred = require('./Deferred');

var _Deferred2 = _interopRequireDefault(_Deferred);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _runnings = {};

var comboDefersMap = new _map2['default']();

var comboPromisesMap = new _map2['default']();

var isFunction = function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]';
};

// 相同id的resolver, 将已有的promise返回， 不再创建新的promise
function createComboPromise(key, resolver) {

    var promise = comboPromisesMap.get(key);

    if (!(promise instanceof _promise2['default'])) {
        promise = new _promise2['default'](resolver);
        comboPromisesMap.set(key, promise);

        promise.then(function (data) {
            comboPromisesMap['delete'](key);
        }, function (error) {
            comboPromisesMap['delete'](key);
        });
    }

    return promise;
}

function createComboDefer(id) {

    var deferKey = id,
        comboDefer = comboDefersMap.get(deferKey);

    if (typeof comboDefer === 'undefined') {
        comboDefer = new _Deferred2['default']();
        comboDefersMap.set(deferKey, comboDefer);
    }

    // 无论成功及失败， 都要删除对应的comboDefer, 然后再将成功或失败返回 
    comboDefer.promise.then(function (data) {
        comboDefersMap['delete'](deferKey);
    }, function (error) {
        comboDefersMap['delete'](deferKey);
    });

    return comboDefer;
}

exports.createComboPromise = createComboPromise;
exports.createComboDefer = createComboDefer;
exports['default'] = createComboPromise;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9Db21ib1Byb21pc2UuanMiXSwibmFtZXMiOlsiX3J1bm5pbmdzIiwiY29tYm9EZWZlcnNNYXAiLCJjb21ib1Byb21pc2VzTWFwIiwiaXNGdW5jdGlvbiIsInZhbHVlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiY3JlYXRlQ29tYm9Qcm9taXNlIiwia2V5IiwicmVzb2x2ZXIiLCJwcm9taXNlIiwiZ2V0Iiwic2V0IiwidGhlbiIsImNyZWF0ZUNvbWJvRGVmZXIiLCJpZCIsImRlZmVyS2V5IiwiY29tYm9EZWZlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQUlBLFlBQVksRUFBaEI7O0FBRUEsSUFBSUMsaUJBQWlCLHNCQUFyQjs7QUFFQSxJQUFJQyxtQkFBbUIsc0JBQXZCOztBQUVBLElBQU1DLGFBQWEsU0FBYkEsVUFBYSxDQUFDQyxLQUFELEVBQVc7QUFDMUIsV0FBT0MsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCSixLQUEvQixNQUEwQyxtQkFBakQ7QUFDSCxDQUZEOztBQUlBO0FBQ0EsU0FBU0ssa0JBQVQsQ0FBNEJDLEdBQTVCLEVBQWlDQyxRQUFqQyxFQUEyQzs7QUFFdkMsUUFBSUMsVUFBVVYsaUJBQWlCVyxHQUFqQixDQUFxQkgsR0FBckIsQ0FBZDs7QUFFQSxRQUFJLEVBQUVFLHVDQUFGLENBQUosRUFBbUM7QUFDL0JBLGtCQUFVLHlCQUFZRCxRQUFaLENBQVY7QUFDQVQseUJBQWlCWSxHQUFqQixDQUFxQkosR0FBckIsRUFBMEJFLE9BQTFCOztBQUVBQSxnQkFBUUcsSUFBUixDQUFhLGdCQUFRO0FBQ2pCYix1Q0FBd0JRLEdBQXhCO0FBQ0gsU0FGRCxFQUVHLGlCQUFTO0FBQ1JSLHVDQUF3QlEsR0FBeEI7QUFDSCxTQUpEO0FBS0g7O0FBRUQsV0FBT0UsT0FBUDtBQUNIOztBQUdELFNBQVNJLGdCQUFULENBQTBCQyxFQUExQixFQUE4Qjs7QUFFMUIsUUFBSUMsV0FBV0QsRUFBZjtBQUFBLFFBQ0lFLGFBQWFsQixlQUFlWSxHQUFmLENBQW1CSyxRQUFuQixDQURqQjs7QUFHQSxRQUFJLE9BQU9DLFVBQVAsS0FBc0IsV0FBMUIsRUFBdUM7QUFDbkNBLHFCQUFhLDJCQUFiO0FBQ0FsQix1QkFBZWEsR0FBZixDQUFtQkksUUFBbkIsRUFBNkJDLFVBQTdCO0FBQ0g7O0FBRUQ7QUFDQUEsZUFBV1AsT0FBWCxDQUFtQkcsSUFBbkIsQ0FBd0IsZ0JBQVE7QUFDNUJkLGlDQUFzQmlCLFFBQXRCO0FBQ0gsS0FGRCxFQUVHLGlCQUFTO0FBQ1JqQixpQ0FBc0JpQixRQUF0QjtBQUNILEtBSkQ7O0FBTUEsV0FBT0MsVUFBUDtBQUNIOztRQUdRVixrQixHQUFBQSxrQjtRQUFvQk8sZ0IsR0FBQUEsZ0I7cUJBRWRQLGtCIiwiZmlsZSI6IkNvbWJvUHJvbWlzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEZWZlcnJlZCBmcm9tICcuL0RlZmVycmVkJztcblxubGV0IF9ydW5uaW5ncyA9IHt9O1xuXG5sZXQgY29tYm9EZWZlcnNNYXAgPSBuZXcgTWFwKCk7XG5cbmxldCBjb21ib1Byb21pc2VzTWFwID0gbmV3IE1hcCgpO1xuXG5jb25zdCBpc0Z1bmN0aW9uID0gKHZhbHVlKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8vIOebuOWQjGlk55qEcmVzb2x2ZXIsIOWwhuW3suacieeahHByb21pc2Xov5Tlm57vvIwg5LiN5YaN5Yib5bu65paw55qEcHJvbWlzZVxuZnVuY3Rpb24gY3JlYXRlQ29tYm9Qcm9taXNlKGtleSwgcmVzb2x2ZXIpIHtcblxuICAgIGxldCBwcm9taXNlID0gY29tYm9Qcm9taXNlc01hcC5nZXQoa2V5KTtcblxuICAgIGlmICghKHByb21pc2UgaW5zdGFuY2VvZiBQcm9taXNlKSkge1xuICAgICAgICBwcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZXIpO1xuICAgICAgICBjb21ib1Byb21pc2VzTWFwLnNldChrZXksIHByb21pc2UpO1xuXG4gICAgICAgIHByb21pc2UudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgIGNvbWJvUHJvbWlzZXNNYXAuZGVsZXRlKGtleSk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIGNvbWJvUHJvbWlzZXNNYXAuZGVsZXRlKGtleSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlQ29tYm9EZWZlcihpZCkge1xuXG4gICAgbGV0IGRlZmVyS2V5ID0gaWQsXG4gICAgICAgIGNvbWJvRGVmZXIgPSBjb21ib0RlZmVyc01hcC5nZXQoZGVmZXJLZXkpO1xuXG4gICAgaWYgKHR5cGVvZiBjb21ib0RlZmVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb21ib0RlZmVyID0gbmV3IERlZmVycmVkKCk7XG4gICAgICAgIGNvbWJvRGVmZXJzTWFwLnNldChkZWZlcktleSwgY29tYm9EZWZlcik7XG4gICAgfVxuXG4gICAgLy8g5peg6K665oiQ5Yqf5Y+K5aSx6LSl77yMIOmDveimgeWIoOmZpOWvueW6lOeahGNvbWJvRGVmZXIsIOeEtuWQjuWGjeWwhuaIkOWKn+aIluWksei0pei/lOWbniBcbiAgICBjb21ib0RlZmVyLnByb21pc2UudGhlbihkYXRhID0+IHtcbiAgICAgICAgY29tYm9EZWZlcnNNYXAuZGVsZXRlKGRlZmVyS2V5KTtcbiAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgIGNvbWJvRGVmZXJzTWFwLmRlbGV0ZShkZWZlcktleSk7XG4gICAgfSlcblxuICAgIHJldHVybiBjb21ib0RlZmVyO1xufVxuXG5cbmV4cG9ydCB7IGNyZWF0ZUNvbWJvUHJvbWlzZSwgY3JlYXRlQ29tYm9EZWZlciB9O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDb21ib1Byb21pc2U7XG4iXX0=