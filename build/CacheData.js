'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Storage = require('./storage/Storage');

var _Storage2 = _interopRequireDefault(_Storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ins = {};

var CacheData = function () {
    function CacheData(ns) {
        var signature = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var isMemory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        (0, _classCallCheck3.default)(this, CacheData);


        var id = ns + "_" + signature;
        // Singleton Pattern
        if (!(_ins[id] instanceof CacheData)) {
            _ins[id] = this;
        } else {
            return _ins[id];
        }

        this.id = id;
        this.signature = signature;
        //CacheData中只采取持久存储方案
        this.storage = new _Storage2.default(ns, isMemory);
    }

    (0, _createClass3.default)(CacheData, [{
        key: 'clear',
        value: function clear() {
            this.storage.clear();
        }
    }, {
        key: 'item',
        value: function item(key, opts) {
            opts = opts || {};
            return new CacheDataItem(this.storage, this.signature, key, opts);
        }
    }]);
    return CacheData;
}();

var CacheDataItem = function () {
    function CacheDataItem(storage, signature, key, opts) {
        (0, _classCallCheck3.default)(this, CacheDataItem);


        // eg: url+参数序列化
        this.key = key;
        // 就是具体的存储方案， 调用它来clear, get , set
        this.storage = storage;
        // eg, v2.0
        this.signature = signature;

        this.maxAge = opts.maxAge || opts.maxage || null;

        this.ignoreExpires = opts.ignoreExpires;

        this.dataFormatter = {
            getter: null,
            setter: null
        };
    }

    (0, _createClass3.default)(CacheDataItem, [{
        key: 'setFormatter',
        value: function setFormatter(setter, getter) {
            this.dataFormatter = {
                setter: setter || null,
                getter: getter || null
            };
        }
    }, {
        key: 'set',
        value: function set(data) {
            if (this.dataFormatter && this.dataFormatter.setter) {
                data = this.dataFormatter.setter(data);
            }
            var value = {
                data: data,
                time: new Date().getTime(),
                signature: this.signature
            };
            if (this.maxAge) {
                value.expires = new Date().getTime() + this.maxAge;
            }
            if (value.data) {
                this.storage.set(this.key, value);
            }
        }
    }, {
        key: 'get',
        value: function get() {
            var data = this.storage.get(this.key);
            if (data && data.signature === this.signature && (this.ignoreExpires || !data.expires || new Date().getTime() < data.expires)) {
                data = data.data;

                if (this.dataFormatter && this.dataFormatter.getter) {
                    data = this.dataFormatter.getter(data);
                }
                return data;
            }
            return null;
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.storage.remove(this.key);
        }
    }, {
        key: 'isExpired',
        value: function isExpired() {
            var data = this.storage.get(this.key);
            return !!data && !!data.expires && new Date().getTime() >= data.expires;
        }
    }, {
        key: 'getUpdatedTime',
        value: function getUpdatedTime() {
            var data = this.storage.get(this.key);
            return data && data.time - 0;
        }
    }, {
        key: 'getExpires',
        value: function getExpires() {
            var data = this.storage.get(this.key);
            return data && data.expires;
        }
    }]);
    return CacheDataItem;
}();

exports.default = CacheData;
//# sourceMappingURL=CacheData.js.map