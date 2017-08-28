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
//# sourceMappingURL=ComboPromise.js.map