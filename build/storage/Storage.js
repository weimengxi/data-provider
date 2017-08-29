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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * [Storage description]
 * @param {[string]}  id       [惟一标识]
 * @param {Boolean} isMemory [是否使用内存级存储，默认为flase 即持久存储]
 */
var _ins = {};
var prefix = _const2['default'].NAMESPACE;

var Storage = function () {
    function Storage(id) {
        var isMemory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        (0, _classCallCheck3['default'])(this, Storage);

        // Singleton pattern
        if (!(_ins[id] instanceof Storage)) {
            _ins[id] = this;
        } else {
            return _ins[id];
        }

        this.id = id;
        this.ns = prefix + "_" + id + "_";

        this._methods = isMemory ? _Solution2['default'].memory.methods : function () {
            if (_Solution2['default'].localStorage.test()) {
                return _Solution2['default'].localStorage.methods;
            }
            if (_Solution2['default'].userData.test()) {
                return _Solution2['default'].userData.methods;
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

    (0, _createClass3['default'])(Storage, [{
        key: 'encode',
        value: function encode(data) {
            return window.JSON ? (0, _stringify2['default'])(data) : data;
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

exports['default'] = Storage;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdG9yYWdlL1N0b3JhZ2UuanMiXSwibmFtZXMiOlsiX2lucyIsInByZWZpeCIsIk5BTUVTUEFDRSIsIlN0b3JhZ2UiLCJpZCIsImlzTWVtb3J5IiwibnMiLCJfbWV0aG9kcyIsIm1lbW9yeSIsIm1ldGhvZHMiLCJsb2NhbFN0b3JhZ2UiLCJ0ZXN0IiwidXNlckRhdGEiLCJpbml0IiwiZ2V0Iiwic2V0IiwicmVtb3ZlIiwiY2xlYXIiLCJkYXRhIiwid2luZG93IiwiSlNPTiIsInBhcnNlIiwia2V5IiwidmFsdWUiLCJlbmNvZGUiLCJlIiwiZGVjb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7QUFLQSxJQUFJQSxPQUFPLEVBQVg7QUFDQSxJQUFJQyxTQUFTLG1CQUFNQyxTQUFuQjs7SUFFTUMsTztBQUVGLHFCQUFZQyxFQUFaLEVBQWtDO0FBQUEsWUFBbEJDLFFBQWtCLHVFQUFQLEtBQU87QUFBQTs7QUFDOUI7QUFDQSxZQUFJLEVBQUVMLEtBQUtJLEVBQUwsYUFBb0JELE9BQXRCLENBQUosRUFBb0M7QUFDaENILGlCQUFLSSxFQUFMLElBQVcsSUFBWDtBQUNILFNBRkQsTUFFTztBQUNILG1CQUFPSixLQUFLSSxFQUFMLENBQVA7QUFDSDs7QUFFRCxhQUFLQSxFQUFMLEdBQVVBLEVBQVY7QUFDQSxhQUFLRSxFQUFMLEdBQVVMLFNBQVMsR0FBVCxHQUFlRyxFQUFmLEdBQW9CLEdBQTlCOztBQUVBLGFBQUtHLFFBQUwsR0FBZ0JGLFdBQVcsc0JBQVNHLE1BQVQsQ0FBZ0JDLE9BQTNCLEdBQXNDLFlBQVc7QUFDN0QsZ0JBQUksc0JBQVNDLFlBQVQsQ0FBc0JDLElBQXRCLEVBQUosRUFBa0M7QUFDOUIsdUJBQU8sc0JBQVNELFlBQVQsQ0FBc0JELE9BQTdCO0FBQ0g7QUFDRCxnQkFBSSxzQkFBU0csUUFBVCxDQUFrQkQsSUFBbEIsRUFBSixFQUE4QjtBQUMxQix1QkFBTyxzQkFBU0MsUUFBVCxDQUFrQkgsT0FBekI7QUFDSDtBQUNELG1CQUFPO0FBQ0hJLHNCQUFNLGdCQUFXLENBQUUsQ0FEaEI7QUFFSEMscUJBQUssZUFBVyxDQUFFLENBRmY7QUFHSEMscUJBQUssZUFBVyxDQUFFLENBSGY7QUFJSEMsd0JBQVEsa0JBQVcsQ0FBRSxDQUpsQjtBQUtIQyx1QkFBTyxpQkFBVyxDQUFFO0FBTGpCLGFBQVA7QUFPSCxTQWRvRCxFQUFyRDs7QUFnQkEsWUFBSSxLQUFLVixRQUFULEVBQW1CO0FBQ2YsaUJBQUtBLFFBQUwsQ0FBY00sSUFBZCxDQUFtQixLQUFLUCxFQUF4QjtBQUNIO0FBRUo7Ozs7K0JBRU1ZLEksRUFBTTtBQUNULG1CQUFPQyxPQUFPQyxJQUFQLEdBQWMsNEJBQWVGLElBQWYsQ0FBZCxHQUFxQ0EsSUFBNUM7QUFDSDs7OytCQUVNQSxJLEVBQU07QUFDVCxtQkFBT0MsT0FBT0MsSUFBUCxHQUFjQSxLQUFLQyxLQUFMLENBQVdILElBQVgsQ0FBZCxHQUFpQ0EsSUFBeEM7QUFDSDs7OzRCQUVHSSxHLEVBQUtDLEssRUFBTztBQUNaLGdCQUFJO0FBQ0EscUJBQUtoQixRQUFMLENBQWNRLEdBQWQsQ0FBa0IsS0FBS1QsRUFBdkIsRUFBMkJnQixHQUEzQixFQUFnQyxLQUFLRSxNQUFMLENBQVlELEtBQVosQ0FBaEM7QUFDQSx1QkFBTyxJQUFQO0FBQ0gsYUFIRCxDQUdFLE9BQU9FLENBQVAsRUFBVTtBQUNSLHVCQUFPLEtBQVA7QUFDSDtBQUNKOzs7NEJBRUdILEcsRUFBSztBQUNMLGdCQUFJO0FBQ0EsdUJBQU8sS0FBS0ksTUFBTCxDQUFZLEtBQUtuQixRQUFMLENBQWNPLEdBQWQsQ0FBa0IsS0FBS1IsRUFBdkIsRUFBMkJnQixHQUEzQixDQUFaLENBQVA7QUFDSCxhQUZELENBRUUsT0FBT0csQ0FBUCxFQUFVLENBQUU7QUFDakI7OzsrQkFFTUgsRyxFQUFLO0FBQ1IsZ0JBQUk7QUFDQSxxQkFBS2YsUUFBTCxDQUFjUyxNQUFkLENBQXFCLEtBQUtWLEVBQTFCLEVBQThCZ0IsR0FBOUI7QUFDSCxhQUZELENBRUUsT0FBT0csQ0FBUCxFQUFVLENBQUU7QUFDakI7OztnQ0FFTztBQUNKLGdCQUFJO0FBQ0EscUJBQUtsQixRQUFMLENBQWNVLEtBQWQsQ0FBb0IsS0FBS1gsRUFBekI7QUFDSCxhQUZELENBRUUsT0FBT21CLENBQVAsRUFBVSxDQUVYO0FBQ0o7Ozs7O3FCQUlVdEIsTyIsImZpbGUiOiJTdG9yYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNvbHV0aW9uIGZyb20gJy4vU29sdXRpb24nO1xuaW1wb3J0IENvbnN0IGZyb20gJy4uL2NvbnN0JztcblxuXG4vKipcbiAqIFtTdG9yYWdlIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtIHtbc3RyaW5nXX0gIGlkICAgICAgIFvmg5/kuIDmoIfor4ZdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzTWVtb3J5IFvmmK/lkKbkvb/nlKjlhoXlrZjnuqflrZjlgqjvvIzpu5jorqTkuLpmbGFzZSDljbPmjIHkuYXlrZjlgqhdXG4gKi9cbnZhciBfaW5zID0ge307XG52YXIgcHJlZml4ID0gQ29uc3QuTkFNRVNQQUNFO1xuXG5jbGFzcyBTdG9yYWdlIHtcblxuICAgIGNvbnN0cnVjdG9yKGlkLCBpc01lbW9yeSA9IGZhbHNlKSB7XG4gICAgICAgIC8vIFNpbmdsZXRvbiBwYXR0ZXJuXG4gICAgICAgIGlmICghKF9pbnNbaWRdIGluc3RhbmNlb2YgU3RvcmFnZSkpIHtcbiAgICAgICAgICAgIF9pbnNbaWRdID0gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfaW5zW2lkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5ucyA9IHByZWZpeCArIFwiX1wiICsgaWQgKyBcIl9cIjtcblxuICAgICAgICB0aGlzLl9tZXRob2RzID0gaXNNZW1vcnkgPyBTb2x1dGlvbi5tZW1vcnkubWV0aG9kcyA6IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChTb2x1dGlvbi5sb2NhbFN0b3JhZ2UudGVzdCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNvbHV0aW9uLmxvY2FsU3RvcmFnZS5tZXRob2RzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFNvbHV0aW9uLnVzZXJEYXRhLnRlc3QoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTb2x1dGlvbi51c2VyRGF0YS5tZXRob2RzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpIHt9LFxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICAgICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHt9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIGlmICh0aGlzLl9tZXRob2RzKSB7XG4gICAgICAgICAgICB0aGlzLl9tZXRob2RzLmluaXQodGhpcy5ucyk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGVuY29kZShkYXRhKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuSlNPTiA/IEpTT04uc3RyaW5naWZ5KGRhdGEpIDogZGF0YTtcbiAgICB9XG5cbiAgICBkZWNvZGUoZGF0YSkge1xuICAgICAgICByZXR1cm4gd2luZG93LkpTT04gPyBKU09OLnBhcnNlKGRhdGEpIDogZGF0YTtcbiAgICB9XG5cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fbWV0aG9kcy5zZXQodGhpcy5ucywga2V5LCB0aGlzLmVuY29kZSh2YWx1ZSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldChrZXkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlY29kZSh0aGlzLl9tZXRob2RzLmdldCh0aGlzLm5zLCBrZXkpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgICByZW1vdmUoa2V5KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9tZXRob2RzLnJlbW92ZSh0aGlzLm5zLCBrZXkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fbWV0aG9kcy5jbGVhcih0aGlzLm5zKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RvcmFnZTtcbiJdfQ==