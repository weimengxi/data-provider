(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "babel-runtime/core-js/promise", "babel-runtime/core-js/map", "./Deferred"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("babel-runtime/core-js/promise"), require("babel-runtime/core-js/map"), require("./Deferred"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.promise, global.map, global.Deferred);
    global.comboPromise = mod.exports;
  }
})(this, function (exports, _promise, _map, _Deferred) {
  "use strict";

  exports.__esModule = true;
  exports.createComboDefer = exports.createComboPromise = undefined;

  var _promise2 = _interopRequireDefault(_promise);

  var _map2 = _interopRequireDefault(_map);

  var _Deferred2 = _interopRequireDefault(_Deferred);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _runnings = {};

  var comboDefersMap = new _map2["default"]();

  var comboPromisesMap = new _map2["default"]();

  var isFunction = function isFunction(value) {
    return Object.prototype.toString.call(value) === "[object Function]";
  };

  // 相同id的resolver, 将已有的promise返回， 不再创建新的promise
  function createComboPromise(key, resolver) {
    var promise = comboPromisesMap.get(key);

    if (!(promise instanceof _promise2["default"])) {
      promise = new _promise2["default"](resolver);
      comboPromisesMap.set(key, promise);

      promise.then(function (data) {
        comboPromisesMap["delete"](key);
      }, function (error) {
        comboPromisesMap["delete"](key);
      });
    }

    return promise;
  }

  function createComboDefer(id) {
    var deferKey = id,
        comboDefer = comboDefersMap.get(deferKey);

    if (typeof comboDefer === "undefined") {
      comboDefer = new _Deferred2["default"]();
      comboDefersMap.set(deferKey, comboDefer);
    }

    // 无论成功及失败， 都要删除对应的comboDefer, 然后再将成功或失败返回
    comboDefer.promise.then(function (data) {
      comboDefersMap["delete"](deferKey);
    }, function (error) {
      comboDefersMap["delete"](deferKey);
    });

    return comboDefer;
  }

  exports.createComboPromise = createComboPromise;
  exports.createComboDefer = createComboDefer;
  exports["default"] = createComboPromise;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb21ib1Byb21pc2UuanMiXSwibmFtZXMiOlsiX3J1bm5pbmdzIiwiY29tYm9EZWZlcnNNYXAiLCJjb21ib1Byb21pc2VzTWFwIiwiaXNGdW5jdGlvbiIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsInZhbHVlIiwiY3JlYXRlQ29tYm9Qcm9taXNlIiwia2V5IiwicmVzb2x2ZXIiLCJwcm9taXNlIiwiZ2V0Iiwic2V0IiwidGhlbiIsImNyZWF0ZUNvbWJvRGVmZXIiLCJpZCIsImRlZmVyS2V5IiwiY29tYm9EZWZlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsTUFBSUEsWUFBWSxFQUFoQjs7QUFFQSxNQUFJQyxpQkFBaUIsc0JBQXJCOztBQUVBLE1BQUlDLG1CQUFtQixzQkFBdkI7O0FBRUEsTUFBTUMsYUFBYSxTQUFiQSxVQUFhLFFBQVM7QUFDMUIsV0FBT0MsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCQyxLQUEvQixNQUEwQyxtQkFBakQ7QUFDRCxHQUZEOztBQUlBO0FBQ0EsV0FBU0Msa0JBQVQsQ0FBNEJDLEdBQTVCLEVBQWlDQyxRQUFqQyxFQUEwQztBQUN4QyxRQUFJQyxVQUFVVixpQkFBaUJXLEdBQWpCLENBQXFCSCxHQUFyQixDQUFkOztBQUVBLFFBQUksRUFBRUUsdUNBQUYsQ0FBSixFQUFtQztBQUNqQ0EsZ0JBQVUseUJBQVlELFFBQVosQ0FBVjtBQUNBVCx1QkFBaUJZLEdBQWpCLENBQXFCSixHQUFyQixFQUEwQkUsT0FBMUI7O0FBRUFBLGNBQVFHLElBQVIsQ0FDRSxnQkFBUTtBQUNOYixtQ0FBd0JRLEdBQXhCO0FBQ0QsT0FISCxFQUlFLGlCQUFTO0FBQ1BSLG1DQUF3QlEsR0FBeEI7QUFDRCxPQU5IO0FBUUQ7O0FBRUQsV0FBT0UsT0FBUDtBQUNEOztBQUVELFdBQVNJLGdCQUFULENBQTBCQyxFQUExQixFQUE2QjtBQUMzQixRQUFJQyxXQUFXRCxFQUFmO0FBQUEsUUFDRUUsYUFBYWxCLGVBQWVZLEdBQWYsQ0FBbUJLLFFBQW5CLENBRGY7O0FBR0EsUUFBSSxPQUFPQyxVQUFQLEtBQXNCLFdBQTFCLEVBQXVDO0FBQ3JDQSxtQkFBYSwyQkFBYjtBQUNBbEIscUJBQWVhLEdBQWYsQ0FBbUJJLFFBQW5CLEVBQTZCQyxVQUE3QjtBQUNEOztBQUVEO0FBQ0FBLGVBQVdQLE9BQVgsQ0FBbUJHLElBQW5CLENBQ0UsZ0JBQVE7QUFDTmQsK0JBQXNCaUIsUUFBdEI7QUFDRCxLQUhILEVBSUUsaUJBQVM7QUFDUGpCLCtCQUFzQmlCLFFBQXRCO0FBQ0QsS0FOSDs7QUFTQSxXQUFPQyxVQUFQO0FBQ0Q7O1VBRU9WLGtCLEdBQUFBLGtCO1VBQW9CTyxnQixHQUFBQSxnQjt1QkFFYlAsa0IiLCJmaWxlIjoiY29tYm9Qcm9taXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERlZmVycmVkIGZyb20gXCIuL0RlZmVycmVkXCI7XG5cbmxldCBfcnVubmluZ3MgPSB7fTtcblxubGV0IGNvbWJvRGVmZXJzTWFwID0gbmV3IE1hcCgpO1xuXG5sZXQgY29tYm9Qcm9taXNlc01hcCA9IG5ldyBNYXAoKTtcblxuY29uc3QgaXNGdW5jdGlvbiA9IHZhbHVlID0+IHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcbn07XG5cbi8vIOebuOWQjGlk55qEcmVzb2x2ZXIsIOWwhuW3suacieeahHByb21pc2Xov5Tlm57vvIwg5LiN5YaN5Yib5bu65paw55qEcHJvbWlzZVxuZnVuY3Rpb24gY3JlYXRlQ29tYm9Qcm9taXNlKGtleSwgcmVzb2x2ZXIpe1xuICBsZXQgcHJvbWlzZSA9IGNvbWJvUHJvbWlzZXNNYXAuZ2V0KGtleSk7XG5cbiAgaWYgKCEocHJvbWlzZSBpbnN0YW5jZW9mIFByb21pc2UpKSB7XG4gICAgcHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmVyKTtcbiAgICBjb21ib1Byb21pc2VzTWFwLnNldChrZXksIHByb21pc2UpO1xuXG4gICAgcHJvbWlzZS50aGVuKFxuICAgICAgZGF0YSA9PiB7XG4gICAgICAgIGNvbWJvUHJvbWlzZXNNYXAuZGVsZXRlKGtleSk7XG4gICAgICB9LFxuICAgICAgZXJyb3IgPT4ge1xuICAgICAgICBjb21ib1Byb21pc2VzTWFwLmRlbGV0ZShrZXkpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tYm9EZWZlcihpZCl7XG4gIGxldCBkZWZlcktleSA9IGlkLFxuICAgIGNvbWJvRGVmZXIgPSBjb21ib0RlZmVyc01hcC5nZXQoZGVmZXJLZXkpO1xuXG4gIGlmICh0eXBlb2YgY29tYm9EZWZlciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNvbWJvRGVmZXIgPSBuZXcgRGVmZXJyZWQoKTtcbiAgICBjb21ib0RlZmVyc01hcC5zZXQoZGVmZXJLZXksIGNvbWJvRGVmZXIpO1xuICB9XG5cbiAgLy8g5peg6K665oiQ5Yqf5Y+K5aSx6LSl77yMIOmDveimgeWIoOmZpOWvueW6lOeahGNvbWJvRGVmZXIsIOeEtuWQjuWGjeWwhuaIkOWKn+aIluWksei0pei/lOWbnlxuICBjb21ib0RlZmVyLnByb21pc2UudGhlbihcbiAgICBkYXRhID0+IHtcbiAgICAgIGNvbWJvRGVmZXJzTWFwLmRlbGV0ZShkZWZlcktleSk7XG4gICAgfSxcbiAgICBlcnJvciA9PiB7XG4gICAgICBjb21ib0RlZmVyc01hcC5kZWxldGUoZGVmZXJLZXkpO1xuICAgIH1cbiAgKTtcblxuICByZXR1cm4gY29tYm9EZWZlcjtcbn1cblxuZXhwb3J0IHtjcmVhdGVDb21ib1Byb21pc2UsIGNyZWF0ZUNvbWJvRGVmZXJ9O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDb21ib1Byb21pc2U7XG4iXX0=