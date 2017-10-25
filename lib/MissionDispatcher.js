(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports", "babel-runtime/core-js/object/assign", "babel-runtime/core-js/map", "babel-runtime/helpers/classCallCheck", "./utils/Deferred", "./utils/comboPromise", "events"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require("babel-runtime/core-js/object/assign"), require("babel-runtime/core-js/map"), require("babel-runtime/helpers/classCallCheck"), require("./utils/Deferred"), require("./utils/comboPromise"), require("events"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.assign, global.map, global.classCallCheck, global.Deferred, global.comboPromise, global.events);
    global.MissionDispatcher = mod.exports;
  }
})(this, function (module, exports, _assign, _map, _classCallCheck2, _Deferred, _comboPromise, _events) {
  "use strict";

  exports.__esModule = true;

  var _assign2 = _interopRequireDefault(_assign);

  var _map2 = _interopRequireDefault(_map);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _Deferred2 = _interopRequireDefault(_Deferred);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // 会不会溢出？
  var serialNumber = 0;

  function makeMissionKey(mission) {
    var missionKey = mission.config.comboRequestEnabled ? mission.signature : serialNumber++;
    return missionKey;
  }

  /*
   * @param {WorkerFactory|Function} 生成worker的工厂
   * @param {count|countber} 生成worker的数量
   */

  var MissionDispatcher = function () {
    function MissionDispatcher(WorkerFactory, count, strategy) {
      (0, _classCallCheck3["default"])(this, MissionDispatcher);
      this._context = {
        workers: [], // worker队列
        missionQueue: [], // 任务队列
        // 持有相同defer的mission, 结构类似{missionDefer: mission}
        missionDefers: new _map2["default"](),
        isRunning: false, // controller的运行状态
        emitter: new _events.EventEmitter()
      };

      for (var i = 0; i < count; i++) {
        var worker = new WorkerFactory(strategy);
        worker.id = i;
        this._context.workers.push(worker);
      }

      this._context.emitter.on("mission:put", run.bind(this._context));
      this._context.emitter.on("worker:add", run.bind(this._context));
    }
    // 【!!!约定】 以下划线开头的是私有变量，请不要调用


    MissionDispatcher.prototype.put = function put(mission) {
      var missionKey = makeMissionKey(mission),
          missionDefer = (0, _comboPromise.createComboDefer)(missionKey),
          missionInQueue = (0, _assign2["default"])({}, mission, {
        defer: missionDefer
      });

      if (this._context.missionDefers.has(missionDefer) === false) {
        this._context.missionDefers.set(missionDefer, missionInQueue);
        this._context.missionQueue.push(missionInQueue);
        this._context.emitter.emit("mission:put", run);
      }

      return missionDefer.promise;
    };

    MissionDispatcher.prototype.start = function start() {
      if (this._context.isRunning === false) {
        this._context.isRunning = true;
        run.bind(this._context)();
      } else {
        console.log(" MissionDispatcher is already Running ... ");
      }
    };

    MissionDispatcher.prototype.stop = function stop() {
      this._context.isRunning = false;
    };

    return MissionDispatcher;
  }();

  function run() {
    var threadsCount = void 0,
        context = this;

    if (context.isRunning === false) {
      console.warn(" MissionDispatcher is stopped ... ");
      return;
    }

    if (context.missionQueue.length === 0) {
      console.log(" No Mission ...  ");
      return;
    }

    if (context.workers.length === 0) {
      console.log(" No Avaliable workers ...  ");
      return;
    }

    // realDo Mission ====
    threadsCount = Math.min(context.workers.length, context.missionQueue.length);

    while (threadsCount > 0) {
      // 从map里出第一个
      dispatch(context.workers.shift(), context.missionQueue.shift()); // FIFO
      threadsCount--;
    }

    // 给worker分配任务, 合并请求
    function dispatch(worker, mission) {
      //console.log("%cSTART: workerId: %s, missionSignature: %s", "color:green", worker.id, mission.signature);

      var finishHandler = function finishHandler() {
        // 归还worker
        context.workers.push(worker);
        context.emitter.emit("worker:add");
        // 删除 执行过的 missionDefer
        context.missionDefers["delete"](mission.defer);
      };

      worker["do"](mission).then(function (data) {
        mission.defer.resolve(data);
        // console.log("%cResolve: m %s, w %s ", "color:blue", mission, worker.id);
        finishHandler();
      }, function (reason) {
        mission.defer.reject(reason);
        // console.log("%cReject: m %s, w %s ", "color:red", mission, worker.id);
        finishHandler();
      });
    }
  }

  exports["default"] = MissionDispatcher;
  module.exports = exports["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NaXNzaW9uRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJzZXJpYWxOdW1iZXIiLCJtYWtlTWlzc2lvbktleSIsIm1pc3Npb24iLCJtaXNzaW9uS2V5IiwiY29uZmlnIiwiY29tYm9SZXF1ZXN0RW5hYmxlZCIsInNpZ25hdHVyZSIsIk1pc3Npb25EaXNwYXRjaGVyIiwiV29ya2VyRmFjdG9yeSIsImNvdW50Iiwic3RyYXRlZ3kiLCJfY29udGV4dCIsIndvcmtlcnMiLCJtaXNzaW9uUXVldWUiLCJtaXNzaW9uRGVmZXJzIiwiaXNSdW5uaW5nIiwiZW1pdHRlciIsImkiLCJ3b3JrZXIiLCJpZCIsInB1c2giLCJvbiIsInJ1biIsImJpbmQiLCJwdXQiLCJtaXNzaW9uRGVmZXIiLCJtaXNzaW9uSW5RdWV1ZSIsImRlZmVyIiwiaGFzIiwic2V0IiwiZW1pdCIsInByb21pc2UiLCJzdGFydCIsImNvbnNvbGUiLCJsb2ciLCJzdG9wIiwidGhyZWFkc0NvdW50IiwiY29udGV4dCIsIndhcm4iLCJsZW5ndGgiLCJNYXRoIiwibWluIiwiZGlzcGF0Y2giLCJzaGlmdCIsImZpbmlzaEhhbmRsZXIiLCJ0aGVuIiwiZGF0YSIsInJlc29sdmUiLCJyZWFzb24iLCJyZWplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQTtBQUNBLE1BQUlBLGVBQWUsQ0FBbkI7O0FBRUEsV0FBU0MsY0FBVCxDQUF3QkMsT0FBeEIsRUFBZ0M7QUFDOUIsUUFBSUMsYUFBYUQsUUFBUUUsTUFBUixDQUFlQyxtQkFBZixHQUNiSCxRQUFRSSxTQURLLEdBRWJOLGNBRko7QUFHQSxXQUFPRyxVQUFQO0FBQ0Q7O0FBRUQ7Ozs7O01BSU1JLGlCO0FBV0osK0JBQVlDLGFBQVosRUFBMkJDLEtBQTNCLEVBQWtDQyxRQUFsQyxFQUE0QztBQUFBO0FBQUEsV0FUNUNDLFFBUzRDLEdBVGpDO0FBQ1RDLGlCQUFTLEVBREEsRUFDSTtBQUNiQyxzQkFBYyxF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QUFTTSxRQUFULENBQWtCeEIsTUFBbEIsRUFBMEJoQixPQUExQixFQUFrQztBQUNoQzs7QUFFQSxVQUFJMEMsZ0JBQWdCLFNBQWhCQSxhQUFnQixHQUFVO0FBQzVCO0FBQ0FQLGdCQUFRekIsT0FBUixDQUFnQlEsSUFBaEIsQ0FBcUJGLE1BQXJCO0FBQ0FtQixnQkFBUXJCLE9BQVIsQ0FBZ0JjLElBQWhCLENBQXFCLFlBQXJCO0FBQ0E7QUFDQU8sZ0JBQVF2QixhQUFSLFdBQTZCWixRQUFReUIsS0FBckM7QUFDRCxPQU5EOztBQVFBVCxtQkFBVWhCLE9BQVYsRUFBbUIyQyxJQUFuQixDQUNFLFVBQVNDLElBQVQsRUFBYztBQUNaNUMsZ0JBQVF5QixLQUFSLENBQWNvQixPQUFkLENBQXNCRCxJQUF0QjtBQUNBO0FBQ0FGO0FBQ0QsT0FMSCxFQU1FLFVBQVNJLE1BQVQsRUFBZ0I7QUFDZDlDLGdCQUFReUIsS0FBUixDQUFjc0IsTUFBZCxDQUFxQkQsTUFBckI7QUFDQTtBQUNBSjtBQUNELE9BVkg7QUFZRDtBQUNGOzt1QkFFY3JDLGlCIiwiZmlsZSI6Ik1pc3Npb25EaXNwYXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERlZmVycmVkIGZyb20gXCIuL3V0aWxzL0RlZmVycmVkXCI7XG5pbXBvcnQge2NyZWF0ZUNvbWJvRGVmZXJ9IGZyb20gXCIuL3V0aWxzL2NvbWJvUHJvbWlzZVwiO1xuaW1wb3J0IHtFdmVudEVtaXR0ZXJ9IGZyb20gXCJldmVudHNcIjtcblxuLy8g5Lya5LiN5Lya5rqi5Ye677yfXG5sZXQgc2VyaWFsTnVtYmVyID0gMDtcblxuZnVuY3Rpb24gbWFrZU1pc3Npb25LZXkobWlzc2lvbil7XG4gIGxldCBtaXNzaW9uS2V5ID0gbWlzc2lvbi5jb25maWcuY29tYm9SZXF1ZXN0RW5hYmxlZFxuICAgID8gbWlzc2lvbi5zaWduYXR1cmVcbiAgICA6IHNlcmlhbE51bWJlcisrO1xuICByZXR1cm4gbWlzc2lvbktleTtcbn1cblxuLypcbiAqIEBwYXJhbSB7V29ya2VyRmFjdG9yeXxGdW5jdGlvbn0g55Sf5oiQd29ya2Vy55qE5bel5Y6CXG4gKiBAcGFyYW0ge2NvdW50fGNvdW50YmVyfSDnlJ/miJB3b3JrZXLnmoTmlbDph49cbiAqL1xuY2xhc3MgTWlzc2lvbkRpc3BhdGNoZXIge1xuICAvLyDjgJAhISHnuqblrprjgJEg5Lul5LiL5YiS57q/5byA5aS055qE5piv56eB5pyJ5Y+Y6YeP77yM6K+35LiN6KaB6LCD55SoXG4gIF9jb250ZXh0ID0ge1xuICAgIHdvcmtlcnM6IFtdLCAvLyB3b3JrZXLpmJ/liJdcbiAgICBtaXNzaW9uUXVldWU6IFtdLCAvLyDku7vliqHpmJ/liJdcbiAgICAvLyDmjIHmnInnm7jlkIxkZWZlcueahG1pc3Npb24sIOe7k+aehOexu+S8vHttaXNzaW9uRGVmZXI6IG1pc3Npb259XG4gICAgbWlzc2lvbkRlZmVyczogbmV3IE1hcCgpLFxuICAgIGlzUnVubmluZzogZmFsc2UsIC8vIGNvbnRyb2xsZXLnmoTov5DooYznirbmgIFcbiAgICBlbWl0dGVyOiBuZXcgRXZlbnRFbWl0dGVyKClcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihXb3JrZXJGYWN0b3J5LCBjb3VudCwgc3RyYXRlZ3kpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGxldCB3b3JrZXIgPSBuZXcgV29ya2VyRmFjdG9yeShzdHJhdGVneSk7XG4gICAgICB3b3JrZXIuaWQgPSBpO1xuICAgICAgdGhpcy5fY29udGV4dC53b3JrZXJzLnB1c2god29ya2VyKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb250ZXh0LmVtaXR0ZXIub24oXCJtaXNzaW9uOnB1dFwiLCBydW4uYmluZCh0aGlzLl9jb250ZXh0KSk7XG4gICAgdGhpcy5fY29udGV4dC5lbWl0dGVyLm9uKFwid29ya2VyOmFkZFwiLCBydW4uYmluZCh0aGlzLl9jb250ZXh0KSk7XG4gIH1cblxuICBwdXQobWlzc2lvbikge1xuICAgIGxldCBtaXNzaW9uS2V5ID0gbWFrZU1pc3Npb25LZXkobWlzc2lvbiksXG4gICAgICBtaXNzaW9uRGVmZXIgPSBjcmVhdGVDb21ib0RlZmVyKG1pc3Npb25LZXkpLFxuICAgICAgbWlzc2lvbkluUXVldWUgPSBPYmplY3QuYXNzaWduKHt9LCBtaXNzaW9uLCB7XG4gICAgICAgIGRlZmVyOiBtaXNzaW9uRGVmZXJcbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX2NvbnRleHQubWlzc2lvbkRlZmVycy5oYXMobWlzc2lvbkRlZmVyKSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX2NvbnRleHQubWlzc2lvbkRlZmVycy5zZXQobWlzc2lvbkRlZmVyLCBtaXNzaW9uSW5RdWV1ZSk7XG4gICAgICB0aGlzLl9jb250ZXh0Lm1pc3Npb25RdWV1ZS5wdXNoKG1pc3Npb25JblF1ZXVlKTtcbiAgICAgIHRoaXMuX2NvbnRleHQuZW1pdHRlci5lbWl0KFwibWlzc2lvbjpwdXRcIiwgcnVuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWlzc2lvbkRlZmVyLnByb21pc2U7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAodGhpcy5fY29udGV4dC5pc1J1bm5pbmcgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9jb250ZXh0LmlzUnVubmluZyA9IHRydWU7XG4gICAgICBydW4uYmluZCh0aGlzLl9jb250ZXh0KSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIiBNaXNzaW9uRGlzcGF0Y2hlciBpcyBhbHJlYWR5IFJ1bm5pbmcgLi4uIFwiKTtcbiAgICB9XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuX2NvbnRleHQuaXNSdW5uaW5nID0gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gcnVuKCl7XG4gIGxldCB0aHJlYWRzQ291bnQsXG4gICAgY29udGV4dCA9IHRoaXM7XG5cbiAgaWYgKGNvbnRleHQuaXNSdW5uaW5nID09PSBmYWxzZSkge1xuICAgIGNvbnNvbGUud2FybihcIiBNaXNzaW9uRGlzcGF0Y2hlciBpcyBzdG9wcGVkIC4uLiBcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNvbnRleHQubWlzc2lvblF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnNvbGUubG9nKFwiIE5vIE1pc3Npb24gLi4uICBcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNvbnRleHQud29ya2Vycy5sZW5ndGggPT09IDApIHtcbiAgICBjb25zb2xlLmxvZyhcIiBObyBBdmFsaWFibGUgd29ya2VycyAuLi4gIFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyByZWFsRG8gTWlzc2lvbiA9PT09XG4gIHRocmVhZHNDb3VudCA9IE1hdGgubWluKGNvbnRleHQud29ya2Vycy5sZW5ndGgsIGNvbnRleHQubWlzc2lvblF1ZXVlLmxlbmd0aCk7XG5cbiAgd2hpbGUgKHRocmVhZHNDb3VudCA+IDApIHtcbiAgICAvLyDku45tYXDph4zlh7rnrKzkuIDkuKpcbiAgICBkaXNwYXRjaChjb250ZXh0LndvcmtlcnMuc2hpZnQoKSwgY29udGV4dC5taXNzaW9uUXVldWUuc2hpZnQoKSk7IC8vIEZJRk9cbiAgICB0aHJlYWRzQ291bnQtLTtcbiAgfVxuXG4gIC8vIOe7mXdvcmtlcuWIhumFjeS7u+WKoSwg5ZCI5bm26K+35rGCXG4gIGZ1bmN0aW9uIGRpc3BhdGNoKHdvcmtlciwgbWlzc2lvbil7XG4gICAgLy9jb25zb2xlLmxvZyhcIiVjU1RBUlQ6IHdvcmtlcklkOiAlcywgbWlzc2lvblNpZ25hdHVyZTogJXNcIiwgXCJjb2xvcjpncmVlblwiLCB3b3JrZXIuaWQsIG1pc3Npb24uc2lnbmF0dXJlKTtcblxuICAgIHZhciBmaW5pc2hIYW5kbGVyID0gZnVuY3Rpb24oKXtcbiAgICAgIC8vIOW9kui/mHdvcmtlclxuICAgICAgY29udGV4dC53b3JrZXJzLnB1c2god29ya2VyKTtcbiAgICAgIGNvbnRleHQuZW1pdHRlci5lbWl0KFwid29ya2VyOmFkZFwiKTtcbiAgICAgIC8vIOWIoOmZpCDmiafooYzov4fnmoQgbWlzc2lvbkRlZmVyXG4gICAgICBjb250ZXh0Lm1pc3Npb25EZWZlcnMuZGVsZXRlKG1pc3Npb24uZGVmZXIpO1xuICAgIH07XG5cbiAgICB3b3JrZXIuZG8obWlzc2lvbikudGhlbihcbiAgICAgIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBtaXNzaW9uLmRlZmVyLnJlc29sdmUoZGF0YSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiJWNSZXNvbHZlOiBtICVzLCB3ICVzIFwiLCBcImNvbG9yOmJsdWVcIiwgbWlzc2lvbiwgd29ya2VyLmlkKTtcbiAgICAgICAgZmluaXNoSGFuZGxlcigpO1xuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIG1pc3Npb24uZGVmZXIucmVqZWN0KHJlYXNvbik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiJWNSZWplY3Q6IG0gJXMsIHcgJXMgXCIsIFwiY29sb3I6cmVkXCIsIG1pc3Npb24sIHdvcmtlci5pZCk7XG4gICAgICAgIGZpbmlzaEhhbmRsZXIoKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1pc3Npb25EaXNwYXRjaGVyO1xuIl19