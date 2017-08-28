//存储服务
var Solution = {};
var _memoryStorage = {};

Solution["localStorage"] = {
    test: function() {
        try {
            return window.localStorage ? true : false;
        } catch (e) {
            return false;
        }
    },
    methods: {
        init: function(ns) {},
        set: function(ns, key, value) {
            try {
                localStorage.setItem(ns + key, value);
            } catch (e) {
                throw e;
            }
        }, //throw
        get: function(ns, key) {
            return localStorage.getItem(ns + key);
        },
        remove: function(ns, key) {
            localStorage.removeItem(ns + key);
        },
        clear: function(ns) {
            if (!ns) {
                localStorage.clear();
            } else {
                for (var i = localStorage.length - 1, key; key = localStorage.key(i--);) {
                    if (key && key.indexOf(ns) === 0) {
                        localStorage.removeItem(key);
                    }
                }
            }
        }
    }
};
Solution["userData"] = {
    test: function() {
        try {
            return window.ActiveXObject && document.documentElement.addBehavior ? true : false
        } catch (e) {
            return false;
        }
    },
    methods: {
        _owners: {},
        init: function(ns) {
            if (!this._owners[ns]) {
                if (document.getElementById(ns)) {
                    this._owners[ns] = document.getElementById(ns);
                } else {
                    var el = document.createElement('script'),
                        head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                    el.id = ns;
                    el.style.display = 'none';
                    el.addBehavior('#default#userdata');
                    head.insertBefore(el, head.firstChild);
                    this._owners[ns] = el;
                }
                try {
                    this._owners[ns].load(ns);
                } catch (e) {}
                var _self = this;
                window.attachEvent("onunload", function() {
                    _self._owners[ns] = null;
                });
            }
        },
        set: function(ns, key, value) {
            if (this._owners[ns]) {
                try {
                    this._owners[ns].setAttribute(key, value);
                    this._owners[ns].save(ns);
                } catch (e) {
                    throw e;
                }
            }
        },
        get: function(ns, key) {
            if (this._owners[ns]) {
                this._owners[ns].load(ns);
                return this._owners[ns].getAttribute(key) || null;
            }
            return null;
        },
        remove: function(ns, key) {
            if (this._owners[ns]) {
                this._owners[ns].removeAttribute(key);
                this._owners[ns].save(ns);
            }
        },
        clear: function(ns) {
            if (this._owners[ns]) {
                var attributes = this._owners[ns].XMLDocument.documentElement.attributes;
                this._owners[ns].load(ns);
                for (var i = 0, attr; attr = attributes[i]; i++) {
                    this._owners[ns].removeAttribute(attr.name)
                }
                this._owners[ns].save(ns);
            }
        }
    }
};

Solution["memory"] = {
    test: function() {
        return true;
    },
    methods: {
        init: function(ns) {
            _memoryStorage[ns] = {}
        },
        get: function(ns, key) {
            return _memoryStorage[ns][key]
        },
        set: function(ns, key, value) {
            _memoryStorage[ns][key] = value
        },
        remove: function(ns, key) {
            delete _memoryStorage[ns][key]
        },
        clear: function(ns) {
            delete _memoryStorage[ns]
        }
    }
};

export default Solution;
