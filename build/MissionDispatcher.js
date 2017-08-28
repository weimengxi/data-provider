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
//# sourceMappingURL=MissionDispatcher.js.map