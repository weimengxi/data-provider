import Deferred from "./Deferred";

let _runnings = {};

let comboDefersMap = new Map();

let comboPromisesMap = new Map();

const isFunction = value => {
  return Object.prototype.toString.call(value) === "[object Function]";
};

// 相同id的resolver, 将已有的promise返回， 不再创建新的promise
function createComboPromise(key, resolver){
  let promise = comboPromisesMap.get(key);

  if (!(promise instanceof Promise)) {
    promise = new Promise(resolver);
    comboPromisesMap.set(key, promise);

    promise.then(
      data => {
        comboPromisesMap.delete(key);
      },
      error => {
        comboPromisesMap.delete(key);
      }
    );
  }

  return promise;
}

function createComboDefer(id){
  let deferKey = id,
    comboDefer = comboDefersMap.get(deferKey);

  if (typeof comboDefer === "undefined") {
    comboDefer = new Deferred();
    comboDefersMap.set(deferKey, comboDefer);
  }

  // 无论成功及失败， 都要删除对应的comboDefer, 然后再将成功或失败返回
  comboDefer.promise.then(
    data => {
      comboDefersMap.delete(deferKey);
    },
    error => {
      comboDefersMap.delete(deferKey);
    }
  );

  return comboDefer;
}

export {createComboPromise, createComboDefer};

export default createComboPromise;
