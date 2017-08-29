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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ins = {};

var CacheData = function () {
    function CacheData(ns) {
        var signature = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var isMemory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        (0, _classCallCheck3['default'])(this, CacheData);


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
        this.storage = new _Storage2['default'](ns, isMemory);
    }

    (0, _createClass3['default'])(CacheData, [{
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
        (0, _classCallCheck3['default'])(this, CacheDataItem);


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

    (0, _createClass3['default'])(CacheDataItem, [{
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

exports['default'] = CacheData;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DYWNoZURhdGEuanMiXSwibmFtZXMiOlsiX2lucyIsIkNhY2hlRGF0YSIsIm5zIiwic2lnbmF0dXJlIiwiaXNNZW1vcnkiLCJpZCIsInN0b3JhZ2UiLCJjbGVhciIsImtleSIsIm9wdHMiLCJDYWNoZURhdGFJdGVtIiwibWF4QWdlIiwibWF4YWdlIiwiaWdub3JlRXhwaXJlcyIsImRhdGFGb3JtYXR0ZXIiLCJnZXR0ZXIiLCJzZXR0ZXIiLCJkYXRhIiwidmFsdWUiLCJ0aW1lIiwiRGF0ZSIsImdldFRpbWUiLCJleHBpcmVzIiwic2V0IiwiZ2V0IiwicmVtb3ZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFDQSxJQUFJQSxPQUFPLEVBQVg7O0lBR01DLFM7QUFFRix1QkFBWUMsRUFBWixFQUFrRDtBQUFBLFlBQWxDQyxTQUFrQyx1RUFBdEIsRUFBc0I7QUFBQSxZQUFsQkMsUUFBa0IsdUVBQVAsS0FBTztBQUFBOzs7QUFFOUMsWUFBSUMsS0FBS0gsS0FBSyxHQUFMLEdBQVdDLFNBQXBCO0FBQ0E7QUFDQSxZQUFJLEVBQUVILEtBQUtLLEVBQUwsYUFBb0JKLFNBQXRCLENBQUosRUFBc0M7QUFDbENELGlCQUFLSyxFQUFMLElBQVcsSUFBWDtBQUNILFNBRkQsTUFFTztBQUNILG1CQUFPTCxLQUFLSyxFQUFMLENBQVA7QUFDSDs7QUFFRCxhQUFLQSxFQUFMLEdBQVVBLEVBQVY7QUFDQSxhQUFLRixTQUFMLEdBQWlCQSxTQUFqQjtBQUNBO0FBQ0EsYUFBS0csT0FBTCxHQUFlLHlCQUFZSixFQUFaLEVBQWdCRSxRQUFoQixDQUFmO0FBQ0g7Ozs7Z0NBRU87QUFDSixpQkFBS0UsT0FBTCxDQUFhQyxLQUFiO0FBQ0g7Ozs2QkFFSUMsRyxFQUFLQyxJLEVBQU07QUFDWkEsbUJBQU9BLFFBQVEsRUFBZjtBQUNBLG1CQUFPLElBQUlDLGFBQUosQ0FBa0IsS0FBS0osT0FBdkIsRUFBZ0MsS0FBS0gsU0FBckMsRUFBZ0RLLEdBQWhE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QUFDSDs7Ozs7cUJBSVVyQixTIiwiZmlsZSI6IkNhY2hlRGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdG9yYWdlIGZyb20gICcuL3N0b3JhZ2UvU3RvcmFnZScgO1xudmFyIF9pbnMgPSB7fTtcblxuXG5jbGFzcyBDYWNoZURhdGEge1xuXG4gICAgY29uc3RydWN0b3IobnMsIHNpZ25hdHVyZSA9ICcnLCBpc01lbW9yeSA9IGZhbHNlKSB7XG5cbiAgICAgICAgbGV0IGlkID0gbnMgKyBcIl9cIiArIHNpZ25hdHVyZTtcbiAgICAgICAgLy8gU2luZ2xldG9uIFBhdHRlcm5cbiAgICAgICAgaWYgKCEoX2luc1tpZF0gaW5zdGFuY2VvZiBDYWNoZURhdGEpKSB7XG4gICAgICAgICAgICBfaW5zW2lkXSA9IHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX2luc1tpZF07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuc2lnbmF0dXJlID0gc2lnbmF0dXJlO1xuICAgICAgICAvL0NhY2hlRGF0YeS4reWPqumHh+WPluaMgeS5heWtmOWCqOaWueahiFxuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBuZXcgU3RvcmFnZShucywgaXNNZW1vcnkpO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UuY2xlYXIoKTtcbiAgICB9O1xuXG4gICAgaXRlbShrZXksIG9wdHMpIHtcbiAgICAgICAgb3B0cyA9IG9wdHMgfHwge307XG4gICAgICAgIHJldHVybiBuZXcgQ2FjaGVEYXRhSXRlbSh0aGlzLnN0b3JhZ2UsIHRoaXMuc2lnbmF0dXJlLCBrZXksIG9wdHMpO1xuICAgIH07XG5cbn1cblxuY2xhc3MgQ2FjaGVEYXRhSXRlbSB7XG5cbiAgICBjb25zdHJ1Y3RvcihzdG9yYWdlLCBzaWduYXR1cmUsIGtleSwgb3B0cykge1xuXG4gICAgICAgIC8vIGVnOiB1cmwr5Y+C5pWw5bqP5YiX5YyWXG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICAvLyDlsLHmmK/lhbfkvZPnmoTlrZjlgqjmlrnmoYjvvIwg6LCD55So5a6D5p2lY2xlYXIsIGdldCAsIHNldFxuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuICAgICAgICAvLyBlZywgdjIuMFxuICAgICAgICB0aGlzLnNpZ25hdHVyZSA9IHNpZ25hdHVyZTtcblxuICAgICAgICB0aGlzLm1heEFnZSA9IG9wdHMubWF4QWdlIHx8IG9wdHMubWF4YWdlIHx8IG51bGw7XG5cbiAgICAgICAgdGhpcy5pZ25vcmVFeHBpcmVzID0gb3B0cy5pZ25vcmVFeHBpcmVzO1xuXG4gICAgICAgIHRoaXMuZGF0YUZvcm1hdHRlciA9IHtcbiAgICAgICAgICAgIGdldHRlcjogbnVsbCxcbiAgICAgICAgICAgIHNldHRlcjogbnVsbFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBzZXRGb3JtYXR0ZXIoc2V0dGVyLCBnZXR0ZXIpIHtcbiAgICAgICAgdGhpcy5kYXRhRm9ybWF0dGVyID0ge1xuICAgICAgICAgICAgc2V0dGVyOiBzZXR0ZXIgfHwgbnVsbCxcbiAgICAgICAgICAgIGdldHRlcjogZ2V0dGVyIHx8IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldChkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFGb3JtYXR0ZXIgJiYgdGhpcy5kYXRhRm9ybWF0dGVyLnNldHRlcikge1xuICAgICAgICAgICAgZGF0YSA9IHRoaXMuZGF0YUZvcm1hdHRlci5zZXR0ZXIoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZhbHVlID0ge1xuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHRpbWU6IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCksXG4gICAgICAgICAgICBzaWduYXR1cmU6IHRoaXMuc2lnbmF0dXJlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubWF4QWdlKSB7XG4gICAgICAgICAgICB2YWx1ZS5leHBpcmVzID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSArIHRoaXMubWF4QWdlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZS5kYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0KHRoaXMua2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQoKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5zdG9yYWdlLmdldCh0aGlzLmtleSk7XG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEuc2lnbmF0dXJlID09PSB0aGlzLnNpZ25hdHVyZSAmJiAodGhpcy5pZ25vcmVFeHBpcmVzIHx8ICFkYXRhLmV4cGlyZXMgfHwgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSA8IGRhdGEuZXhwaXJlcykpIHtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmRhdGE7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFGb3JtYXR0ZXIgJiYgdGhpcy5kYXRhRm9ybWF0dGVyLmdldHRlcikge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLmRhdGFGb3JtYXR0ZXIuZ2V0dGVyKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmVtb3ZlKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlKHRoaXMua2V5KTtcbiAgICB9XG5cbiAgICBpc0V4cGlyZWQoKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5zdG9yYWdlLmdldCh0aGlzLmtleSk7XG4gICAgICAgIHJldHVybiAhIWRhdGEgJiYgISFkYXRhLmV4cGlyZXMgJiYgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSA+PSBkYXRhLmV4cGlyZXM7XG4gICAgfVxuXG4gICAgZ2V0VXBkYXRlZFRpbWUoKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5zdG9yYWdlLmdldCh0aGlzLmtleSk7XG4gICAgICAgIHJldHVybiBkYXRhICYmIChkYXRhLnRpbWUgLSAwKTtcbiAgICB9XG5cbiAgICBnZXRFeHBpcmVzKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuc3RvcmFnZS5nZXQodGhpcy5rZXkpO1xuICAgICAgICByZXR1cm4gZGF0YSAmJiBkYXRhLmV4cGlyZXM7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENhY2hlRGF0YTtcbiJdfQ==