import Solution from './Solution';
import Const from '../Const';


/**
 * [Storage description]
 * @param {[string]}  id       [惟一标识]
 * @param {Boolean} isMemory [是否使用内存级存储，默认为flase 即持久存储]
 */
var _ins = {};
var prefix = Const.NAMESPACE;

class Storage {

    constructor(id, isMemory = false) {
        // Singleton pattern
        if (!(_ins[id] instanceof Storage)) {
            _ins[id] = this;
        } else {
            return _ins[id];
        }

        this.id = id;
        this.ns = prefix + "_" + id + "_";

        this._methods = isMemory ? Solution.memory.methods : (function() {
            if (Solution.localStorage.test()) {
                return Solution.localStorage.methods;
            }
            if (Solution.userData.test()) {
                return Solution.userData.methods;
            }
            return {
                init: function() {},
                get: function() {},
                set: function() {},
                remove: function() {},
                clear: function() {}
            };
        })();

        if (this._methods) {
            this._methods.init(this.ns);
        }

    }

    encode(data) {
        return window.JSON ? JSON.stringify(data) : data;
    }

    decode(data) {
        return window.JSON ? JSON.parse(data) : data;
    }

    set(key, value) {
        try {
            this._methods.set(this.ns, key, this.encode(value));
            return true;
        } catch (e) {
            return false;
        }
    }

    get(key) {
        try {
            return this.decode(this._methods.get(this.ns, key));
        } catch (e) {}
    }

    remove(key) {
        try {
            this._methods.remove(this.ns, key);
        } catch (e) {}
    }

    clear() {
        try {
            this._methods.clear(this.ns);
        } catch (e) {

        }
    }

}

export default Storage;
