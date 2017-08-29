'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Deferred = require('./utils/Deferred');

var _Deferred2 = _interopRequireDefault(_Deferred);

var _ComboPromise = require('./utils/ComboPromise');

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
    function MissionDispatcher(WorkerFactory, count) {
        (0, _classCallCheck3['default'])(this, MissionDispatcher);
        this._context = {
            workers: [], // worker队列
            missionQueue: [], // 任务队列 
            // 持有相同defer的mission, 结构类似{missionDefer: mission} 
            missionDefers: new _map2['default'](),
            isRunning: false, // controller的运行状态 
            emitter: new _events.EventEmitter()
        };

        for (var i = 0; i < count; i++) {
            var worker = new WorkerFactory();
            worker.id = i;
            this._context.workers.push(worker);
        }

        this._context.emitter.on('mission:put', run.bind(this._context));
        this._context.emitter.on('worker:add', run.bind(this._context));
    }

    // 【!!!约定】 以下划线开头的是私有变量，请不要调用 


    (0, _createClass3['default'])(MissionDispatcher, [{
        key: 'put',
        value: function put(mission) {

            var missionKey = makeMissionKey(mission),
                missionDefer = (0, _ComboPromise.createComboDefer)(missionKey),
                missionInQueue = (0, _assign2['default'])({}, mission, { defer: missionDefer });

            if (this._context.missionDefers.has(missionDefer) === false) {
                this._context.missionDefers.set(missionDefer, missionInQueue);
                this._context.missionQueue.push(missionInQueue);
                this._context.emitter.emit('mission:put', run);
            }

            return missionDefer.promise;
        }
    }, {
        key: 'start',
        value: function start() {
            if (this._context.isRunning === false) {
                this._context.isRunning = true;
                run.bind(this._context)();
            } else {
                console.log(' MissionDispatcher is already Running ... ');
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            this._context.isRunning = false;
        }
    }]);
    return MissionDispatcher;
}();

