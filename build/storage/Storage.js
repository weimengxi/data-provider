'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Solution = require('./Solution');

var _Solution2 = _interopRequireDefault(_Solution);

var _const = require('../const');

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [Storage description]
 * @param {[string]}  id       [惟一标识]
 * @param {Boolean} isMemory [是否使用内存级存储，默认为flase 即持久存储]
 */
var _ins = {};
var prefix = _const2.default.NAMESPACE;

var Storage = function () {
    function Storage(id) {
        var isMemory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        (0, _classCallCheck3.default)(this, Storage);

        // Singleton pattern
        if (!(_ins[id] instanceof Storage)) {
            _ins[id] = this;
        } else {
            return _ins[id];
        }

        this.id = id;
        this.ns = prefix + "_" + id + "_";

        this._methods = isMemory ? _Solution2.default.memory.methods : function () {
            if (_Solution2.default.localStorage.test()) {
                return _Solution2.default.localStorage.methods;
            }
            if (_Solution2.default.userData.test()) {
                return _Solution2.default.userData.methods;
            }
            return {
                init: function init() {},
                get: function get() {},
                set: function set() {},
                remove: function remove() {},
                clear: function clear() {}
            };
        }();

        if (this._methods) {
            this._methods.init(this.ns);
        }
    }

    (0, _createClass3.default)(Storage, [{
        key: 'encode',
        value: function encode(data) {
            return window.JSON ? (0, _stringify2.default)(data) : data;
        }
    }, {
        key: 'decode',
        value: function decode(data) {
            return window.JSON ? JSON.parse(data) : data;
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            try {
                this._methods.set(this.ns, key, this.encode(value));
                return true;
            } catch (e) {
                return false;
            }
        }
    }, {
        key: 'get',
        value: function get(key) {
            try {
                return this.decode(this._methods.get(this.ns, key));
            } catch (e) {}
        }
    }, {
        key: 'remove',
        value: function remove(key) {
            try {
                this._methods.remove(this.ns, key);
            } catch (e) {}
        }
    }, {
        key: 'clear',
        value: function clear() {
            try {
                this._methods.clear(this.ns);
            } catch (e) {}
        }
    }]);
    return Storage;
}();

exports.default = Storage;
//# sourceMappingURL=Storage.js.map