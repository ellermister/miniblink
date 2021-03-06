var requestId;
!function(global, undefined) {
    "use strict";
    function canUseNextTick() {
        return "object" == typeof process && "[object process]" === Object.prototype.toString.call(process)
    }
    function canUseMessageChannel() {
        return !!global.MessageChannel
    }
    function canUsePostMessage() {
        if (!global.postMessage || global.importScripts)
            return !1;
        var e = !0
          , t = global.onmessage;
        return global.onmessage = function() {
            e = !1
        }
        ,
        global.postMessage("", "*"),
        global.onmessage = t,
        e
    }
    function canUseReadyStateChange() {
        return "document"in global && "onreadystatechange"in global.document.createElement("script")
    }
    function installNextTickImplementation(e) {
        e.setImmediate = function() {
            var e = tasks.addFromSetImmediateArguments(arguments);
            return process.nextTick(function() {
                tasks.runIfPresent(e)
            }),
            e
        }
    }
    function installMessageChannelImplementation(e) {
        var t = new global.MessageChannel;
        t.port1.onmessage = function(e) {
            var t = e.data;
            tasks.runIfPresent(t)
        }
        ,
        e.setImmediate = function() {
            var e = tasks.addFromSetImmediateArguments(arguments);
            return t.port2.postMessage(e),
            e
        }
    }
    function installPostMessageImplementation(e) {
        function n(e, t) {
            return "string" == typeof e && e.substring(0, t.length) === t
        }
        function t(e) {
            if (e.source === global && n(e.data, r)) {
                var t = e.data.substring(r.length);
                tasks.runIfPresent(t)
            }
        }
        var r = "com.bn.NobleJS.setImmediate" + Math.random();
        global.addEventListener ? global.addEventListener("message", t, !1) : global.attachEvent("onmessage", t),
        e.setImmediate = function() {
            var e = tasks.addFromSetImmediateArguments(arguments);
            return global.postMessage(r + e, "*"),
            e
        }
    }
    function installReadyStateChangeImplementation(e) {
        e.setImmediate = function() {
            var e = tasks.addFromSetImmediateArguments(arguments)
              , t = global.document.createElement("script");
            return t.onreadystatechange = function() {
                tasks.runIfPresent(e),
                t.onreadystatechange = null,
                t.parentNode.removeChild(t),
                t = null
            }
            ,
            global.document.documentElement.appendChild(t),
            e
        }
    }
    function installSetTimeoutImplementation(e) {
        e.setImmediate = function() {
            var e = tasks.addFromSetImmediateArguments(arguments);
            return global.setTimeout(function() {
                tasks.runIfPresent(e)
            }, 0),
            e
        }
    }
    var tasks = function() {
        function Task(e, t) {
            this.handler = e,
            this.args = t
        }
        Task.prototype.run = function() {
            if ("function" == typeof this.handler)
                this.handler.apply(undefined, this.args);
            else {
                var scriptSource = "" + this.handler;
                eval(scriptSource)
            }
        }
        ;
        var nextHandle = 1
          , tasksByHandle = {}
          , currentlyRunningATask = !1;
        return {
            addFromSetImmediateArguments: function(e) {
                var t = new Task(e[0],Array.prototype.slice.call(e, 1))
                  , n = nextHandle++;
                return tasksByHandle[n] = t,
                n
            },
            runIfPresent: function(e) {
                if (currentlyRunningATask)
                    global.setTimeout(function() {
                        tasks.runIfPresent(e)
                    }, 0);
                else {
                    var t = tasksByHandle[e];
                    if (t) {
                        currentlyRunningATask = !0;
                        try {
                            t.run()
                        } finally {
                            delete tasksByHandle[e],
                            currentlyRunningATask = !1
                        }
                    }
                }
            },
            remove: function(e) {
                delete tasksByHandle[e]
            }
        }
    }();
    if (!global.setImmediate) {
        var attachTo = "function" == typeof Object.getPrototypeOf && "setTimeout"in Object.getPrototypeOf(global) ? Object.getPrototypeOf(global) : global;
        canUseNextTick() ? installNextTickImplementation(attachTo) : canUsePostMessage() ? installPostMessageImplementation(attachTo) : canUseMessageChannel() ? installMessageChannelImplementation(attachTo) : canUseReadyStateChange() ? installReadyStateChangeImplementation(attachTo) : installSetTimeoutImplementation(attachTo),
        attachTo.clearImmediate = tasks.remove
    }
}("object" == typeof global && global ? global : this),
"undefined" == typeof WeakMap && function() {
    var r = Object.defineProperty
      , e = Date.now() % 1e9
      , t = function() {
        this.name = "__st" + (1e9 * Math.random() >>> 0) + e++ + "__"
    };
    t.prototype = {
        set: function(e, t) {
            var n = e[this.name];
            n && n[0] === e ? n[1] = t : r(e, this.name, {
                value: [e, t],
                writable: !0
            })
        },
        get: function(e) {
            var t;
            return (t = e[this.name]) && t[0] === e ? t[1] : undefined
        },
        "delete": function(e) {
            this.set(e, undefined)
        }
    },
    window.WeakMap = t
}(),
function(e) {
    function i(e) {
        k.push(e),
        w || (w = !0,
        g(t))
    }
    function o(e) {
        return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(e) || e
    }
    function t() {
        w = !1;
        var e = k;
        k = [],
        e.sort(function(e, t) {
            return e.uid_ - t.uid_
        });
        var n = !1;
        e.forEach(function(e) {
            var t = e.takeRecords();
            r(e),
            t.length && (e.callback_(t, e),
            n = !0)
        }),
        n && t()
    }
    function r(n) {
        n.nodes_.forEach(function(e) {
            var t = m.get(e);
            t && t.forEach(function(e) {
                e.observer === n && e.removeTransientObservers()
            })
        })
    }
    function d(e, t) {
        for (var n = e; n; n = n.parentNode) {
            var r = m.get(n);
            if (r)
                for (var i = 0; i < r.length; i++) {
                    var o = r[i]
                      , a = o.options;
                    if (n === e || a.subtree) {
                        var s = t(a);
                        s && o.enqueue(s)
                    }
                }
        }
    }
    function n(e) {
        this.callback_ = e,
        this.nodes_ = [],
        this.records_ = [],
        this.uid_ = ++j
    }
    function a(e, t) {
        this.type = e,
        this.target = t,
        this.addedNodes = [],
        this.removedNodes = [],
        this.previousSibling = null,
        this.nextSibling = null,
        this.attributeName = null,
        this.attributeNamespace = null,
        this.oldValue = null
    }
    function s(e) {
        var t = new a(e.type,e.target);
        return t.addedNodes = e.addedNodes.slice(),
        t.removedNodes = e.removedNodes.slice(),
        t.previousSibling = e.previousSibling,
        t.nextSibling = e.nextSibling,
        t.attributeName = e.attributeName,
        t.attributeNamespace = e.attributeNamespace,
        t.oldValue = e.oldValue,
        t
    }
    function f(e, t) {
        return b = new a(e,t)
    }
    function p(e) {
        return x || ((x = s(b)).oldValue = e,
        x)
    }
    function h() {
        b = x = undefined
    }
    function l(e) {
        return e === x || e === b
    }
    function u(e, t) {
        return e === t ? e : x && l(e) ? x : null
    }
    function c(e, t, n) {
        this.observer = e,
        this.target = t,
        this.options = n,
        this.transientObservedNodes = []
    }
    var m = new WeakMap
      , g = window.msSetImmediate;
    if (!g) {
        var v = []
          , y = String(Math.random());
        window.addEventListener("message", function(e) {
            if (e.data === y) {
                var t = v;
                v = [],
                t.forEach(function(e) {
                    e()
                })
            }
        }),
        g = function(e) {
            v.push(e),
            window.postMessage(y, "*")
        }
    }
    var b, x, w = !1, k = [], j = 0;
    n.prototype = {
        observe: function(e, t) {
            if (e = o(e),
            !t.childList && !t.attributes && !t.characterData || t.attributeOldValue && !t.attributes || t.attributeFilter && t.attributeFilter.length && !t.attributes || t.characterDataOldValue && !t.characterData)
                throw new SyntaxError;
            var n, r = m.get(e);
            r || m.set(e, r = []);
            for (var i = 0; i < r.length; i++)
                if (r[i].observer === this) {
                    (n = r[i]).removeListeners(),
                    n.options = t;
                    break
                }
            n || (n = new c(this,e,t),
            r.push(n),
            this.nodes_.push(e)),
            n.addListeners()
        },
        disconnect: function() {
            this.nodes_.forEach(function(e) {
                for (var t = m.get(e), n = 0; n < t.length; n++) {
                    var r = t[n];
                    if (r.observer === this) {
                        r.removeListeners(),
                        t.splice(n, 1);
                        break
                    }
                }
            }, this),
            this.records_ = []
        },
        takeRecords: function() {
            var e = this.records_;
            return this.records_ = [],
            e
        }
    },
    c.prototype = {
        enqueue: function(e) {
            var t = this.observer.records_
              , n = t.length;
            if (0 < t.length) {
                var r = u(t[n - 1], e);
                if (r)
                    return void (t[n - 1] = r)
            } else
                i(this.observer);
            t[n] = e
        },
        addListeners: function() {
            this.addListeners_(this.target)
        },
        addListeners_: function(e) {
            var t = this.options;
            t.attributes && e.addEventListener("DOMAttrModified", this, !0),
            t.characterData && e.addEventListener("DOMCharacterDataModified", this, !0),
            t.childList && e.addEventListener("DOMNodeInserted", this, !0),
            (t.childList || t.subtree) && e.addEventListener("DOMNodeRemoved", this, !0)
        },
        removeListeners: function() {
            this.removeListeners_(this.target)
        },
        removeListeners_: function(e) {
            var t = this.options;
            t.attributes && e.removeEventListener("DOMAttrModified", this, !0),
            t.characterData && e.removeEventListener("DOMCharacterDataModified", this, !0),
            t.childList && e.removeEventListener("DOMNodeInserted", this, !0),
            (t.childList || t.subtree) && e.removeEventListener("DOMNodeRemoved", this, !0)
        },
        addTransientObserver: function(e) {
            if (e !== this.target) {
                this.addListeners_(e),
                this.transientObservedNodes.push(e);
                var t = m.get(e);
                t || m.set(e, t = []),
                t.push(this)
            }
        },
        removeTransientObservers: function() {
            var e = this.transientObservedNodes;
            this.transientObservedNodes = [],
            e.forEach(function(e) {
                this.removeListeners_(e);
                for (var t = m.get(e), n = 0; n < t.length; n++)
                    if (t[n] === this) {
                        t.splice(n, 1);
                        break
                    }
            }, this)
        },
        handleEvent: function(e) {
            switch (e.stopImmediatePropagation(),
            e.type) {
            case "DOMAttrModified":
                var t = e.attrName
                  , n = e.relatedNode.namespaceURI
                  , r = e.target;
                (o = new f("attributes",r)).attributeName = t,
                o.attributeNamespace = n;
                var i = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
                d(r, function(e) {
                    if (e.attributes && (!e.attributeFilter || !e.attributeFilter.length || -1 !== e.attributeFilter.indexOf(t) || -1 !== e.attributeFilter.indexOf(n)))
                        return e.attributeOldValue ? p(i) : o
                });
                break;
            case "DOMCharacterDataModified":
                var o = f("characterData", r = e.target);
                i = e.prevValue;
                d(r, function(e) {
                    if (e.characterData)
                        return e.characterDataOldValue ? p(i) : o
                });
                break;
            case "DOMNodeRemoved":
                this.addTransientObserver(e.target);
            case "DOMNodeInserted":
                r = e.relatedNode;
                var a, s, l = e.target;
                "DOMNodeInserted" === e.type ? (a = [l],
                s = []) : (a = [],
                s = [l]);
                var u = l.previousSibling
                  , c = l.nextSibling;
                (o = f("childList", r)).addedNodes = a,
                o.removedNodes = s,
                o.previousSibling = u,
                o.nextSibling = c,
                d(r, function(e) {
                    if (e.childList)
                        return o
                })
            }
            h()
        }
    },
    e.JsMutationObserver = n,
    e.MutationObserver || (e.MutationObserver = n)
}(this),
function(e) {
    "use strict";
    function t() {
        if (!(this instanceof t))
            return new t;
        this.size = 0,
        this.uid = 0,
        this.selectors = [],
        this.indexes = Object.create(this.indexes),
        this.activeIndexes = []
    }
    function p(e, t) {
        var n, r, i, o, a, s, l = (e = e.slice(0).concat(e["default"])).length, u = t, c = [];
        do {
            if (d.exec(""),
            (i = d.exec(u)) && (u = i[3],
            i[2] || !u))
                for (n = 0; n < l; n++)
                    if (a = (s = e[n]).selector(i[1])) {
                        for (r = c.length,
                        o = !1; r--; )
                            if (c[r].index === s && c[r].key === a) {
                                o = !0;
                                break
                            }
                        o || c.push({
                            index: s,
                            key: a
                        });
                        break
                    }
        } while (i);return c
    }
    function f(e, t) {
        var n, r, i;
        for (n = 0,
        r = e.length; n < r; n++)
            if (i = e[n],
            t.isPrototypeOf(i))
                return i
    }
    function m(e, t) {
        return e.id - t.id
    }
    var n = e.document.documentElement
      , r = n.webkitMatchesSelector || n.mozMatchesSelector || n.oMatchesSelector || n.msMatchesSelector;
    t.prototype.matchesSelector = function(e, t) {
        return r.call(e, t)
    }
    ,
    t.prototype.querySelectorAll = function(e, t) {
        return t.querySelectorAll(e)
    }
    ,
    t.prototype.indexes = [];
    var i = /^#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    t.prototype.indexes.push({
        name: "ID",
        selector: function s(e) {
            var t;
            if (t = e.match(i))
                return t[0].slice(1)
        },
        element: function l(e) {
            if (e.id)
                return [e.id]
        }
    });
    var o = /^\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    t.prototype.indexes.push({
        name: "CLASS",
        selector: function u(e) {
            var t;
            if (t = e.match(o))
                return t[0].slice(1)
        },
        element: function c(e) {
            var t = e.className;
            if (t) {
                if ("string" == typeof t)
                    return t.split(/\s/);
                if ("object" == typeof t && "baseVal"in t)
                    return t.baseVal.split(/\s/)
            }
        }
    });
    var h, a = /^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    t.prototype.indexes.push({
        name: "TAG",
        selector: function g(e) {
            var t;
            if (t = e.match(a))
                return t[0].toUpperCase()
        },
        element: function v(e) {
            return [e.nodeName.toUpperCase()]
        }
    }),
    t.prototype.indexes["default"] = {
        name: "UNIVERSAL",
        selector: function() {
            return !0
        },
        element: function() {
            return [!0]
        }
    },
    h = "function" == typeof e.Map ? e.Map : function() {
        function e() {
            this.map = {}
        }
        return e.prototype.get = function(e) {
            return this.map[e + " "]
        }
        ,
        e.prototype.set = function(e, t) {
            this.map[e + " "] = t
        }
        ,
        e
    }();
    var d = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;
    t.prototype.logDefaultIndexUsed = function() {}
    ,
    t.prototype.add = function(e, t) {
        var n, r, i, o, a, s, l, u, c = this.activeIndexes, d = this.selectors;
        if ("string" == typeof e) {
            for (n = {
                id: this.uid++,
                selector: e,
                data: t
            },
            l = p(this.indexes, e),
            r = 0; r < l.length; r++)
                o = (u = l[r]).key,
                (a = f(c, i = u.index)) || ((a = Object.create(i)).map = new h,
                c.push(a)),
                i === this.indexes["default"] && this.logDefaultIndexUsed(n),
                (s = a.map.get(o)) || (s = [],
                a.map.set(o, s)),
                s.push(n);
            this.size++,
            d.push(e)
        }
    }
    ,
    t.prototype.remove = function(e, t) {
        if ("string" == typeof e) {
            var n, r, i, o, a, s, l, u, c = this.activeIndexes, d = {}, f = 1 === arguments.length;
            for (n = p(this.indexes, e),
            i = 0; i < n.length; i++)
                for (r = n[i],
                o = c.length; o--; )
                    if (s = c[o],
                    r.index.isPrototypeOf(s)) {
                        if (l = s.map.get(r.key))
                            for (a = l.length; a--; )
                                (u = l[a]).selector !== e || !f && u.data !== t || (l.splice(a, 1),
                                d[u.id] = !0);
                        break
                    }
            this.size -= Object.keys(d).length
        }
    }
    ,
    t.prototype.queryAll = function(e) {
        if (!this.selectors.length)
            return [];
        var t, n, r, i, o, a, s, l, u = {}, c = [], d = this.querySelectorAll(this.selectors.join(", "), e);
        for (t = 0,
        r = d.length; t < r; t++)
            for (o = d[t],
            n = 0,
            i = (a = this.matches(o)).length; n < i; n++)
                u[(l = a[n]).id] ? s = u[l.id] : (s = {
                    id: l.id,
                    selector: l.selector,
                    data: l.data,
                    elements: []
                },
                u[l.id] = s,
                c.push(s)),
                s.elements.push(o);
        return c.sort(m)
    }
    ,
    t.prototype.matches = function(e) {
        if (!e)
            return [];
        var t, n, r, i, o, a, s, l, u, c, d, f = this.activeIndexes, p = {}, h = [];
        for (t = 0,
        i = f.length; t < i; t++)
            if (l = (s = f[t]).element(e))
                for (n = 0,
                o = l.length; n < o; n++)
                    if (u = s.map.get(l[n]))
                        for (r = 0,
                        a = u.length; r < a; r++)
                            !p[d = (c = u[r]).id] && this.matchesSelector(e, c.selector) && (p[d] = !0,
                            h.push(c));
        return h.sort(m)
    }
    ,
    e.SelectorSet = t
}(window),
function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    }
    : t(e)
}("undefined" != typeof window ? window : this, function(h, e) {
    function s(e) {
        var t = e.length
          , n = Z.type(e);
        return "function" !== n && !Z.isWindow(e) && (!(1 !== e.nodeType || !t) || ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e))
    }
    function t(e, n, r) {
        if (Z.isFunction(n))
            return Z.grep(e, function(e, t) {
                return !!n.call(e, t, e) !== r
            });
        if (n.nodeType)
            return Z.grep(e, function(e) {
                return e === n !== r
            });
        if ("string" == typeof n) {
            if (se.test(n))
                return Z.filter(n, e, r);
            n = Z.filter(n, e)
        }
        return Z.grep(e, function(e) {
            return 0 <= U.call(n, e) !== r
        })
    }
    function n(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; )
            ;
        return e
    }
    function f(e) {
        var n = he[e] = {};
        return Z.each(e.match(pe) || [], function(e, t) {
            n[t] = !0
        }),
        n
    }
    function r() {
        J.removeEventListener("DOMContentLoaded", r, !1),
        h.removeEventListener("load", r, !1),
        Z.ready()
    }
    function i() {
        Object.defineProperty(this.cache = {}, 0, {
            get: function() {
                return {}
            }
        }),
        this.expando = Z.expando + Math.random()
    }
    function l(e, t, n) {
        var r;
        if (n === undefined && 1 === e.nodeType)
            if (r = "data-" + t.replace(be, "-$1").toLowerCase(),
            "string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : ye.test(n) ? Z.parseJSON(n) : n)
                } catch (i) {}
                ve.set(e, t, n)
            } else
                n = undefined;
        return n
    }
    function o() {
        return !0
    }
    function u() {
        return !1
    }
    function a() {
        try {
            return J.activeElement
        } catch (e) {}
    }
    function c(e, t) {
        return Z.nodeName(e, "table") && Z.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }
    function m(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
        e
    }
    function g(e) {
        var t = Pe.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"),
        e
    }
    function v(e, t) {
        for (var n = 0, r = e.length; n < r; n++)
            ge.set(e[n], "globalEval", !t || ge.get(t[n], "globalEval"))
    }
    function d(e, t) {
        var n, r, i, o, a, s, l, u;
        if (1 === t.nodeType) {
            if (ge.hasData(e) && (o = ge.access(e),
            a = ge.set(t, o),
            u = o.events))
                for (i in delete a.handle,
                a.events = {},
                u)
                    for (n = 0,
                    r = u[i].length; n < r; n++)
                        Z.event.add(t, i, u[i][n]);
            ve.hasData(e) && (s = ve.access(e),
            l = Z.extend({}, s),
            ve.set(t, l))
        }
    }
    function y(e, t) {
        var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
        return t === undefined || t && Z.nodeName(e, t) ? Z.merge([e], n) : n
    }
    function p(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && $e.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
    }
    function b(e, t) {
        var n, r = Z(t.createElement(e)).appendTo(t.body), i = h.getDefaultComputedStyle && (n = h.getDefaultComputedStyle(r[0])) ? n.display : Z.css(r[0], "display");
        return r.detach(),
        i
    }
    function x(e) {
        var t = J
          , n = _e[e];
        return n || ("none" !== (n = b(e, t)) && n || ((t = (Re = (Re || Z("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement))[0].contentDocument).write(),
        t.close(),
        n = b(e, t),
        Re.detach()),
        _e[e] = n),
        n
    }
    function w(e, t, n) {
        var r, i, o, a, s = e.style;
        return (n = n || Be(e)) && (a = n.getPropertyValue(t) || n[t]),
        n && ("" !== a || Z.contains(e.ownerDocument, e) || (a = Z.style(e, t)),
        We.test(a) && ze.test(t) && (r = s.width,
        i = s.minWidth,
        o = s.maxWidth,
        s.minWidth = s.maxWidth = s.width = a,
        a = n.width,
        s.width = r,
        s.minWidth = i,
        s.maxWidth = o)),
        a !== undefined ? a + "" : a
    }
    function k(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }
    function j(e, t) {
        if (t in e)
            return t;
        for (var n = t[0].toUpperCase() + t.slice(1), r = t, i = Ge.length; i--; )
            if ((t = Ge[i] + n)in e)
                return t;
        return r
    }
    function T(e, t, n) {
        var r = Ue.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }
    function $(e, t, n, r, i) {
        for (var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; o < 4; o += 2)
            "margin" === n && (a += Z.css(e, n + je[o], !0, i)),
            r ? ("content" === n && (a -= Z.css(e, "padding" + je[o], !0, i)),
            "margin" !== n && (a -= Z.css(e, "border" + je[o] + "Width", !0, i))) : (a += Z.css(e, "padding" + je[o], !0, i),
            "padding" !== n && (a += Z.css(e, "border" + je[o] + "Width", !0, i)));
        return a
    }
    function C(e, t, n) {
        var r = !0
          , i = "width" === t ? e.offsetWidth : e.offsetHeight
          , o = Be(e)
          , a = "border-box" === Z.css(e, "boxSizing", !1, o);
        if (i <= 0 || null == i) {
            if (((i = w(e, t, o)) < 0 || null == i) && (i = e.style[t]),
            We.test(i))
                return i;
            r = a && (G.boxSizingReliable() || i === e.style[t]),
            i = parseFloat(i) || 0
        }
        return i + $(e, t, n || (a ? "border" : "content"), r, o) + "px"
    }
    function E(e, t) {
        for (var n, r, i, o = [], a = 0, s = e.length; a < s; a++)
            (r = e[a]).style && (o[a] = ge.get(r, "olddisplay"),
            n = r.style.display,
            t ? (o[a] || "none" !== n || (r.style.display = ""),
            "" === r.style.display && Te(r) && (o[a] = ge.access(r, "olddisplay", x(r.nodeName)))) : (i = Te(r),
            "none" === n && i || ge.set(r, "olddisplay", i ? n : Z.css(r, "display"))));
        for (a = 0; a < s; a++)
            (r = e[a]).style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none"));
        return e
    }
    function S(e, t, n, r, i) {
        return new S.prototype.init(e,t,n,r,i)
    }
    function N() {
        return setTimeout(function() {
            Je = undefined
        }),
        Je = Z.now()
    }
    function L(e, t) {
        var n, r = 0, i = {
            height: e
        };
        for (t = t ? 1 : 0; r < 4; r += 2 - t)
            i["margin" + (n = je[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e),
        i
    }
    function D(e, t, n) {
        for (var r, i = (at[t] || []).concat(at["*"]), o = 0, a = i.length; o < a; o++)
            if (r = i[o].call(n, t, e))
                return r
    }
    function I(t, e, n) {
        var r, i, o, a, s, l, u, c = this, d = {}, f = t.style, p = t.nodeType && Te(t), h = ge.get(t, "fxshow");
        for (r in n.queue || (null == (s = Z._queueHooks(t, "fx")).unqueued && (s.unqueued = 0,
        l = s.empty.fire,
        s.empty.fire = function() {
            s.unqueued || l()
        }
        ),
        s.unqueued++,
        c.always(function() {
            c.always(function() {
                s.unqueued--,
                Z.queue(t, "fx").length || s.empty.fire()
            })
        })),
        1 === t.nodeType && ("height"in e || "width"in e) && (n.overflow = [f.overflow, f.overflowX, f.overflowY],
        "inline" === ("none" === (u = Z.css(t, "display")) ? x(t.nodeName) : u) && "none" === Z.css(t, "float") && (f.display = "inline-block")),
        n.overflow && (f.overflow = "hidden",
        c.always(function() {
            f.overflow = n.overflow[0],
            f.overflowX = n.overflow[1],
            f.overflowY = n.overflow[2]
        })),
        e)
            if (i = e[r],
            nt.exec(i)) {
                if (delete e[r],
                o = o || "toggle" === i,
                i === (p ? "hide" : "show")) {
                    if ("show" !== i || !h || h[r] === undefined)
                        continue;
                    p = !0
                }
                d[r] = h && h[r] || Z.style(t, r)
            } else
                u = undefined;
        if (Z.isEmptyObject(d))
            "inline" === ("none" === u ? x(t.nodeName) : u) && (f.display = u);
        else
            for (r in h ? "hidden"in h && (p = h.hidden) : h = ge.access(t, "fxshow", {}),
            o && (h.hidden = !p),
            p ? Z(t).show() : c.done(function() {
                Z(t).hide()
            }),
            c.done(function() {
                var e;
                for (e in ge.remove(t, "fxshow"),
                d)
                    Z.style(t, e, d[e])
            }),
            d)
                a = D(p ? h[r] : 0, r, c),
                r in h || (h[r] = a.start,
                p && (a.end = a.start,
                a.start = "width" === r || "height" === r ? 1 : 0))
    }
    function A(e, t) {
        var n, r, i, o, a;
        for (n in e)
            if (i = t[r = Z.camelCase(n)],
            o = e[n],
            Z.isArray(o) && (i = o[1],
            o = e[n] = o[0]),
            n !== r && (e[r] = o,
            delete e[n]),
            (a = Z.cssHooks[r]) && "expand"in a)
                for (n in o = a.expand(o),
                delete e[r],
                o)
                    n in e || (e[n] = o[n],
                    t[n] = i);
            else
                t[r] = i
    }
    function O(o, e, t) {
        var n, a, r = 0, i = ot.length, s = Z.Deferred().always(function() {
            delete l.elem
        }), l = function() {
            if (a)
                return !1;
            for (var e = Je || N(), t = Math.max(0, u.startTime + u.duration - e), n = 1 - (t / u.duration || 0), r = 0, i = u.tweens.length; r < i; r++)
                u.tweens[r].run(n);
            return s.notifyWith(o, [u, n, t]),
            n < 1 && i ? t : (s.resolveWith(o, [u]),
            !1)
        }, u = s.promise({
            elem: o,
            props: Z.extend({}, e),
            opts: Z.extend(!0, {
                specialEasing: {}
            }, t),
            originalProperties: e,
            originalOptions: t,
            startTime: Je || N(),
            duration: t.duration,
            tweens: [],
            createTween: function(e, t) {
                var n = Z.Tween(o, u.opts, e, t, u.opts.specialEasing[e] || u.opts.easing);
                return u.tweens.push(n),
                n
            },
            stop: function(e) {
                var t = 0
                  , n = e ? u.tweens.length : 0;
                if (a)
                    return this;
                for (a = !0; t < n; t++)
                    u.tweens[t].run(1);
                return e ? s.resolveWith(o, [u, e]) : s.rejectWith(o, [u, e]),
                this
            }
        }), c = u.props;
        for (A(c, u.opts.specialEasing); r < i; r++)
            if (n = ot[r].call(u, o, c, u.opts))
                return n;
        return Z.map(c, D, u),
        Z.isFunction(u.opts.start) && u.opts.start.call(o, u),
        Z.fx.timer(Z.extend(l, {
            elem: o,
            anim: u,
            queue: u.opts.queue
        })),
        u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
    }
    function M(o) {
        return function(e, t) {
            "string" != typeof e && (t = e,
            e = "*");
            var n, r = 0, i = e.toLowerCase().match(pe) || [];
            if (Z.isFunction(t))
                for (; n = i[r++]; )
                    "+" === n[0] ? (n = n.slice(1) || "*",
                    (o[n] = o[n] || []).unshift(t)) : (o[n] = o[n] || []).push(t)
        }
    }
    function H(t, i, o, a) {
        function s(e) {
            var r;
            return l[e] = !0,
            Z.each(t[e] || [], function(e, t) {
                var n = t(i, o, a);
                return "string" != typeof n || u || l[n] ? u ? !(r = n) : void 0 : (i.dataTypes.unshift(n),
                s(n),
                !1)
            }),
            r
        }
        var l = {}
          , u = t === $t;
        return s(i.dataTypes[0]) || !l["*"] && s("*")
    }
    function P(e, t) {
        var n, r, i = Z.ajaxSettings.flatOptions || {};
        for (n in t)
            t[n] !== undefined && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && Z.extend(!0, e, r),
        e
    }
    function F(e, t, n) {
        for (var r, i, o, a, s = e.contents, l = e.dataTypes; "*" === l[0]; )
            l.shift(),
            r === undefined && (r = e.mimeType || t.getResponseHeader("Content-Type"));
        if (r)
            for (i in s)
                if (s[i] && s[i].test(r)) {
                    l.unshift(i);
                    break
                }
        if (l[0]in n)
            o = l[0];
        else {
            for (i in n) {
                if (!l[0] || e.converters[i + " " + l[0]]) {
                    o = i;
                    break
                }
                a || (a = i)
            }
            o = o || a
        }
        if (o)
            return o !== l[0] && l.unshift(o),
            n[o]
    }
    function q(e, t, n, r) {
        var i, o, a, s, l, u = {}, c = e.dataTypes.slice();
        if (c[1])
            for (a in e.converters)
                u[a.toLowerCase()] = e.converters[a];
        for (o = c.shift(); o; )
            if (e.responseFields[o] && (n[e.responseFields[o]] = t),
            !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
            l = o,
            o = c.shift())
                if ("*" === o)
                    o = l;
                else if ("*" !== l && l !== o) {
                    if (!(a = u[l + " " + o] || u["* " + o]))
                        for (i in u)
                            if ((s = i.split(" "))[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                                !0 === a ? a = u[i] : !0 !== u[i] && (o = s[0],
                                c.unshift(s[1]));
                                break
                            }
                    if (!0 !== a)
                        if (a && e["throws"])
                            t = a(t);
                        else
                            try {
                                t = a(t)
                            } catch (d) {
                                return {
                                    state: "parsererror",
                                    error: a ? d : "No conversion from " + l + " to " + o
                                }
                            }
                }
        return {
            state: "success",
            data: t
        }
    }
    function R(n, e, r, i) {
        var t;
        if (Z.isArray(e))
            Z.each(e, function(e, t) {
                r || St.test(n) ? i(n, t) : R(n + "[" + ("object" == typeof t ? e : "") + "]", t, r, i)
            });
        else if (r || "object" !== Z.type(e))
            i(n, e);
        else
            for (t in e)
                R(n + "[" + t + "]", e[t], r, i)
    }
    function _(e) {
        return Z.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
    }
    var z = []
      , W = z.slice
      , B = z.concat
      , X = z.push
      , U = z.indexOf
      , Y = {}
      , V = Y.toString
      , K = Y.hasOwnProperty
      , G = {}
      , J = h.document
      , Q = "2.1.1-beta1"
      , Z = function(e, t) {
        return new Z.fn.init(e,t)
    }
      , ee = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      , te = /^-ms-/
      , ne = /-([\da-z])/gi
      , re = function(e, t) {
        return t.toUpperCase()
    };
    Z.fn = Z.prototype = {
        jquery: Q,
        constructor: Z,
        selector: "",
        length: 0,
        toArray: function() {
            return W.call(this)
        },
        get: function(e) {
            return null != e ? e < 0 ? this[e + this.length] : this[e] : W.call(this)
        },
        pushStack: function(e) {
            var t = Z.merge(this.constructor(), e);
            return t.prevObject = this,
            t.context = this.context,
            t
        },
        each: function(e, t) {
            return Z.each(this, e, t)
        },
        map: function(n) {
            return this.pushStack(Z.map(this, function(e, t) {
                return n.call(e, t, e)
            }))
        },
        slice: function() {
            return this.pushStack(W.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length
              , n = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= n && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: X,
        sort: z.sort,
        splice: z.splice
    },
    Z.extend = Z.fn.extend = function(e) {
        var t, n, r, i, o, a, s = e || {}, l = 1, u = arguments.length, c = !1;
        for ("boolean" == typeof s && (c = s,
        s = arguments[l] || {},
        l++),
        "object" == typeof s || Z.isFunction(s) || (s = {}),
        l === u && (s = this,
        l--); l < u; l++)
            if (null != (t = arguments[l]))
                for (n in t)
                    r = s[n],
                    s !== (i = t[n]) && (c && i && (Z.isPlainObject(i) || (o = Z.isArray(i))) ? (o ? (o = !1,
                    a = r && Z.isArray(r) ? r : []) : a = r && Z.isPlainObject(r) ? r : {},
                    s[n] = Z.extend(c, a, i)) : i !== undefined && (s[n] = i));
        return s
    }
    ,
    Z.extend({
        expando: "jQuery" + (Q + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === Z.type(e)
        },
        isArray: Array.isArray,
        isWindow: function(e) {
            return null != e && e === e.window
        },
        isNumeric: function(e) {
            return !Z.isArray(e) && 0 <= e - parseFloat(e)
        },
        isPlainObject: function(e) {
            return "object" === Z.type(e) && !e.nodeType && !Z.isWindow(e) && !(e.constructor && !K.call(e.constructor.prototype, "isPrototypeOf"))
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? Y[V.call(e)] || "object" : typeof e
        },
        globalEval: function(e) {
            var t, n = eval;
            (e = Z.trim(e)) && (1 === e.indexOf("use strict") ? ((t = J.createElement("script")).text = e,
            J.head.appendChild(t).parentNode.removeChild(t)) : n(e))
        },
        camelCase: function(e) {
            return e.replace(te, "ms-").replace(ne, re)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, n) {
            var r = 0
              , i = e.length
              , o = s(e);
            if (n) {
                if (o)
                    for (; r < i && !1 !== t.apply(e[r], n); r++)
                        ;
                else
                    for (r in e)
                        if (!1 === t.apply(e[r], n))
                            break
            } else if (o)
                for (; r < i && !1 !== t.call(e[r], r, e[r]); r++)
                    ;
            else
                for (r in e)
                    if (!1 === t.call(e[r], r, e[r]))
                        break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(ee, "")
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (s(Object(e)) ? Z.merge(n, "string" == typeof e ? [e] : e) : X.call(n, e)),
            n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : U.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++)
                e[i++] = t[r];
            return e.length = i,
            e
        },
        grep: function(e, t, n) {
            for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
                !t(e[i], i) !== a && r.push(e[i]);
            return r
        },
        map: function(e, t, n) {
            var r, i = 0, o = e.length, a = [];
            if (s(e))
                for (; i < o; i++)
                    null != (r = t(e[i], i, n)) && a.push(r);
            else
                for (i in e)
                    null != (r = t(e[i], i, n)) && a.push(r);
            return B.apply([], a)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, r, i;
            return "string" == typeof t && (n = e[t],
            t = e,
            e = n),
            Z.isFunction(e) ? (r = W.call(arguments, 2),
            (i = function() {
                return e.apply(t || this, r.concat(W.call(arguments)))
            }
            ).guid = e.guid = e.guid || Z.guid++,
            i) : undefined
        },
        now: Date.now,
        support: G
    }),
    Z.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        Y["[object " + t + "]"] = t.toLowerCase()
    });
    var ie = function(n) {
        function x(e, t, n, r) {
            var i, o, a, s, l, u, c, d, f, p;
            if ((t ? t.ownerDocument || t : R) !== I && D(t),
            n = n || [],
            !e || "string" != typeof e)
                return n;
            if (1 !== (s = (t = t || I).nodeType) && 9 !== s)
                return [];
            if (O && !r) {
                if (i = ye.exec(e))
                    if (a = i[1]) {
                        if (9 === s) {
                            if (!(o = t.getElementById(a)) || !o.parentNode)
                                return n;
                            if (o.id === a)
                                return n.push(o),
                                n
                        } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(a)) && F(t, o) && o.id === a)
                            return n.push(o),
                            n
                    } else {
                        if (i[2])
                            return Z.apply(n, t.getElementsByTagName(e)),
                            n;
                        if ((a = i[3]) && k.getElementsByClassName && t.getElementsByClassName)
                            return Z.apply(n, t.getElementsByClassName(a)),
                            n
                    }
                if (k.qsa && (!M || !M.test(e))) {
                    if (d = c = q,
                    f = t,
                    p = 9 === s && e,
                    1 === s && "object" !== t.nodeName.toLowerCase()) {
                        for (u = g(e),
                        (c = t.getAttribute("id")) ? d = c.replace(xe, "\\$&") : t.setAttribute("id", d),
                        d = "[id='" + d + "'] ",
                        l = u.length; l--; )
                            u[l] = d + v(u[l]);
                        f = be.test(e) && m(t.parentNode) || t,
                        p = u.join(",")
                    }
                    if (p)
                        try {
                            return Z.apply(n, f.querySelectorAll(p)),
                            n
                        } catch (h) {} finally {
                            c || t.removeAttribute("id")
                        }
                }
            }
            return E(e.replace(le, "$1"), t, n, r)
        }
        function e() {
            function n(e, t) {
                return r.push(e + " ") > j.cacheLength && delete n[r.shift()],
                n[e + " "] = t
            }
            var r = [];
            return n
        }
        function l(e) {
            return e[q] = !0,
            e
        }
        function r(e) {
            var t = I.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                t = null
            }
        }
        function t(e, t) {
            for (var n = e.split("|"), r = e.length; r--; )
                j.attrHandle[n[r]] = t
        }
        function u(e, t) {
            var n = t && e
              , r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || V) - (~e.sourceIndex || V);
            if (r)
                return r;
            if (n)
                for (; n = n.nextSibling; )
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function i(t) {
            return function(e) {
                return "input" === e.nodeName.toLowerCase() && e.type === t
            }
        }
        function o(n) {
            return function(e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t || "button" === t) && e.type === n
            }
        }
        function a(a) {
            return l(function(o) {
                return o = +o,
                l(function(e, t) {
                    for (var n, r = a([], e.length, o), i = r.length; i--; )
                        e[n = r[i]] && (e[n] = !(t[n] = e[n]))
                })
            })
        }
        function m(e) {
            return e && typeof e.getElementsByTagName !== Y && e
        }
        function s() {}
        function g(e, t) {
            var n, r, i, o, a, s, l, u = B[e + " "];
            if (u)
                return t ? 0 : u.slice(0);
            for (a = e,
            s = [],
            l = j.preFilter; a; ) {
                for (o in n && !(r = ue.exec(a)) || (r && (a = a.slice(r[0].length) || a),
                s.push(i = [])),
                n = !1,
                (r = ce.exec(a)) && (n = r.shift(),
                i.push({
                    value: n,
                    type: r[0].replace(le, " ")
                }),
                a = a.slice(n.length)),
                j.filter)
                    !(r = he[o].exec(a)) || l[o] && !(r = l[o](r)) || (n = r.shift(),
                    i.push({
                        value: n,
                        type: o,
                        matches: r
                    }),
                    a = a.slice(n.length));
                if (!n)
                    break
            }
            return t ? a.length : a ? x.error(e) : B(e, s).slice(0)
        }
        function v(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++)
                r += e[t].value;
            return r
        }
        function d(a, e, t) {
            var s = e.dir
              , l = t && "parentNode" === s
              , u = z++;
            return e.first ? function(e, t, n) {
                for (; e = e[s]; )
                    if (1 === e.nodeType || l)
                        return a(e, t, n)
            }
            : function(e, t, n) {
                var r, i, o = [_, u];
                if (n) {
                    for (; e = e[s]; )
                        if ((1 === e.nodeType || l) && a(e, t, n))
                            return !0
                } else
                    for (; e = e[s]; )
                        if (1 === e.nodeType || l) {
                            if ((r = (i = e[q] || (e[q] = {}))[s]) && r[0] === _ && r[1] === u)
                                return o[2] = r[2];
                            if ((i[s] = o)[2] = a(e, t, n))
                                return !0
                        }
            }
        }
        function f(i) {
            return 1 < i.length ? function(e, t, n) {
                for (var r = i.length; r--; )
                    if (!i[r](e, t, n))
                        return !1;
                return !0
            }
            : i[0]
        }
        function y(e, t, n) {
            for (var r = 0, i = t.length; r < i; r++)
                x(e, t[r], n);
            return n
        }
        function w(e, t, n, r, i) {
            for (var o, a = [], s = 0, l = e.length, u = null != t; s < l; s++)
                (o = e[s]) && (n && !n(o, r, i) || (a.push(o),
                u && t.push(s)));
            return a
        }
        function b(p, h, m, g, v, e) {
            return g && !g[q] && (g = b(g)),
            v && !v[q] && (v = b(v, e)),
            l(function(e, t, n, r) {
                var i, o, a, s = [], l = [], u = t.length, c = e || y(h || "*", n.nodeType ? [n] : n, []), d = !p || !e && h ? c : w(c, s, p, n, r), f = m ? v || (e ? p : u || g) ? [] : t : d;
                if (m && m(d, f, n, r),
                g)
                    for (i = w(f, l),
                    g(i, [], n, r),
                    o = i.length; o--; )
                        (a = i[o]) && (f[l[o]] = !(d[l[o]] = a));
                if (e) {
                    if (v || p) {
                        if (v) {
                            for (i = [],
                            o = f.length; o--; )
                                (a = f[o]) && i.push(d[o] = a);
                            v(null, f = [], i, r)
                        }
                        for (o = f.length; o--; )
                            (a = f[o]) && -1 < (i = v ? te.call(e, a) : s[o]) && (e[i] = !(t[i] = a))
                    }
                } else
                    f = w(f === t ? f.splice(u, f.length) : f),
                    v ? v(null, t, f, r) : Z.apply(t, f)
            })
        }
        function p(e) {
            for (var r, t, n, i = e.length, o = j.relative[e[0].type], a = o || j.relative[" "], s = o ? 1 : 0, l = d(function(e) {
                return e === r
            }, a, !0), u = d(function(e) {
                return -1 < te.call(r, e)
            }, a, !0), c = [function(e, t, n) {
                return !o && (n || t !== S) || ((r = t).nodeType ? l(e, t, n) : u(e, t, n))
            }
            ]; s < i; s++)
                if (t = j.relative[e[s].type])
                    c = [d(f(c), t)];
                else {
                    if ((t = j.filter[e[s].type].apply(null, e[s].matches))[q]) {
                        for (n = ++s; n < i && !j.relative[e[n].type]; n++)
                            ;
                        return b(1 < s && f(c), 1 < s && v(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(le, "$1"), t, s < n && p(e.slice(s, n)), n < i && p(e = e.slice(n)), n < i && v(e))
                    }
                    c.push(t)
                }
            return f(c)
        }
        function c(g, v) {
            var y = 0 < v.length
              , b = 0 < g.length
              , e = function(e, t, n, r, i) {
                var o, a, s, l = 0, u = "0", c = e && [], d = [], f = S, p = e || b && j.find.TAG("*", i), h = _ += null == f ? 1 : Math.random() || .1, m = p.length;
                for (i && (S = t !== I && t); u !== m && null != (o = p[u]); u++) {
                    if (b && o) {
                        for (a = 0; s = g[a++]; )
                            if (s(o, t, n)) {
                                r.push(o);
                                break
                            }
                        i && (_ = h)
                    }
                    y && ((o = !s && o) && l--,
                    e && c.push(o))
                }
                if (l += u,
                y && u !== l) {
                    for (a = 0; s = v[a++]; )
                        s(c, d, t, n);
                    if (e) {
                        if (0 < l)
                            for (; u--; )
                                c[u] || d[u] || (d[u] = J.call(r));
                        d = w(d)
                    }
                    Z.apply(r, d),
                    i && !e && 0 < d.length && 1 < l + v.length && x.uniqueSort(r)
                }
                return i && (_ = h,
                S = f),
                c
            };
            return y ? l(e) : e
        }
        var h, k, j, T, $, C, E, S, N, L, D, I, A, O, M, H, P, F, q = "sizzle" + -new Date, R = n.document, _ = 0, z = 0, W = e(), B = e(), X = e(), U = function(e, t) {
            return e === t && (L = !0),
            0
        }, Y = typeof undefined, V = 1 << 31, K = {}.hasOwnProperty, G = [], J = G.pop, Q = G.push, Z = G.push, ee = G.slice, te = G.indexOf || function(e) {
            for (var t = 0, n = this.length; t < n; t++)
                if (this[t] === e)
                    return t;
            return -1
        }
        , ne = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", re = "[\\x20\\t\\r\\n\\f]", ie = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", oe = ie.replace("w", "w#"), ae = "\\[" + re + "*(" + ie + ")" + re + "*(?:([*^$|!~]?=)" + re + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + oe + ")|)|)" + re + "*\\]", se = ":(" + ie + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + ae.replace(3, 8) + ")*)|.*)\\)|)", le = new RegExp("^" + re + "+|((?:^|[^\\\\])(?:\\\\.)*)" + re + "+$","g"), ue = new RegExp("^" + re + "*," + re + "*"), ce = new RegExp("^" + re + "*([>+~]|" + re + ")" + re + "*"), de = new RegExp("=" + re + "*([^\\]'\"]*?)" + re + "*\\]","g"), fe = new RegExp(se), pe = new RegExp("^" + oe + "$"), he = {
            ID: new RegExp("^#(" + ie + ")"),
            CLASS: new RegExp("^\\.(" + ie + ")"),
            TAG: new RegExp("^(" + ie.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + ae),
            PSEUDO: new RegExp("^" + se),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + re + "*(even|odd|(([+-]|)(\\d*)n|)" + re + "*(?:([+-]|)" + re + "*(\\d+)|))" + re + "*\\)|)","i"),
            bool: new RegExp("^(?:" + ne + ")$","i"),
            needsContext: new RegExp("^" + re + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + re + "*((?:-\\d)?\\d*)" + re + "*\\)|)(?=[^-]|$)","i")
        }, me = /^(?:input|select|textarea|button)$/i, ge = /^h\d$/i, ve = /^[^{]+\{\s*\[native \w/, ye = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, be = /[+~]/, xe = /'|\\/g, we = new RegExp("\\\\([\\da-f]{1,6}" + re + "?|(" + re + ")|.)","ig"), ke = function(e, t, n) {
            var r = "0x" + t - 65536;
            return r != r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
        };
        try {
            Z.apply(G = ee.call(R.childNodes), R.childNodes),
            G[R.childNodes.length].nodeType
        } catch (je) {
            Z = {
                apply: G.length ? function(e, t) {
                    Q.apply(e, ee.call(t))
                }
                : function(e, t) {
                    for (var n = e.length, r = 0; e[n++] = t[r++]; )
                        ;
                    e.length = n - 1
                }
            }
        }
        for (h in k = x.support = {},
        $ = x.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return !!t && "HTML" !== t.nodeName
        }
        ,
        D = x.setDocument = function(e) {
            var t, l = e ? e.ownerDocument || e : R, n = l.defaultView;
            return l !== I && 9 === l.nodeType && l.documentElement ? (A = (I = l).documentElement,
            O = !$(l),
            n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", function() {
                D()
            }, !1) : n.attachEvent && n.attachEvent("onunload", function() {
                D()
            })),
            k.attributes = r(function(e) {
                return e.className = "i",
                !e.getAttribute("className")
            }),
            k.getElementsByTagName = r(function(e) {
                return e.appendChild(l.createComment("")),
                !e.getElementsByTagName("*").length
            }),
            k.getElementsByClassName = ve.test(l.getElementsByClassName) && r(function(e) {
                return e.innerHTML = "<div class='a'></div><div class='a i'></div>",
                e.firstChild.className = "i",
                2 === e.getElementsByClassName("i").length
            }),
            k.getById = r(function(e) {
                return A.appendChild(e).id = q,
                !l.getElementsByName || !l.getElementsByName(q).length
            }),
            k.getById ? (j.find.ID = function(e, t) {
                if (typeof t.getElementById !== Y && O) {
                    var n = t.getElementById(e);
                    return n && n.parentNode ? [n] : []
                }
            }
            ,
            j.filter.ID = function(e) {
                var t = e.replace(we, ke);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ) : (delete j.find.ID,
            j.filter.ID = function(e) {
                var n = e.replace(we, ke);
                return function(e) {
                    var t = typeof e.getAttributeNode !== Y && e.getAttributeNode("id");
                    return t && t.value === n
                }
            }
            ),
            j.find.TAG = k.getElementsByTagName ? function(e, t) {
                if (typeof t.getElementsByTagName !== Y)
                    return t.getElementsByTagName(e)
            }
            : function(e, t) {
                var n, r = [], i = 0, o = t.getElementsByTagName(e);
                if ("*" !== e)
                    return o;
                for (; n = o[i++]; )
                    1 === n.nodeType && r.push(n);
                return r
            }
            ,
            j.find.CLASS = k.getElementsByClassName && function(e, t) {
                if (typeof t.getElementsByClassName !== Y && O)
                    return t.getElementsByClassName(e)
            }
            ,
            H = [],
            M = [],
            (k.qsa = ve.test(l.querySelectorAll)) && (r(function(e) {
                e.innerHTML = "<select t=''><option selected=''></option></select>",
                e.querySelectorAll("[t^='']").length && M.push("[*^$]=" + re + "*(?:''|\"\")"),
                e.querySelectorAll("[selected]").length || M.push("\\[" + re + "*(?:value|" + ne + ")"),
                e.querySelectorAll(":checked").length || M.push(":checked")
            }),
            r(function(e) {
                var t = l.createElement("input");
                t.setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                e.querySelectorAll("[name=d]").length && M.push("name" + re + "*[*^$|!~]?="),
                e.querySelectorAll(":enabled").length || M.push(":enabled", ":disabled"),
                e.querySelectorAll("*,:x"),
                M.push(",.*:")
            })),
            (k.matchesSelector = ve.test(P = A.webkitMatchesSelector || A.mozMatchesSelector || A.oMatchesSelector || A.msMatchesSelector)) && r(function(e) {
                k.disconnectedMatch = P.call(e, "div"),
                P.call(e, "[s!='']:x"),
                H.push("!=", se)
            }),
            M = M.length && new RegExp(M.join("|")),
            H = H.length && new RegExp(H.join("|")),
            t = ve.test(A.compareDocumentPosition),
            F = t || ve.test(A.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e
                  , r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            }
            : function(e, t) {
                if (t)
                    for (; t = t.parentNode; )
                        if (t === e)
                            return !0;
                return !1
            }
            ,
            U = t ? function(e, t) {
                if (e === t)
                    return L = !0,
                    0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !k.sortDetached && t.compareDocumentPosition(e) === n ? e === l || e.ownerDocument === R && F(R, e) ? -1 : t === l || t.ownerDocument === R && F(R, t) ? 1 : N ? te.call(N, e) - te.call(N, t) : 0 : 4 & n ? -1 : 1)
            }
            : function(e, t) {
                if (e === t)
                    return L = !0,
                    0;
                var n, r = 0, i = e.parentNode, o = t.parentNode, a = [e], s = [t];
                if (!i || !o)
                    return e === l ? -1 : t === l ? 1 : i ? -1 : o ? 1 : N ? te.call(N, e) - te.call(N, t) : 0;
                if (i === o)
                    return u(e, t);
                for (n = e; n = n.parentNode; )
                    a.unshift(n);
                for (n = t; n = n.parentNode; )
                    s.unshift(n);
                for (; a[r] === s[r]; )
                    r++;
                return r ? u(a[r], s[r]) : a[r] === R ? -1 : s[r] === R ? 1 : 0
            }
            ,
            l) : I
        }
        ,
        x.matches = function(e, t) {
            return x(e, null, null, t)
        }
        ,
        x.matchesSelector = function(e, t) {
            if ((e.ownerDocument || e) !== I && D(e),
            t = t.replace(de, "='$1']"),
            k.matchesSelector && O && (!H || !H.test(t)) && (!M || !M.test(t)))
                try {
                    var n = P.call(e, t);
                    if (n || k.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return n
                } catch (je) {}
            return 0 < x(t, I, null, [e]).length
        }
        ,
        x.contains = function(e, t) {
            return (e.ownerDocument || e) !== I && D(e),
            F(e, t)
        }
        ,
        x.attr = function(e, t) {
            (e.ownerDocument || e) !== I && D(e);
            var n = j.attrHandle[t.toLowerCase()]
              , r = n && K.call(j.attrHandle, t.toLowerCase()) ? n(e, t, !O) : undefined;
            return r !== undefined ? r : k.attributes || !O ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }
        ,
        x.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        x.uniqueSort = function(e) {
            var t, n = [], r = 0, i = 0;
            if (L = !k.detectDuplicates,
            N = !k.sortStable && e.slice(0),
            e.sort(U),
            L) {
                for (; t = e[i++]; )
                    t === e[i] && (r = n.push(i));
                for (; r--; )
                    e.splice(n[r], 1)
            }
            return N = null,
            e
        }
        ,
        T = x.getText = function(e) {
            var t, n = "", r = 0, i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        n += T(e)
                } else if (3 === i || 4 === i)
                    return e.nodeValue
            } else
                for (; t = e[r++]; )
                    n += T(t);
            return n
        }
        ,
        (j = x.selectors = {
            cacheLength: 50,
            createPseudo: l,
            match: he,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(we, ke),
                    e[3] = (e[4] || e[5] || "").replace(we, ke),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || x.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && x.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, n = !e[5] && e[2];
                    return he.CHILD.test(e[0]) ? null : (e[3] && e[4] !== undefined ? e[2] = e[4] : n && fe.test(n) && (t = g(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                    e[2] = n.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(we, ke).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = W[e + " "];
                    return t || (t = new RegExp("(^|" + re + ")" + e + "(" + re + "|$)")) && W(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== Y && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(n, r, i) {
                    return function(e) {
                        var t = x.attr(e, n);
                        return null == t ? "!=" === r : !r || (t += "",
                        "=" === r ? t === i : "!=" === r ? t !== i : "^=" === r ? i && 0 === t.indexOf(i) : "*=" === r ? i && -1 < t.indexOf(i) : "$=" === r ? i && t.slice(-i.length) === i : "~=" === r ? -1 < (" " + t + " ").indexOf(i) : "|=" === r && (t === i || t.slice(0, i.length + 1) === i + "-"))
                    }
                },
                CHILD: function(p, e, t, h, m) {
                    var g = "nth" !== p.slice(0, 3)
                      , v = "last" !== p.slice(-4)
                      , y = "of-type" === e;
                    return 1 === h && 0 === m ? function(e) {
                        return !!e.parentNode
                    }
                    : function(e, t, n) {
                        var r, i, o, a, s, l, u = g !== v ? "nextSibling" : "previousSibling", c = e.parentNode, d = y && e.nodeName.toLowerCase(), f = !n && !y;
                        if (c) {
                            if (g) {
                                for (; u; ) {
                                    for (o = e; o = o[u]; )
                                        if (y ? o.nodeName.toLowerCase() === d : 1 === o.nodeType)
                                            return !1;
                                    l = u = "only" === p && !l && "nextSibling"
                                }
                                return !0
                            }
                            if (l = [v ? c.firstChild : c.lastChild],
                            v && f) {
                                for (s = (r = (i = c[q] || (c[q] = {}))[p] || [])[0] === _ && r[1],
                                a = r[0] === _ && r[2],
                                o = s && c.childNodes[s]; o = ++s && o && o[u] || (a = s = 0) || l.pop(); )
                                    if (1 === o.nodeType && ++a && o === e) {
                                        i[p] = [_, s, a];
                                        break
                                    }
                            } else if (f && (r = (e[q] || (e[q] = {}))[p]) && r[0] === _)
                                a = r[1];
                            else
                                for (; (o = ++s && o && o[u] || (a = s = 0) || l.pop()) && ((y ? o.nodeName.toLowerCase() !== d : 1 !== o.nodeType) || !++a || (f && ((o[q] || (o[q] = {}))[p] = [_, a]),
                                o !== e)); )
                                    ;
                            return (a -= m) === h || a % h == 0 && 0 <= a / h
                        }
                    }
                },
                PSEUDO: function(e, o) {
                    var t, a = j.pseudos[e] || j.setFilters[e.toLowerCase()] || x.error("unsupported pseudo: " + e);
                    return a[q] ? a(o) : 1 < a.length ? (t = [e, e, "", o],
                    j.setFilters.hasOwnProperty(e.toLowerCase()) ? l(function(e, t) {
                        for (var n, r = a(e, o), i = r.length; i--; )
                            e[n = te.call(e, r[i])] = !(t[n] = r[i])
                    }) : function(e) {
                        return a(e, 0, t)
                    }
                    ) : a
                }
            },
            pseudos: {
                not: l(function(e) {
                    var r = []
                      , i = []
                      , s = C(e.replace(le, "$1"));
                    return s[q] ? l(function(e, t, n, r) {
                        for (var i, o = s(e, null, r, []), a = e.length; a--; )
                            (i = o[a]) && (e[a] = !(t[a] = i))
                    }) : function(e, t, n) {
                        return r[0] = e,
                        s(r, null, n, i),
                        !i.pop()
                    }
                }),
                has: l(function(t) {
                    return function(e) {
                        return 0 < x(t, e).length
                    }
                }),
                contains: l(function(t) {
                    return function(e) {
                        return -1 < (e.textContent || e.innerText || T(e)).indexOf(t)
                    }
                }),
                lang: l(function(n) {
                    return pe.test(n || "") || x.error("unsupported lang: " + n),
                    n = n.replace(we, ke).toLowerCase(),
                    function(e) {
                        var t;
                        do {
                            if (t = O ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                                return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                        } while ((e = e.parentNode) && 1 === e.nodeType);return !1
                    }
                }),
                target: function(e) {
                    var t = n.location && n.location.hash;
                    return t && t.slice(1) === e.id
                },
                root: function(e) {
                    return e === A
                },
                focus: function(e) {
                    return e === I.activeElement && (!I.hasFocus || I.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: function(e) {
                    return !1 === e.disabled
                },
                disabled: function(e) {
                    return !0 === e.disabled
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    !0 === e.selected
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !j.pseudos.empty(e)
                },
                header: function(e) {
                    return ge.test(e.nodeName)
                },
                input: function(e) {
                    return me.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: a(function() {
                    return [0]
                }),
                last: a(function(e, t) {
                    return [t - 1]
                }),
                eq: a(function(e, t, n) {
                    return [n < 0 ? n + t : n]
                }),
                even: a(function(e, t) {
                    for (var n = 0; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                odd: a(function(e, t) {
                    for (var n = 1; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                lt: a(function(e, t, n) {
                    for (var r = n < 0 ? n + t : n; 0 <= --r; )
                        e.push(r);
                    return e
                }),
                gt: a(function(e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t; )
                        e.push(r);
                    return e
                })
            }
        }).pseudos.nth = j.pseudos.eq,
        {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            j.pseudos[h] = i(h);
        for (h in {
            submit: !0,
            reset: !0
        })
            j.pseudos[h] = o(h);
        return s.prototype = j.filters = j.pseudos,
        j.setFilters = new s,
        C = x.compile = function(e, t) {
            var n, r = [], i = [], o = X[e + " "];
            if (!o) {
                for (t || (t = g(e)),
                n = t.length; n--; )
                    (o = p(t[n]))[q] ? r.push(o) : i.push(o);
                (o = X(e, c(i, r))).selector = e
            }
            return o
        }
        ,
        E = x.select = function(e, t, n, r) {
            var i, o, a, s, l, u = "function" == typeof e && e, c = !r && g(e = u.selector || e);
            if (n = n || [],
            1 === c.length) {
                if (2 < (o = c[0] = c[0].slice(0)).length && "ID" === (a = o[0]).type && k.getById && 9 === t.nodeType && O && j.relative[o[1].type]) {
                    if (!(t = (j.find.ID(a.matches[0].replace(we, ke), t) || [])[0]))
                        return n;
                    u && (t = t.parentNode),
                    e = e.slice(o.shift().value.length)
                }
                for (i = he.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i],
                !j.relative[s = a.type]); )
                    if ((l = j.find[s]) && (r = l(a.matches[0].replace(we, ke), be.test(o[0].type) && m(t.parentNode) || t))) {
                        if (o.splice(i, 1),
                        !(e = r.length && v(o)))
                            return Z.apply(n, r),
                            n;
                        break
                    }
            }
            return (u || C(e, c))(r, t, !O, n, be.test(e) && m(t.parentNode) || t),
            n
        }
        ,
        k.sortStable = q.split("").sort(U).join("") === q,
        k.detectDuplicates = !!L,
        D(),
        k.sortDetached = r(function(e) {
            return 1 & e.compareDocumentPosition(I.createElement("div"))
        }),
        r(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || t("type|href|height|width", function(e, t, n) {
            if (!n)
                return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        k.attributes && r(function(e) {
            return e.innerHTML = "<input/>",
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || t("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase())
                return e.defaultValue
        }),
        r(function(e) {
            return null == e.getAttribute("disabled")
        }) || t(ne, function(e, t, n) {
            var r;
            if (!n)
                return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }),
        x
    }(h);
    Z.find = ie,
    Z.expr = ie.selectors,
    Z.expr[":"] = Z.expr.pseudos,
    Z.unique = ie.uniqueSort,
    Z.text = ie.getText,
    Z.isXMLDoc = ie.isXML,
    Z.contains = ie.contains;
    var oe = Z.expr.match.needsContext
      , ae = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
      , se = /^.[^:#\[\.,]*$/;
    Z.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === r.nodeType ? Z.find.matchesSelector(r, e) ? [r] : [] : Z.find.matches(e, Z.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }
    ,
    Z.fn.extend({
        find: function(e) {
            var t, n = this.length, r = [], i = this;
            if ("string" != typeof e)
                return this.pushStack(Z(e).filter(function() {
                    for (t = 0; t < n; t++)
                        if (Z.contains(i[t], this))
                            return !0
                }));
            for (t = 0; t < n; t++)
                Z.find(e, i[t], r);
            return (r = this.pushStack(1 < n ? Z.unique(r) : r)).selector = this.selector ? this.selector + " " + e : e,
            r
        },
        filter: function(e) {
            return this.pushStack(t(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(t(this, e || [], !0))
        },
        is: function(e) {
            return !!t(this, "string" == typeof e && oe.test(e) ? Z(e) : e || [], !1).length
        }
    });
    var le, ue = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    (Z.fn.init = function(e, t) {
        var n, r;
        if (!e)
            return this;
        if ("string" != typeof e)
            return e.nodeType ? (this.context = this[0] = e,
            this.length = 1,
            this) : Z.isFunction(e) ? "undefined" != typeof le.ready ? le.ready(e) : e(Z) : (e.selector !== undefined && (this.selector = e.selector,
            this.context = e.context),
            Z.makeArray(e, this));
        if (!(n = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : ue.exec(e)) || !n[1] && t)
            return !t || t.jquery ? (t || le).find(e) : this.constructor(t).find(e);
        if (n[1]) {
            if (t = t instanceof Z ? t[0] : t,
            Z.merge(this, Z.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : J, !0)),
            ae.test(n[1]) && Z.isPlainObject(t))
                for (n in t)
                    Z.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
            return this
        }
        return (r = J.getElementById(n[2])) && r.parentNode && (this.length = 1,
        this[0] = r),
        this.context = J,
        this.selector = e,
        this
    }
    ).prototype = Z.fn,
    le = Z(J);
    var ce = /^(?:parents|prev(?:Until|All))/
      , de = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    Z.extend({
        dir: function(e, t, n) {
            for (var r = [], i = n !== undefined; (e = e[t]) && 9 !== e.nodeType; )
                if (1 === e.nodeType) {
                    if (i && Z(e).is(n))
                        break;
                    r.push(e)
                }
            return r
        },
        sibling: function(e, t) {
            for (var n = []; e; e = e.nextSibling)
                1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }),
    Z.fn.extend({
        has: function(e) {
            var t = Z(e, this)
              , n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (Z.contains(this, t[e]))
                        return !0
            })
        },
        closest: function(e, t) {
            for (var n, r = 0, i = this.length, o = [], a = oe.test(e) || "string" != typeof e ? Z(e, t || this.context) : 0; r < i; r++)
                for (n = this[r]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && Z.find.matchesSelector(n, e))) {
                        o.push(n);
                        break
                    }
            return this.pushStack(1 < o.length ? Z.unique(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? U.call(Z(e), this[0]) : U.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(Z.unique(Z.merge(this.get(), Z(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    Z.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return Z.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return Z.dir(e, "parentNode", n)
        },
        next: function(e) {
            return n(e, "nextSibling")
        },
        prev: function(e) {
            return n(e, "previousSibling")
        },
        nextAll: function(e) {
            return Z.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return Z.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return Z.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return Z.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return Z.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return Z.sibling(e.firstChild)
        },
        contents: function(e) {
            return e.contentDocument || Z.merge([], e.childNodes)
        }
    }, function(r, i) {
        Z.fn[r] = function(e, t) {
            var n = Z.map(this, i, e);
            return "Until" !== r.slice(-5) && (t = e),
            t && "string" == typeof t && (n = Z.filter(t, n)),
            1 < this.length && (de[r] || Z.unique(n),
            ce.test(r) && n.reverse()),
            this.pushStack(n)
        }
    });
    var fe, pe = /\S+/g, he = {};
    Z.Callbacks = function(i) {
        i = "string" == typeof i ? he[i] || f(i) : Z.extend({}, i);
        var t, n, o, a, s, r, l = [], u = !i.once && [], c = function(e) {
            for (t = i.memory && e,
            n = !0,
            r = a || 0,
            a = 0,
            s = l.length,
            o = !0; l && r < s; r++)
                if (!1 === l[r].apply(e[0], e[1]) && i.stopOnFalse) {
                    t = !1;
                    break
                }
            o = !1,
            l && (u ? u.length && c(u.shift()) : t ? l = [] : d.disable())
        }, d = {
            add: function() {
                if (l) {
                    var e = l.length;
                    !function r(e) {
                        Z.each(e, function(e, t) {
                            var n = Z.type(t);
                            "function" === n ? i.unique && d.has(t) || l.push(t) : t && t.length && "string" !== n && r(t)
                        })
                    }(arguments),
                    o ? s = l.length : t && (a = e,
                    c(t))
                }
                return this
            },
            remove: function() {
                return l && Z.each(arguments, function(e, t) {
                    for (var n; -1 < (n = Z.inArray(t, l, n)); )
                        l.splice(n, 1),
                        o && (n <= s && s--,
                        n <= r && r--)
                }),
                this
            },
            has: function(e) {
                return e ? -1 < Z.inArray(e, l) : !(!l || !l.length)
            },
            empty: function() {
                return l = [],
                s = 0,
                this
            },
            disable: function() {
                return l = u = t = undefined,
                this
            },
            disabled: function() {
                return !l
            },
            lock: function() {
                return u = undefined,
                t || d.disable(),
                this
            },
            locked: function() {
                return !u
            },
            fireWith: function(e, t) {
                return !l || n && !u || (t = [e, (t = t || []).slice ? t.slice() : t],
                o ? u.push(t) : c(t)),
                this
            },
            fire: function() {
                return d.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!n
            }
        };
        return d
    }
    ,
    Z.extend({
        Deferred: function(e) {
            var o = [["resolve", "done", Z.Callbacks("once memory"), "resolved"], ["reject", "fail", Z.Callbacks("once memory"), "rejected"], ["notify", "progress", Z.Callbacks("memory")]]
              , i = "pending"
              , a = {
                state: function() {
                    return i
                },
                always: function() {
                    return s.done(arguments).fail(arguments),
                    this
                },
                then: function() {
                    var i = arguments;
                    return Z.Deferred(function(r) {
                        Z.each(o, function(e, t) {
                            var n = Z.isFunction(i[e]) && i[e];
                            s[t[1]](function() {
                                var e = n && n.apply(this, arguments);
                                e && Z.isFunction(e.promise) ? e.promise().done(r.resolve).fail(r.reject).progress(r.notify) : r[t[0] + "With"](this === a ? r.promise() : this, n ? [e] : arguments)
                            })
                        }),
                        i = null
                    }).promise()
                },
                promise: function(e) {
                    return null != e ? Z.extend(e, a) : a
                }
            }
              , s = {};
            return a.pipe = a.then,
            Z.each(o, function(e, t) {
                var n = t[2]
                  , r = t[3];
                a[t[1]] = n.add,
                r && n.add(function() {
                    i = r
                }, o[1 ^ e][2].disable, o[2][2].lock),
                s[t[0]] = function() {
                    return s[t[0] + "With"](this === s ? a : this, arguments),
                    this
                }
                ,
                s[t[0] + "With"] = n.fireWith
            }),
            a.promise(s),
            e && e.call(s, s),
            s
        },
        when: function(e) {
            var i, t, n, r = 0, o = W.call(arguments), a = o.length, s = 1 !== a || e && Z.isFunction(e.promise) ? a : 0, l = 1 === s ? e : Z.Deferred(), u = function(t, n, r) {
                return function(e) {
                    n[t] = this,
                    r[t] = 1 < arguments.length ? W.call(arguments) : e,
                    r === i ? l.notifyWith(n, r) : --s || l.resolveWith(n, r)
                }
            };
            if (1 < a)
                for (i = new Array(a),
                t = new Array(a),
                n = new Array(a); r < a; r++)
                    o[r] && Z.isFunction(o[r].promise) ? o[r].promise().done(u(r, n, o)).fail(l.reject).progress(u(r, t, i)) : --s;
            return s || l.resolveWith(n, o),
            l.promise()
        }
    }),
    Z.fn.ready = function(e) {
        return Z.ready.promise().done(e),
        this
    }
    ,
    Z.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? Z.readyWait++ : Z.ready(!0)
        },
        ready: function(e) {
            (!0 === e ? --Z.readyWait : Z.isReady) || (Z.isReady = !0) !== e && 0 < --Z.readyWait || (fe.resolveWith(J, [Z]),
            Z.fn.triggerHandler && (Z(J).triggerHandler("ready"),
            Z(J).off("ready")))
        }
    }),
    Z.ready.promise = function(e) {
        return fe || (fe = Z.Deferred(),
        "complete" === J.readyState ? setTimeout(Z.ready) : (J.addEventListener("DOMContentLoaded", r, !1),
        h.addEventListener("load", r, !1))),
        fe.promise(e)
    }
    ,
    Z.ready.promise();
    var me = Z.access = function(e, t, n, r, i, o, a) {
        var s = 0
          , l = e.length
          , u = null == n;
        if ("object" === Z.type(n))
            for (s in i = !0,
            n)
                Z.access(e, t, s, n[s], !0, o, a);
        else if (r !== undefined && (i = !0,
        Z.isFunction(r) || (a = !0),
        u && (a ? (t.call(e, r),
        t = null) : (u = t,
        t = function(e, t, n) {
            return u.call(Z(e), n)
        }
        )),
        t))
            for (; s < l; s++)
                t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
        return i ? e : u ? t.call(e) : l ? t(e[0], n) : o
    }
    ;
    Z.acceptData = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    }
    ,
    i.uid = 1,
    i.accepts = Z.acceptData,
    i.prototype = {
        key: function(e) {
            if (!i.accepts(e))
                return 0;
            var t = {}
              , n = e[this.expando];
            if (!n) {
                n = i.uid++;
                try {
                    t[this.expando] = {
                        value: n
                    },
                    Object.defineProperties(e, t)
                } catch (r) {
                    t[this.expando] = n,
                    Z.extend(e, t)
                }
            }
            return this.cache[n] || (this.cache[n] = {}),
            n
        },
        set: function(e, t, n) {
            var r, i = this.key(e), o = this.cache[i];
            if ("string" == typeof t)
                o[t] = n;
            else if (Z.isEmptyObject(o))
                Z.extend(this.cache[i], t);
            else
                for (r in t)
                    o[r] = t[r];
            return o
        },
        get: function(e, t) {
            var n = this.cache[this.key(e)];
            return t === undefined ? n : n[t]
        },
        access: function(e, t, n) {
            var r;
            return t === undefined || t && "string" == typeof t && n === undefined ? (r = this.get(e, t)) !== undefined ? r : this.get(e, Z.camelCase(t)) : (this.set(e, t, n),
            n !== undefined ? n : t)
        },
        remove: function(e, t) {
            var n, r, i, o = this.key(e), a = this.cache[o];
            if (t === undefined)
                this.cache[o] = {};
            else {
                Z.isArray(t) ? r = t.concat(t.map(Z.camelCase)) : (i = Z.camelCase(t),
                r = t in a ? [t, i] : (r = i)in a ? [r] : r.match(pe) || []),
                n = r.length;
                for (; n--; )
                    delete a[r[n]]
            }
        },
        hasData: function(e) {
            return !Z.isEmptyObject(this.cache[e[this.expando]] || {})
        },
        discard: function(e) {
            e[this.expando] && delete this.cache[e[this.expando]]
        }
    };
    var ge = new i
      , ve = new i
      , ye = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , be = /([A-Z])/g;
    Z.extend({
        hasData: function(e) {
            return ve.hasData(e) || ge.hasData(e)
        },
        data: function(e, t, n) {
            return ve.access(e, t, n)
        },
        removeData: function(e, t) {
            ve.remove(e, t)
        },
        _data: function(e, t, n) {
            return ge.access(e, t, n)
        },
        _removeData: function(e, t) {
            ge.remove(e, t)
        }
    }),
    Z.fn.extend({
        data: function(r, e) {
            var t, n, i, o = this[0], a = o && o.attributes;
            if (r !== undefined)
                return "object" == typeof r ? this.each(function() {
                    ve.set(this, r)
                }) : me(this, function(t) {
                    var e, n = Z.camelCase(r);
                    if (o && t === undefined)
                        return (e = ve.get(o, r)) !== undefined ? e : (e = ve.get(o, n)) !== undefined ? e : (e = l(o, n, undefined)) !== undefined ? e : void 0;
                    this.each(function() {
                        var e = ve.get(this, n);
                        ve.set(this, n, t),
                        -1 !== r.indexOf("-") && e !== undefined && ve.set(this, r, t)
                    })
                }, null, e, 1 < arguments.length, null, !0);
            if (this.length && (i = ve.get(o),
            1 === o.nodeType && !ge.get(o, "hasDataAttrs"))) {
                for (t = a.length; t--; )
                    0 === (n = a[t].name).indexOf("data-") && (n = Z.camelCase(n.slice(5)),
                    l(o, n, i[n]));
                ge.set(o, "hasDataAttrs", !0)
            }
            return i
        },
        removeData: function(e) {
            return this.each(function() {
                ve.remove(this, e)
            })
        }
    }),
    Z.extend({
        queue: function(e, t, n) {
            var r;
            if (e)
                return t = (t || "fx") + "queue",
                r = ge.get(e, t),
                n && (!r || Z.isArray(n) ? r = ge.access(e, t, Z.makeArray(n)) : r.push(n)),
                r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = Z.queue(e, t)
              , r = n.length
              , i = n.shift()
              , o = Z._queueHooks(e, t)
              , a = function() {
                Z.dequeue(e, t)
            };
            "inprogress" === i && (i = n.shift(),
            r--),
            i && ("fx" === t && n.unshift("inprogress"),
            delete o.stop,
            i.call(e, a, o)),
            !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return ge.get(e, n) || ge.access(e, n, {
                empty: Z.Callbacks("once memory").add(function() {
                    ge.remove(e, [t + "queue", n])
                })
            })
        }
    }),
    Z.fn.extend({
        queue: function(t, n) {
            var e = 2;
            return "string" != typeof t && (n = t,
            t = "fx",
            e--),
            arguments.length < e ? Z.queue(this[0], t) : n === undefined ? this : this.each(function() {
                var e = Z.queue(this, t, n);
                Z._queueHooks(this, t),
                "fx" === t && "inprogress" !== e[0] && Z.dequeue(this, t)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                Z.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1, i = Z.Deferred(), o = this, a = this.length, s = function() {
                --r || i.resolveWith(o, [o])
            };
            for ("string" != typeof e && (t = e,
            e = undefined),
            e = e || "fx"; a--; )
                (n = ge.get(o[a], e + "queueHooks")) && n.empty && (r++,
                n.empty.add(s));
            return s(),
            i.promise(t)
        }
    });
    var xe, we, ke = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, je = ["Top", "Right", "Bottom", "Left"], Te = function(e, t) {
        return e = t || e,
        "none" === Z.css(e, "display") || !Z.contains(e.ownerDocument, e)
    }, $e = /^(?:checkbox|radio)$/i;
    xe = J.createDocumentFragment().appendChild(J.createElement("div")),
    (we = J.createElement("input")).setAttribute("type", "radio"),
    we.setAttribute("checked", "checked"),
    we.setAttribute("name", "t"),
    xe.appendChild(we),
    G.checkClone = xe.cloneNode(!0).cloneNode(!0).lastChild.checked,
    xe.innerHTML = "<textarea>x</textarea>",
    G.noCloneChecked = !!xe.cloneNode(!0).lastChild.defaultValue;
    var Ce = typeof undefined;
    G.focusinBubbles = "onfocusin"in h;
    var Ee = /^key/
      , Se = /^(?:mouse|pointer|contextmenu)|click/
      , Ne = /^(?:focusinfocus|focusoutblur)$/
      , Le = /^([^.]*)(?:\.(.+)|)$/;
    Z.event = {
        global: {},
        add: function(t, e, n, r, i) {
            var o, a, s, l, u, c, d, f, p, h, m, g = ge.get(t);
            if (g)
                for (n.handler && (n = (o = n).handler,
                i = o.selector),
                n.guid || (n.guid = Z.guid++),
                (l = g.events) || (l = g.events = {}),
                (a = g.handle) || (a = g.handle = function(e) {
                    return typeof Z !== Ce && Z.event.triggered !== e.type ? Z.event.dispatch.apply(t, arguments) : undefined
                }
                ),
                u = (e = (e || "").match(pe) || [""]).length; u--; )
                    p = m = (s = Le.exec(e[u]) || [])[1],
                    h = (s[2] || "").split(".").sort(),
                    p && (d = Z.event.special[p] || {},
                    p = (i ? d.delegateType : d.bindType) || p,
                    d = Z.event.special[p] || {},
                    c = Z.extend({
                        type: p,
                        origType: m,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && Z.expr.match.needsContext.test(i),
                        namespace: h.join(".")
                    }, o),
                    (f = l[p]) || ((f = l[p] = []).delegateCount = 0,
                    d.setup && !1 !== d.setup.call(t, r, h, a) || t.addEventListener && t.addEventListener(p, a, !1)),
                    d.add && (d.add.call(t, c),
                    c.handler.guid || (c.handler.guid = n.guid)),
                    i ? f.splice(f.delegateCount++, 0, c) : f.push(c),
                    Z.event.global[p] = !0)
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, l, u, c, d, f, p, h, m, g = ge.hasData(e) && ge.get(e);
            if (g && (l = g.events)) {
                for (u = (t = (t || "").match(pe) || [""]).length; u--; )
                    if (p = m = (s = Le.exec(t[u]) || [])[1],
                    h = (s[2] || "").split(".").sort(),
                    p) {
                        for (d = Z.event.special[p] || {},
                        f = l[p = (r ? d.delegateType : d.bindType) || p] || [],
                        s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        a = o = f.length; o--; )
                            c = f[o],
                            !i && m !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (f.splice(o, 1),
                            c.selector && f.delegateCount--,
                            d.remove && d.remove.call(e, c));
                        a && !f.length && (d.teardown && !1 !== d.teardown.call(e, h, g.handle) || Z.removeEvent(e, p, g.handle),
                        delete l[p])
                    } else
                        for (p in l)
                            Z.event.remove(e, p + t[u], n, r, !0);
                Z.isEmptyObject(l) && (delete g.handle,
                ge.remove(e, "events"))
            }
        },
        trigger: function(e, t, n, r) {
            var i, o, a, s, l, u, c, d = [n || J], f = K.call(e, "type") ? e.type : e, p = K.call(e, "namespace") ? e.namespace.split(".") : [];
            if (o = a = n = n || J,
            3 !== n.nodeType && 8 !== n.nodeType && !Ne.test(f + Z.event.triggered) && (0 <= f.indexOf(".") && (f = (p = f.split(".")).shift(),
            p.sort()),
            l = f.indexOf(":") < 0 && "on" + f,
            (e = e[Z.expando] ? e : new Z.Event(f,"object" == typeof e && e)).isTrigger = r ? 2 : 3,
            e.namespace = p.join("."),
            e.namespace_re = e.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            e.result = undefined,
            e.target || (e.target = n),
            t = null == t ? [e] : Z.makeArray(t, [e]),
            c = Z.event.special[f] || {},
            r || !c.trigger || !1 !== c.trigger.apply(n, t))) {
                if (!r && !c.noBubble && !Z.isWindow(n)) {
                    for (s = c.delegateType || f,
                    Ne.test(s + f) || (o = o.parentNode); o; o = o.parentNode)
                        d.push(o),
                        a = o;
                    a === (n.ownerDocument || J) && d.push(a.defaultView || a.parentWindow || h)
                }
                for (i = 0; (o = d[i++]) && !e.isPropagationStopped(); )
                    e.type = 1 < i ? s : c.bindType || f,
                    (u = (ge.get(o, "events") || {})[e.type] && ge.get(o, "handle")) && u.apply(o, t),
                    (u = l && o[l]) && u.apply && Z.acceptData(o) && (e.result = u.apply(o, t),
                    !1 === e.result && e.preventDefault());
                return e.type = f,
                r || e.isDefaultPrevented() || c._default && !1 !== c._default.apply(d.pop(), t) || !Z.acceptData(n) || l && Z.isFunction(n[f]) && !Z.isWindow(n) && ((a = n[l]) && (n[l] = null),
                n[Z.event.triggered = f](),
                Z.event.triggered = undefined,
                a && (n[l] = a)),
                e.result
            }
        },
        dispatch: function(e) {
            e = Z.event.fix(e);
            var t, n, r, i, o, a = [], s = W.call(arguments), l = (ge.get(this, "events") || {})[e.type] || [], u = Z.event.special[e.type] || {};
            if ((s[0] = e).delegateTarget = this,
            !u.preDispatch || !1 !== u.preDispatch.call(this, e)) {
                for (a = Z.event.handlers.call(this, e, l),
                t = 0; (i = a[t++]) && !e.isPropagationStopped(); )
                    for (e.currentTarget = i.elem,
                    n = 0; (o = i.handlers[n++]) && !e.isImmediatePropagationStopped(); )
                        e.namespace_re && !e.namespace_re.test(o.namespace) || (e.handleObj = o,
                        e.data = o.data,
                        (r = ((Z.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s)) !== undefined && !1 === (e.result = r) && (e.preventDefault(),
                        e.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, e),
                e.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a = [], s = t.delegateCount, l = e.target;
            if (s && l.nodeType && (!e.button || "click" !== e.type))
                for (; l !== this; l = l.parentNode || this)
                    if (!0 !== l.disabled || "click" !== e.type) {
                        for (r = [],
                        n = 0; n < s; n++)
                            r[i = (o = t[n]).selector + " "] === undefined && (r[i] = o.needsContext ? 0 <= Z(i, this).index(l) : Z.find(i, this, null, [l]).length),
                            r[i] && r.push(o);
                        r.length && a.push({
                            elem: l,
                            handlers: r
                        })
                    }
            return s < t.length && a.push({
                elem: this,
                handlers: t.slice(s)
            }),
            a
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode),
                e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, r, i, o = t.button;
                return null == e.pageX && null != t.clientX && (r = (n = e.target.ownerDocument || J).documentElement,
                i = n.body,
                e.pageX = t.clientX + (r && r.scrollLeft || i && i.scrollLeft || 0) - (r && r.clientLeft || i && i.clientLeft || 0),
                e.pageY = t.clientY + (r && r.scrollTop || i && i.scrollTop || 0) - (r && r.clientTop || i && i.clientTop || 0)),
                e.which || o === undefined || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0),
                e
            }
        },
        fix: function(e) {
            if (e[Z.expando])
                return e;
            var t, n, r, i = e.type, o = e, a = this.fixHooks[i];
            for (a || (this.fixHooks[i] = a = Se.test(i) ? this.mouseHooks : Ee.test(i) ? this.keyHooks : {}),
            r = a.props ? this.props.concat(a.props) : this.props,
            e = new Z.Event(o),
            t = r.length; t--; )
                e[n = r[t]] = o[n];
            return e.target || (e.target = J),
            3 === e.target.nodeType && (e.target = e.target.parentNode),
            a.filter ? a.filter(e, o) : e
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== a() && this.focus)
                        return this.focus(),
                        !1
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === a() && this.blur)
                        return this.blur(),
                        !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if ("checkbox" === this.type && this.click && Z.nodeName(this, "input"))
                        return this.click(),
                        !1
                },
                _default: function(e) {
                    return Z.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    e.result !== undefined && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n, r) {
            var i = Z.extend(new Z.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            r ? Z.event.trigger(i, null, t) : Z.event.dispatch.call(t, i),
            i.isDefaultPrevented() && n.preventDefault()
        }
    },
    Z.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    }
    ,
    Z.Event = function(e, t) {
        if (!(this instanceof Z.Event))
            return new Z.Event(e,t);
        e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === undefined && !1 === e.returnValue ? o : u) : this.type = e,
        t && Z.extend(this, t),
        this.timeStamp = e && e.timeStamp || Z.now(),
        this[Z.expando] = !0
    }
    ,
    Z.Event.prototype = {
        isDefaultPrevented: u,
        isPropagationStopped: u,
        isImmediatePropagationStopped: u,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = o,
            e && e.preventDefault && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = o,
            e && e.stopPropagation && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = o,
            e && e.stopImmediatePropagation && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    Z.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, o) {
        Z.event.special[e] = {
            delegateType: o,
            bindType: o,
            handle: function(e) {
                var t, n = this, r = e.relatedTarget, i = e.handleObj;
                return r && (r === n || Z.contains(n, r)) || (e.type = i.origType,
                t = i.handler.apply(this, arguments),
                e.type = o),
                t
            }
        }
    }),
    G.focusinBubbles || Z.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, r) {
        var i = function(e) {
            Z.event.simulate(r, e.target, Z.event.fix(e), !0)
        };
        Z.event.special[r] = {
            setup: function() {
                var e = this.ownerDocument || this
                  , t = ge.access(e, r);
                t || e.addEventListener(n, i, !0),
                ge.access(e, r, (t || 0) + 1)
            },
            teardown: function() {
                var e = this.ownerDocument || this
                  , t = ge.access(e, r) - 1;
                t ? ge.access(e, r, t) : (e.removeEventListener(n, i, !0),
                ge.remove(e, r))
            }
        }
    }),
    Z.fn.extend({
        on: function(e, t, n, r, i) {
            var o, a;
            if ("object" == typeof e) {
                for (a in "string" != typeof t && (n = n || t,
                t = undefined),
                e)
                    this.on(a, t, n, e[a], i);
                return this
            }
            if (null == n && null == r ? (r = t,
            n = t = undefined) : null == r && ("string" == typeof t ? (r = n,
            n = undefined) : (r = n,
            n = t,
            t = undefined)),
            !1 === r)
                r = u;
            else if (!r)
                return this;
            return 1 === i && (o = r,
            (r = function(e) {
                return Z().off(e),
                o.apply(this, arguments)
            }
            ).guid = o.guid || (o.guid = Z.guid++)),
            this.each(function() {
                Z.event.add(this, e, r, n, t)
            })
        },
        one: function(e, t, n, r) {
            return this.on(e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj)
                return r = e.handleObj,
                Z(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler),
                this;
            if ("object" != typeof e)
                return !1 !== t && "function" != typeof t || (n = t,
                t = undefined),
                !1 === n && (n = u),
                this.each(function() {
                    Z.event.remove(this, e, n, t)
                });
            for (i in e)
                this.off(i, t, e[i]);
            return this
        },
        trigger: function(e, t) {
            return this.each(function() {
                Z.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n)
                return Z.event.trigger(e, t, n, !0)
        }
    });
    var De = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
      , Ie = /<([\w:]+)/
      , Ae = /<|&#?\w+;/
      , Oe = /<(?:script|style|link)/i
      , Me = /checked\s*(?:[^=]|=\s*.checked.)/i
      , He = /^$|\/(?:java|ecma)script/i
      , Pe = /^true\/(.*)/
      , Fe = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
      , qe = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    qe.optgroup = qe.option,
    qe.tbody = qe.tfoot = qe.colgroup = qe.caption = qe.thead,
    qe.th = qe.td,
    Z.extend({
        clone: function(e, t, n) {
            var r, i, o, a, s = e.cloneNode(!0), l = Z.contains(e.ownerDocument, e);
            if (!(G.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Z.isXMLDoc(e)))
                for (a = y(s),
                r = 0,
                i = (o = y(e)).length; r < i; r++)
                    p(o[r], a[r]);
            if (t)
                if (n)
                    for (o = o || y(e),
                    a = a || y(s),
                    r = 0,
                    i = o.length; r < i; r++)
                        d(o[r], a[r]);
                else
                    d(e, s);
            return 0 < (a = y(s, "script")).length && v(a, !l && y(e, "script")),
            s
        },
        buildFragment: function(e, t, n, r) {
            for (var i, o, a, s, l, u, c = t.createDocumentFragment(), d = [], f = 0, p = e.length; f < p; f++)
                if ((i = e[f]) || 0 === i)
                    if ("object" === Z.type(i))
                        Z.merge(d, i.nodeType ? [i] : i);
                    else if (Ae.test(i)) {
                        for (o = o || c.appendChild(t.createElement("div")),
                        a = (Ie.exec(i) || ["", ""])[1].toLowerCase(),
                        s = qe[a] || qe._default,
                        o.innerHTML = s[1] + i.replace(De, "<$1></$2>") + s[2],
                        u = s[0]; u--; )
                            o = o.lastChild;
                        Z.merge(d, o.childNodes),
                        (o = c.firstChild).textContent = ""
                    } else
                        d.push(t.createTextNode(i));
            for (c.textContent = "",
            f = 0; i = d[f++]; )
                if ((!r || -1 === Z.inArray(i, r)) && (l = Z.contains(i.ownerDocument, i),
                o = y(c.appendChild(i), "script"),
                l && v(o),
                n))
                    for (u = 0; i = o[u++]; )
                        He.test(i.type || "") && n.push(i);
            return c
        },
        cleanData: function(e) {
            for (var t, n, r, i, o = Z.event.special, a = 0; (n = e[a]) !== undefined; a++) {
                if (Z.acceptData(n) && (i = n[ge.expando]) && (t = ge.cache[i])) {
                    if (t.events)
                        for (r in t.events)
                            o[r] ? Z.event.remove(n, r) : Z.removeEvent(n, r, t.handle);
                    ge.cache[i] && delete ge.cache[i]
                }
                delete ve.cache[n[ve.expando]]
            }
        }
    }),
    Z.fn.extend({
        text: function(e) {
            return me(this, function(e) {
                return e === undefined ? Z.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || c(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = c(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function(e, t) {
            for (var n, r = e ? Z.filter(e, this) : this, i = 0; null != (n = r[i]); i++)
                t || 1 !== n.nodeType || Z.cleanData(y(n)),
                n.parentNode && (t && Z.contains(n.ownerDocument, n) && v(y(n, "script")),
                n.parentNode.removeChild(n));
            return this
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (Z.cleanData(y(e, !1)),
                e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e,
            t = null == t ? e : t,
            this.map(function() {
                return Z.clone(this, e, t)
            })
        },
        html: function(e) {
            return me(this, function(e) {
                var t = this[0] || {}
                  , n = 0
                  , r = this.length;
                if (e === undefined && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !Oe.test(e) && !qe[(Ie.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = e.replace(De, "<$1></$2>");
                    try {
                        for (; n < r; n++)
                            1 === (t = this[n] || {}).nodeType && (Z.cleanData(y(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (i) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function(e) {
            var t = e;
            return this.domManip(arguments, function(e) {
                t = this.parentNode,
                Z.cleanData(y(this)),
                t && t.replaceChild(e, this)
            }),
            t && (t.length || t.nodeType) ? this : this.remove()
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(n, r) {
            n = B.apply([], n);
            var e, t, i, o, a, s, l = 0, u = this.length, c = this, d = u - 1, f = n[0], p = Z.isFunction(f);
            if (p || 1 < u && "string" == typeof f && !G.checkClone && Me.test(f))
                return this.each(function(e) {
                    var t = c.eq(e);
                    p && (n[0] = f.call(this, e, t.html())),
                    t.domManip(n, r)
                });
            if (u && (t = (e = Z.buildFragment(n, this[0].ownerDocument, !1, this)).firstChild,
            1 === e.childNodes.length && (e = t),
            t)) {
                for (o = (i = Z.map(y(e, "script"), m)).length; l < u; l++)
                    a = e,
                    l !== d && (a = Z.clone(a, !0, !0),
                    o && Z.merge(i, y(a, "script"))),
                    r.call(this[l], a, l);
                if (o)
                    for (s = i[i.length - 1].ownerDocument,
                    Z.map(i, g),
                    l = 0; l < o; l++)
                        a = i[l],
                        He.test(a.type || "") && !ge.access(a, "globalEval") && Z.contains(s, a) && (a.src ? Z._evalUrl && Z._evalUrl(a.src) : Z.globalEval(a.textContent.replace(Fe, "")))
            }
            return this
        }
    }),
    Z.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, a) {
        Z.fn[e] = function(e) {
            for (var t, n = [], r = Z(e), i = r.length - 1, o = 0; o <= i; o++)
                t = o === i ? this : this.clone(!0),
                Z(r[o])[a](t),
                X.apply(n, t.get());
            return this.pushStack(n)
        }
    });
    var Re, _e = {}, ze = /^margin/, We = new RegExp("^(" + ke + ")(?!px)[a-z%]+$","i"), Be = function(e) {
        return e.ownerDocument.defaultView.getComputedStyle(e, null)
    };
    !function() {
        function e() {
            o.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",
            o.innerHTML = "",
            r.appendChild(i);
            var e = h.getComputedStyle(o, null);
            t = "1%" !== e.top,
            n = "4px" === e.width,
            r.removeChild(i)
        }
        var t, n, r = J.documentElement, i = J.createElement("div"), o = J.createElement("div");
        o.style && (o.style.backgroundClip = "content-box",
        o.cloneNode(!0).style.backgroundClip = "",
        G.clearCloneStyle = "content-box" === o.style.backgroundClip,
        i.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",
        i.appendChild(o),
        h.getComputedStyle && Z.extend(G, {
            pixelPosition: function() {
                return e(),
                t
            },
            boxSizingReliable: function() {
                return null == n && e(),
                n
            },
            reliableMarginRight: function() {
                var e, t = o.appendChild(J.createElement("div"));
                return t.style.cssText = o.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                t.style.marginRight = t.style.width = "0",
                o.style.width = "1px",
                r.appendChild(i),
                e = !parseFloat(h.getComputedStyle(t, null).marginRight),
                r.removeChild(i),
                e
            }
        }))
    }(),
    Z.swap = function(e, t, n, r) {
        var i, o, a = {};
        for (o in t)
            a[o] = e.style[o],
            e.style[o] = t[o];
        for (o in i = n.apply(e, r || []),
        t)
            e.style[o] = a[o];
        return i
    }
    ;
    var Xe = /^(none|table(?!-c[ea]).+)/
      , Ue = new RegExp("^(" + ke + ")(.*)$","i")
      , Ye = new RegExp("^([+-])=(" + ke + ")","i")
      , Ve = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , Ke = {
        letterSpacing: "0",
        fontWeight: "400"
    }
      , Ge = ["Webkit", "O", "Moz", "ms"];
    Z.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = w(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": "cssFloat"
        },
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = Z.camelCase(t), l = e.style;
                if (t = Z.cssProps[s] || (Z.cssProps[s] = j(l, s)),
                a = Z.cssHooks[t] || Z.cssHooks[s],
                n === undefined)
                    return a && "get"in a && (i = a.get(e, !1, r)) !== undefined ? i : l[t];
                "string" === (o = typeof n) && (i = Ye.exec(n)) && (n = (i[1] + 1) * i[2] + parseFloat(Z.css(e, t)),
                o = "number"),
                null != n && n == n && ("number" !== o || Z.cssNumber[s] || (n += "px"),
                G.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"),
                a && "set"in a && (n = a.set(e, n, r)) === undefined || (l[t] = n))
            }
        },
        css: function(e, t, n, r) {
            var i, o, a, s = Z.camelCase(t);
            return t = Z.cssProps[s] || (Z.cssProps[s] = j(e.style, s)),
            (a = Z.cssHooks[t] || Z.cssHooks[s]) && "get"in a && (i = a.get(e, !0, n)),
            i === undefined && (i = w(e, t, r)),
            "normal" === i && t in Ke && (i = Ke[t]),
            "" === n || n ? (o = parseFloat(i),
            !0 === n || Z.isNumeric(o) ? o || 0 : i) : i
        }
    }),
    Z.each(["height", "width"], function(e, i) {
        Z.cssHooks[i] = {
            get: function(e, t, n) {
                if (t)
                    return 0 === e.offsetWidth && Xe.test(Z.css(e, "display")) ? Z.swap(e, Ve, function() {
                        return C(e, i, n)
                    }) : C(e, i, n)
            },
            set: function(e, t, n) {
                var r = n && Be(e);
                return T(e, t, n ? $(e, i, n, "border-box" === Z.css(e, "boxSizing", !1, r), r) : 0)
            }
        }
    }),
    Z.cssHooks.marginRight = k(G.reliableMarginRight, function(e, t) {
        if (t)
            return Z.swap(e, {
                display: "inline-block"
            }, w, [e, "marginRight"])
    }),
    Z.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(i, o) {
        Z.cssHooks[i + o] = {
            expand: function(e) {
                for (var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++)
                    n[i + je[t] + o] = r[t] || r[t - 2] || r[0];
                return n
            }
        },
        ze.test(i) || (Z.cssHooks[i + o].set = T)
    }),
    Z.fn.extend({
        css: function(e, t) {
            return me(this, function(e, t, n) {
                var r, i, o = {}, a = 0;
                if (Z.isArray(t)) {
                    for (r = Be(e),
                    i = t.length; a < i; a++)
                        o[t[a]] = Z.css(e, t[a], !1, r);
                    return o
                }
                return n !== undefined ? Z.style(e, t, n) : Z.css(e, t)
            }, e, t, 1 < arguments.length)
        },
        show: function() {
            return E(this, !0)
        },
        hide: function() {
            return E(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Te(this) ? Z(this).show() : Z(this).hide()
            })
        }
    }),
    (Z.Tween = S).prototype = {
        constructor: S,
        init: function(e, t, n, r, i, o) {
            this.elem = e,
            this.prop = n,
            this.easing = i || "swing",
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = r,
            this.unit = o || (Z.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = S.propHooks[this.prop];
            return e && e.get ? e.get(this) : S.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = S.propHooks[this.prop];
            return this.options.duration ? this.pos = t = Z.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : S.propHooks._default.set(this),
            this
        }
    },
    S.prototype.init.prototype = S.prototype,
    S.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = Z.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0 : e.elem[e.prop]
            },
            set: function(e) {
                Z.fx.step[e.prop] ? Z.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[Z.cssProps[e.prop]] || Z.cssHooks[e.prop]) ? Z.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    },
    S.propHooks.scrollTop = S.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    Z.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    },
    Z.fx = S.prototype.init,
    Z.fx.step = {};
    var Je, Qe, Ze, et, tt, nt = /^(?:toggle|show|hide)$/, rt = new RegExp("^(?:([+-])=|)(" + ke + ")([a-z%]*)$","i"), it = /queueHooks$/, ot = [I], at = {
        "*": [function(e, t) {
            var n = this.createTween(e, t)
              , r = n.cur()
              , i = rt.exec(t)
              , o = i && i[3] || (Z.cssNumber[e] ? "" : "px")
              , a = (Z.cssNumber[e] || "px" !== o && +r) && rt.exec(Z.css(n.elem, e))
              , s = 1
              , l = 20;
            if (a && a[3] !== o)
                for (o = o || a[3],
                i = i || [],
                a = +r || 1; a /= s = s || ".5",
                Z.style(n.elem, e, a + o),
                s !== (s = n.cur() / r) && 1 !== s && --l; )
                    ;
            return i && (a = n.start = +a || +r || 0,
            n.unit = o,
            n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2]),
            n
        }
        ]
    };
    Z.Animation = Z.extend(O, {
        tweener: function(e, t) {
            Z.isFunction(e) ? (t = e,
            e = ["*"]) : e = e.split(" ");
            for (var n, r = 0, i = e.length; r < i; r++)
                n = e[r],
                at[n] = at[n] || [],
                at[n].unshift(t)
        },
        prefilter: function(e, t) {
            t ? ot.unshift(e) : ot.push(e)
        }
    }),
    Z.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? Z.extend({}, e) : {
            complete: n || !n && t || Z.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !Z.isFunction(t) && t
        };
        return r.duration = Z.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in Z.fx.speeds ? Z.fx.speeds[r.duration] : Z.fx.speeds._default,
        null != r.queue && !0 !== r.queue || (r.queue = "fx"),
        r.old = r.complete,
        r.complete = function() {
            Z.isFunction(r.old) && r.old.call(this),
            r.queue && Z.dequeue(this, r.queue)
        }
        ,
        r
    }
    ,
    Z.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(Te).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(t, e, n, r) {
            var i = Z.isEmptyObject(t)
              , o = Z.speed(e, n, r)
              , a = function() {
                var e = O(this, Z.extend({}, t), o);
                (i || ge.get(this, "finish")) && e.stop(!0)
            };
            return a.finish = a,
            i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(i, e, o) {
            var a = function(e) {
                var t = e.stop;
                delete e.stop,
                t(o)
            };
            return "string" != typeof i && (o = e,
            e = i,
            i = undefined),
            e && !1 !== i && this.queue(i || "fx", []),
            this.each(function() {
                var e = !0
                  , t = null != i && i + "queueHooks"
                  , n = Z.timers
                  , r = ge.get(this);
                if (t)
                    r[t] && r[t].stop && a(r[t]);
                else
                    for (t in r)
                        r[t] && r[t].stop && it.test(t) && a(r[t]);
                for (t = n.length; t--; )
                    n[t].elem !== this || null != i && n[t].queue !== i || (n[t].anim.stop(o),
                    e = !1,
                    n.splice(t, 1));
                !e && o || Z.dequeue(this, i)
            })
        },
        finish: function(a) {
            return !1 !== a && (a = a || "fx"),
            this.each(function() {
                var e, t = ge.get(this), n = t[a + "queue"], r = t[a + "queueHooks"], i = Z.timers, o = n ? n.length : 0;
                for (t.finish = !0,
                Z.queue(this, a, []),
                r && r.stop && r.stop.call(this, !0),
                e = i.length; e--; )
                    i[e].elem === this && i[e].queue === a && (i[e].anim.stop(!0),
                    i.splice(e, 1));
                for (e = 0; e < o; e++)
                    n[e] && n[e].finish && n[e].finish.call(this);
                delete t.finish
            })
        }
    }),
    Z.each(["toggle", "show", "hide"], function(e, r) {
        var i = Z.fn[r];
        Z.fn[r] = function(e, t, n) {
            return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(L(r, !0), e, t, n)
        }
    }),
    Z.each({
        slideDown: L("show"),
        slideUp: L("hide"),
        slideToggle: L("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, r) {
        Z.fn[e] = function(e, t, n) {
            return this.animate(r, e, t, n)
        }
    }),
    Z.timers = [],
    Z.fx.tick = function() {
        var e, t = 0, n = Z.timers;
        for (Je = Z.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || Z.fx.stop(),
        Je = undefined
    }
    ,
    Z.fx.timer = function(e) {
        Z.timers.push(e),
        e() ? Z.fx.start() : Z.timers.pop()
    }
    ,
    Z.fx.interval = 13,
    Z.fx.start = function() {
        Qe || (Qe = setInterval(Z.fx.tick, Z.fx.interval))
    }
    ,
    Z.fx.stop = function() {
        clearInterval(Qe),
        Qe = null
    }
    ,
    Z.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    Z.fn.delay = function(r, e) {
        return r = Z.fx && Z.fx.speeds[r] || r,
        e = e || "fx",
        this.queue(e, function(e, t) {
            var n = setTimeout(e, r);
            t.stop = function() {
                clearTimeout(n)
            }
        })
    }
    ,
    Ze = J.createElement("input"),
    et = J.createElement("select"),
    tt = et.appendChild(J.createElement("option")),
    Ze.type = "checkbox",
    G.checkOn = "" !== Ze.value,
    G.optSelected = tt.selected,
    et.disabled = !0,
    G.optDisabled = !tt.disabled,
    (Ze = J.createElement("input")).value = "t",
    Ze.type = "radio",
    G.radioValue = "t" === Ze.value;
    var st, lt, ut = Z.expr.attrHandle;
    Z.fn.extend({
        attr: function(e, t) {
            return me(this, Z.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                Z.removeAttr(this, e)
            })
        }
    }),
    Z.extend({
        attr: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (e && 3 !== o && 8 !== o && 2 !== o)
                return typeof e.getAttribute === Ce ? Z.prop(e, t, n) : (1 === o && Z.isXMLDoc(e) || (t = t.toLowerCase(),
                r = Z.attrHooks[t] || (Z.expr.match.bool.test(t) ? lt : st)),
                n === undefined ? r && "get"in r && null !== (i = r.get(e, t)) ? i : null == (i = Z.find.attr(e, t)) ? undefined : i : null !== n ? r && "set"in r && (i = r.set(e, n, t)) !== undefined ? i : (e.setAttribute(t, n + ""),
                n) : void Z.removeAttr(e, t))
        },
        removeAttr: function(e, t) {
            var n, r, i = 0, o = t && t.match(pe);
            if (o && 1 === e.nodeType)
                for (; n = o[i++]; )
                    r = Z.propFix[n] || n,
                    Z.expr.match.bool.test(n) && (e[r] = !1),
                    e.removeAttribute(n)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!G.radioValue && "radio" === t && Z.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t),
                        n && (e.value = n),
                        t
                    }
                }
            }
        }
    }),
    lt = {
        set: function(e, t, n) {
            return !1 === t ? Z.removeAttr(e, n) : e.setAttribute(n, n),
            n
        }
    },
    Z.each(Z.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var o = ut[t] || Z.find.attr;
        ut[t] = function(e, t, n) {
            var r, i;
            return n || (i = ut[t],
            ut[t] = r,
            r = null != o(e, t, n) ? t.toLowerCase() : null,
            ut[t] = i),
            r
        }
    });
    var ct = /^(?:input|select|textarea|button)$/i;
    Z.fn.extend({
        prop: function(e, t) {
            return me(this, Z.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[Z.propFix[e] || e]
            })
        }
    }),
    Z.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (e && 3 !== o && 8 !== o && 2 !== o)
                return (1 !== o || !Z.isXMLDoc(e)) && (t = Z.propFix[t] || t,
                i = Z.propHooks[t]),
                n !== undefined ? i && "set"in i && (r = i.set(e, n, t)) !== undefined ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    return e.hasAttribute("tabindex") || ct.test(e.nodeName) || e.href ? e.tabIndex : -1
                }
            }
        }
    }),
    G.optSelected || (Z.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
            null
        }
    }),
    Z.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        Z.propFix[this.toLowerCase()] = this
    });
    var dt = /[\t\r\n\f]/g;
    Z.fn.extend({
        addClass: function(t) {
            var e, n, r, i, o, a, s = "string" == typeof t && t, l = 0, u = this.length;
            if (Z.isFunction(t))
                return this.each(function(e) {
                    Z(this).addClass(t.call(this, e, this.className))
                });
            if (s)
                for (e = (t || "").match(pe) || []; l < u; l++)
                    if (r = 1 === (n = this[l]).nodeType && (n.className ? (" " + n.className + " ").replace(dt, " ") : " ")) {
                        for (o = 0; i = e[o++]; )
                            r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                        a = Z.trim(r),
                        n.className !== a && (n.className = a)
                    }
            return this
        },
        removeClass: function(t) {
            var e, n, r, i, o, a, s = 0 === arguments.length || "string" == typeof t && t, l = 0, u = this.length;
            if (Z.isFunction(t))
                return this.each(function(e) {
                    Z(this).removeClass(t.call(this, e, this.className))
                });
            if (s)
                for (e = (t || "").match(pe) || []; l < u; l++)
                    if (r = 1 === (n = this[l]).nodeType && (n.className ? (" " + n.className + " ").replace(dt, " ") : "")) {
                        for (o = 0; i = e[o++]; )
                            for (; 0 <= r.indexOf(" " + i + " "); )
                                r = r.replace(" " + i + " ", " ");
                        a = t ? Z.trim(r) : "",
                        n.className !== a && (n.className = a)
                    }
            return this
        },
        toggleClass: function(i, t) {
            var o = typeof i;
            return "boolean" == typeof t && "string" === o ? t ? this.addClass(i) : this.removeClass(i) : Z.isFunction(i) ? this.each(function(e) {
                Z(this).toggleClass(i.call(this, e, this.className, t), t)
            }) : this.each(function() {
                if ("string" === o)
                    for (var e, t = 0, n = Z(this), r = i.match(pe) || []; e = r[t++]; )
                        n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                else
                    o !== Ce && "boolean" !== o || (this.className && ge.set(this, "__className__", this.className),
                    this.className = this.className || !1 === i ? "" : ge.get(this, "__className__") || "")
            })
        },
        hasClass: function(e) {
            for (var t = " " + e + " ", n = 0, r = this.length; n < r; n++)
                if (1 === this[n].nodeType && 0 <= (" " + this[n].className + " ").replace(dt, " ").indexOf(t))
                    return !0;
            return !1
        }
    });
    var ft = /\r/g;
    Z.fn.extend({
        val: function(n) {
            var r, e, i, t = this[0];
            return arguments.length ? (i = Z.isFunction(n),
            this.each(function(e) {
                var t;
                1 === this.nodeType && (null == (t = i ? n.call(this, e, Z(this).val()) : n) ? t = "" : "number" == typeof t ? t += "" : Z.isArray(t) && (t = Z.map(t, function(e) {
                    return null == e ? "" : e + ""
                })),
                (r = Z.valHooks[this.type] || Z.valHooks[this.nodeName.toLowerCase()]) && "set"in r && r.set(this, t, "value") !== undefined || (this.value = t))
            })) : t ? (r = Z.valHooks[t.type] || Z.valHooks[t.nodeName.toLowerCase()]) && "get"in r && (e = r.get(t, "value")) !== undefined ? e : "string" == typeof (e = t.value) ? e.replace(ft, "") : null == e ? "" : e : void 0
        }
    }),
    Z.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = Z.find.attr(e, "value");
                    return null != t ? t : Z.trim(Z.text(e))
                }
            },
            select: {
                get: function(e) {
                    for (var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || i < 0, a = o ? null : [], s = o ? i + 1 : r.length, l = i < 0 ? s : o ? i : 0; l < s; l++)
                        if (((n = r[l]).selected || l === i) && (G.optDisabled ? !n.disabled : null === n.getAttribute("disabled")) && (!n.parentNode.disabled || !Z.nodeName(n.parentNode, "optgroup"))) {
                            if (t = Z(n).val(),
                            o)
                                return t;
                            a.push(t)
                        }
                    return a
                },
                set: function(e, t) {
                    for (var n, r, i = e.options, o = Z.makeArray(t), a = i.length; a--; )
                        ((r = i[a]).selected = 0 <= Z.inArray(r.value, o)) && (n = !0);
                    return n || (e.selectedIndex = -1),
                    o
                }
            }
        }
    }),
    Z.each(["radio", "checkbox"], function() {
        Z.valHooks[this] = {
            set: function(e, t) {
                if (Z.isArray(t))
                    return e.checked = 0 <= Z.inArray(Z(e).val(), t)
            }
        },
        G.checkOn || (Z.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    }),
    Z.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, n) {
        Z.fn[n] = function(e, t) {
            return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n)
        }
    }),
    Z.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var pt = Z.now()
      , ht = /\?/;
    Z.parseJSON = function(e) {
        return JSON.parse(e + "")
    }
    ,
    Z.parseXML = function(e) {
        var t;
        if (!e || "string" != typeof e)
            return null;
        try {
            t = (new DOMParser).parseFromString(e, "text/xml")
        } catch (n) {
            t = undefined
        }
        return t && !t.getElementsByTagName("parsererror").length || Z.error("Invalid XML: " + e),
        t
    }
    ;
    var mt, gt, vt = /#.*$/, yt = /([?&])_=[^&]*/, bt = /^(.*?):[ \t]*([^\r\n]*)$/gm, xt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, wt = /^(?:GET|HEAD)$/, kt = /^\/\//, jt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Tt = {}, $t = {}, Ct = "*/".concat("*");
    try {
        gt = location.href
    } catch (zt) {
        (gt = J.createElement("a")).href = "",
        gt = gt.href
    }
    mt = jt.exec(gt.toLowerCase()) || [],
    Z.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: gt,
            type: "GET",
            isLocal: xt.test(mt[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Ct,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": Z.parseJSON,
                "text xml": Z.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? P(P(e, Z.ajaxSettings), t) : P(Z.ajaxSettings, e)
        },
        ajaxPrefilter: M(Tt),
        ajaxTransport: M($t),
        ajax: function(e, t) {
            function n(e, t, n, r) {
                var i, o, a, s, l, u = t;
                2 !== w && (w = 2,
                p && clearTimeout(p),
                c = undefined,
                f = r || "",
                k.readyState = 0 < e ? 4 : 0,
                i = 200 <= e && e < 300 || 304 === e,
                n && (s = F(m, k, n)),
                s = q(m, s, k, i),
                i ? (m.ifModified && ((l = k.getResponseHeader("Last-Modified")) && (Z.lastModified[d] = l),
                (l = k.getResponseHeader("etag")) && (Z.etag[d] = l)),
                204 === e || "HEAD" === m.type ? u = "nocontent" : 304 === e ? u = "notmodified" : (u = s.state,
                o = s.data,
                i = !(a = s.error))) : (a = u,
                !e && u || (u = "error",
                e < 0 && (e = 0))),
                k.status = e,
                k.statusText = (t || u) + "",
                i ? y.resolveWith(g, [o, u, k]) : y.rejectWith(g, [k, u, a]),
                k.statusCode(x),
                x = undefined,
                h && v.trigger(i ? "ajaxSuccess" : "ajaxError", [k, m, i ? o : a]),
                b.fireWith(g, [k, u]),
                h && (v.trigger("ajaxComplete", [k, m]),
                --Z.active || Z.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e,
            e = undefined),
            t = t || {};
            var c, d, f, r, p, i, h, o, m = Z.ajaxSetup({}, t), g = m.context || m, v = m.context && (g.nodeType || g.jquery) ? Z(g) : Z.event, y = Z.Deferred(), b = Z.Callbacks("once memory"), x = m.statusCode || {}, a = {}, s = {}, w = 0, l = "canceled", k = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (2 === w) {
                        if (!r)
                            for (r = {}; t = bt.exec(f); )
                                r[t[1].toLowerCase()] = t[2];
                        t = r[e.toLowerCase()]
                    }
                    return null == t ? null : t
                },
                getAllResponseHeaders: function() {
                    return 2 === w ? f : null
                },
                setRequestHeader: function(e, t) {
                    var n = e.toLowerCase();
                    return w || (e = s[n] = s[n] || e,
                    a[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return w || (m.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    var t;
                    if (e)
                        if (w < 2)
                            for (t in e)
                                x[t] = [x[t], e[t]];
                        else
                            k.always(e[k.status]);
                    return this
                },
                abort: function(e) {
                    var t = e || l;
                    return c && c.abort(t),
                    n(0, t),
                    this
                }
            };
            if (y.promise(k).complete = b.add,
            k.success = k.done,
            k.error = k.fail,
            m.url = ((e || m.url || gt) + "").replace(vt, "").replace(kt, mt[1] + "//"),
            m.type = t.method || t.type || m.method || m.type,
            m.dataTypes = Z.trim(m.dataType || "*").toLowerCase().match(pe) || [""],
            null == m.crossDomain && (i = jt.exec(m.url.toLowerCase()),
            m.crossDomain = !(!i || i[1] === mt[1] && i[2] === mt[2] && (i[3] || ("http:" === i[1] ? "80" : "443")) === (mt[3] || ("http:" === mt[1] ? "80" : "443")))),
            m.data && m.processData && "string" != typeof m.data && (m.data = Z.param(m.data, m.traditional)),
            H(Tt, m, t, k),
            2 === w)
                return k;
            for (o in (h = m.global) && 0 == Z.active++ && Z.event.trigger("ajaxStart"),
            m.type = m.type.toUpperCase(),
            m.hasContent = !wt.test(m.type),
            d = m.url,
            m.hasContent || (m.data && (d = m.url += (ht.test(d) ? "&" : "?") + m.data,
            delete m.data),
            !1 === m.cache && (m.url = yt.test(d) ? d.replace(yt, "$1_=" + pt++) : d + (ht.test(d) ? "&" : "?") + "_=" + pt++)),
            m.ifModified && (Z.lastModified[d] && k.setRequestHeader("If-Modified-Since", Z.lastModified[d]),
            Z.etag[d] && k.setRequestHeader("If-None-Match", Z.etag[d])),
            (m.data && m.hasContent && !1 !== m.contentType || t.contentType) && k.setRequestHeader("Content-Type", m.contentType),
            k.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + Ct + "; q=0.01" : "") : m.accepts["*"]),
            m.headers)
                k.setRequestHeader(o, m.headers[o]);
            if (m.beforeSend && (!1 === m.beforeSend.call(g, k, m) || 2 === w))
                return k.abort();
            for (o in l = "abort",
            {
                success: 1,
                error: 1,
                complete: 1
            })
                k[o](m[o]);
            if (c = H($t, m, t, k)) {
                k.readyState = 1,
                h && v.trigger("ajaxSend", [k, m]),
                m.async && 0 < m.timeout && (p = setTimeout(function() {
                    k.abort("timeout")
                }, m.timeout));
                try {
                    w = 1,
                    c.send(a, n)
                } catch (zt) {
                    if (!(w < 2))
                        throw zt;
                    n(-1, zt)
                }
            } else
                n(-1, "No Transport");
            return k
        },
        getJSON: function(e, t, n) {
            return Z.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return Z.get(e, undefined, t, "script")
        }
    }),
    Z.each(["get", "post"], function(e, i) {
        Z[i] = function(e, t, n, r) {
            return Z.isFunction(t) && (r = r || n,
            n = t,
            t = undefined),
            Z.ajax({
                url: e,
                type: i,
                dataType: r,
                data: t,
                success: n
            })
        }
    }),
    Z.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        Z.fn[t] = function(e) {
            return this.on(t, e)
        }
    }),
    Z._evalUrl = function(e) {
        return Z.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }
    ,
    Z.fn.extend({
        wrapAll: function(t) {
            var e;
            return Z.isFunction(t) ? this.each(function(e) {
                Z(this).wrapAll(t.call(this, e))
            }) : (this[0] && (e = Z(t, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && e.insertBefore(this[0]),
            e.map(function() {
                for (var e = this; e.firstElementChild; )
                    e = e.firstElementChild;
                return e
            }).append(this)),
            this)
        },
        wrapInner: function(n) {
            return Z.isFunction(n) ? this.each(function(e) {
                Z(this).wrapInner(n.call(this, e))
            }) : this.each(function() {
                var e = Z(this)
                  , t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n)
            })
        },
        wrap: function(t) {
            var n = Z.isFunction(t);
            return this.each(function(e) {
                Z(this).wrapAll(n ? t.call(this, e) : t)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                Z.nodeName(this, "body") || Z(this).replaceWith(this.childNodes)
            }).end()
        }
    }),
    Z.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0
    }
    ,
    Z.expr.filters.visible = function(e) {
        return !Z.expr.filters.hidden(e)
    }
    ;
    var Et = /%20/g
      , St = /\[\]$/
      , Nt = /\r?\n/g
      , Lt = /^(?:submit|button|image|reset|file)$/i
      , Dt = /^(?:input|select|textarea|keygen)/i;
    Z.param = function(e, t) {
        var n, r = [], i = function(e, t) {
            t = Z.isFunction(t) ? t() : null == t ? "" : t,
            r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
        };
        if (t === undefined && (t = Z.ajaxSettings && Z.ajaxSettings.traditional),
        Z.isArray(e) || e.jquery && !Z.isPlainObject(e))
            Z.each(e, function() {
                i(this.name, this.value)
            });
        else
            for (n in e)
                R(n, e[n], t, i);
        return r.join("&").replace(Et, "+")
    }
    ,
    Z.fn.extend({
        serialize: function() {
            return Z.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = Z.prop(this, "elements");
                return e ? Z.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !Z(this).is(":disabled") && Dt.test(this.nodeName) && !Lt.test(e) && (this.checked || !$e.test(e))
            }).map(function(e, t) {
                var n = Z(this).val();
                return null == n ? null : Z.isArray(n) ? Z.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Nt, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Nt, "\r\n")
                }
            }).get()
        }
    }),
    Z.ajaxSettings.xhr = function() {
        try {
            return new XMLHttpRequest
        } catch (zt) {}
    }
    ;
    var It = 0
      , At = {}
      , Ot = {
        0: 200,
        1223: 204
    }
      , Mt = Z.ajaxSettings.xhr();
    h.ActiveXObject && Z(h).on("unload", function() {
        for (var e in At)
            At[e]()
    }),
    G.cors = !!Mt && "withCredentials"in Mt,
    G.ajax = Mt = !!Mt,
    Z.ajaxTransport(function(o) {
        var a;
        if (G.cors || Mt && !o.crossDomain)
            return {
                send: function(e, t) {
                    var n, r = o.xhr(), i = ++It;
                    if (r.open(o.type, o.url, o.async, o.username, o.password),
                    o.xhrFields)
                        for (n in o.xhrFields)
                            r[n] = o.xhrFields[n];
                    for (n in o.mimeType && r.overrideMimeType && r.overrideMimeType(o.mimeType),
                    o.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"),
                    e)
                        r.setRequestHeader(n, e[n]);
                    a = function(e) {
                        return function() {
                            a && (delete At[i],
                            a = r.onload = r.onerror = null,
                            "abort" === e ? r.abort() : "error" === e ? t(r.status, r.statusText) : t(Ot[r.status] || r.status, r.statusText, "string" == typeof r.responseText ? {
                                text: r.responseText
                            } : undefined, r.getAllResponseHeaders()))
                        }
                    }
                    ,
                    r.onload = a(),
                    r.onerror = a("error"),
                    a = At[i] = a("abort");
                    try {
                        r.send(o.hasContent && o.data || null)
                    } catch (zt) {
                        if (a)
                            throw zt
                    }
                },
                abort: function() {
                    a && a()
                }
            }
    }),
    Z.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return Z.globalEval(e),
                e
            }
        }
    }),
    Z.ajaxPrefilter("script", function(e) {
        e.cache === undefined && (e.cache = !1),
        e.crossDomain && (e.type = "GET")
    }),
    Z.ajaxTransport("script", function(n) {
        var r, i;
        if (n.crossDomain)
            return {
                send: function(e, t) {
                    r = Z("<script>").prop({
                        async: !0,
                        charset: n.scriptCharset,
                        src: n.url
                    }).on("load error", i = function(e) {
                        r.remove(),
                        i = null,
                        e && t("error" === e.type ? 404 : 200, e.type)
                    }
                    ),
                    J.head.appendChild(r[0])
                },
                abort: function() {
                    i && i()
                }
            }
    });
    var Ht = []
      , Pt = /(=)\?(?=&|$)|\?\?/;
    Z.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Ht.pop() || Z.expando + "_" + pt++;
            return this[e] = !0,
            e
        }
    }),
    Z.ajaxPrefilter("json jsonp", function(e, t, n) {
        var r, i, o, a = !1 !== e.jsonp && (Pt.test(e.url) ? "url" : "string" == typeof e.data && !(e.contentType || "").indexOf("application/x-www-form-urlencoded") && Pt.test(e.data) && "data");
        if (a || "jsonp" === e.dataTypes[0])
            return r = e.jsonpCallback = Z.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback,
            a ? e[a] = e[a].replace(Pt, "$1" + r) : !1 !== e.jsonp && (e.url += (ht.test(e.url) ? "&" : "?") + e.jsonp + "=" + r),
            e.converters["script json"] = function() {
                return o || Z.error(r + " was not called"),
                o[0]
            }
            ,
            e.dataTypes[0] = "json",
            i = h[r],
            h[r] = function() {
                o = arguments
            }
            ,
            n.always(function() {
                h[r] = i,
                e[r] && (e.jsonpCallback = t.jsonpCallback,
                Ht.push(r)),
                o && Z.isFunction(i) && i(o[0]),
                o = i = undefined
            }),
            "script"
    }),
    Z.parseHTML = function(e, t, n) {
        if (!e || "string" != typeof e)
            return null;
        "boolean" == typeof t && (n = t,
        t = !1),
        t = t || J;
        var r = ae.exec(e)
          , i = !n && [];
        return r ? [t.createElement(r[1])] : (r = Z.buildFragment([e], t, i),
        i && i.length && Z(i).remove(),
        Z.merge([], r.childNodes))
    }
    ;
    var Ft = Z.fn.load;
    Z.fn.load = function(e, t, n) {
        if ("string" != typeof e && Ft)
            return Ft.apply(this, arguments);
        var r, i, o, a = this, s = e.indexOf(" ");
        return 0 <= s && (r = Z.trim(e.slice(s)),
        e = e.slice(0, s)),
        Z.isFunction(t) ? (n = t,
        t = undefined) : t && "object" == typeof t && (i = "POST"),
        0 < a.length && Z.ajax({
            url: e,
            type: i,
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments,
            a.html(r ? Z("<div>").append(Z.parseHTML(e)).find(r) : e)
        }).complete(n && function(e, t) {
            a.each(n, o || [e.responseText, t, e])
        }
        ),
        this
    }
    ,
    Z.expr.filters.animated = function(t) {
        return Z.grep(Z.timers, function(e) {
            return t === e.elem
        }).length
    }
    ;
    var qt = h.document.documentElement;
    Z.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, a, s, l, u = Z.css(e, "position"), c = Z(e), d = {};
            "static" === u && (e.style.position = "relative"),
            s = c.offset(),
            o = Z.css(e, "top"),
            l = Z.css(e, "left"),
            ("absolute" === u || "fixed" === u) && -1 < (o + l).indexOf("auto") ? (a = (r = c.position()).top,
            i = r.left) : (a = parseFloat(o) || 0,
            i = parseFloat(l) || 0),
            Z.isFunction(t) && (t = t.call(e, n, s)),
            null != t.top && (d.top = t.top - s.top + a),
            null != t.left && (d.left = t.left - s.left + i),
            "using"in t ? t.using.call(e, d) : c.css(d)
        }
    },
    Z.fn.extend({
        offset: function(t) {
            if (arguments.length)
                return t === undefined ? this : this.each(function(e) {
                    Z.offset.setOffset(this, t, e)
                });
            var e, n, r = this[0], i = {
                top: 0,
                left: 0
            }, o = r && r.ownerDocument;
            return o ? (e = o.documentElement,
            Z.contains(e, r) ? (typeof r.getBoundingClientRect !== Ce && (i = r.getBoundingClientRect()),
            n = _(o),
            {
                top: i.top + n.pageYOffset - e.clientTop,
                left: i.left + n.pageXOffset - e.clientLeft
            }) : i) : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n = this[0], r = {
                    top: 0,
                    left: 0
                };
                return "fixed" === Z.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(),
                t = this.offset(),
                Z.nodeName(e[0], "html") || (r = e.offset()),
                r.top += Z.css(e[0], "borderTopWidth", !0),
                r.left += Z.css(e[0], "borderLeftWidth", !0)),
                {
                    top: t.top - r.top - Z.css(n, "marginTop", !0),
                    left: t.left - r.left - Z.css(n, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent || qt; e && !Z.nodeName(e, "html") && "static" === Z.css(e, "position"); )
                    e = e.offsetParent;
                return e || qt
            })
        }
    }),
    Z.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, i) {
        var o = "pageYOffset" === i;
        Z.fn[t] = function(e) {
            return me(this, function(e, t, n) {
                var r = _(e);
                if (n === undefined)
                    return r ? r[i] : e[t];
                r ? r.scrollTo(o ? h.pageXOffset : n, o ? n : h.pageYOffset) : e[t] = n
            }, t, e, arguments.length, null)
        }
    }),
    Z.each(["top", "left"], function(e, n) {
        Z.cssHooks[n] = k(G.pixelPosition, function(e, t) {
            if (t)
                return t = w(e, n),
                We.test(t) ? Z(e).position()[n] + "px" : t
        })
    }),
    Z.each({
        Height: "height",
        Width: "width"
    }, function(o, a) {
        Z.each({
            padding: "inner" + o,
            content: a,
            "": "outer" + o
        }, function(r, e) {
            Z.fn[e] = function(e, t) {
                var n = arguments.length && (r || "boolean" != typeof e)
                  , i = r || (!0 === e || !0 === t ? "margin" : "border");
                return me(this, function(e, t, n) {
                    var r;
                    return Z.isWindow(e) ? e.document.documentElement["client" + o] : 9 === e.nodeType ? (r = e.documentElement,
                    Math.max(e.body["scroll" + o], r["scroll" + o], e.body["offset" + o], r["offset" + o], r["client" + o])) : n === undefined ? Z.css(e, t, i) : Z.style(e, t, n, i)
                }, a, n ? e : undefined, n, null)
            }
        })
    }),
    Z.fn.size = function() {
        return this.length
    }
    ,
    Z.fn.andSelf = Z.fn.addBack,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return Z
    });
    var Rt = h.jQuery
      , _t = h.$;
    return Z.noConflict = function(e) {
        return h.$ === Z && (h.$ = _t),
        e && h.jQuery === Z && (h.jQuery = Rt),
        Z
    }
    ,
    typeof e === Ce && (h.jQuery = h.$ = Z),
    Z
}),
function() {
    var e, t, p, o, u, c, n, h, r, i, a, m, s, l, d, f, g, v, y, b, x, w, k, j, T, C, E;
    T = document.createElement("div"),
    C = document.createElement("div"),
    E = document.createElement("div"),
    T.appendChild(C),
    C.appendChild(E),
    T.innerHTML = "",
    s = E.parentNode !== C,
    j = 0,
    h = [],
    (w = new SelectorSet).querySelectorAll = $.find,
    w.matchesSelector = $.find.matchesSelector,
    a = new WeakMap,
    p = new WeakMap,
    m = new WeakMap,
    y = function(e, t) {
        var n, r;
        (n = a.get(e)) || (n = [],
        a.set(e, n)),
        -1 === n.indexOf(t.id) && (null != t.initialize && (r = t.initialize.call(e, e)),
        m.set(e, r),
        n.push(t.id))
    }
    ,
    v = function(e, t) {
        var n, r, i, o;
        (n = p.get(e)) || (n = [],
        p.set(e, n)),
        -1 === n.indexOf(t.id) && (t.elements.push(e),
        (r = m.get(e)) && ("length"in r || null != (i = r.add) && i.call(e, e)),
        null != (o = t.add) && o.call(e, e),
        n.push(t.id))
    }
    ,
    b = function(e, t) {
        var n, r, i, o, a, s, l, u, c, d, f;
        if (n = p.get(e))
            if (t)
                -1 !== (o = t.elements.indexOf(e)) && t.elements.splice(o, 1),
                -1 !== (o = n.indexOf(t.id)) && ((a = m.get(e)) && ("length"in a || null != (l = a.remove) && l.call(e, e)),
                null != (u = t.remove) && u.call(e, e),
                n.splice(o, 1)),
                0 === n.length && p["delete"](e);
            else {
                for (r = 0,
                s = (c = n.slice(0)).length; r < s; r++)
                    i = c[r],
                    (t = h[i]) && (-1 !== (o = t.elements.indexOf(e)) && t.elements.splice(o, 1),
                    (a = m.get(e)) && null != (d = a.remove) && d.call(e, e),
                    null != (f = t.remove) && f.call(e, e));
                p["delete"](e)
            }
    }
    ,
    o = function(e, t) {
        var n, r, i, o, a, s, l, u, c, d, f, p, h, m, g;
        for (a = 0,
        c = t.length; a < c; a++)
            if ((i = t[a]).nodeType === Node.ELEMENT_NODE) {
                for (s = 0,
                d = (h = w.matches(i)).length; s < d; s++)
                    n = h[s].data,
                    e.push(["add", i, n]);
                for (l = 0,
                f = (m = w.queryAll(i)).length; l < f; l++)
                    for (n = (g = m[l]).data,
                    u = 0,
                    p = (o = g.elements).length; u < p; u++)
                        r = o[u],
                        e.push(["add", r, n])
            }
    }
    ,
    l = function(e, t) {
        var n, r, i, o, a, s, l;
        for (i = 0,
        a = t.length; i < a; i++)
            if ((r = t[i]).nodeType === Node.ELEMENT_NODE)
                for (e.push(["remove", r]),
                o = 0,
                s = (l = r.getElementsByTagName("*")).length; o < s; o++)
                    n = l[o],
                    e.push(["remove", n])
    }
    ,
    g = function(e) {
        var t, n, r, i, o, a, s;
        for (n = 0,
        i = h.length; n < i; n++)
            if (a = h[n])
                for (r = 0,
                o = (s = a.elements).length; r < o; r++)
                    (t = s[r]).parentNode || e.push(["remove", t])
    }
    ,
    f = function(e, t) {
        var n, r, i, o, a, s, l, u, c;
        if (t.nodeType === Node.ELEMENT_NODE) {
            for (r = 0,
            s = (c = w.matches(t)).length; r < s; r++)
                n = c[r].data,
                e.push(["add", t, n]);
            if (o = p.get(t))
                for (a = 0,
                l = o.length; a < l; a++)
                    i = o[a],
                    (u = h[i]) && (w.matchesSelector(t, u.selector) || e.push(["remove", t, u]))
        }
    }
    ,
    d = function(e, t) {
        var n, r, i, o;
        if (t.nodeType === Node.ELEMENT_NODE)
            for (f(e, t),
            r = 0,
            i = (o = t.getElementsByTagName("*")).length; r < i; r++)
                n = o[r],
                f(e, n)
    }
    ,
    u = function(e) {
        var t, n, r, i, o, a;
        for (n = 0,
        r = e.length; n < r; n++)
            a = (o = e[n])[0],
            t = o[1],
            i = o[2],
            "add" === a ? (y(t, i),
            v(t, i)) : "remove" === a && b(t, i)
    }
    ,
    k = function(e) {
        var t, n, r, i;
        for (n = 0,
        r = (i = e.elements).length; n < r; n++)
            t = i[n],
            b(t, e);
        w.remove(e.selector, e),
        delete h[e.id],
        $.observe.count--
    }
    ,
    $.observe = function(e, t) {
        var n;
        return null != t.call && (t = {
            initialize: t
        }),
        n = {
            id: j++,
            selector: e,
            initialize: t.initialize || t.init,
            add: t.add,
            remove: t.remove,
            elements: [],
            stop: function() {
                return k(n)
            }
        },
        w.add(e, n),
        h[n.id] = n,
        x(),
        $.observe.count++,
        n
    }
    ,
    t = !1,
    x = function() {
        if (!t)
            return setImmediate(e),
            t = !0
    }
    ,
    e = function() {
        var e;
        return o(e = [], [document.documentElement]),
        u(e),
        t = !1
    }
    ,
    $.observe.count = 0,
    $(document).on("observe:dirty", function(e) {
        var t;
        d(t = [], e.target),
        u(t)
    }),
    c = [],
    r = function() {
        var e, t, n, r, i, o, a, s, l;
        for (e = [],
        l = c,
        c = [],
        r = 0,
        o = l.length; r < o; r++)
            for (i = 0,
            a = (n = (s = l[r]).form ? s.form.elements : s.ownerDocument.getElementsByTagName("input")).length; i < a; i++)
                t = n[i],
                f(e, t);
        u(e)
    }
    ,
    i = function(e) {
        c.push(e.target),
        setImmediate(r)
    }
    ,
    document.addEventListener("change", i, !1),
    $(document).on("change", i),
    n = new MutationObserver(function(e) {
        var t, n, r, i;
        for (t = [],
        n = 0,
        r = e.length; n < r; n++)
            "childList" === (i = e[n]).type ? (o(t, i.addedNodes),
            l(t, i.removedNodes)) : "attributes" === i.type && f(t, i.target);
        s && g(t),
        u(t)
    }
    ),
    $(function() {
        var e;
        return n.observe(document, {
            childList: !0,
            attributes: !0,
            subtree: !0
        }),
        o(e = [], [document.documentElement]),
        u(e)
    }, !1)
}
.call(this),
function(c, l) {
    "use strict";
    var u;
    c.rails !== l && c.error("jquery-ujs has already been loaded!");
    var e = c(document);
    c.rails = u = {
        linkClickSelector: "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]",
        buttonClickSelector: "button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)",
        inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
        formSubmitSelector: "form",
        formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
        disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
        enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
        requiredInputSelector: "input[name][required]:not([disabled]), textarea[name][required]:not([disabled])",
        fileInputSelector: "input[name][type=file]:not([disabled])",
        linkDisableSelector: "a[data-disable-with], a[data-disable]",
        buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
        csrfToken: function() {
            return c("meta[name=csrf-token]").attr("content")
        },
        csrfParam: function() {
            return c("meta[name=csrf-param]").attr("content")
        },
        CSRFProtection: function(e) {
            var t = u.csrfToken();
            t && e.setRequestHeader("X-CSRF-Token", t)
        },
        refreshCSRFTokens: function() {
            c('form input[name="' + u.csrfParam() + '"]').val(u.csrfToken())
        },
        fire: function(e, t, n) {
            var r = c.Event(t);
            return e.trigger(r, n),
            !1 !== r.result
        },
        confirm: function(e) {
            return confirm(e)
        },
        ajax: function(e) {
            return c.ajax(e)
        },
        href: function(e) {
            return e[0].href
        },
        isRemote: function(e) {
            return e.data("remote") !== l && !1 !== e.data("remote")
        },
        handleRemote: function(r) {
            var e, t, n, i, o, a;
            if (u.fire(r, "ajax:before")) {
                if (i = r.data("with-credentials") || null,
                o = r.data("type") || c.ajaxSettings && c.ajaxSettings.dataType,
                r.is("form")) {
                    e = r.data("ujs:submit-button-formmethod") || r.attr("method"),
                    t = r.data("ujs:submit-button-formaction") || r.attr("action"),
                    n = c(r[0]).serializeArray();
                    var s = r.data("ujs:submit-button");
                    s && (n.push(s),
                    r.data("ujs:submit-button", null)),
                    r.data("ujs:submit-button-formmethod", null),
                    r.data("ujs:submit-button-formaction", null)
                } else
                    r.is(u.inputChangeSelector) ? (e = r.data("method"),
                    t = r.data("url"),
                    n = r.serialize(),
                    r.data("params") && (n = n + "&" + r.data("params"))) : r.is(u.buttonClickSelector) ? (e = r.data("method") || "get",
                    t = r.data("url"),
                    n = r.serialize(),
                    r.data("params") && (n = n + "&" + r.data("params"))) : (e = r.data("method"),
                    t = u.href(r),
                    n = r.data("params") || null);
                return a = {
                    type: e || "GET",
                    data: n,
                    dataType: o,
                    beforeSend: function(e, t) {
                        if (t.dataType === l && e.setRequestHeader("accept", "*/*;q=0.5, " + t.accepts.script),
                        !u.fire(r, "ajax:beforeSend", [e, t]))
                            return !1;
                        r.trigger("ajax:send", e)
                    },
                    success: function(e, t, n) {
                        r.trigger("ajax:success", [e, t, n])
                    },
                    complete: function(e, t) {
                        r.trigger("ajax:complete", [e, t])
                    },
                    error: function(e, t, n) {
                        r.trigger("ajax:error", [e, t, n])
                    },
                    crossDomain: u.isCrossDomain(t)
                },
                i && (a.xhrFields = {
                    withCredentials: i
                }),
                t && (a.url = t),
                u.ajax(a)
            }
            return !1
        },
        isCrossDomain: function(e) {
            var t = document.createElement("a");
            t.href = location.href;
            var n = document.createElement("a");
            try {
                return n.href = e,
                n.href = n.href,
                !((!n.protocol || ":" === n.protocol) && !n.host || t.protocol + "//" + t.host == n.protocol + "//" + n.host)
            } catch (r) {
                return !0
            }
        },
        handleMethod: function(e) {
            var t = u.href(e)
              , n = e.data("method")
              , r = e.attr("target")
              , i = u.csrfToken()
              , o = u.csrfParam()
              , a = c('<form method="post" action="' + t + '"></form>')
              , s = '<input name="_method" value="' + n + '" type="hidden" />';
            o === l || i === l || u.isCrossDomain(t) || (s += '<input name="' + o + '" value="' + i + '" type="hidden" />'),
            r && a.attr("target", r),
            a.hide().append(s).appendTo("body"),
            a.submit()
        },
        formElements: function(e, t) {
            return e.is("form") ? c(e[0].elements).filter(t) : e.find(t)
        },
        disableFormElements: function(e) {
            u.formElements(e, u.disableSelector).each(function() {
                u.disableFormElement(c(this))
            })
        },
        disableFormElement: function(e) {
            var t, n;
            t = e.is("button") ? "html" : "val",
            (n = e.data("disable-with")) !== l && (e.data("ujs:enable-with", e[t]()),
            e[t](n)),
            e.prop("disabled", !0),
            e.data("ujs:disabled", !0)
        },
        enableFormElements: function(e) {
            u.formElements(e, u.enableSelector).each(function() {
                u.enableFormElement(c(this))
            })
        },
        enableFormElement: function(e) {
            var t = e.is("button") ? "html" : "val";
            e.data("ujs:enable-with") !== l && (e[t](e.data("ujs:enable-with")),
            e.removeData("ujs:enable-with")),
            e.prop("disabled", !1),
            e.removeData("ujs:disabled")
        },
        allowAction: function(e) {
            var t, n = e.data("confirm"), r = !1;
            if (!n)
                return !0;
            if (u.fire(e, "confirm")) {
                try {
                    r = u.confirm(n)
                } catch (i) {
                    (console.error || console.log).call(console, i.stack || i)
                }
                t = u.fire(e, "confirm:complete", [r])
            }
            return r && t
        },
        blankInputs: function(e, t, n) {
            var r, i, o, a = c(), s = t || "input,textarea", l = e.find(s), u = {};
            return l.each(function() {
                (r = c(this)).is("input[type=radio]") ? (o = r.attr("name"),
                u[o] || (0 === e.find('input[type=radio]:checked[name="' + o + '"]').length && (i = e.find('input[type=radio][name="' + o + '"]'),
                a = a.add(i)),
                u[o] = o)) : (r.is("input[type=checkbox],input[type=radio]") ? r.is(":checked") : !!r.val()) === n && (a = a.add(r))
            }),
            !!a.length && a
        },
        nonBlankInputs: function(e, t) {
            return u.blankInputs(e, t, !0)
        },
        stopEverything: function(e) {
            return c(e.target).trigger("ujs:everythingStopped"),
            e.stopImmediatePropagation(),
            !1
        },
        disableElement: function(e) {
            var t = e.data("disable-with");
            t !== l && (e.data("ujs:enable-with", e.html()),
            e.html(t)),
            e.bind("click.railsDisable", function(e) {
                return u.stopEverything(e)
            }),
            e.data("ujs:disabled", !0)
        },
        enableElement: function(e) {
            e.data("ujs:enable-with") !== l && (e.html(e.data("ujs:enable-with")),
            e.removeData("ujs:enable-with")),
            e.unbind("click.railsDisable"),
            e.removeData("ujs:disabled")
        }
    },
    u.fire(e, "rails:attachBindings") && (c.ajaxPrefilter(function(e, t, n) {
        e.crossDomain || u.CSRFProtection(n)
    }),
    c(window).on("pageshow.rails", function() {
        c(c.rails.enableSelector).each(function() {
            var e = c(this);
            e.data("ujs:disabled") && c.rails.enableFormElement(e)
        }),
        c(c.rails.linkDisableSelector).each(function() {
            var e = c(this);
            e.data("ujs:disabled") && c.rails.enableElement(e)
        })
    }),
    e.on("ajax:complete", u.linkDisableSelector, function() {
        u.enableElement(c(this))
    }),
    e.on("ajax:complete", u.buttonDisableSelector, function() {
        u.enableFormElement(c(this))
    }),
    e.on("click.rails", u.linkClickSelector, function(e) {
        var t = c(this)
          , n = t.data("method")
          , r = t.data("params")
          , i = e.metaKey || e.ctrlKey;
        if (!u.allowAction(t))
            return u.stopEverything(e);
        if (!i && t.is(u.linkDisableSelector) && u.disableElement(t),
        u.isRemote(t)) {
            if (i && (!n || "GET" === n) && !r)
                return !0;
            var o = u.handleRemote(t);
            return !1 === o ? u.enableElement(t) : o.fail(function() {
                u.enableElement(t)
            }),
            !1
        }
        return n ? (u.handleMethod(t),
        !1) : void 0
    }),
    e.on("click.rails", u.buttonClickSelector, function(e) {
        var t = c(this);
        if (!u.allowAction(t) || !u.isRemote(t))
            return u.stopEverything(e);
        t.is(u.buttonDisableSelector) && u.disableFormElement(t);
        var n = u.handleRemote(t);
        return !1 === n ? u.enableFormElement(t) : n.fail(function() {
            u.enableFormElement(t)
        }),
        !1
    }),
    e.on("change.rails", u.inputChangeSelector, function(e) {
        var t = c(this);
        return u.allowAction(t) && u.isRemote(t) ? (u.handleRemote(t),
        !1) : u.stopEverything(e)
    }),
    e.on("submit.rails", u.formSubmitSelector, function(e) {
        var t, n, r = c(this), i = u.isRemote(r);
        if (!u.allowAction(r))
            return u.stopEverything(e);
        if (r.attr("novalidate") === l)
            if (r.data("ujs:formnovalidate-button") === l) {
                if ((t = u.blankInputs(r, u.requiredInputSelector, !1)) && u.fire(r, "ajax:aborted:required", [t]))
                    return u.stopEverything(e)
            } else
                r.data("ujs:formnovalidate-button", l);
        if (i) {
            if (n = u.nonBlankInputs(r, u.fileInputSelector)) {
                setTimeout(function() {
                    u.disableFormElements(r)
                }, 13);
                var o = u.fire(r, "ajax:aborted:file", [n]);
                return o || setTimeout(function() {
                    u.enableFormElements(r)
                }, 13),
                o
            }
            return u.handleRemote(r),
            !1
        }
        setTimeout(function() {
            u.disableFormElements(r)
        }, 13)
    }),
    e.on("click.rails", u.formInputClickSelector, function(e) {
        var t = c(this);
        if (!u.allowAction(t))
            return u.stopEverything(e);
        var n = t.attr("name")
          , r = n ? {
            name: n,
            value: t.val()
        } : null
          , i = t.closest("form");
        0 === i.length && (i = c("#" + t.attr("form"))),
        i.data("ujs:submit-button", r),
        i.data("ujs:formnovalidate-button", t.attr("formnovalidate")),
        i.data("ujs:submit-button-formaction", t.attr("formaction")),
        i.data("ujs:submit-button-formmethod", t.attr("formmethod"))
    }),
    e.on("ajax:send.rails", u.formSubmitSelector, function(e) {
        this === e.target && u.disableFormElements(c(this))
    }),
    e.on("ajax:complete.rails", u.formSubmitSelector, function(e) {
        this === e.target && u.enableFormElements(c(this))
    }),
    c(function() {
        u.refreshCSRFTokens()
    }))
}(jQuery),
function(e) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = e();
    else if ("function" == typeof define && define.amd)
        define([], e);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).Clipboard = e()
    }
}(function() {
    var a;
    return function c(o, a, s) {
        function l(n, e) {
            if (!a[n]) {
                if (!o[n]) {
                    var t = "function" == typeof require && require;
                    if (!e && t)
                        return t(n, !0);
                    if (u)
                        return u(n, !0);
                    var r = new Error("Cannot find module '" + n + "'");
                    throw r.code = "MODULE_NOT_FOUND",
                    r
                }
                var i = a[n] = {
                    exports: {}
                };
                o[n][0].call(i.exports, function(e) {
                    var t = o[n][1][e];
                    return l(t || e)
                }, i, i.exports, c, o, a, s)
            }
            return a[n].exports
        }
        for (var u = "function" == typeof require && require, e = 0; e < s.length; e++)
            l(s[e]);
        return l
    }({
        1: [function(e, t) {
            function n(e, t) {
                for (; e && e.nodeType !== r; ) {
                    if (e.matches(t))
                        return e;
                    e = e.parentNode
                }
            }
            var r = 9;
            if ("undefined" != typeof Element && !Element.prototype.matches) {
                var i = Element.prototype;
                i.matches = i.matchesSelector || i.mozMatchesSelector || i.msMatchesSelector || i.oMatchesSelector || i.webkitMatchesSelector
            }
            t.exports = n
        }
        , {}],
        2: [function(e, t) {
            function n(e, t, n, r, i) {
                var o = a.apply(this, arguments);
                return e.addEventListener(n, o, i),
                {
                    destroy: function() {
                        e.removeEventListener(n, o, i)
                    }
                }
            }
            function a(t, n, e, r) {
                return function(e) {
                    e.delegateTarget = i(e.target, n),
                    e.delegateTarget && r.call(t, e)
                }
            }
            var i = e("./closest");
            t.exports = n
        }
        , {
            "./closest": 1
        }],
        3: [function(e, t, n) {
            n.node = function(e) {
                return e !== undefined && e instanceof HTMLElement && 1 === e.nodeType
            }
            ,
            n.nodeList = function(e) {
                var t = Object.prototype.toString.call(e);
                return e !== undefined && ("[object NodeList]" === t || "[object HTMLCollection]" === t) && "length"in e && (0 === e.length || n.node(e[0]))
            }
            ,
            n.string = function(e) {
                return "string" == typeof e || e instanceof String
            }
            ,
            n.fn = function(e) {
                return "[object Function]" === Object.prototype.toString.call(e)
            }
        }
        , {}],
        4: [function(e, t) {
            function n(e, t, n) {
                if (!e && !t && !n)
                    throw new Error("Missing required arguments");
                if (!a.string(t))
                    throw new TypeError("Second argument must be a String");
                if (!a.fn(n))
                    throw new TypeError("Third argument must be a Function");
                if (a.node(e))
                    return r(e, t, n);
                if (a.nodeList(e))
                    return i(e, t, n);
                if (a.string(e))
                    return o(e, t, n);
                throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")
            }
            function r(e, t, n) {
                return e.addEventListener(t, n),
                {
                    destroy: function() {
                        e.removeEventListener(t, n)
                    }
                }
            }
            function i(e, t, n) {
                return Array.prototype.forEach.call(e, function(e) {
                    e.addEventListener(t, n)
                }),
                {
                    destroy: function() {
                        Array.prototype.forEach.call(e, function(e) {
                            e.removeEventListener(t, n)
                        })
                    }
                }
            }
            function o(e, t, n) {
                return s(document.body, e, t, n)
            }
            var a = e("./is")
              , s = e("delegate");
            t.exports = n
        }
        , {
            "./is": 3,
            delegate: 2
        }],
        5: [function(e, t) {
            function n(e) {
                var t;
                if ("SELECT" === e.nodeName)
                    e.focus(),
                    t = e.value;
                else if ("INPUT" === e.nodeName || "TEXTAREA" === e.nodeName) {
                    var n = e.hasAttribute("readonly");
                    n || e.setAttribute("readonly", ""),
                    e.select(),
                    e.setSelectionRange(0, e.value.length),
                    n || e.removeAttribute("readonly"),
                    t = e.value
                } else {
                    e.hasAttribute("contenteditable") && e.focus();
                    var r = window.getSelection()
                      , i = document.createRange();
                    i.selectNodeContents(e),
                    r.removeAllRanges(),
                    r.addRange(i),
                    t = r.toString()
                }
                return t
            }
            t.exports = n
        }
        , {}],
        6: [function(e, t) {
            function n() {}
            n.prototype = {
                on: function(e, t, n) {
                    var r = this.e || (this.e = {});
                    return (r[e] || (r[e] = [])).push({
                        fn: t,
                        ctx: n
                    }),
                    this
                },
                once: function(e, t, n) {
                    function r() {
                        i.off(e, r),
                        t.apply(n, arguments)
                    }
                    var i = this;
                    return r._ = t,
                    this.on(e, r, n)
                },
                emit: function(e) {
                    for (var t = [].slice.call(arguments, 1), n = ((this.e || (this.e = {}))[e] || []).slice(), r = 0, i = n.length; r < i; r++)
                        n[r].fn.apply(n[r].ctx, t);
                    return this
                },
                off: function(e, t) {
                    var n = this.e || (this.e = {})
                      , r = n[e]
                      , i = [];
                    if (r && t)
                        for (var o = 0, a = r.length; o < a; o++)
                            r[o].fn !== t && r[o].fn._ !== t && i.push(r[o]);
                    return i.length ? n[e] = i : delete n[e],
                    this
                }
            },
            t.exports = n
        }
        , {}],
        7: [function(r, i, o) {
            !function(e, t) {
                if ("function" == typeof a && a.amd)
                    a(["module", "select"], t);
                else if (void 0 !== o)
                    t(i, r("select"));
                else {
                    var n = {
                        exports: {}
                    };
                    t(n, e.select),
                    e.clipboardAction = n.exports
                }
            }(this, function(e, t) {
                "use strict";
                function n(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                }
                function f(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }
                var p = n(t)
                  , h = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                }
                : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }
                  , m = function() {
                    function r(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1,
                            r.configurable = !0,
                            "value"in r && (r.writable = !0),
                            Object.defineProperty(e, r.key, r)
                        }
                    }
                    return function(e, t, n) {
                        return t && r(e.prototype, t),
                        n && r(e, n),
                        e
                    }
                }()
                  , r = function() {
                    function t(e) {
                        f(this, t),
                        this.resolveOptions(e),
                        this.initSelection()
                    }
                    return m(t, [{
                        key: "resolveOptions",
                        value: function n(e) {
                            var t = 0 < arguments.length && e !== undefined ? arguments[0] : {};
                            this.action = t.action,
                            this.emitter = t.emitter,
                            this.target = t.target,
                            this.text = t.text,
                            this.trigger = t.trigger,
                            this.selectedText = ""
                        }
                    }, {
                        key: "initSelection",
                        value: function e() {
                            this.text ? this.selectFake() : this.target && this.selectTarget()
                        }
                    }, {
                        key: "selectFake",
                        value: function r() {
                            var e = this
                              , t = "rtl" == document.documentElement.getAttribute("dir");
                            this.removeFake(),
                            this.fakeHandlerCallback = function() {
                                return e.removeFake()
                            }
                            ,
                            this.fakeHandler = document.body.addEventListener("click", this.fakeHandlerCallback) || !0,
                            this.fakeElem = document.createElement("textarea"),
                            this.fakeElem.style.fontSize = "12pt",
                            this.fakeElem.style.border = "0",
                            this.fakeElem.style.padding = "0",
                            this.fakeElem.style.margin = "0",
                            this.fakeElem.style.position = "absolute",
                            this.fakeElem.style[t ? "right" : "left"] = "-9999px";
                            var n = window.pageYOffset || document.documentElement.scrollTop;
                            this.fakeElem.style.top = n + "px",
                            this.fakeElem.setAttribute("readonly", ""),
                            this.fakeElem.value = this.text,
                            document.body.appendChild(this.fakeElem),
                            this.selectedText = (0,
                            p["default"])(this.fakeElem),
                            this.copyText()
                        }
                    }, {
                        key: "removeFake",
                        value: function i() {
                            this.fakeHandler && (document.body.removeEventListener("click", this.fakeHandlerCallback),
                            this.fakeHandler = null,
                            this.fakeHandlerCallback = null),
                            this.fakeElem && (document.body.removeChild(this.fakeElem),
                            this.fakeElem = null)
                        }
                    }, {
                        key: "selectTarget",
                        value: function o() {
                            this.selectedText = (0,
                            p["default"])(this.target),
                            this.copyText()
                        }
                    }, {
                        key: "copyText",
                        value: function a() {
                            var e = void 0;
                            try {
                                e = document.execCommand(this.action)
                            } catch (t) {
                                e = !1
                            }
                            this.handleResult(e)
                        }
                    }, {
                        key: "handleResult",
                        value: function s(e) {
                            this.emitter.emit(e ? "success" : "error", {
                                action: this.action,
                                text: this.selectedText,
                                trigger: this.trigger,
                                clearSelection: this.clearSelection.bind(this)
                            })
                        }
                    }, {
                        key: "clearSelection",
                        value: function l() {
                            this.target && this.target.blur(),
                            window.getSelection().removeAllRanges()
                        }
                    }, {
                        key: "destroy",
                        value: function u() {
                            this.removeFake()
                        }
                    }, {
                        key: "action",
                        set: function c(e) {
                            var t = 0 < arguments.length && e !== undefined ? arguments[0] : "copy";
                            if (this._action = t,
                            "copy" !== this._action && "cut" !== this._action)
                                throw new Error('Invalid "action" value, use either "copy" or "cut"')
                        },
                        get: function d() {
                            return this._action
                        }
                    }, {
                        key: "target",
                        set: function c(e) {
                            if (e !== undefined) {
                                if (!e || "object" !== (void 0 === e ? "undefined" : h(e)) || 1 !== e.nodeType)
                                    throw new Error('Invalid "target" value, use a valid Element');
                                if ("copy" === this.action && e.hasAttribute("disabled"))
                                    throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                                if ("cut" === this.action && (e.hasAttribute("readonly") || e.hasAttribute("disabled")))
                                    throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                                this._target = e
                            }
                        },
                        get: function d() {
                            return this._target
                        }
                    }]),
                    t
                }();
                e.exports = r
            })
        }
        , {
            select: 5
        }],
        8: [function(r, i, o) {
            !function(e, t) {
                if ("function" == typeof a && a.amd)
                    a(["module", "./clipboard-action", "tiny-emitter", "good-listener"], t);
                else if (void 0 !== o)
                    t(i, r("./clipboard-action"), r("tiny-emitter"), r("good-listener"));
                else {
                    var n = {
                        exports: {}
                    };
                    t(n, e.clipboardAction, e.tinyEmitter, e.goodListener),
                    e.clipboard = n.exports
                }
            }(this, function(e, t, n, r) {
                "use strict";
                function i(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                }
                function u(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }
                function c(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }
                function d(e, t) {
                    if ("function" != typeof t && null !== t)
                        throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                    t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                }
                function f(e, t) {
                    var n = "data-clipboard-" + e;
                    if (t.hasAttribute(n))
                        return t.getAttribute(n)
                }
                var p = i(t)
                  , h = i(n)
                  , m = i(r)
                  , g = function() {
                    function r(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1,
                            r.configurable = !0,
                            "value"in r && (r.writable = !0),
                            Object.defineProperty(e, r.key, r)
                        }
                    }
                    return function(e, t, n) {
                        return t && r(e.prototype, t),
                        n && r(e, n),
                        e
                    }
                }()
                  , o = function() {
                    function r(e, t) {
                        u(this, r);
                        var n = c(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this));
                        return n.resolveOptions(t),
                        n.listenClick(e),
                        n
                    }
                    return d(r, h["default"]),
                    g(r, [{
                        key: "resolveOptions",
                        value: function n(e) {
                            var t = 0 < arguments.length && e !== undefined ? arguments[0] : {};
                            this.action = "function" == typeof t.action ? t.action : this.defaultAction,
                            this.target = "function" == typeof t.target ? t.target : this.defaultTarget,
                            this.text = "function" == typeof t.text ? t.text : this.defaultText
                        }
                    }, {
                        key: "listenClick",
                        value: function i(e) {
                            var t = this;
                            this.listener = (0,
                            m["default"])(e, "click", function(e) {
                                return t.onClick(e)
                            })
                        }
                    }, {
                        key: "onClick",
                        value: function o(e) {
                            var t = e.delegateTarget || e.currentTarget;
                            this.clipboardAction && (this.clipboardAction = null),
                            this.clipboardAction = new p["default"]({
                                action: this.action(t),
                                target: this.target(t),
                                text: this.text(t),
                                trigger: t,
                                emitter: this
                            })
                        }
                    }, {
                        key: "defaultAction",
                        value: function t(e) {
                            return f("action", e)
                        }
                    }, {
                        key: "defaultTarget",
                        value: function a(e) {
                            var t = f("target", e);
                            if (t)
                                return document.querySelector(t)
                        }
                    }, {
                        key: "defaultText",
                        value: function s(e) {
                            return f("text", e)
                        }
                    }, {
                        key: "destroy",
                        value: function e() {
                            this.listener.destroy(),
                            this.clipboardAction && (this.clipboardAction.destroy(),
                            this.clipboardAction = null)
                        }
                    }], [{
                        key: "isSupported",
                        value: function l(e) {
                            var t = 0 < arguments.length && e !== undefined ? arguments[0] : ["copy", "cut"]
                              , n = "string" == typeof t ? [t] : t
                              , r = !!document.queryCommandSupported;
                            return n.forEach(function(e) {
                                r = r && !!document.queryCommandSupported(e)
                            }),
                            r
                        }
                    }]),
                    r
                }();
                e.exports = o
            })
        }
        , {
            "./clipboard-action": 7,
            "good-listener": 4,
            "tiny-emitter": 6
        }]
    }, {}, [8])(8)
}),
function(v) {
    function e(e, t, n) {
        return n = u(t, n),
        this.on("click.pjax", e, function(e) {
            var t = n;
            t.container || ((t = v.extend({}, n)).container = v(this).attr("data-pjax")),
            r(e, t)
        })
    }
    function r(e, t, n) {
        n = u(t, n);
        var r = e.currentTarget
          , i = v(r);
        if ("A" !== r.tagName.toUpperCase())
            throw "$.fn.pjax or $.pjax.click requires an anchor element";
        if (!(1 < e.which || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || location.protocol !== r.protocol || location.hostname !== r.hostname || -1 < r.href.indexOf("#") && l(r) == l(location) || e.isDefaultPrevented())) {
            var o = {
                url: r.href,
                container: i.attr("data-pjax"),
                target: r
            }
              , a = v.extend({}, o, n)
              , s = v.Event("pjax:click");
            i.trigger(s, [a]),
            s.isDefaultPrevented() || (y(a),
            e.preventDefault(),
            i.trigger("pjax:clicked", [a]))
        }
    }
    function t(e, t, n) {
        n = u(t, n);
        var r = e.currentTarget
          , i = v(r);
        if ("FORM" !== r.tagName.toUpperCase())
            throw "$.pjax.submit requires a form element";
        var o = {
            type: (i.attr("method") || "GET").toUpperCase(),
            url: i.attr("action"),
            container: i.attr("data-pjax"),
            target: r
        };
        if ("GET" !== o.type && window.FormData !== undefined)
            o.data = new FormData(r),
            o.processData = !1,
            o.contentType = !1;
        else {
            if (i.find(":file").length)
                return;
            o.data = i.serializeArray()
        }
        y(v.extend({}, o, n)),
        e.preventDefault()
    }
    function y(p) {
        function h(e, t, n) {
            n || (n = {}),
            n.relatedTarget = p.target;
            var r = v.Event(e, n);
            return g.trigger(r, t),
            !r.isDefaultPrevented()
        }
        p = v.extend(!0, {}, v.ajaxSettings, y.defaults, p),
        v.isFunction(p.url) && (p.url = p.url());
        var m = w(p.url).hash
          , e = v.type(p.container);
        if ("string" !== e)
            throw "expected string value for 'container' option; got " + e;
        var r, g = p.context = v(p.container);
        if (!g.length)
            throw "the container selector '" + p.container + "' did not match anything";
        p.data || (p.data = {}),
        v.isArray(p.data) ? p.data.push({
            name: "_pjax",
            value: p.container
        }) : p.data._pjax = p.container,
        p.beforeSend = function(e, t) {
            if ("GET" !== t.type && (t.timeout = 0),
            e.setRequestHeader("X-PJAX", "true"),
            e.setRequestHeader("X-PJAX-Container", p.container),
            !h("pjax:beforeSend", [e, t]))
                return !1;
            0 < t.timeout && (r = setTimeout(function() {
                h("pjax:timeout", [e, p]) && e.abort("timeout")
            }, t.timeout),
            t.timeout = 0);
            var n = w(t.url);
            m && (n.hash = m),
            p.requestUrl = c(n)
        }
        ,
        p.complete = function(e, t) {
            r && clearTimeout(r),
            h("pjax:complete", [e, t, p]),
            h("pjax:end", [e, p])
        }
        ,
        p.error = function(e, t, n) {
            var r = k("", e, p)
              , i = h("pjax:error", [e, t, n, p]);
            "GET" == p.type && "abort" !== t && i && b(r.url)
        }
        ,
        p.success = function(e, t, n) {
            var r = y.state
              , i = "function" == typeof v.pjax.defaults.version ? v.pjax.defaults.version() : v.pjax.defaults.version
              , o = n.getResponseHeader("X-PJAX-Version")
              , a = k(e, n, p)
              , s = w(a.url);
            if (m && (s.hash = m,
            a.url = s.href),
            i && o && i !== o)
                b(a.url);
            else if (a.contents) {
                if (y.state = {
                    id: p.id || x(),
                    url: a.url,
                    title: a.title,
                    container: p.container,
                    fragment: p.fragment,
                    timeout: p.timeout
                },
                (p.push || p.replace) && window.history.replaceState(y.state, a.title, a.url),
                v.contains(g, document.activeElement))
                    try {
                        document.activeElement.blur()
                    } catch (f) {}
                a.title && (document.title = a.title),
                h("pjax:beforeReplace", [a.contents, p], {
                    state: y.state,
                    previousState: r
                }),
                g.html(a.contents);
                var l = g.find("input[autofocus], textarea[autofocus]").last()[0];
                l && document.activeElement !== l && l.focus(),
                j(a.scripts);
                var u = p.scrollTo;
                if (m) {
                    var c = decodeURIComponent(m.slice(1))
                      , d = document.getElementById(c) || document.getElementsByName(c)[0];
                    d && (u = v(d).offset().top)
                }
                "number" == typeof u && v(window).scrollTop(u),
                h("pjax:success", [e, t, n, p])
            } else
                b(a.url)
        }
        ,
        y.state || (y.state = {
            id: x(),
            url: window.location.href,
            title: document.title,
            container: p.container,
            fragment: p.fragment,
            timeout: p.timeout
        },
        window.history.replaceState(y.state, document.title)),
        d(y.xhr),
        y.options = p;
        var t = y.xhr = v.ajax(p);
        return 0 < t.readyState && (p.push && !p.replace && (a(y.state.id, [p.container, f(g)]),
        window.history.pushState(null, "", p.requestUrl)),
        h("pjax:start", [t, p]),
        h("pjax:send", [t, p])),
        y.xhr
    }
    function n(e, t) {
        var n = {
            url: window.location.href,
            push: !1,
            replace: !0,
            scrollTo: !1
        };
        return y(v.extend(n, u(e, t)))
    }
    function b(e) {
        window.history.replaceState(null, "", y.state.url),
        window.location.replace(e)
    }
    function i(e) {
        C || d(y.xhr);
        var t, n = y.state, r = e.state;
        if (r && r.container) {
            if (C && E == r.url)
                return;
            if (n) {
                if (n.id === r.id)
                    return;
                t = n.id < r.id ? "forward" : "back"
            }
            var i = N[r.id] || []
              , o = i[0] || r.container
              , a = v(o)
              , s = i[1];
            if (a.length) {
                n && m(t, n.id, [o, f(a)]);
                var l = v.Event("pjax:popstate", {
                    state: r,
                    direction: t
                });
                a.trigger(l);
                var u = {
                    id: r.id,
                    url: r.url,
                    container: o,
                    push: !1,
                    fragment: r.fragment,
                    timeout: r.timeout,
                    scrollTo: !1
                };
                if (s) {
                    a.trigger("pjax:start", [null, u]),
                    (y.state = r).title && (document.title = r.title);
                    var c = v.Event("pjax:beforeReplace", {
                        state: r,
                        previousState: n
                    });
                    a.trigger(c, [s, u]),
                    a.html(s),
                    a.trigger("pjax:end", [null, u])
                } else
                    y(u);
                a[0].offsetHeight
            } else
                b(location.href)
        }
        C = !1
    }
    function o(e) {
        var t = v.isFunction(e.url) ? e.url() : e.url
          , n = e.type ? e.type.toUpperCase() : "GET"
          , r = v("<form>", {
            method: "GET" === n ? "GET" : "POST",
            action: t,
            style: "display:none"
        });
        "GET" !== n && "POST" !== n && r.append(v("<input>", {
            type: "hidden",
            name: "_method",
            value: n.toLowerCase()
        }));
        var i = e.data;
        if ("string" == typeof i)
            v.each(i.split("&"), function(e, t) {
                var n = t.split("=");
                r.append(v("<input>", {
                    type: "hidden",
                    name: n[0],
                    value: n[1]
                }))
            });
        else if (v.isArray(i))
            v.each(i, function(e, t) {
                r.append(v("<input>", {
                    type: "hidden",
                    name: t.name,
                    value: t.value
                }))
            });
        else if ("object" == typeof i) {
            var o;
            for (o in i)
                r.append(v("<input>", {
                    type: "hidden",
                    name: o,
                    value: i[o]
                }))
        }
        v(document.body).append(r),
        r.submit()
    }
    function d(e) {
        e && e.readyState < 4 && (e.onreadystatechange = v.noop,
        e.abort())
    }
    function x() {
        return (new Date).getTime()
    }
    function f(e) {
        var t = e.clone();
        return t.find("script").each(function() {
            this.src || v._data(this, "globalEval", !1)
        }),
        t.contents()
    }
    function c(e) {
        return e.search = e.search.replace(/([?&])(_pjax|_)=[^&]*/g, "").replace(/^&/, ""),
        e.href.replace(/\?($|#)/, "$1")
    }
    function w(e) {
        var t = document.createElement("a");
        return t.href = e,
        t
    }
    function l(e) {
        return e.href.replace(/#.*/, "")
    }
    function u(e, t) {
        return e && t ? ((t = v.extend({}, t)).container = e,
        t) : v.isPlainObject(e) ? e : {
            container: e
        }
    }
    function p(e, t) {
        return e.filter(t).add(e.find(t))
    }
    function h(e) {
        return v.parseHTML(e, document, !0)
    }
    function k(e, t, n) {
        var r, i, o = {}, a = /<html/i.test(e), s = t.getResponseHeader("X-PJAX-URL");
        if (o.url = s ? c(w(s)) : n.requestUrl,
        a) {
            i = v(h(e.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]));
            var l = e.match(/<head[^>]*>([\s\S.]*)<\/head>/i);
            r = null != l ? v(h(l[0])) : i
        } else
            r = i = v(h(e));
        if (0 === i.length)
            return o;
        if (o.title = p(r, "title").last().text(),
        n.fragment) {
            var u = i;
            "body" !== n.fragment && (u = p(u, n.fragment).first()),
            u.length && (o.contents = "body" === n.fragment ? u : u.contents(),
            o.title || (o.title = u.attr("title") || u.data("title")))
        } else
            a || (o.contents = i);
        return o.contents && (o.contents = o.contents.not(function() {
            return v(this).is("title")
        }),
        o.contents.find("title").remove(),
        o.scripts = p(o.contents, "script[src]").remove(),
        o.contents = o.contents.not(o.scripts)),
        o.title && (o.title = v.trim(o.title)),
        o
    }
    function j(e) {
        if (e) {
            var r = v("script[src]");
            e.each(function() {
                var e = this.src;
                if (!r.filter(function() {
                    return this.src === e
                }).length) {
                    var t = document.createElement("script")
                      , n = v(this).attr("type");
                    n && (t.type = n),
                    t.src = v(this).attr("src"),
                    document.head.appendChild(t)
                }
            })
        }
    }
    function a(e, t) {
        N[e] = t,
        D.push(e),
        s(L, 0),
        s(D, y.defaults.maxCacheLength)
    }
    function m(e, t, n) {
        var r, i;
        N[t] = n,
        "forward" === e ? (r = D,
        i = L) : (r = L,
        i = D),
        r.push(t),
        (t = i.pop()) && delete N[t],
        s(r, y.defaults.maxCacheLength)
    }
    function s(e, t) {
        for (; e.length > t; )
            delete N[e.shift()]
    }
    function g() {
        return v("meta").filter(function() {
            var e = v(this).attr("http-equiv");
            return e && "X-PJAX-VERSION" === e.toUpperCase()
        }).attr("content")
    }
    function T() {
        v.fn.pjax = e,
        v.pjax = y,
        v.pjax.enable = v.noop,
        v.pjax.disable = $,
        v.pjax.click = r,
        v.pjax.submit = t,
        v.pjax.reload = n,
        v.pjax.defaults = {
            timeout: 650,
            push: !0,
            replace: !1,
            type: "GET",
            dataType: "html",
            scrollTo: 0,
            maxCacheLength: 20,
            version: g
        },
        v(window).on("popstate.pjax", i)
    }
    function $() {
        v.fn.pjax = function() {
            return this
        }
        ,
        v.pjax = o,
        v.pjax.enable = T,
        v.pjax.disable = v.noop,
        v.pjax.click = v.noop,
        v.pjax.submit = v.noop,
        v.pjax.reload = function() {
            window.location.reload()
        }
        ,
        v(window).off("popstate.pjax", i)
    }
    var C = !0
      , E = window.location.href
      , S = window.history.state;
    S && S.container && (y.state = S),
    "state"in window.history && (C = !1);
    var N = {}
      , L = []
      , D = [];
    v.event.props && v.inArray("state", v.event.props) < 0 ? v.event.props.push("state") : "state"in v.Event.prototype || v.event.addProp("state"),
    v.support.pjax = window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/),
    v.support.pjax ? T() : $()
}(jQuery),
function() {
    $(document).on("ready pjax:success", function() {
        return new Clipboard("#copy-api-token").on("success", function() {
            var e;
            return e = '<div class="flash notice"><div class="flash-inner">API token copied to clipboard.</div></div>',
            0 < $(".flash").length ? $(".flash").replaceWith(e) : $(".content-push").before(e)
        }),
        $(".js-edit-address").on("click", function(e) {
            return e.stopPropagation(),
            e.preventDefault(),
            $(".js-address-form input,select").prop("disabled", !1),
            $(".js-submit-address").removeClass("hidden"),
            $(".js-edit-address").addClass("hidden")
        }),
        $(".js-address-form").on("submit", function(e) {
            var t;
            return e.stopPropagation(),
            e.preventDefault(),
            (t = $(e.target)).addClass("loading"),
            $.ajax({
                method: "POST",
                url: "/account/address",
                data: t.serialize(),
                success: function() {
                    return t.removeClass("loading"),
                    $(".js-address-form input,select").prop("disabled", !0),
                    $(".js-submit-address").addClass("hidden"),
                    $(".js-edit-address").removeClass("hidden")
                },
                error: function() {
                    return t.removeClass("loading")
                }
            })
        })
    })
}
.call(this),
function() {
    $(document).ready(function() {
        var r;
        return r = function() {
            var e, t, n, r, i, o;
            for (r = [],
            n = 0,
            i = (o = $(".js-package-sort li")).length; n < i; n++)
                t = o[n],
                r.push($(t).data("id"));
            return e = {
                ids: r.join(",")
            },
            $.ajax({
                url: "/admin/packages/order",
                method: "POST",
                data: e
            })
        }
        ,
        $(".js-admin-package-search-results").on("click", ".js-add-to-list", function(e) {
            var t, n;
            return e.stopPropagation(),
            e.preventDefault(),
            (n = (t = $(e.currentTarget).closest("li")).clone()).find(".js-add-to-list").removeClass("add-button js-add-to-list").addClass("delete-button js-remove-from-list").find(".octicon").removeClass("octicon-move-down").addClass("octicon-trashcan"),
            $(".js-package-sort").prepend(n),
            t.find(".js-add-to-list").replaceWith('<span class="octicon octicon-check"></span>'),
            r()
        }),
        $(".js-package-sort").on("click", ".js-remove-from-list", function(e) {
            return e.stopPropagation(),
            e.preventDefault(),
            $(e.currentTarget).closest("li").remove(),
            r()
        }),
        $(".js-package-sort").dragsort({
            dragSelector: "li",
            dragEnd: r
        }),
        $(".js-admin-package-search-results").on("click", ".js-admin-search-pagination a", function(e) {
            return e.stopPropagation(),
            e.preventDefault(),
            $(".js-admin-package-search-results").load($(e.currentTarget).attr("href"))
        }),
        $("form.js-admin-package-search").submit(function(e) {
            return e.stopPropagation(),
            e.preventDefault(),
            $.ajax({
                url: "/admin/packages/search",
                data: {
                    q: $("#q").val(),
                    filter: $(e.currentTarget).data("filter")
                },
                success: function(e) {
                    return $(".js-admin-package-search-results").html(e)
                }
            })
        }),
        $(".js-user-search-result .js-eligible-for-reward").on("change", function(e) {
            return $(".js-user-search-result").addClass("spinnin"),
            $.ajax({
                url: "/admin/users/" + e.target.dataset.userLogin,
                method: "POST",
                data: {
                    eligible_for_reward: e.target.checked
                },
                success: function(e) {
                    return $(".js-user-search-result").html(e).removeClass("spinnin")
                }
            })
        }),
        $(".js-user-search-result .js-reward-ordered").on("change", function(e) {
            return $(".js-user-search-result").addClass("spinnin"),
            $.ajax({
                url: "/admin/users/" + e.target.dataset.userLogin,
                method: "POST",
                data: {
                    reward_ordered: e.target.checked
                },
                success: function(e) {
                    return $(".js-user-search-result").html(e).removeClass("spinnin")
                }
            })
        }),
        $(".js-user-search-result .js-clear-address").on("click", function(e) {
            return $(".js-user-search-result").addClass("spinnin"),
            $.ajax({
                url: "/admin/users/" + e.target.dataset.userLogin,
                method: "POST",
                data: {
                    clear_serialized_address: !0
                },
                success: function(e) {
                    return $(".js-user-search-result").html(e).removeClass("spinnin")
                }
            })
        }),
        $(".js-show-blacklist-modal").leanModal().on("click", function() {
            return $(".js-user-blacklist-modal input").focus(),
            null
        }),
        $(".js-user-blacklist-confirm-form").on("submit", function() {
            if ("" === $("input[name=user-blacklist-reason]").val())
                return !1
        }),
        $(".js-show-delete-modal").leanModal().on("click", function() {
            return $(".js-user-delete-modal input").focus(),
            null
        }),
        $(".js-user-delete-confirm-form").on("submit", function() {
            var e;
            if ((e = $("input[name=user-delete-confirm]").val()) !== $("input[name=user-delete-confirm-username]").val() || "" === e)
                return !1
        })
    })
}
.call(this),
function() {
    $(document).on("click", ".js-tabbed-pages .js-tabbed-tab", function(e) {
        var t, n;
        return e.preventDefault(),
        t = $(e.currentTarget).closest(".js-tabbed-pages"),
        n = $(e.currentTarget).attr("data-page"),
        t.find(".js-tabbed-tab").filter(".selected").removeClass("selected"),
        t.find(".js-tabbed-page").filter(".selected").removeClass("selected"),
        t.find("[data-page='" + n + "']").addClass("selected")
    })
}
.call(this),
function() {
    var t;
    $(document).ready(function() {
        if ($(".js-search-version-select").on("selectmenu:selected", function(e) {
            var t, n;
            return n = window.location.pathname.match(/^\/docs\/api\/search/i) ? 4 : window.location.pathname.match(/^\/docs\/api/i) ? 3 : 2,
            (t = window.location.pathname.split("/"))[n] = $(e.target).data("version"),
            window.location.pathname = t.join("/")
        }),
        $(document).pjax(".documents a:not([data-remote]):not([data-behavior]):not([data-skip-pjax])", "#js-pjax-container"),
        window.location.hash)
            return t(window.location.hash)
    }),
    $(document).on("click", ".js-api-name", function(e) {
        return e.preventDefault(),
        t($(this).attr("href")),
        !1
    }),
    $(window).on("hashchange", function() {
        return t(window.location.hash)
    }),
    $(document).on("click", ".js-toggle-extended", function(e) {
        return e.preventDefault(),
        $(this).parent().toggleClass("show"),
        !1
    }),
    t = function(e) {
        var t, n;
        return (n = (t = $(e)).parents(".extended-methods-container")).length && n.addClass("show"),
        t.hasClass("expanded") ? t.removeClass("expanded") : (t.addClass("expanded"),
        window.history.replaceState("", "", e))
    }
}
.call(this),
function() {}
.call(this),
function(o) {
    o.fn.extend({
        leanModal: function(e) {
            function i(e) {
                o("#lean_overlay").fadeOut(200),
                o(e).css({
                    display: "none"
                })
            }
            var t = {
                top: 100,
                overlay: .5,
                closeButton: null
            }
              , n = o("<div id='lean_overlay'></div>");
            return o("body").append(n),
            e = o.extend(t, e),
            this.each(function() {
                var r = e;
                o(this).click(function(e) {
                    var t = o(this).attr("href");
                    o("#lean_overlay").click(function() {
                        i(t)
                    }),
                    o(r.closeButton).click(function() {
                        i(t)
                    });
                    o(t).outerHeight();
                    var n = o(t).outerWidth();
                    o("#lean_overlay").css({
                        display: "block",
                        opacity: 0
                    }),
                    o("#lean_overlay").fadeTo(200, r.overlay),
                    o(t).css({
                        display: "block",
                        position: "fixed",
                        opacity: 0,
                        "z-index": 11e3,
                        left: "50%",
                        "margin-left": -n / 2 + "px",
                        top: r.top + "px"
                    }),
                    o(t).fadeTo(200, 1),
                    e.preventDefault()
                })
            })
        }
    })
}(jQuery),
function() {
    $(document).ready(function() {
        return $(".js-show-flag").leanModal().on("click", function() {
            return $("#flag-modal textarea").focus(),
            null
        }),
        $("#flag-modal").on("keydown", function(e) {
            var t, n;
            switch (t = e.keyCode,
            n = e.metaKey,
            t) {
            case 13:
                n && $("#flag-modal form").submit();
                break;
            case 27:
                $("#lean_overlay").click()
            }
            return null
        }),
        $(".star-box").on("click", "a.js-star-button", function(e) {
            var t;
            if (t = e.target.className.match(/octicon-star/) ? e.target.parentNode : e.target,
            e.stopPropagation(),
            e.preventDefault(),
            !t.className.match(/\bdisabled\b/))
                return $.ajax({
                    url: t.getAttribute("href"),
                    method: "post",
                    error: function() {
                        return console.error("An error occured whilst starring")
                    },
                    success: function(e) {
                        return $(t).parent().html(e)
                    }
                })
        }),
        $(".trending-select").on("selectmenu:selected", function(e) {
            var t, n, r, i;
            return r = (t = $(e.target)).data("trending-sort"),
            n = !!t.data("is-theme"),
            $(".package-list.trending .loading-overlay").show(),
            i = n ? "/themes/trending/" + r : "/packages/trending/" + r,
            $.ajax({
                url: i,
                headers: {
                    "X-PJAX": "true"
                },
                method: "get",
                success: function(e) {
                    return $(".trending-packages").html(e),
                    $(".package-list.trending .loading-overlay").hide()
                },
                error: function() {
                    return $(".package-list.trending .loading-overlay").hide()
                }
            })
        }),
        $(".card-install-button").on("click", function() {
            return $(this).next(".modal-download-atom").show()
        }),
        $(".card-install-button-close").on("click", function() {
            return $(this).parent().hide()
        })
    })
}
.call(this),
"undefined" == typeof document || "classList"in document.createElement("a") || function(e) {
    "use strict";
    if ("HTMLElement"in e || "Element"in e) {
        var t = "classList"
          , n = "prototype"
          , r = (e.HTMLElement || e.Element)[n]
          , i = Object
          , o = String[n].trim || function() {
            return this.replace(/^\s+|\s+$/g, "")
        }
          , a = Array[n].indexOf || function(e) {
            for (var t = 0, n = this.length; t < n; t++)
                if (t in this && this[t] === e)
                    return t;
            return -1
        }
          , s = function(e, t) {
            this.name = e,
            this.code = DOMException[e],
            this.message = t
        }
          , l = function(e, t) {
            if ("" === t)
                throw new s("SYNTAX_ERR","An invalid or illegal string was specified");
            if (/\s/.test(t))
                throw new s("INVALID_CHARACTER_ERR","String contains an invalid character");
            return a.call(e, t)
        }
          , u = function(e) {
            for (var t = o.call(e.className), n = t ? t.split(/\s+/) : [], r = 0, i = n.length; r < i; r++)
                this.push(n[r]);
            this._updateClassName = function() {
                e.className = this.toString()
            }
        }
          , c = u[n] = []
          , d = function() {
            return new u(this)
        };
        if (s[n] = Error[n],
        c.item = function(e) {
            return this[e] || null
        }
        ,
        c.contains = function(e) {
            return -1 !== l(this, e += "")
        }
        ,
        c.add = function() {
            for (var e, t = arguments, n = 0, r = t.length, i = !1; e = t[n] + "",
            -1 === l(this, e) && (this.push(e),
            i = !0),
            ++n < r; )
                ;
            i && this._updateClassName()
        }
        ,
        c.remove = function() {
            var e, t = arguments, n = 0, r = t.length, i = !1;
            do {
                e = t[n] + "";
                var o = l(this, e);
                -1 !== o && (this.splice(o, 1),
                i = !0)
            } while (++n < r);i && this._updateClassName()
        }
        ,
        c.toggle = function(e, t) {
            e += "";
            var n = this.contains(e)
              , r = n ? !0 !== t && "remove" : !1 !== t && "add";
            return r && this[r](e),
            !n
        }
        ,
        c.toString = function() {
            return this.join(" ")
        }
        ,
        i.defineProperty) {
            var f = {
                get: d,
                enumerable: !0,
                configurable: !0
            };
            try {
                i.defineProperty(r, t, f)
            } catch (p) {
                -2146823252 === p.number && (f.enumerable = !1,
                i.defineProperty(r, t, f))
            }
        } else
            i[n].__defineGetter__ && r.__defineGetter__(t, d)
    }
}(self),
function() {
    var u, c, d;
    c = "ontransitionend"in window,
    $.fn.performTransition = function(e) {
        var t, n, r, i, o, a, s, l;
        if (c) {
            for (i = 0,
            a = (r = (r = this.find(".js-transitionable")).add(this.filter(".js-transitionable"))).length; i < a; i++)
                n = r[i],
                t = $(n),
                l = u(n),
                t.one("transitionend", function() {
                    if (n.style.display = null,
                    n.style.visibility = null,
                    l)
                        return d(n, function() {
                            return n.style.height = null
                        })
                }),
                n.style.display = "block",
                n.style.visibility = "visible",
                l && d(n, function() {
                    return n.style.height = t.height() + "px"
                }),
                n.offsetHeight;
            for (e.apply(this),
            o = 0,
            s = r.length; o < s; o++)
                n = r[o],
                u(n) && (0 === $(n).height() ? n.style.height = n.scrollHeight + "px" : n.style.height = "0px");
            return this
        }
        e.apply(this)
    }
    ,
    u = function(e) {
        return "height" === $(e).css("transitionProperty")
    }
    ,
    d = function(e, t) {
        e.style.transition = "none",
        t(e),
        e.offsetHeight,
        e.style.transition = null
    }
}
.call(this),
function() {
    $.fn.fire = function(t, e, n) {
        var r, i, o, a, s;
        if ((r = e) && ($.isPlainObject(r) ? a = r : $.isFunction(r) && (i = r)),
        (r = n) && $.isFunction(r) && (i = r),
        o = this[0],
        null == a && (a = {}),
        null == a.cancelable && (a.cancelable = !!i),
        null == a.bubbles && (a.bubbles = !0),
        s = function() {
            var e;
            return e = $.Event(t, a),
            $.event.trigger(e, [], o, !e.bubbles),
            i && !e.isDefaultPrevented() && i.call(o, e),
            e
        }
        ,
        !a.async)
            return s();
        delete a.async,
        setImmediate(s)
    }
}
.call(this),
function() {
    var t, e, i, o;
    i = {
        8: "backspace",
        9: "tab",
        13: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        19: "pause",
        20: "capslock",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "insert",
        46: "del",
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        91: "meta",
        93: "meta",
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9",
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12",
        144: "numlock",
        145: "scroll",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'"
    },
    o = {
        48: ")",
        49: "!",
        50: "@",
        51: "#",
        52: "$",
        53: "%",
        54: "^",
        55: "&",
        56: "*",
        57: "(",
        65: "A",
        66: "B",
        67: "C",
        68: "D",
        69: "E",
        70: "F",
        71: "G",
        72: "H",
        73: "I",
        74: "J",
        75: "K",
        76: "L",
        77: "M",
        78: "N",
        79: "O",
        80: "P",
        81: "Q",
        82: "R",
        83: "S",
        84: "T",
        85: "U",
        86: "V",
        87: "W",
        88: "X",
        89: "Y",
        90: "Z",
        186: ":",
        187: "+",
        188: "<",
        189: "_",
        190: ">",
        191: "?",
        192: "~",
        219: "{",
        220: "|",
        221: "}",
        222: '"'
    },
    t = function(e) {
        var t, n, r;
        return t = i[e.which],
        n = "",
        e.ctrlKey && "ctrl" !== t && (n += "ctrl+"),
        e.altKey && "alt" !== t && (n += "alt+"),
        e.metaKey && !e.ctrlKey && "meta" !== t && (n += "meta+"),
        e.shiftKey ? (r = o[e.which]) ? "" + n + r : "shift" === t ? n + "shift" : t ? n + "shift+" + t : null : t ? "" + n + t : null
    }
    ,
    e = function(e) {
        return null == e.hotkey && (e.hotkey = t(e)),
        e.handleObj.handler.apply(this, arguments)
    }
    ,
    $.event.special.keydown = {
        handle: e
    },
    $.event.special.keyup = {
        handle: e
    }
}
.call(this),
function() {
    var r, n, i, t, o, a = [].indexOf || function(e) {
        for (var t = 0, n = this.length; t < n; t++)
            if (t in this && this[t] === e)
                return t;
        return -1
    }
    ;
    n = null,
    r = function(e) {
        n && i(n),
        $(e).fire("menu:activate", function() {
            return $(document).on("keydown.menu", o),
            $(document).on("click.menu", t),
            n = e,
            $(e).performTransition(function() {
                return document.body.classList.add("menu-active"),
                e.classList.add("active"),
                $(e).find(".js-menu-content[aria-hidden]").attr("aria-hidden", "false")
            }),
            $(e).fire("menu:activated", {
                async: !0
            })
        })
    }
    ,
    i = function(e) {
        $(e).fire("menu:deactivate", function() {
            return $(document).off(".menu"),
            n = null,
            $(e).performTransition(function() {
                return document.body.classList.remove("menu-active"),
                e.classList.remove("active"),
                $(e).find(".js-menu-content[aria-hidden]").attr("aria-hidden", "true")
            }),
            $(e).fire("menu:deactivated", {
                async: !0
            })
        })
    }
    ,
    t = function(e) {
        n && ($(e.target).closest(n)[0] || (e.preventDefault(),
        i(n)))
    }
    ,
    o = function(e) {
        n && "esc" === e.hotkey && (0 <= a.call($(document.activeElement).parents(), n) && document.activeElement.blur(),
        e.preventDefault(),
        i(n))
    }
    ,
    $(document).on("click", ".js-menu-container", function(e) {
        var t;
        t = this,
        $(e.target).closest(".js-menu-target")[0] ? (e.preventDefault(),
        t === n ? i(t) : r(t)) : $(e.target).closest(".js-menu-content")[0] || t === n && (e.preventDefault(),
        i(t))
    }),
    $(document).on("click", ".js-menu-container .js-menu-close", function(e) {
        i($(this).closest(".js-menu-container")[0]),
        e.preventDefault()
    }),
    $.fn.menu = function(e) {
        var t, n;
        return t = $(this).closest(".js-menu-container")[0],
        "function" == typeof (n = {
            activate: function() {
                return r(t)
            },
            deactivate: function() {
                return i(t)
            }
        })[e] ? n[e]() : void 0
    }
}
.call(this),
function() {
    $(document).on("ajaxSuccess", ".js-select-menu:not([data-multiple])", function() {
        return $(this).menu("deactivate")
    }),
    $(document).on("ajaxSend", ".js-select-menu:not([data-multiple])", function() {
        return $(this).addClass("is-loading")
    }),
    $(document).on("ajaxComplete", ".js-select-menu", function() {
        return $(this).removeClass("is-loading")
    }),
    $(document).on("ajaxError", ".js-select-menu", function() {
        return $(this).addClass("has-error")
    }),
    $(document).on("menu:deactivate", ".js-select-menu", function() {
        return $(this).removeClass("is-loading has-error")
    })
}
.call(this),
function() {
    $(document).on("selectmenu:selected", ".js-select-menu .js-navigation-item", function() {
        var e, t, n;
        if (e = $(this).closest(".js-select-menu"),
        (n = $(this).find(".js-select-button-text"))[0] && e.find(".js-select-button").html(n.html()),
        t = $(this).find(".js-select-menu-item-gravatar"),
        n[0])
            return e.find(".js-select-button-gravatar").html(t.html())
    })
}
.call(this),
function() {
    $.hidden = function() {
        return this.offsetWidth <= 0 && this.offsetHeight <= 0
    }
    ,
    $.visible = function() {
        return !$.hidden.call(this)
    }
    ,
    $.fn.hidden = function() {
        return this.filter($.hidden)
    }
    ,
    $.fn.visible = function() {
        return this.filter($.visible)
    }
}
.call(this),
function() {
    $(document).on("selectmenu:change", ".js-select-menu .select-menu-list", function(e) {
        var t, n;
        (n = $(this).find(".js-navigation-item")).removeClass("last-visible"),
        n.visible().last().addClass("last-visible"),
        $(this).is("[data-filterable-for]") || (t = $(e.target).hasClass("filterable-empty"),
        $(this).toggleClass("filterable-empty", t))
    })
}
.call(this),
function() {
    var l, r;
    $.fuzzyScore = function(e, t) {
        var n;
        return (n = r(e, t)) && !/\//.test(t) && (n += r(e.replace(/^.*\//, ""), t)),
        n
    }
    ,
    $.fuzzySort = function(r, i) {
        var e, t, n, o, a, s;
        for ((r = function() {
            var e, t, n;
            for (n = [],
            e = 0,
            t = r.length; e < t; e++)
                s = r[e],
                (a = $.fuzzyScore(s, i)) && n.push([s, a]);
            return n
        }()).sort(l),
        o = [],
        t = 0,
        n = r.length; t < n; t++)
            e = r[t],
            o.push(e[0]);
        return o
    }
    ,
    l = function(e, t) {
        var n, r, i, o;
        return r = e[0],
        o = t[0],
        n = e[1],
        (i = t[1]) < n ? -1 : n < i ? 1 : r < o ? -1 : o < r ? 1 : 0
    }
    ,
    $.fuzzyRegexp = function(e) {
        var t, n, r;
        return r = e.toLowerCase(),
        t = "+.*?[]{}()^$|\\".replace(/(.)/g, "\\$1"),
        n = new RegExp("\\(([" + t + "])\\)","g"),
        e = r.replace(/(.)/g, "($1)(.*?)").replace(n, "(\\$1)"),
        new RegExp("(.*)" + e + "$","i")
    }
    ,
    $.fuzzyHighlight = function(e, t, n) {
        var r, i, o, a, s, l, u, c;
        if (null == n && (n = null),
        i = $.trim(e.innerHTML),
        t) {
            if (null == n && (n = $.fuzzyRegexp(t)),
            !(l = i.match(n)))
                return;
            for (u = !1,
            i = [],
            o = a = 1,
            c = l.length; 1 <= c ? a < c : c < a; o = 1 <= c ? ++a : --a)
                (s = l[o]) && (o % 2 == 0 ? u || (i.push("<mark>"),
                u = !0) : u && (i.push("</mark>"),
                u = !1),
                i.push("" + s));
            e.innerHTML = i.join("")
        } else
            r = i.replace(/<\/?mark>/g, ""),
            i !== r && (e.innerHTML = r)
    }
    ,
    r = function(e, t) {
        var n, r, i, o, a, s, l, u, c, d, f, p, h, m, g;
        if (e === t)
            return 1;
        for (m = e.length,
        s = d = h = g = 0,
        f = t.length; d < f; s = ++d) {
            if (i = t[s],
            l = e.indexOf(i.toLowerCase()),
            u = e.indexOf(i.toUpperCase()),
            -1 === (c = -1 < (p = Math.min(l, u)) ? p : Math.max(l, u)))
                return 0;
            o = .1,
            e[c] === i && (o += .1),
            0 === c && (o += .8,
            0 === s && (h = 1)),
            " " === e.charAt(c - 1) && (o += .8),
            e = e.substring(c + 1, m),
            g += o
        }
        return a = ((r = g / (n = t.length)) * (n / m) + r) / 2,
        h && a + .1 < 1 && (a += .1),
        a
    }
}
.call(this),
function() {
    var L, D, I, A, O;
    A = new WeakMap,
    $.fn.fuzzyFilterSortList = function(e, t) {
        var n, r, i, o, a, s, l, u, c, d, f, p, h, m, g, v, y, b, x, w, k, j, T, C, E, S, N;
        if (null == t && (t = {}),
        v = this[0]) {
            for (e = e.toLowerCase(),
            o = null != (x = t.content) ? x : L,
            E = null != (w = t.text) ? w : I,
            C = null != (k = t.score) ? k : $.fuzzyScore,
            g = t.limit,
            !0 === t.mark ? y = D : null != (null != (j = t.mark) ? j.call : void 0) && (y = t.mark),
            (n = A.get(v)) ? i = $(v).children() : (i = n = $(v).children(),
            A.set(v, n.slice(0))),
            a = 0,
            f = i.length; a < f; a++)
                s = i[a],
                v.removeChild(s),
                s.style.display = "";
            if (T = document.createDocumentFragment(),
            N = S = 0,
            e) {
                for (c = 0,
                h = (l = n.slice(0)).length; c < h; c++)
                    null == (s = l[c]).fuzzyFilterTextCache && (s.fuzzyFilterTextCache = E(o(s))),
                    s.fuzzyFilterScoreCache = C(s.fuzzyFilterTextCache, e);
                for (l.sort(O),
                b = $.fuzzyRegexp(e),
                d = 0,
                m = l.length; d < m; d++)
                    s = l[d],
                    (!g || S < g) && 0 < s.fuzzyFilterScoreCache && (N++,
                    y && (y(r = o(s)),
                    y(r, e, b)),
                    T.appendChild(s)),
                    S++
            } else
                for (u = 0,
                p = n.length; u < p; u++)
                    s = n[u],
                    (!g || S < g) && (N++,
                    y && y(o(s)),
                    T.appendChild(s)),
                    S++;
            return v.appendChild(T),
            N
        }
    }
    ,
    O = function(e, t) {
        var n, r, i, o;
        return n = e.fuzzyFilterScoreCache,
        i = t.fuzzyFilterScoreCache,
        r = e.fuzzyFilterTextCache,
        o = t.fuzzyFilterTextCache,
        i < n ? -1 : n < i ? 1 : r < o ? -1 : o < r ? 1 : 0
    }
    ,
    L = function(e) {
        return e
    }
    ,
    I = function(e) {
        return $.trim(e.textContent.toLowerCase())
    }
    ,
    D = $.fuzzyHighlight
}
.call(this),
function() {
    var p, h;
    $.fn.prefixFilterList = function(e, t) {
        var n, r, i, o, a, s, l, u, c, d, f;
        if (null == t && (t = {}),
        s = this[0]) {
            for (e = e.toLowerCase(),
            d = null != (u = t.text) ? u : h,
            i = $(s).children(),
            a = t.limit,
            !0 === t.mark ? l = p : null != (null != (c = t.mark) ? c.call : void 0) && (l = t.mark),
            n = f = 0,
            o = i.length; n < o; n++)
                0 === d(r = i[n]).indexOf(e) ? a && a <= f ? r.style.display = "none" : (f++,
                r.style.display = "",
                l && (l(r),
                l(r, e))) : r.style.display = "none";
            return f
        }
    }
    ,
    h = function(e) {
        return $.trim(e.textContent.toLowerCase())
    }
    ,
    p = function(e, t) {
        var n, r, i;
        r = e.innerHTML,
        t ? (i = new RegExp(t,"i"),
        e.innerHTML = r.replace(i, "<mark>$&</mark>")) : (n = r.replace(/<\/?mark>/g, ""),
        r !== n && (e.innerHTML = n))
    }
}
.call(this),
function() {
    var p, h;
    $.fn.substringFilterList = function(e, t) {
        var n, r, i, o, a, s, l, u, c, d, f;
        if (null == t && (t = {}),
        s = this[0]) {
            for (e = e.toLowerCase(),
            d = null != (u = t.text) ? u : h,
            a = t.limit,
            i = $(s).children(),
            !0 === t.mark ? l = p : null != (null != (c = t.mark) ? c.call : void 0) && (l = t.mark),
            n = f = 0,
            o = i.length; n < o; n++)
                -1 !== d(r = i[n]).indexOf(e) ? a && a <= f ? r.style.display = "none" : (f++,
                r.style.display = "",
                l && (l(r),
                l(r, e))) : r.style.display = "none";
            return f
        }
    }
    ,
    h = function(e) {
        return $.trim(e.textContent.toLowerCase())
    }
    ,
    p = function(e, t) {
        var n, r, i;
        r = e.innerHTML,
        t ? (i = new RegExp(t,"i"),
        e.innerHTML = r.replace(i, "<mark>$&</mark>")) : (n = r.replace(/<\/?mark>/g, ""),
        r !== n && (e.innerHTML = n))
    }
}
.call(this),
function() {
    $.fn.focused = function(e) {
        var n, r, i;
        return r = [],
        i = [],
        n = e ? this.find(e).filter(document.activeElement)[0] : this.filter(document.activeElement)[0],
        this.on("focusin", e, function() {
            var e, t;
            if (!n)
                for (n = this,
                e = 0,
                t = r.length; e < t; e++)
                    r[e].call(this)
        }),
        this.on("focusout", e, function() {
            var e, t;
            if (n)
                for (n = null,
                e = 0,
                t = i.length; e < t; e++)
                    i[e].call(this)
        }),
        {
            "in": function(e) {
                return r.push(e),
                n && e.call(n),
                this
            },
            out: function(e) {
                return i.push(e),
                this
            }
        }
    }
}
.call(this),
function() {
    var e, t;
    e = function() {
        var e, t, n, r, i, o;
        return t = n = !1,
        i = null,
        e = 100,
        r = function(t) {
            i && clearTimeout(i),
            i = setTimeout(function() {
                var e;
                i = null,
                e = new $.Event("throttled:input",{
                    target: t
                }),
                $.event.trigger(e, null, o, !0)
            }, e)
        }
        ,
        $(o = this).on("keydown.throttledInput", function() {
            n || (t = !1),
            n = !0,
            i && clearTimeout(i)
        }),
        $(this).on("keyup.throttledInput", function(e) {
            n = !1,
            t && r(e.target),
            t = !1
        }),
        $(this).on("input.throttledInput", function(e) {
            t = !0,
            n || r(e.target)
        })
    }
    ,
    t = function() {
        return $(this).off("keydown.throttledInput"),
        $(this).off("keyup.throttledInput"),
        $(this).off("input.throttledInput")
    }
    ,
    $.event.special["throttled:input"] = {
        setup: e,
        teardown: t
    }
}
.call(this),
function() {
    var a;
    $(document).focused(".js-filterable-field")["in"](function() {
        var e;
        return e = $(this).val(),
        $(this).on("throttled:input.filterable", function() {
            if (e !== $(this).val())
                return e = $(this).val(),
                $(this).fire("filterable:change", {
                    async: !0
                })
        }),
        $(this).fire("filterable:change", {
            async: !0
        })
    }).out(function() {
        return $(this).off(".filterable")
    }),
    $(document).on("filterable:change", ".js-filterable-field", function() {
        var e, t, n, r, i, o;
        for (i = $.trim($(this).val().toLowerCase()),
        t = 0,
        n = (o = $("[data-filterable-for=" + this.id + "]")).length; t < n; t++)
            r = o[t],
            e = $(r),
            a(e, i),
            e.fire("filterable:change", {
                relatedTarget: this
            })
    }),
    a = function(e, t) {
        var n, r, i, o;
        e.find(".js-filterable-text")[0] && (n = function(e) {
            return $(e).find(".js-filterable-text")[0]
        }
        ),
        i = void 0 !== e.attr("data-filterable-highlight"),
        r = e.attr("data-filterable-limit"),
        o = function() {
            switch (e.attr("data-filterable-type")) {
            case "fuzzy":
                return e.fuzzyFilterSortList(t, {
                    content: n,
                    mark: i,
                    limit: r
                });
            case "substring":
                return e.substringFilterList(t, {
                    content: n,
                    mark: i,
                    limit: r
                });
            default:
                return e.prefixFilterList(t, {
                    content: n,
                    mark: i,
                    limit: r
                })
            }
        }(),
        e.toggleClass("filterable-active", 0 < t.length),
        e.toggleClass("filterable-empty", 0 === o)
    }
}
.call(this),
function() {
    $(document).on("menu:activated selectmenu:load", ".js-select-menu", function() {
        return $(this).find(".js-filterable-field").focus()
    }),
    $(document).on("menu:deactivate", ".js-select-menu", function() {
        return $(this).find(".js-filterable-field").val("").trigger("filterable:change")
    })
}
.call(this),
function() {
    $(document).on("navigation:open", ".js-select-menu:not([data-multiple]) .js-navigation-item", function() {
        var e, t;
        if ((e = (t = $(this)).closest(".js-select-menu")).find(".js-navigation-item.selected").removeClass("selected"),
        t.addClass("selected"),
        t.removeClass("indeterminate"),
        t.find("input[type=radio], input[type=checkbox]").prop("checked", !0).change(),
        t.fire("selectmenu:selected"),
        !e.hasClass("is-loading"))
            return e.menu("deactivate")
    }),
    $(document).on("navigation:open", ".js-select-menu[data-multiple] .js-navigation-item", function() {
        var e, t;
        return t = (e = $(this)).hasClass("selected"),
        e.toggleClass("selected", !t),
        e.removeClass("indeterminate"),
        e.find("input[type=radio], input[type=checkbox]").prop("checked", !t).change(),
        e.fire("selectmenu:selected")
    })
}
.call(this),
function() {
    var e;
    e = function(e) {
        var t, n, r, i;
        return r = e.currentTarget,
        (t = $(r)).removeClass("js-load-contents"),
        t.addClass("is-loading"),
        t.removeClass("has-error"),
        i = t.attr("data-contents-url"),
        n = t.data("contents-data"),
        $.ajax({
            url: i,
            data: n
        }).then(function(e) {
            t.removeClass("is-loading"),
            t.find(".js-select-menu-deferred-content").html(e).pageUpdate(),
            t.hasClass("active") && t.fire("selectmenu:load")
        }, function() {
            t.removeClass("is-loading"),
            t.addClass("has-error")
        })
    }
    ,
    $.observe(".js-select-menu.js-load-contents", {
        add: function() {
            $(this).on("mouseenter", e),
            $(this).on("menu:activate", e)
        },
        remove: function() {
            $(this).off("mouseenter", e),
            $(this).off("menu:activate", e)
        }
    })
}
.call(this),
function() {
    $.fn.positionedOffset = function(e) {
        var t, n, r, i, o, a, s;
        if (t = this[0]) {
            for ((null != e ? e.jquery : void 0) && (e = e[0]),
            r = a = 0,
            n = t.offsetHeight,
            s = t.offsetWidth; t !== document.body && t !== e; )
                if (a += t.offsetTop || 0,
                r += t.offsetLeft || 0,
                !(t = t.offsetParent))
                    return;
            return e && e.offsetParent ? (i = e.scrollHeight,
            o = e.scrollWidth) : (i = $(document).height(),
            o = $(document).width()),
            {
                top: a,
                left: r,
                bottom: i - (a + n),
                right: o - (r + s)
            }
        }
    }
}
.call(this),
function() {
    var s, l = [].slice;
    $.fn.scrollTo = function() {
        var e, t, n, r, i, o, a;
        return e = 1 <= arguments.length ? l.call(arguments, 0) : [],
        (t = this[0]) && (r = {},
        $.isPlainObject(e[0]) ? (r = e[0],
        $.isFunction(e[1]) && null == r.complete && (r.complete = e[1])) : null != e[0] && (r.target = e[0]),
        null == r.top && null == r.left && (r.target ? (a = (i = $(r.target).positionedOffset(t)).top,
        n = i.left,
        r.top = a,
        r.left = n) : (a = (o = $(t).positionedOffset()).top,
        n = o.left,
        r.top = a,
        r.left = n,
        t = document)),
        t.offsetParent ? r.duration ? s(t, r) : (null != r.top && (t.scrollTop = r.top),
        null != r.left && (t.scrollLeft = r.left),
        "function" == typeof r.complete && r.complete()) : r.duration ? s("html, body", r) : (null != r.top && $(document).scrollTop(r.top),
        null != r.left && $(document).scrollLeft(r.left),
        "function" == typeof r.complete && r.complete())),
        this
    }
    ,
    s = function(e, t) {
        var n, r, i;
        return i = {},
        null != t.top && (i.scrollTop = t.top),
        null != t.left && (i.scrollLeft = t.left),
        r = {
            duration: t.duration,
            queue: !1
        },
        t.complete && (n = $(e).length,
        r.complete = function() {
            if (0 == --n)
                return setImmediate(t.complete)
        }
        ),
        $(e).animate(i, r)
    }
}
.call(this),
function() {
    $.fn.overflowOffset = function(e) {
        var t, n, r, i, o, a, s;
        if (null == e && (e = document.body),
        (t = this[0]) && (i = $(t).positionedOffset(e)))
            return e.offsetParent ? o = {
                top: $(e).scrollTop(),
                left: $(e).scrollLeft()
            } : (o = {
                top: $(window).scrollTop(),
                left: $(window).scrollLeft()
            },
            e = document.documentElement),
            a = i.top - o.top,
            r = i.left - o.left,
            n = e.clientHeight,
            s = e.clientWidth,
            {
                top: a,
                left: r,
                bottom: n - (a + t.offsetHeight),
                right: s - (r + t.offsetWidth),
                height: n,
                width: s
            }
    }
}
.call(this),
function() {
    $.fn.overflowParent = function() {
        var e, t, n;
        if (!(e = this[0]))
            return $();
        if (e === document.body)
            return $();
        for (; e !== document.body; ) {
            if (!(e = e.parentElement))
                return $();
            if (n = $(e).css("overflow-y"),
            t = $(e).css("overflow-x"),
            "auto" === n || "auto" === t || "scroll" === n || "scroll" === t)
                break
        }
        return $(e)
    }
}
.call(this),
function() {
    var o, e, a, n, i, s, l, u, r, c, d, f, p, h, m, g, v, t, y, b, x, w, k, j, T, C, E, S;
    i = navigator.userAgent.match(/Macintosh/),
    v = navigator.userAgent.match(/Macintosh/) ? "meta" : "ctrl",
    r = !1,
    t = {
        x: 0,
        y: 0
    },
    e = function(e) {
        e.addEventListener("mousemove", y, !1),
        e.addEventListener("mouseover", b, !1)
    }
    ,
    S = function(e) {
        e.removeEventListener("mousemove", y, !1),
        e.removeEventListener("mouseover", b, !1)
    }
    ,
    $.observe(".js-navigation-container", {
        add: e,
        remove: S
    }),
    y = function(e) {
        t.x === e.clientX && t.y === e.clientY || (r = !1),
        t = {
            x: e.clientX,
            y: e.clientY
        }
    }
    ,
    b = function(e) {
        r || $(e.target).trigger("navigation:mouseover")
    }
    ,
    $(document).on("keydown", function(e) {
        var t, n;
        (e.target === document.body || e.target.classList.contains("js-navigation-enable")) && (t = p()) && (r = !0,
        n = $(t).find(".js-navigation-item.navigation-focus")[0] || t,
        $(n).fire("navigation:keydown", {
            originalEvent: e,
            hotkey: e.hotkey,
            relatedTarget: t
        }).isDefaultPrevented() && e.preventDefault())
    }),
    $(document).on("navigation:keydown", ".js-active-navigation-container", function(e) {
        var t, n, r;
        if (t = this,
        n = $(e.originalEvent.target).is("input, textarea"),
        $(e.target).is(".js-navigation-item"))
            if (r = e.target,
            n) {
                if (i)
                    switch (e.hotkey) {
                    case "ctrl+n":
                        s(r, t);
                        break;
                    case "ctrl+p":
                        l(r, t)
                    }
                switch (e.hotkey) {
                case "up":
                    l(r, t);
                    break;
                case "down":
                    s(r, t);
                    break;
                case "enter":
                    g(r);
                    break;
                case v + "+enter":
                    g(r, !0)
                }
            } else {
                if (i)
                    switch (e.hotkey) {
                    case "ctrl+n":
                        s(r, t);
                        break;
                    case "ctrl+p":
                        l(r, t);
                        break;
                    case "alt+v":
                        w(r, t);
                        break;
                    case "ctrl+v":
                        x(r, t)
                    }
                switch (e.hotkey) {
                case "j":
                    s(r, t);
                    break;
                case "k":
                    l(r, t);
                    break;
                case "o":
                case "enter":
                    g(r);
                    break;
                case v + "+enter":
                    g(r, !0)
                }
            }
        else if (r = h(t)[0],
        n) {
            if (i)
                switch (e.hotkey) {
                case "ctrl+n":
                    f(r, t)
                }
            switch (e.hotkey) {
            case "down":
                f(r, t)
            }
        } else {
            if (i)
                switch (e.hotkey) {
                case "ctrl+n":
                case "ctrl+v":
                    f(r, t)
                }
            switch (e.hotkey) {
            case "j":
                f(r, t)
            }
        }
        if (n) {
            if (i)
                switch (e.hotkey) {
                case "ctrl+n":
                case "ctrl+p":
                    e.preventDefault()
                }
            switch (e.hotkey) {
            case "up":
            case "down":
                e.preventDefault();
                break;
            case "enter":
            case v + "+enter":
                e.preventDefault()
            }
        } else {
            if (i)
                switch (e.hotkey) {
                case "ctrl+n":
                case "ctrl+p":
                case "alt+v":
                case "ctrl+v":
                    e.preventDefault()
                }
            switch (e.hotkey) {
            case "j":
            case "k":
                e.preventDefault();
                break;
            case "o":
            case "enter":
            case v + "+enter":
                e.preventDefault()
            }
        }
    }),
    $(document).on("navigation:mouseover", ".js-active-navigation-container .js-navigation-item", function(e) {
        var t;
        t = $(e.currentTarget).closest(".js-navigation-container")[0],
        f(e.currentTarget, t)
    }),
    c = function(e) {
        var t, n;
        n = e.currentTarget,
        t = e.modifierKey || e.altKey || e.ctrlKey || e.metaKey,
        $(n).fire("navigation:open", {
            modifierKey: t
        }).isDefaultPrevented() && e.preventDefault()
    }
    ,
    $(document).on("click", ".js-active-navigation-container .js-navigation-item", function(e) {
        c(e)
    }),
    $(document).on("navigation:keyopen", ".js-active-navigation-container .js-navigation-item", function(e) {
        var t;
        (t = $(this).filter(".js-navigation-open")[0] || $(this).find(".js-navigation-open")[0]) ? (e.modifierKey ? (window.open(t.href, "_blank"),
        window.focus()) : $(t).click(),
        e.preventDefault()) : c(e)
    }),
    o = function(e) {
        var t;
        if (t = p(),
        e !== t)
            return $(e).fire("navigation:activate", function() {
                return t && t.classList.remove("js-active-navigation-container"),
                e.classList.add("js-active-navigation-container"),
                $(e).fire("navigation:activated", {
                    async: !0
                })
            })
    }
    ,
    u = function(e) {
        return $(e).fire("navigation:deactivate", function() {
            return e.classList.remove("js-active-navigation-container"),
            $(e).fire("navigation:deactivated", {
                async: !0
            })
        })
    }
    ,
    n = [],
    j = function(e) {
        var t;
        (t = p()) && n.push(t),
        o(e)
    }
    ,
    k = function(e) {
        var t;
        u(e),
        a(e),
        (t = n.pop()) && o(t)
    }
    ,
    d = function(e, t) {
        var n, r;
        if (n = h(t)[0],
        r = $(e).closest(".js-navigation-item")[0] || n,
        o(t),
        r) {
            if (f(r, t))
                return;
            E($(r).overflowParent()[0], r)
        }
    }
    ,
    a = function(e) {
        $(e).find(".navigation-focus.js-navigation-item").removeClass("navigation-focus")
    }
    ,
    T = function(e, t) {
        a(t),
        d(e, t)
    }
    ,
    l = function(e, t) {
        var n, r;
        if (r = (n = h(t))[$.inArray(e, n) - 1]) {
            if (f(r, t))
                return;
            t = $(r).overflowParent()[0],
            "page" === m(t) ? E(t, r) : C(t, r)
        }
    }
    ,
    s = function(e, t) {
        var n, r;
        if (r = (n = h(t))[$.inArray(e, n) + 1]) {
            if (f(r, t))
                return;
            t = $(r).overflowParent()[0],
            "page" === m(t) ? E(t, r) : C(t, r)
        }
    }
    ,
    w = function(e, t) {
        var n, r, i;
        for (r = h(t),
        n = $.inArray(e, r),
        t = $(e).overflowParent()[0]; (i = r[n - 1]) && 0 <= $(i).overflowOffset(t).top; )
            n--;
        if (i) {
            if (f(i, t))
                return;
            E(t, i)
        }
    }
    ,
    x = function(e, t) {
        var n, r, i;
        for (r = h(t),
        n = $.inArray(e, r),
        t = $(e).overflowParent()[0]; (i = r[n + 1]) && 0 <= $(i).overflowOffset(t).bottom; )
            n++;
        if (i) {
            if (f(i, t))
                return;
            E(t, i)
        }
    }
    ,
    g = function(e, t) {
        null == t && (t = !1),
        $(e).fire("navigation:keyopen", {
            modifierKey: t
        })
    }
    ,
    f = function(e, t) {
        return $(e).fire("navigation:focus", function() {
            return a(t),
            e.classList.add("navigation-focus"),
            $(e).fire("navigation:focused", {
                async: !0
            })
        }).isDefaultPrevented()
    }
    ,
    p = function() {
        return $(".js-active-navigation-container")[0]
    }
    ,
    h = function(e) {
        return $(e).find(".js-navigation-item").visible()
    }
    ,
    m = function(e) {
        var t;
        return null != (t = $(e).attr("data-navigation-scroll")) ? t : "item"
    }
    ,
    E = function(e, t) {
        var n, r, i;
        return r = $(t).positionedOffset(e),
        (n = $(t).overflowOffset(e)).bottom <= 0 ? $(e).scrollTo({
            top: r.top - 30,
            duration: 200
        }) : n.top <= 0 ? (i = (null != e.offsetParent ? e.scrollHeight : $(document).height()) - (r.bottom + n.height),
        $(e).scrollTo({
            top: i + 30,
            duration: 200
        })) : void 0
    }
    ,
    C = function(e, t) {
        var n, r, i;
        return r = $(t).positionedOffset(e),
        (n = $(t).overflowOffset(e)).bottom <= 0 ? (i = (null != e.offsetParent ? e.scrollHeight : $(document).height()) - (r.bottom + n.height),
        $(e).scrollTo({
            top: i
        })) : n.top <= 0 ? $(e).scrollTo({
            top: r.top
        }) : void 0
    }
    ,
    $.fn.navigation = function(e) {
        var t, n, r, i;
        return "active" === e ? p() : (t = $(this).closest(".js-navigation-container")[0]) && "function" == typeof (n = {
            activate: function() {
                return o(t)
            },
            deactivate: function() {
                return u(t)
            },
            push: function() {
                return j(t)
            },
            pop: function() {
                return k(t)
            },
            focus: (i = this,
            function() {
                return d(i, t)
            }
            ),
            clear: function() {
                return a(t)
            },
            refocus: (r = this,
            function() {
                return T(r, t)
            }
            )
        })[e] ? n[e]() : void 0
    }
}
.call(this),
function() {
    $(document).on("menu:activate", ".js-select-menu", function() {
        return $(this).find(":focus").blur(),
        $(this).find(".js-menu-target").attr("aria-expanded", !0).addClass("selected"),
        $(this).find(".js-navigation-container").navigation("push")
    }),
    $(document).on("menu:deactivate", ".js-select-menu", function() {
        return $(this).find(".js-menu-target").attr("aria-expanded", !1).removeClass("selected"),
        $(this).find(".js-navigation-container").navigation("pop")
    }),
    $(document).on("filterable:change selectmenu:tabchange", ".js-select-menu .select-menu-list", function() {
        return $(this).navigation("refocus")
    })
}
.call(this),
function() {
    var r;
    $(document).on("filterable:change", ".js-select-menu .select-menu-list", function(e) {
        var t, n;
        (n = $(this).find(".js-new-item-form")[0]) && ("" === (t = e.relatedTarget.value) || r(this, t) ? $(this).removeClass("is-showing-new-item-form") : ($(this).addClass("is-showing-new-item-form"),
        $(n).find(".js-new-item-name").text(t),
        $(n).find(".js-new-item-value").val(t))),
        $(e.target).trigger("selectmenu:change")
    }),
    r = function(e, t) {
        var n, r, i, o;
        for (n = 0,
        i = (o = $(e).find(".js-select-button-text")).length; n < i; n++)
            if (r = o[n],
            $.trim($(r).text().toLowerCase()) === t.toLowerCase())
                return !0;
        return !1
    }
}
.call(this),
function() {
    var e;
    $(document).on("menu:activate selectmenu:load", ".js-select-menu", function() {
        return $(this).find(".js-select-menu-tab").first().addClass("selected")
    }),
    $(document).on("click", ".js-select-menu .js-select-menu-tab", function() {
        return $(this).closest(".js-select-menu").find(".js-select-menu-tab").removeClass("selected"),
        $(this).addClass("selected"),
        !1
    }),
    e = function(e, t) {
        var n, r;
        r = e.getAttribute("data-tab-filter"),
        (n = $(e).closest(".js-select-menu").find(".js-select-menu-tab-bucket").filter(function() {
            return this.getAttribute("data-tab-filter") === r
        })).toggleClass("selected", t),
        t && n.fire("selectmenu:tabchange")
    }
    ,
    $.observe(".js-select-menu .js-select-menu-tab.selected", {
        add: function() {
            return e(this, !0)
        },
        remove: function() {
            return e(this, !1)
        }
    })
}
.call(this),
function() {
    $(document).ready(function() {
        return $(".welcome").on("click", ".js-download-button", function(e) {
            var t, n, r;
            if (n = $(e.currentTarget).closest("a").attr("href"),
            null != (r = /\/download\/(\w+)/.exec(n)) && "undefined" != typeof ga && ga("send", "event", "button", "download", r[1]),
            "undefined" != typeof twttr)
                try {
                    twttr.conversion.trackPid("l6c39", {
                        tw_sale_amount: 0,
                        tw_order_quantity: 0
                    })
                } catch (i) {
                    t = i,
                    console.error(t)
                }
        })
    })
}
.call(this),
function(u) {
    u.fn.addressfield = function(e) {
        var t = this
          , n = u.extend({
            fields: {},
            json: null,
            async: !0,
            defs: {
                fields: {}
            }
        }, e);
        return "string" == typeof n.json ? (u.ajax({
            dataType: "json",
            url: n.json,
            async: n.async,
            success: function(e) {
                u.fn.addressfield.binder.call(t, n.fields, u.fn.addressfield.transform(e)),
                u(n.fields.country).change()
            }
        }),
        t) : "object" == typeof n.json && null !== n.json ? (u.fn.addressfield.binder.call(t, n.fields, u.fn.addressfield.transform(n.json)),
        u(n.fields.country).change(),
        t) : u.fn.addressfield.apply.call(t, n.defs, n.fields)
    }
    ,
    u.fn.addressfield.apply = function(r, e) {
        var t, n, i, o, a, s = u(this), l = [];
        for (o in r.fields) {
            if (a = u.fn.addressfield.onlyKey(r.fields[o]),
            n = e.hasOwnProperty(a) ? e[a] : "." + a,
            t = s.find(n),
            r.fields[o][a]instanceof Array)
                return u.fn.addressfield.apply.call(t, {
                    fields: r.fields[o][a]
                }, e);
            t.length && e.hasOwnProperty(a) && (l.push(n),
            "undefined" != typeof r.fields[o][a].options ? (t.is("select") || (t = u.fn.addressfield.convertToSelect.call(t)),
            u.fn.addressfield.updateOptions.call(t, r.fields[o][a].options)) : (t.is("select") && (t = u.fn.addressfield.convertToText.call(t)),
            i = r.fields[o][a].hasOwnProperty("eg") ? r.fields[o][a].eg : "",
            u.fn.addressfield.updateEg.call(t, i)),
            u.fn.addressfield.updateLabel.call(t, r.fields[o][a].label)),
            !u.fn.addressfield.isVisible.call(t) && e.hasOwnProperty(a) && u.fn.addressfield.showField.call(t),
            u.fn.addressfield.validate.call(t, a, r.fields[o][a])
        }
        return u.each(e, function(e, t) {
            var n = s.find(t);
            n.length && !u.fn.addressfield.hasField(r, e) && (console.log("hiding?", n, e),
            u.fn.addressfield.hideField.call(n))
        }),
        u.fn.addressfield.orderFields.call(s, l),
        s.trigger("addressfield:after", {
            config: r,
            fieldMap: e
        }),
        this
    }
    ,
    u.fn.addressfield.binder = function(e, t) {
        var n = this;
        return u(e.country).bind("change", function() {
            console.log(e),
            u.fn.addressfield.apply.call(n, t[this.value], e)
        }),
        n
    }
    ,
    u.fn.addressfield.transform = function(e) {
        var t, n = {};
        for (t in e.options)
            n[e.options[t].iso] = e.options[t];
        return n
    }
    ,
    u.fn.addressfield.onlyKey = function(e) {
        for (var t in e)
            return t
    }
    ,
    u.fn.addressfield.hasField = function(e, t) {
        var n, r;
        for (n in e.fields) {
            if (r = u.fn.addressfield.onlyKey(e.fields[n]),
            e.fields[n][r]instanceof Array)
                return u.fn.addressfield.hasField({
                    fields: e.fields[n][r]
                }, t);
            if (r === t)
                return !0
        }
        return !1
    }
    ,
    u.fn.addressfield.updateLabel = function(e) {
        var t = u(this)
          , n = t.attr("id");
        (u('label[for="' + n + '"]') || t.prev("label")).text(e)
    }
    ,
    u.fn.addressfield.updateEg = function(e) {
        var t = e ? "e.g. " + e : "";
        u(this).attr("placeholder", t)
    }
    ,
    u.fn.addressfield.updateOptions = function(n) {
        var r = u(this)
          , e = r.data("_saved") || r.val();
        r.children("option").remove(),
        u.each(n, function(e) {
            var t = u.fn.addressfield.onlyKey(n[e]);
            r.append(u("<option></option>").attr("value", t).text(n[e][t]))
        }),
        r.val(e).change(),
        r.removeData("_saved")
    }
    ,
    u.fn.addressfield.convertToText = function() {
        var e = u(this)
          , t = u("<input />").attr("type", "text");
        return u.fn.addressfield.copyAttrsTo.call(e, t),
        t.val(e.val()),
        e.replaceWith(t),
        t
    }
    ,
    u.fn.addressfield.convertToSelect = function() {
        var e = u(this)
          , t = u("<select></select>");
        return u.fn.addressfield.copyAttrsTo.call(e, t),
        t.data("_saved", e.val()),
        e.replaceWith(t),
        t
    }
    ,
    u.fn.addressfield.validate = function(e, t) {
        var n = u(this)
          , r = "isValid_" + e
          , i = {}
          , o = "Please check your formatting.";
        "undefined" != typeof u.validator && (o = u.validator.messages.hasOwnProperty(r) ? u.validator.messages[r] : o,
        t.hasOwnProperty("format") ? (u.validator.addMethod(r, function(e) {
            return new RegExp(t.format).test(u.trim(e.toString()))
        }, o),
        i[r] = !0,
        n.rules("add", i)) : u.validator.addMethod(r, function() {
            return !0
        }, o))
    }
    ,
    u.fn.addressfield.hideField = function() {
        u(this).val("").hide(),
        u.fn.addressfield.container.call(this).hide()
    }
    ,
    u.fn.addressfield.showField = function() {
        this.show(),
        u.fn.addressfield.container.call(this).show()
    }
    ,
    u.fn.addressfield.isVisible = function() {
        return u(this).is(":visible")
    }
    ,
    u.fn.addressfield.container = function() {
        var e = u(this)
          , t = e.attr("id")
          , n = u('label[for="' + t + '"]') || e.prev("label");
        return "function" == typeof u.fn.has ? e.parents().has(n).first() : e.parents().find(":has(label):has(#" + t + "):last")
    }
    ,
    u.fn.addressfield.copyAttrsTo = function(e) {
        var t = ["class", "id", "name", "propdescname"]
          , n = u(this);
        u.each(n[0].attributes, function() {
            -1 !== u.inArray(this.name, t) && ("propdescname" === this.name ? e.attr("name", this.value) : e.attr(this.name, this.value))
        })
    }
    ,
    u.fn.addressfield.orderFields = function(e) {
        var t, n, r = e.length;
        for (t = 0; t < r; ++t)
            t in e && (n = u.fn.addressfield.container.call(this.find(e[t])),
            e[t] = {
                element: n.clone(),
                selector: e[t],
                value: u(this).find(e[t]).val()
            },
            n.remove());
        for (console.log(e, u(this)),
        t = 0; t < r; ++t)
            t in e && (n = u(this).append(e[t].element)).find(e[t].selector).val(e[t].value).change()
    }
}(jQuery),
function(d) {
    d.fn.dragsort = function(e) {
        if ("destroy" != e) {
            var l = d.extend({}, d.fn.dragsort.defaults, e)
              , u = []
              , c = null
              , a = null;
            return this.each(function(e, t) {
                d(t).is("table") && 1 == d(t).children().size() && d(t).children().is("tbody") && (t = d(t).children().get(0));
                var n = {
                    draggedItem: null,
                    placeHolderItem: null,
                    pos: null,
                    offset: null,
                    offsetLimit: null,
                    scroll: null,
                    container: t,
                    init: function() {
                        l.tagName = 0 == d(this.container).children().size() ? "li" : d(this.container).children().get(0).tagName.toLowerCase(),
                        "" == l.itemSelector && (l.itemSelector = l.tagName),
                        "" == l.dragSelector && (l.dragSelector = l.tagName),
                        "" == l.placeHolderTemplate && (l.placeHolderTemplate = "<" + l.tagName + ">&nbsp;</" + l.tagName + ">"),
                        d(this.container).attr("data-listidx", e).mousedown(this.grabItem).bind("dragsort-uninit", this.uninit),
                        this.styleDragHandlers(!0)
                    },
                    uninit: function() {
                        var e = u[d(this).attr("data-listidx")];
                        d(e.container).unbind("mousedown", e.grabItem).unbind("dragsort-uninit"),
                        e.styleDragHandlers(!1)
                    },
                    getItems: function() {
                        return d(this.container).children(l.itemSelector)
                    },
                    styleDragHandlers: function(e) {
                        this.getItems().map(function() {
                            return d(this).is(l.dragSelector) ? this : d(this).find(l.dragSelector).get()
                        }).css("cursor", e ? "grab" : "")
                    },
                    grabItem: function(e) {
                        var t = u[d(this).attr("data-listidx")]
                          , n = d(e.target).closest("[data-listidx] > " + l.tagName).get(0)
                          , r = 0 < t.getItems().filter(function() {
                            return this == n
                        }).size();
                        if (!(1 != e.which || d(e.target).is(l.dragSelectorExclude) || 0 < d(e.target).closest(l.dragSelectorExclude).size()) && r) {
                            e.preventDefault();
                            for (var i = e.target; !d(i).is(l.dragSelector); ) {
                                if (i == this)
                                    return;
                                i = i.parentNode
                            }
                            d(i).attr("data-cursor", d(i).css("cursor")),
                            d(i).css("cursor", "move");
                            var o = this
                              , a = function() {
                                t.dragStart.call(o, e),
                                d(t.container).unbind("mousemove", a)
                            };
                            d(t.container).mousemove(a).mouseup(function() {
                                d(t.container).unbind("mousemove", a),
                                d(i).css("cursor", d(i).attr("data-cursor"))
                            })
                        }
                    },
                    dragStart: function(e) {
                        null != c && null != c.draggedItem && c.dropItem(),
                        (c = u[d(this).attr("data-listidx")]).draggedItem = d(e.target).closest("[data-listidx] > " + l.tagName),
                        c.draggedItem.attr("data-origpos", d(this).attr("data-listidx") + "-" + d(c.container).children().index(c.draggedItem));
                        var t = parseInt(c.draggedItem.css("marginTop"))
                          , n = parseInt(c.draggedItem.css("marginLeft"));
                        if (c.offset = c.draggedItem.offset(),
                        c.offset.top = e.pageY - c.offset.top + (isNaN(t) ? 0 : t) - 1,
                        c.offset.left = e.pageX - c.offset.left + (isNaN(n) ? 0 : n) - 1,
                        !l.dragBetween) {
                            var r = 0 == d(c.container).outerHeight() ? Math.max(1, Math.round(.5 + c.getItems().size() * c.draggedItem.outerWidth() / d(c.container).outerWidth())) * c.draggedItem.outerHeight() : d(c.container).outerHeight();
                            c.offsetLimit = d(c.container).offset(),
                            c.offsetLimit.right = c.offsetLimit.left + d(c.container).outerWidth() - c.draggedItem.outerWidth(),
                            c.offsetLimit.bottom = c.offsetLimit.top + r - c.draggedItem.outerHeight()
                        }
                        var i = c.draggedItem.height()
                          , o = c.draggedItem.width();
                        if ("tr" == l.tagName ? (c.draggedItem.children().each(function() {
                            d(this).width(d(this).width())
                        }),
                        c.placeHolderItem = c.draggedItem.clone().attr("data-placeholder", !0),
                        c.draggedItem.after(c.placeHolderItem),
                        c.placeHolderItem.children().each(function() {
                            d(this).css({
                                borderWidth: 0,
                                width: d(this).width() + 1,
                                height: d(this).height() + 1
                            }).html("&nbsp;")
                        })) : (c.draggedItem.after(l.placeHolderTemplate),
                        c.placeHolderItem = c.draggedItem.next().css({
                            height: i,
                            width: o
                        }).attr("data-placeholder", !0)),
                        "td" == l.tagName) {
                            var a = c.draggedItem.closest("table").get(0);
                            d("<table id='" + a.id + "' style='border-width: 0px;' class='dragSortItem " + a.className + "'><tr></tr></table>").appendTo("body").children().append(c.draggedItem)
                        }
                        var s = c.draggedItem.attr("style");
                        c.draggedItem.attr("data-origstyle", s || ""),
                        c.draggedItem.css({
                            position: "absolute",
                            opacity: .8,
                            "z-index": 999,
                            height: i,
                            width: o
                        }),
                        c.scroll = {
                            moveX: 0,
                            moveY: 0,
                            maxX: d(document).width() - d(window).width(),
                            maxY: d(document).height() - d(window).height()
                        },
                        c.scroll.scrollY = window.setInterval(function() {
                            if (l.scrollContainer == window) {
                                var e = d(l.scrollContainer).scrollTop();
                                (0 < c.scroll.moveY && e < c.scroll.maxY || c.scroll.moveY < 0 && 0 < e) && (d(l.scrollContainer).scrollTop(e + c.scroll.moveY),
                                c.draggedItem.css("top", c.draggedItem.offset().top + c.scroll.moveY + 1))
                            } else
                                d(l.scrollContainer).scrollTop(d(l.scrollContainer).scrollTop() + c.scroll.moveY)
                        }, 10),
                        c.scroll.scrollX = window.setInterval(function() {
                            if (l.scrollContainer == window) {
                                var e = d(l.scrollContainer).scrollLeft();
                                (0 < c.scroll.moveX && e < c.scroll.maxX || c.scroll.moveX < 0 && 0 < e) && (d(l.scrollContainer).scrollLeft(e + c.scroll.moveX),
                                c.draggedItem.css("left", c.draggedItem.offset().left + c.scroll.moveX + 1))
                            } else
                                d(l.scrollContainer).scrollLeft(d(l.scrollContainer).scrollLeft() + c.scroll.moveX)
                        }, 10),
                        d(u).each(function(e, t) {
                            t.createDropTargets(),
                            t.buildPositionTable()
                        }),
                        c.setPos(e.pageX, e.pageY),
                        d(document).bind("mousemove", c.swapItems),
                        d(document).bind("mouseup", c.dropItem),
                        l.scrollContainer != window && d(window).bind("wheel", c.wheel)
                    },
                    setPos: function(e, t) {
                        var n = t - this.offset.top
                          , r = e - this.offset.left;
                        l.dragBetween || (n = Math.min(this.offsetLimit.bottom, Math.max(n, this.offsetLimit.top)),
                        r = Math.min(this.offsetLimit.right, Math.max(r, this.offsetLimit.left)));
                        var i = this.draggedItem.offsetParent().not("body").offset();
                        if (null != i && (n -= i.top,
                        r -= i.left),
                        l.scrollContainer == window)
                            t -= d(window).scrollTop(),
                            e -= d(window).scrollLeft(),
                            t = Math.max(0, t - d(window).height() + 5) + Math.min(0, t - 5),
                            e = Math.max(0, e - d(window).width() + 5) + Math.min(0, e - 5);
                        else {
                            var o = d(l.scrollContainer)
                              , a = o.offset();
                            t = Math.max(0, t - o.height() - a.top) + Math.min(0, t - a.top),
                            e = Math.max(0, e - o.width() - a.left) + Math.min(0, e - a.left)
                        }
                        c.scroll.moveX = 0 == e ? 0 : e * l.scrollSpeed / Math.abs(e),
                        c.scroll.moveY = 0 == t ? 0 : t * l.scrollSpeed / Math.abs(t),
                        this.draggedItem.css({
                            top: n,
                            left: r
                        })
                    },
                    wheel: function(e) {
                        if (c && l.scrollContainer != window) {
                            var t = d(l.scrollContainer)
                              , n = t.offset();
                            if ((e = e.originalEvent).clientX > n.left && e.clientX < n.left + t.width() && e.clientY > n.top && e.clientY < n.top + t.height()) {
                                var r = (0 == e.deltaMode ? 1 : 10) * e.deltaY;
                                t.scrollTop(t.scrollTop() + r),
                                e.preventDefault()
                            }
                        }
                    },
                    buildPositionTable: function() {
                        var n = [];
                        this.getItems().not([c.draggedItem[0], c.placeHolderItem[0]]).each(function(e) {
                            var t = d(this).offset();
                            t.right = t.left + d(this).outerWidth(),
                            t.bottom = t.top + d(this).outerHeight(),
                            t.elm = this,
                            n[e] = t
                        }),
                        this.pos = n
                    },
                    dropItem: function() {
                        if (null != c.draggedItem) {
                            var e = c.draggedItem.attr("data-origstyle");
                            if (c.draggedItem.attr("style", e),
                            "" == e && c.draggedItem.removeAttr("style"),
                            c.draggedItem.removeAttr("data-origstyle"),
                            c.styleDragHandlers(!0),
                            c.placeHolderItem.before(c.draggedItem),
                            c.placeHolderItem.remove(),
                            d("[data-droptarget], .dragSortItem").remove(),
                            window.clearInterval(c.scroll.scrollY),
                            window.clearInterval(c.scroll.scrollX),
                            c.draggedItem.attr("data-origpos") != d(u).index(c) + "-" + d(c.container).children().index(c.draggedItem) && 0 == l.dragEnd.apply(c.draggedItem)) {
                                var t = c.draggedItem.attr("data-origpos").split("-")
                                  , n = d(u[t[0]].container).children().not(c.draggedItem).eq(t[1]);
                                0 < n.size() ? n.before(c.draggedItem) : 0 == t[1] ? d(u[t[0]].container).prepend(c.draggedItem) : d(u[t[0]].container).append(c.draggedItem)
                            }
                            return c.draggedItem.removeAttr("data-origpos"),
                            c.draggedItem = null,
                            d(document).unbind("mousemove", c.swapItems),
                            d(document).unbind("mouseup", c.dropItem),
                            l.scrollContainer != window && d(window).unbind("wheel", c.wheel),
                            !1
                        }
                    },
                    swapItems: function(e) {
                        if (null == c.draggedItem)
                            return !1;
                        c.setPos(e.pageX, e.pageY);
                        for (var t = c.findPos(e.pageX, e.pageY), n = c, r = 0; -1 == t && l.dragBetween && r < u.length; r++)
                            t = u[r].findPos(e.pageX, e.pageY),
                            n = u[r];
                        if (-1 == t)
                            return !1;
                        var i = function() {
                            return d(n.container).children().not(n.draggedItem)
                        }
                          , o = i().not(l.itemSelector).each(function() {
                            this.idx = i().index(this)
                        });
                        return null == a || a.top > c.draggedItem.offset().top || a.left > c.draggedItem.offset().left ? d(n.pos[t].elm).before(c.placeHolderItem) : d(n.pos[t].elm).after(c.placeHolderItem),
                        o.each(function() {
                            var e = i().eq(this.idx).get(0);
                            this != e && i().index(this) < this.idx ? d(this).insertAfter(e) : this != e && d(this).insertBefore(e)
                        }),
                        d(u).each(function(e, t) {
                            t.createDropTargets(),
                            t.buildPositionTable()
                        }),
                        a = c.draggedItem.offset(),
                        !1
                    },
                    findPos: function(e, t) {
                        for (var n = 0; n < this.pos.length; n++)
                            if (this.pos[n].left < e && this.pos[n].right > e && this.pos[n].top < t && this.pos[n].bottom > t)
                                return n;
                        return -1
                    },
                    createDropTargets: function() {
                        l.dragBetween && d(u).each(function() {
                            var e = d(this.container).find("[data-placeholder]")
                              , t = d(this.container).find("[data-droptarget]");
                            0 < e.size() && 0 < t.size() ? t.remove() : 0 == e.size() && 0 == t.size() && ("td" == l.tagName ? d(l.placeHolderTemplate).attr("data-droptarget", !0).appendTo(this.container) : d(this.container).append(c.placeHolderItem.removeAttr("data-placeholder").clone().attr("data-droptarget", !0)),
                            c.placeHolderItem.attr("data-placeholder", !0))
                        })
                    }
                };
                n.init(),
                u.push(n)
            }),
            this
        }
        d(this.selector).trigger("dragsort-uninit")
    }
    ,
    d.fn.dragsort.defaults = {
        itemSelector: "",
        dragSelector: "",
        dragSelectorExclude: "input, textarea",
        dragEnd: function() {},
        dragBetween: !1,
        placeHolderTemplate: "",
        scrollContainer: window,
        scrollSpeed: 5
    }
}(jQuery),
function(l) {
    function s(e, t) {
        return "function" == typeof e ? e.call(t) : e
    }
    function t(e) {
        for (; e = e.parentNode; )
            if (e == document)
                return !0;
        return !1
    }
    function u(e, t) {
        this.$element = l(e),
        this.options = t,
        this.enabled = !0,
        this.fixTitle()
    }
    u.prototype = {
        show: function() {
            var e = this.getTitle();
            if (e && this.enabled) {
                var t = this.tip();
                t.find(".tipsy-inner")[this.options.html ? "html" : "text"](e),
                t[0].className = "tipsy",
                t.remove().css({
                    top: 0,
                    left: 0,
                    visibility: "hidden",
                    display: "block"
                }).prependTo(document.body);
                var n, r = l.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                }), i = t[0].offsetWidth, o = t[0].offsetHeight, a = s(this.options.gravity, this.$element[0]);
                switch (a.charAt(0)) {
                case "n":
                    n = {
                        top: r.top + r.height + this.options.offset,
                        left: r.left + r.width / 2 - i / 2
                    };
                    break;
                case "s":
                    n = {
                        top: r.top - o - this.options.offset,
                        left: r.left + r.width / 2 - i / 2
                    };
                    break;
                case "e":
                    n = {
                        top: r.top + r.height / 2 - o / 2,
                        left: r.left - i - this.options.offset
                    };
                    break;
                case "w":
                    n = {
                        top: r.top + r.height / 2 - o / 2,
                        left: r.left + r.width + this.options.offset
                    }
                }
                2 == a.length && ("w" == a.charAt(1) ? n.left = r.left + r.width / 2 - 15 : n.left = r.left + r.width / 2 - i + 15),
                t.css(n).addClass("tipsy-" + a),
                t.find(".tipsy-arrow")[0].className = "tipsy-arrow tipsy-arrow-" + a.charAt(0),
                this.options.className && t.addClass(s(this.options.className, this.$element[0])),
                this.options.fade ? t.stop().css({
                    opacity: 0,
                    display: "block",
                    visibility: "visible"
                }).animate({
                    opacity: this.options.opacity
                }) : t.css({
                    visibility: "visible",
                    opacity: this.options.opacity
                })
            }
        },
        hide: function() {
            this.options.fade ? this.tip().stop().fadeOut(function() {
                l(this).remove()
            }) : this.tip().remove()
        },
        fixTitle: function() {
            var e = this.$element;
            (e.attr("title") || "string" != typeof e.attr("original-title")) && e.attr("original-title", e.attr("title") || "").removeAttr("title")
        },
        getTitle: function() {
            var e, t = this.$element, n = this.options;
            return this.fixTitle(),
            "string" == typeof (n = this.options).title ? e = t.attr("title" == n.title ? "original-title" : n.title) : "function" == typeof n.title && (e = n.title.call(t[0])),
            (e = ("" + e).replace(/(^\s*|\s*$)/, "")) || n.fallback
        },
        tip: function() {
            return this.$tip || (this.$tip = l('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>'),
            this.$tip.data("tipsy-pointee", this.$element[0])),
            this.$tip
        },
        validate: function() {
            this.$element[0].parentNode || (this.hide(),
            this.$element = null,
            this.options = null)
        },
        enable: function() {
            this.enabled = !0
        },
        disable: function() {
            this.enabled = !1
        },
        toggleEnabled: function() {
            this.enabled = !this.enabled
        }
    },
    l.fn.tipsy = function(n) {
        function t(e) {
            var t = l.data(e, "tipsy");
            return t || (t = new u(e,l.fn.tipsy.elementOptions(e, n)),
            l.data(e, "tipsy", t)),
            t
        }
        function e() {
            var e = t(this);
            e.hoverState = "in",
            0 == n.delayIn ? e.show() : (e.fixTitle(),
            setTimeout(function() {
                "in" == e.hoverState && e.show()
            }, n.delayIn))
        }
        function r() {
            var e = t(this);
            e.hoverState = "out",
            0 == n.delayOut ? e.hide() : setTimeout(function() {
                "out" == e.hoverState && e.hide()
            }, n.delayOut)
        }
        if (!0 === n)
            return this.data("tipsy");
        if ("string" == typeof n) {
            var i = this.data("tipsy");
            return i && i[n](),
            this
        }
        if ((n = l.extend({}, l.fn.tipsy.defaults, n)).live || this.each(function() {
            t(this)
        }),
        "manual" != n.trigger) {
            var o = n.live ? "live" : "bind"
              , a = "hover" == n.trigger ? "mouseenter" : "focus"
              , s = "hover" == n.trigger ? "mouseleave" : "blur";
            this[o](a, e)[o](s, r)
        }
        return this
    }
    ,
    l.fn.tipsy.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: !1,
        fallback: "",
        gravity: "n",
        html: !1,
        live: !1,
        offset: 0,
        opacity: .8,
        title: "title",
        trigger: "hover"
    },
    l.fn.tipsy.revalidate = function() {
        l(".tipsy").each(function() {
            var e = l.data(this, "tipsy-pointee");
            e && t(e) || l(this).remove()
        })
    }
    ,
    l.fn.tipsy.elementOptions = function(e, t) {
        return l.metadata ? l.extend({}, t, l(e).metadata()) : t
    }
    ,
    l.fn.tipsy.autoNS = function() {
        return l(this).offset().top > l(document).scrollTop() + l(window).height() / 2 ? "s" : "n"
    }
    ,
    l.fn.tipsy.autoWE = function() {
        return l(this).offset().left > l(document).scrollLeft() + l(window).width() / 2 ? "e" : "w"
    }
    ,
    l.fn.tipsy.autoBounds = function(i, o) {
        return function() {
            var e = {
                ns: o[0],
                ew: 1 < o.length && o[1]
            }
              , t = l(document).scrollTop() + i
              , n = l(document).scrollLeft() + i
              , r = l(this);
            return r.offset().top < t && (e.ns = "n"),
            r.offset().left < n && (e.ew = "w"),
            l(window).width() + l(document).scrollLeft() - r.offset().left < i && (e.ew = "e"),
            l(window).height() + l(document).scrollTop() - r.offset().top < i && (e.ns = "s"),
            e.ns + (e.ew ? e.ew : "")
        }
    }
}(jQuery),
requestId = null,
function(r) {
    var e, i, t, n, o, a;
    i = function() {
        return null != requestId ? requestId : r("#peek").data("request-id")
    }
    ,
    n = function() {
        return r("#peek").length
    }
    ,
    a = function(e) {
        var t, n;
        for (t in e.data)
            for (n in e.data[t])
                r("[data-defer-to=" + t + "-" + n + "]").text(e.data[t][n]);
        return r(document).trigger("peek:render", [i(), e])
    }
    ,
    t = function() {
        return r("#peek .peek-tooltip, #peek .tooltip").each(function() {
            var e, t;
            return t = (e = r(this)).hasClass("rightwards") || e.hasClass("leftwards") ? r.fn.tipsy.autoWE : r.fn.tipsy.autoNS,
            e.tipsy({
                gravity: t
            })
        })
    }
    ,
    o = function(e) {
        var t;
        if (!r(e.target).is(":input"))
            return 96 !== e.which || e.metaKey ? void 0 : (t = r("#peek")).hasClass("disabled") ? (t.removeClass("disabled"),
            document.cookie = "peek=true; path=/") : (t.addClass("disabled"),
            document.cookie = "peek=false; path=/")
    }
    ,
    e = function() {
        return r.ajax("/peek/results", {
            data: {
                request_id: i()
            },
            success: function(e) {
                return a(e)
            },
            error: function() {}
        })
    }
    ,
    r(document).on("keypress", o),
    r(document).on("peek:update", t),
    r(document).on("peek:update", e),
    r(document).on("pjax:end", function(e, t) {
        if (null != t && (requestId = t.getResponseHeader("X-Request-Id")),
        n())
            return r(this).trigger("peek:update")
    }),
    r(document).on("page:change turbolinks:load", function() {
        if (n())
            return r(this).trigger("peek:update")
    }),
    r(function() {
        if (n())
            return r(this).trigger("peek:update")
    })
}(jQuery),
function() {
    var a, s, e, l;
    a = function() {
        function c(e) {
            var t, n;
            for (t in null == e && (e = {}),
            this.el = $("#peek-view-performance-bar .performance-bar"),
            e)
                n = e[t],
                this[t] = n;
            null == this.width && (this.width = this.el.width()),
            null == this.timing && (this.timing = window.performance.timing)
        }
        return c.prototype.appInfo = null,
        c.prototype.width = null,
        c.formatTime = function(e) {
            return 1e3 <= e ? (e / 1e3).toFixed(3) + "s" : e.toFixed(0) + "ms"
        }
        ,
        c.prototype.render = function(e) {
            var t, n;
            return null == e && (e = 0),
            this.el.empty(),
            this.addBar("frontend", "#90d35b", "domLoading", "domInteractive"),
            n = this.timing.responseEnd - this.timing.requestStart,
            e && e <= n ? (t = n - e,
            this.addBar("latency / receiving", "#f1faff", this.timing.requestStart + e, this.timing.requestStart + e + t),
            this.addBar("app", "#90afcf", this.timing.requestStart, this.timing.requestStart + e, this.appInfo)) : this.addBar("backend", "#c1d7ee", "requestStart", "responseEnd"),
            this.addBar("tcp / ssl", "#45688e", "connectStart", "connectEnd"),
            this.addBar("redirect", "#0c365e", "redirectStart", "redirectEnd"),
            this.addBar("dns", "#082541", "domainLookupStart", "domainLookupEnd"),
            this.el
        }
        ,
        c.prototype.isLoaded = function() {
            return this.timing.domInteractive
        }
        ,
        c.prototype.start = function() {
            return this.timing.navigationStart
        }
        ,
        c.prototype.end = function() {
            return this.timing.domInteractive
        }
        ,
        c.prototype.total = function() {
            return this.end() - this.start()
        }
        ,
        c.prototype.addBar = function(e, t, n, r) {
            var i, o, a, s, l, u;
            if ("string" == typeof n && (n = this.timing[n]),
            "string" == typeof r && (r = this.timing[r]),
            null != n && null != r)
                return s = r - n,
                a = n - this.start(),
                o = this.mapH(a),
                u = this.mapH(s),
                l = e + ": " + c.formatTime(s),
                (i = $("<li></li>", {
                    title: l,
                    "class": "peek-tooltip"
                })).css({
                    width: u + "px",
                    left: o + "px",
                    background: t
                }),
                i.tipsy({
                    gravity: $.fn.tipsy.autoNS
                }),
                this.el.append(i)
        }
        ,
        c.prototype.mapH = function(e) {
            return e * (this.width / this.total())
        }
        ,
        c
    }(),
    e = function() {
        var e, t, n, r;
        return t = $("#peek-server_response_time"),
        r = Math.round(1e3 * t.data("time")),
        (e = new a).render(r),
        (n = $("<span>", {
            "class": "peek-tooltip",
            title: "Total navigation time for this page."
        }).text(a.formatTime(e.total()))).tipsy({
            gravity: $.fn.tipsy.autoNS
        }),
        l(n)
    }
    ,
    l = function(e) {
        return $("#serverstats").html(e)
    }
    ,
    s = null,
    $(document).on("pjax:start page:fetch turbolinks:request-start", function(e) {
        return s = e.timeStamp
    }),
    $(document).on("pjax:end page:load turbolinks:load", function(e, t) {
        var r, i, o;
        if (null != s)
            return r = e.timeStamp,
            o = r - s,
            i = t ? parseInt(t.getResponseHeader("X-Runtime")) : 0,
            setTimeout(function() {
                var e, t, n;
                return e = (new Date).getTime(),
                new a({
                    timing: {
                        requestStart: s,
                        responseEnd: r,
                        domLoading: r,
                        domInteractive: e
                    },
                    isLoaded: function() {
                        return !0
                    },
                    start: function() {
                        return s
                    },
                    end: function() {
                        return e
                    }
                }).render(i),
                n = null != $.fn.pjax ? "PJAX" : "Turbolinks",
                (t = $("<span>", {
                    "class": "peek-tooltip",
                    title: n + " navigation time"
                }).text(a.formatTime(o))).tipsy({
                    gravity: $.fn.tipsy.autoNS
                }),
                l(t),
                s = null
            }, 0)
    }),
    $(function() {
        return window.performance ? e() : $("#peek-view-performance-bar").remove()
    })
}
.call(this);
