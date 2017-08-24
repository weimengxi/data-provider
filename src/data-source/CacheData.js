import Storage from  './storage/Storage' ;
var _ins = {};


class CacheData {

    constructor(ns, signature = '', isMemory = false) {

        let id = ns + "_" + signature;
        // Singleton Pattern
        if (!(_ins[id] instanceof CacheData)) {
            _ins[id] = this;
        } else {
            return _ins[id];
        }

        this.id = id;
        this.signature = signature;
        //CacheData中只采取持久存储方案
        this.storage = new Storage(ns, isMemory);
    }

    clear() {
        this.storage.clear();
    };

    item(key, opts) {
        opts = opts || {};
        return new CacheDataItem(this.storage, this.signature, key, opts);
    };

}

class CacheDataItem {

    constructor(storage, signature, key, opts) {

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
        }

    }

    setFormatter(setter, getter) {
        this.dataFormatter = {
            setter: setter || null,
            getter: getter || null
        }
    }

    set(data) {
        if (this.dataFormatter && this.dataFormatter.setter) {
            data = this.dataFormatter.setter(data);
        }
        var value = {
            data: data,
            time: (new Date()).getTime(),
            signature: this.signature
        }
        if (this.maxAge) {
            value.expires = (new Date()).getTime() + this.maxAge;
        }
        if (value.data) {
            this.storage.set(this.key, value);
        }
    }

    get() {
        var data = this.storage.get(this.key);
        if (data && data.signature === this.signature && (this.ignoreExpires || !data.expires || (new Date()).getTime() < data.expires)) {
            data = data.data;

            if (this.dataFormatter && this.dataFormatter.getter) {
                data = this.dataFormatter.getter(data);
            }
            return data;
        }
        return null;
    }

    remove() {
        this.storage.remove(this.key);
    }

    isExpired() {
        var data = this.storage.get(this.key);
        return !!data && !!data.expires && (new Date()).getTime() >= data.expires;
    }

    getUpdatedTime() {
        var data = this.storage.get(this.key);
        return data && (data.time - 0);
    }

    getExpires() {
        var data = this.storage.get(this.key);
        return data && data.expires;
    }

}

export default CacheData;
