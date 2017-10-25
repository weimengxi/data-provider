import Deferred from "./utils/Deferred";
import {createComboDefer} from "./utils/comboPromise";
import {EventEmitter} from "events";

// 会不会溢出？
let serialNumber = 0;

function makeMissionKey(mission){
  let missionKey = mission.config.comboRequestEnabled
    ? mission.signature
    : serialNumber++;
  return missionKey;
}

/*
 * @param {WorkerFactory|Function} 生成worker的工厂
 * @param {count|countber} 生成worker的数量
 */
class MissionDispatcher {
  // 【!!!约定】 以下划线开头的是私有变量，请不要调用
  _context = {
    workers: [], // worker队列
    missionQueue: [], // 任务队列
    // 持有相同defer的mission, 结构类似{missionDefer: mission}
    missionDefers: new Map(),
    isRunning: false, // controller的运行状态
    emitter: new EventEmitter()
  };

  constructor(WorkerFactory, count, strategy) {
    for (let i = 0; i < count; i++) {
      let worker = new WorkerFactory(strategy);
      worker.id = i;
      this._context.workers.push(worker);
    }

    this._context.emitter.on("mission:put", run.bind(this._context));
    this._context.emitter.on("worker:add", run.bind(this._context));
  }

  put(mission) {
    let missionKey = makeMissionKey(mission),
      missionDefer = createComboDefer(missionKey),
      missionInQueue = Object.assign({}, mission, {
        defer: missionDefer
      });

    if (this._context.missionDefers.has(missionDefer) === false) {
      this._context.missionDefers.set(missionDefer, missionInQueue);
      this._context.missionQueue.push(missionInQueue);
      this._context.emitter.emit("mission:put", run);
    }

    return missionDefer.promise;
  }

  start() {
    if (this._context.isRunning === false) {
      this._context.isRunning = true;
      run.bind(this._context)();
    } else {
      console.log(" MissionDispatcher is already Running ... ");
    }
  }

  stop() {
    this._context.isRunning = false;
  }
}

function run(){
  let threadsCount,
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
  function dispatch(worker, mission){
    //console.log("%cSTART: workerId: %s, missionSignature: %s", "color:green", worker.id, mission.signature);

    var finishHandler = function(){
      // 归还worker
      context.workers.push(worker);
      context.emitter.emit("worker:add");
      // 删除 执行过的 missionDefer
      context.missionDefers.delete(mission.defer);
    };

    worker.do(mission).then(
      function(data){
        mission.defer.resolve(data);
        // console.log("%cResolve: m %s, w %s ", "color:blue", mission, worker.id);
        finishHandler();
      },
      function(reason){
        mission.defer.reject(reason);
        // console.log("%cReject: m %s, w %s ", "color:red", mission, worker.id);
        finishHandler();
      }
    );
  }
}

export default MissionDispatcher;