function run() {

    var threadsCount = void 0,
        context = this;

    if (context.isRunning === false) {
        console.warn(' MissionDispatcher is stopped ... ');
        return;
    }

    if (context.missionQueue.length === 0) {
        console.log(' No Mission ...  ');
        return;
    }

    if (context.workers.length === 0) {
        console.log(' No Avaliable workers ...  ');
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
            context.missionDefers['delete'](mission.defer);
        };

        worker['do'](mission).then(function (data) {
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

exports['default'] = MissionDispatcher;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NaXNzaW9uRGlzcGF0Y2hlci5qcyJdLCJuYW1lcyI6WyJzZXJpYWxOdW1iZXIiLCJtYWtlTWlzc2lvbktleSIsIm1pc3Npb24iLCJtaXNzaW9uS2V5IiwiY29uZmlnIiwiY29tYm9SZXF1ZXN0RW5hYmxlZCIsInNpZ25hdHVyZSIsIk1pc3Npb25EaXNwYXRjaGVyIiwiV29ya2VyRmFjdG9yeSIsImNvdW50IiwiX2NvbnRleHQiLCJ3b3JrZXJzIiwibWlzc2lvblF1ZXVlIiwibWlzc2lvbkRlZmVycyIsImlzUnVubmluZyIsImVtaXR0ZXIiLCJpIiwid29ya2VyIiwiaWQiLCJwdXNoIiwib24iLCJydW4iLCJiaW5kIiwibWlzc2lvbkRlZmVyIiwibWlzc2lvbkluUXVldWUiLCJkZWZlciIsImhhcyIsInNldCIsImVtaXQiLCJwcm9taXNlIiwiY29uc29sZSIsImxvZyIsInRocmVhZHNDb3VudCIsImNvbnRleHQiLCJ3YXJuIiwibGVuZ3RoIiwiTWF0aCIsIm1pbiIsImRpc3BhdGNoIiwic2hpZnQiLCJmaW5pc2hIYW5kbGVyIiwidGhlbiIsImRhdGEiLCJyZXNvbHZlIiwicmVhc29uIiwicmVqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUVBO0FBQ0EsSUFBSUEsZUFBZSxDQUFuQjs7QUFFQSxTQUFTQyxjQUFULENBQXdCQyxPQUF4QixFQUFpQztBQUM3QixRQUFJQyxhQUFhRCxRQUFRRSxNQUFSLENBQWVDLG1CQUFmLEdBQXFDSCxRQUFRSSxTQUE3QyxHQUF5RE4sY0FBMUU7QUFDQSxXQUFPRyxVQUFQO0FBQ0g7O0FBRUQ7Ozs7O0lBSU1JLGlCO0FBWUYsK0JBQVlDLGFBQVosRUFBMkJDLEtBQTNCLEVBQWtDO0FBQUE7QUFBQSxhQVRsQ0MsUUFTa0MsR0FUdkI7QUFDUEMscUJBQVMsRUFERixFQUNNO0FBQ2JDLDBCQUFjLEVBRlAsRUFFVztBQUNsQjtBQUNBQywyQkFBZSxzQkFKUjtBQUtQQyx1QkFBVyxLQUxKLEVBS1c7QUFDbEJDLHFCQUFTO0FBTkYsU0FTdUI7O0FBQzlCLGFBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJUCxLQUFwQixFQUEyQk8sR0FBM0IsRUFBZ0M7QUFDNUIsZ0JBQUlDLFNBQVMsSUFBSVQsYUFBSixFQUFiO0FBQ0FTLG1CQUFPQyxFQUFQLEdBQVlGLENBQVo7QUFDQSxpQkFBS04sUUFBTCxDQUFjQyxPQUFkLENBQXNCUSxJQUF0QixDQUEyQkYsTUFBM0I7QUFDSDs7QUFFRCxhQUFLUCxRQUFMLENBQWNLLE9BQWQsQ0FBc0JLLEVBQXRCLENBQXlCLGFBQXpCLEVBQXdDQyxJQUFJQyxJQUFKLENBQVMsS0FBS1osUUFBZCxDQUF4QztBQUNBLGFBQUtBLFFBQUwsQ0FBY0ssT0FBZCxDQUFzQkssRUFBdEIsQ0FBeUIsWUFBekIsRUFBdUNDLElBQUlDLElBQUosQ0FBUyxLQUFLWixRQUFkLENBQXZDO0FBRUg7O0FBcEJEOzs7Ozs0QkFzQklSLE8sRUFBUzs7QUFFVCxnQkFBSUMsYUFBYUYsZUFBZUMsT0FBZixDQUFqQjtBQUFBLGdCQUNJcUIsZUFBZSxvQ0FBaUJwQixVQUFqQixDQURuQjtBQUFBLGdCQUVJcUIsaUJBQWlCLHlCQUFjLEVBQWQsRUFBa0J0QixPQUFsQixFQUEyQixFQUFFdUIsT0FBT0YsWUFBVCxFQUEzQixDQUZyQjs7QUFJQSxnQkFBSSxLQUFLYixRQUFMLENBQWNHLGFBQWQsQ0FBNEJhLEdBQTVCLENBQWdDSCxZQUFoQyxNQUFrRCxLQUF0RCxFQUE2RDtBQUN6RCxxQkFBS2IsUUFBTCxDQUFjRyxhQUFkLENBQTRCYyxHQUE1QixDQUFnQ0osWUFBaEMsRUFBOENDLGNBQTlDO0FBQ0EscUJBQUtkLFFBQUwsQ0FBY0UsWUFBZCxDQUEyQk8sSUFBM0IsQ0FBZ0NLLGNBQWhDO0FBQ0EscUJBQUtkLFFBQUwsQ0FBY0ssT0FBZCxDQUFzQmEsSUFBdEIsQ0FBMkIsYUFBM0IsRUFBMENQLEdBQTFDO0FBQ0g7O0FBRUQsbUJBQU9FLGFBQWFNLE9BQXBCO0FBRUg7OztnQ0FFTztBQUNKLGdCQUFJLEtBQUtuQixRQUFMLENBQWNJLFNBQWQsS0FBNEIsS0FBaEMsRUFBdUM7QUFDbkMscUJBQUtKLFFBQUwsQ0FBY0ksU0FBZCxHQUEwQixJQUExQjtBQUNBTyxvQkFBSUMsSUFBSixDQUFTLEtBQUtaLFFBQWQ7QUFDSCxhQUhELE1BR087QUFDSG9CLHdCQUFRQyxHQUFSLENBQVksNENBQVo7QUFDSDtBQUNKOzs7K0JBRU07QUFDSCxpQkFBS3JCLFFBQUwsQ0FBY0ksU0FBZCxHQUEwQixLQUExQjtBQUNIOzs7OztBQUlMLFNBQVNPLEdBQVQsR0FBZTs7QUFFWCxRQUFJVyxxQkFBSjtBQUFBLFFBQ0lDLFVBQVUsSUFEZDs7QUFHQSxRQUFJQSxRQUFRbkIsU0FBUixLQUFzQixLQUExQixFQUFpQztBQUM3QmdCLGdCQUFRSSxJQUFSLENBQWEsb0NBQWI7QUFDQTtBQUNIOztBQUVELFFBQUlELFFBQVFyQixZQUFSLENBQXFCdUIsTUFBckIsS0FBZ0MsQ0FBcEMsRUFBdUM7QUFDbkNMLGdCQUFRQyxHQUFSLENBQVksbUJBQVo7QUFDQTtBQUNIOztBQUVELFFBQUlFLFFBQVF0QixPQUFSLENBQWdCd0IsTUFBaEIsS0FBMkIsQ0FBL0IsRUFBa0M7QUFDOUJMLGdCQUFRQyxHQUFSLENBQVksNkJBQVo7QUFDQTtBQUNIOztBQUVEO0FBQ0FDLG1CQUFlSSxLQUFLQyxHQUFMLENBQVNKLFFBQVF0QixPQUFSLENBQWdCd0IsTUFBekIsRUFBaUNGLFFBQVFyQixZQUFSLENBQXFCdUIsTUFBdEQsQ0FBZjs7QUFFQSxXQUFPSCxlQUFlLENBQXRCLEVBQXlCO0FBQ3JCO0FBQ0FNLGlCQUFTTCxRQUFRdEIsT0FBUixDQUFnQjRCLEtBQWhCLEVBQVQsRUFBa0NOLFFBQVFyQixZQUFSLENBQXFCMkIsS0FBckIsRUFBbEMsRUFGcUIsQ0FFNEM7QUFDakVQO0FBQ0g7O0FBRUQ7QUFDQSxhQUFTTSxRQUFULENBQWtCckIsTUFBbEIsRUFBMEJmLE9BQTFCLEVBQW1DOztBQUUvQjs7QUFFQSxZQUFJc0MsZ0JBQWdCLFNBQWhCQSxhQUFnQixHQUFXO0FBQzNCO0FBQ0FQLG9CQUFRdEIsT0FBUixDQUFnQlEsSUFBaEIsQ0FBcUJGLE1BQXJCO0FBQ0FnQixvQkFBUWxCLE9BQVIsQ0FBZ0JhLElBQWhCLENBQXFCLFlBQXJCO0FBQ0E7QUFDQUssb0JBQVFwQixhQUFSLFdBQTZCWCxRQUFRdUIsS0FBckM7QUFDSCxTQU5EOztBQVFBUixxQkFBVWYsT0FBVixFQUNLdUMsSUFETCxDQUNVLFVBQVNDLElBQVQsRUFBZTtBQUNqQnhDLG9CQUFRdUIsS0FBUixDQUFja0IsT0FBZCxDQUFzQkQsSUFBdEI7QUFDQTtBQUNBRjtBQUNILFNBTEwsRUFLTyxVQUFTSSxNQUFULEVBQWlCO0FBQ2hCMUMsb0JBQVF1QixLQUFSLENBQWNvQixNQUFkLENBQXFCRCxNQUFyQjtBQUNBO0FBQ0FKO0FBQ0gsU0FUTDtBQVdIO0FBRUo7O3FCQUVjakMsaUIiLCJmaWxlIjoiTWlzc2lvbkRpc3BhdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGVmZXJyZWQgZnJvbSAnLi91dGlscy9EZWZlcnJlZCc7XG5pbXBvcnQgeyBjcmVhdGVDb21ib0RlZmVyIH0gZnJvbSAnLi91dGlscy9Db21ib1Byb21pc2UnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLy8g5Lya5LiN5Lya5rqi5Ye677yfXG5sZXQgc2VyaWFsTnVtYmVyID0gMDtcblxuZnVuY3Rpb24gbWFrZU1pc3Npb25LZXkobWlzc2lvbikge1xuICAgIGxldCBtaXNzaW9uS2V5ID0gbWlzc2lvbi5jb25maWcuY29tYm9SZXF1ZXN0RW5hYmxlZCA/IG1pc3Npb24uc2lnbmF0dXJlIDogc2VyaWFsTnVtYmVyKys7XG4gICAgcmV0dXJuIG1pc3Npb25LZXk7XG59XG5cbi8qXG4gKiBAcGFyYW0ge1dvcmtlckZhY3Rvcnl8RnVuY3Rpb259IOeUn+aIkHdvcmtlcueahOW3peWOglxuICogQHBhcmFtIHtjb3VudHxjb3VudGJlcn0g55Sf5oiQd29ya2Vy55qE5pWw6YePIFxuICovXG5jbGFzcyBNaXNzaW9uRGlzcGF0Y2hlciB7XG5cbiAgICAvLyDjgJAhISHnuqblrprjgJEg5Lul5LiL5YiS57q/5byA5aS055qE5piv56eB5pyJ5Y+Y6YeP77yM6K+35LiN6KaB6LCD55SoIFxuICAgIF9jb250ZXh0ID0ge1xuICAgICAgICB3b3JrZXJzOiBbXSwgLy8gd29ya2Vy6Zif5YiXXG4gICAgICAgIG1pc3Npb25RdWV1ZTogW10sIC8vIOS7u+WKoemYn+WIlyBcbiAgICAgICAgLy8g5oyB5pyJ55u45ZCMZGVmZXLnmoRtaXNzaW9uLCDnu5PmnoTnsbvkvLx7bWlzc2lvbkRlZmVyOiBtaXNzaW9ufSBcbiAgICAgICAgbWlzc2lvbkRlZmVyczogbmV3IE1hcCgpLFxuICAgICAgICBpc1J1bm5pbmc6IGZhbHNlLCAvLyBjb250cm9sbGVy55qE6L+Q6KGM54q25oCBIFxuICAgICAgICBlbWl0dGVyOiBuZXcgRXZlbnRFbWl0dGVyKClcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoV29ya2VyRmFjdG9yeSwgY291bnQpIHvCoFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGxldCB3b3JrZXIgPSBuZXcgV29ya2VyRmFjdG9yeSgpO1xuICAgICAgICAgICAgd29ya2VyLmlkID0gaTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQud29ya2Vycy5wdXNoKHdvcmtlcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jb250ZXh0LmVtaXR0ZXIub24oJ21pc3Npb246cHV0JywgcnVuLmJpbmQodGhpcy5fY29udGV4dCkpO1xuICAgICAgICB0aGlzLl9jb250ZXh0LmVtaXR0ZXIub24oJ3dvcmtlcjphZGQnLCBydW4uYmluZCh0aGlzLl9jb250ZXh0KSk7XG5cbiAgICB9XG5cbiAgICBwdXQobWlzc2lvbikge1xuXG4gICAgICAgIGxldCBtaXNzaW9uS2V5ID0gbWFrZU1pc3Npb25LZXkobWlzc2lvbiksXG4gICAgICAgICAgICBtaXNzaW9uRGVmZXIgPSBjcmVhdGVDb21ib0RlZmVyKG1pc3Npb25LZXkpLFxuICAgICAgICAgICAgbWlzc2lvbkluUXVldWUgPSBPYmplY3QuYXNzaWduKHt9LCBtaXNzaW9uLCB7IGRlZmVyOiBtaXNzaW9uRGVmZXIgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2NvbnRleHQubWlzc2lvbkRlZmVycy5oYXMobWlzc2lvbkRlZmVyKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQubWlzc2lvbkRlZmVycy5zZXQobWlzc2lvbkRlZmVyLCBtaXNzaW9uSW5RdWV1ZSk7XG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0Lm1pc3Npb25RdWV1ZS5wdXNoKG1pc3Npb25JblF1ZXVlKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQuZW1pdHRlci5lbWl0KCdtaXNzaW9uOnB1dCcsIHJ1bik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWlzc2lvbkRlZmVyLnByb21pc2U7XG5cbiAgICB9O1xuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0LmlzUnVubmluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQuaXNSdW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHJ1bi5iaW5kKHRoaXMuX2NvbnRleHQpKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnIE1pc3Npb25EaXNwYXRjaGVyIGlzIGFscmVhZHkgUnVubmluZyAuLi4gJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5fY29udGV4dC5pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gcnVuKCkge1xuXG4gICAgbGV0IHRocmVhZHNDb3VudCxcbiAgICAgICAgY29udGV4dCA9IHRoaXM7XG5cbiAgICBpZiAoY29udGV4dC5pc1J1bm5pbmcgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignIE1pc3Npb25EaXNwYXRjaGVyIGlzIHN0b3BwZWQgLi4uICcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQubWlzc2lvblF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zb2xlLmxvZygnIE5vIE1pc3Npb24gLi4uICAnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb250ZXh0LndvcmtlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCcgTm8gQXZhbGlhYmxlIHdvcmtlcnMgLi4uICAnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHJlYWxEbyBNaXNzaW9uID09PT1cbiAgICB0aHJlYWRzQ291bnQgPSBNYXRoLm1pbihjb250ZXh0LndvcmtlcnMubGVuZ3RoLCBjb250ZXh0Lm1pc3Npb25RdWV1ZS5sZW5ndGgpO1xuXG4gICAgd2hpbGUgKHRocmVhZHNDb3VudCA+IDApIHtcbiAgICAgICAgLy8g5LuObWFw6YeM5Ye656ys5LiA5LiqXG4gICAgICAgIGRpc3BhdGNoKGNvbnRleHQud29ya2Vycy5zaGlmdCgpLCBjb250ZXh0Lm1pc3Npb25RdWV1ZS5zaGlmdCgpKTsgLy8gRklGT1xuICAgICAgICB0aHJlYWRzQ291bnQtLTtcbiAgICB9XG5cbiAgICAvLyDnu5l3b3JrZXLliIbphY3ku7vliqEsIOWQiOW5tuivt+axglxuICAgIGZ1bmN0aW9uIGRpc3BhdGNoKHdvcmtlciwgbWlzc2lvbikge1xuXG4gICAgICAgIC8vY29uc29sZS5sb2coXCIlY1NUQVJUOiB3b3JrZXJJZDogJXMsIG1pc3Npb25TaWduYXR1cmU6ICVzXCIsIFwiY29sb3I6Z3JlZW5cIiwgd29ya2VyLmlkLCBtaXNzaW9uLnNpZ25hdHVyZSk7XG5cbiAgICAgICAgdmFyIGZpbmlzaEhhbmRsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIOW9kui/mHdvcmtlclxuICAgICAgICAgICAgY29udGV4dC53b3JrZXJzLnB1c2god29ya2VyKTtcbiAgICAgICAgICAgIGNvbnRleHQuZW1pdHRlci5lbWl0KFwid29ya2VyOmFkZFwiKTtcbiAgICAgICAgICAgIC8vIOWIoOmZpCDmiafooYzov4fnmoQgbWlzc2lvbkRlZmVyXG4gICAgICAgICAgICBjb250ZXh0Lm1pc3Npb25EZWZlcnMuZGVsZXRlKG1pc3Npb24uZGVmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgd29ya2VyLmRvKG1pc3Npb24pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgbWlzc2lvbi5kZWZlci5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiJWNSZXNvbHZlOiBtICVzLCB3ICVzIFwiLCBcImNvbG9yOmJsdWVcIiwgbWlzc2lvbiwgd29ya2VyLmlkKTtcbiAgICAgICAgICAgICAgICBmaW5pc2hIYW5kbGVyKCk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICAgICAgICBtaXNzaW9uLmRlZmVyLnJlamVjdChyZWFzb24pO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiJWNSZWplY3Q6IG0gJXMsIHcgJXMgXCIsIFwiY29sb3I6cmVkXCIsIG1pc3Npb24sIHdvcmtlci5pZCk7XG4gICAgICAgICAgICAgICAgZmluaXNoSGFuZGxlcigpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWlzc2lvbkRpc3BhdGNoZXI7XG4iXX0=