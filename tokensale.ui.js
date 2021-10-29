var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty =
    $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (a, b, e) {
              if (a == Array.prototype || a == Object.prototype) return a;
              a[b] = e.value;
              return a;
          };
$jscomp.getGlobal = function (a) {
    a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
    for (var b = 0; b < a.length; ++b) {
        var e = a[b];
        if (e && e.Math == Math) return e;
    }
    throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (a, b) {
    var e = $jscomp.propertyToPolyfillSymbol[b];
    if (null == e) return a[b];
    e = a[e];
    return void 0 !== e ? e : a[b];
};
$jscomp.polyfill = function (a, b, e, g) {
    b && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(a, b, e, g) : $jscomp.polyfillUnisolated(a, b, e, g));
};
$jscomp.polyfillUnisolated = function (a, b, e, g) {
    e = $jscomp.global;
    a = a.split(".");
    for (g = 0; g < a.length - 1; g++) {
        var f = a[g];
        if (!(f in e)) return;
        e = e[f];
    }
    a = a[a.length - 1];
    g = e[a];
    b = b(g);
    b != g && null != b && $jscomp.defineProperty(e, a, { configurable: !0, writable: !0, value: b });
};
$jscomp.polyfillIsolated = function (a, b, e, g) {
    var f = a.split(".");
    a = 1 === f.length;
    g = f[0];
    g = !a && g in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
    for (var k = 0; k < f.length - 1; k++) {
        var c = f[k];
        if (!(c in g)) return;
        g = g[c];
    }
    f = f[f.length - 1];
    e = $jscomp.IS_SYMBOL_NATIVE && "es6" === e ? g[f] : null;
    b = b(e);
    null != b &&
        (a
            ? $jscomp.defineProperty($jscomp.polyfills, f, { configurable: !0, writable: !0, value: b })
            : b !== e &&
              (void 0 === $jscomp.propertyToPolyfillSymbol[f] && ((e = (1e9 * Math.random()) >>> 0), ($jscomp.propertyToPolyfillSymbol[f] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(f) : $jscomp.POLYFILL_PREFIX + e + "$" + f)),
              $jscomp.defineProperty(g, $jscomp.propertyToPolyfillSymbol[f], { configurable: !0, writable: !0, value: b })));
};
$jscomp.underscoreProtoCanBeSet = function () {
    var a = { a: !0 },
        b = {};
    try {
        return (b.__proto__ = a), b.a;
    } catch (e) {}
    return !1;
};
$jscomp.setPrototypeOf =
    $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf
        ? Object.setPrototypeOf
        : $jscomp.underscoreProtoCanBeSet()
        ? function (a, b) {
              a.__proto__ = b;
              if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
              return a;
          }
        : null;
$jscomp.arrayIteratorImpl = function (a) {
    var b = 0;
    return function () {
        return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
    };
};
$jscomp.arrayIterator = function (a) {
    return { next: $jscomp.arrayIteratorImpl(a) };
};
$jscomp.makeIterator = function (a) {
    var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return b ? b.call(a) : $jscomp.arrayIterator(a);
};
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function (a) {
    if (!(a instanceof Object)) throw new TypeError("Iterator result " + a + " is not an object");
};
$jscomp.generator.Context = function () {
    this.isRunning_ = !1;
    this.yieldAllIterator_ = null;
    this.yieldResult = void 0;
    this.nextAddress = 1;
    this.finallyAddress_ = this.catchAddress_ = 0;
    this.finallyContexts_ = this.abruptCompletion_ = null;
};
$jscomp.generator.Context.prototype.start_ = function () {
    if (this.isRunning_) throw new TypeError("Generator is already running");
    this.isRunning_ = !0;
};
$jscomp.generator.Context.prototype.stop_ = function () {
    this.isRunning_ = !1;
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function () {
    this.nextAddress = this.catchAddress_ || this.finallyAddress_;
};
$jscomp.generator.Context.prototype.next_ = function (a) {
    this.yieldResult = a;
};
$jscomp.generator.Context.prototype.throw_ = function (a) {
    this.abruptCompletion_ = { exception: a, isException: !0 };
    this.jumpToErrorHandler_();
};
$jscomp.generator.Context.prototype["return"] = function (a) {
    this.abruptCompletion_ = { return: a };
    this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function (a) {
    this.abruptCompletion_ = { jumpTo: a };
    this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.yield = function (a, b) {
    this.nextAddress = b;
    return { value: a };
};
$jscomp.generator.Context.prototype.yieldAll = function (a, b) {
    var e = $jscomp.makeIterator(a),
        g = e.next();
    $jscomp.generator.ensureIteratorResultIsObject_(g);
    if (g.done) (this.yieldResult = g.value), (this.nextAddress = b);
    else return (this.yieldAllIterator_ = e), this.yield(g.value, b);
};
$jscomp.generator.Context.prototype.jumpTo = function (a) {
    this.nextAddress = a;
};
$jscomp.generator.Context.prototype.jumpToEnd = function () {
    this.nextAddress = 0;
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function (a, b) {
    this.catchAddress_ = a;
    void 0 != b && (this.finallyAddress_ = b);
};
$jscomp.generator.Context.prototype.setFinallyBlock = function (a) {
    this.catchAddress_ = 0;
    this.finallyAddress_ = a || 0;
};
$jscomp.generator.Context.prototype.leaveTryBlock = function (a, b) {
    this.nextAddress = a;
    this.catchAddress_ = b || 0;
};
$jscomp.generator.Context.prototype.enterCatchBlock = function (a) {
    this.catchAddress_ = a || 0;
    a = this.abruptCompletion_.exception;
    this.abruptCompletion_ = null;
    return a;
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function (a, b, e) {
    e ? (this.finallyContexts_[e] = this.abruptCompletion_) : (this.finallyContexts_ = [this.abruptCompletion_]);
    this.catchAddress_ = a || 0;
    this.finallyAddress_ = b || 0;
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function (a, b) {
    var e = this.finallyContexts_.splice(b || 0)[0];
    if ((e = this.abruptCompletion_ = this.abruptCompletion_ || e)) {
        if (e.isException) return this.jumpToErrorHandler_();
        void 0 != e.jumpTo && this.finallyAddress_ < e.jumpTo ? ((this.nextAddress = e.jumpTo), (this.abruptCompletion_ = null)) : (this.nextAddress = this.finallyAddress_);
    } else this.nextAddress = a;
};
$jscomp.generator.Context.prototype.forIn = function (a) {
    return new $jscomp.generator.Context.PropertyIterator(a);
};
$jscomp.generator.Context.PropertyIterator = function (a) {
    this.object_ = a;
    this.properties_ = [];
    for (var b in a) this.properties_.push(b);
    this.properties_.reverse();
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function () {
    for (; 0 < this.properties_.length; ) {
        var a = this.properties_.pop();
        if (a in this.object_) return a;
    }
    return null;
};
$jscomp.generator.Engine_ = function (a) {
    this.context_ = new $jscomp.generator.Context();
    this.program_ = a;
};
$jscomp.generator.Engine_.prototype.next_ = function (a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
    this.context_.next_(a);
    return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.return_ = function (a) {
    this.context_.start_();
    var b = this.context_.yieldAllIterator_;
    if (b)
        return this.yieldAllStep_(
            "return" in b
                ? b["return"]
                : function (e) {
                      return { value: e, done: !0 };
                  },
            a,
            this.context_["return"]
        );
    this.context_["return"](a);
    return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.throw_ = function (a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
    this.context_.throw_(a);
    return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function (a, b, e) {
    try {
        var g = a.call(this.context_.yieldAllIterator_, b);
        $jscomp.generator.ensureIteratorResultIsObject_(g);
        if (!g.done) return this.context_.stop_(), g;
        var f = g.value;
    } catch (k) {
        return (this.context_.yieldAllIterator_ = null), this.context_.throw_(k), this.nextStep_();
    }
    this.context_.yieldAllIterator_ = null;
    e.call(this.context_, f);
    return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.nextStep_ = function () {
    for (; this.context_.nextAddress; )
        try {
            var a = this.program_(this.context_);
            if (a) return this.context_.stop_(), { value: a.value, done: !1 };
        } catch (b) {
            (this.context_.yieldResult = void 0), this.context_.throw_(b);
        }
    this.context_.stop_();
    if (this.context_.abruptCompletion_) {
        a = this.context_.abruptCompletion_;
        this.context_.abruptCompletion_ = null;
        if (a.isException) throw a.exception;
        return { value: a["return"], done: !0 };
    }
    return { value: void 0, done: !0 };
};
$jscomp.generator.Generator_ = function (a) {
    this.next = function (b) {
        return a.next_(b);
    };
    this["throw"] = function (b) {
        return a.throw_(b);
    };
    this["return"] = function (b) {
        return a.return_(b);
    };
    this[Symbol.iterator] = function () {
        return this;
    };
};
$jscomp.generator.createGenerator = function (a, b) {
    var e = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
    $jscomp.setPrototypeOf && a.prototype && $jscomp.setPrototypeOf(e, a.prototype);
    return e;
};
$jscomp.asyncExecutePromiseGenerator = function (a) {
    function b(g) {
        return a.next(g);
    }
    function e(g) {
        return a["throw"](g);
    }
    return new Promise(function (g, f) {
        function k(c) {
            c.done ? g(c.value) : Promise.resolve(c.value).then(b, e).then(k, f);
        }
        k(a.next());
    });
};
$jscomp.asyncExecutePromiseGeneratorFunction = function (a) {
    return $jscomp.asyncExecutePromiseGenerator(a());
};
$jscomp.asyncExecutePromiseGeneratorProgram = function (a) {
    return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)));
};
$jscomp.initSymbol = function () {};
$jscomp.polyfill(
    "Symbol",
    function (a) {
        if (a) return a;
        var b = function (k, c) {
            this.$jscomp$symbol$id_ = k;
            $jscomp.defineProperty(this, "description", { configurable: !0, writable: !0, value: c });
        };
        b.prototype.toString = function () {
            return this.$jscomp$symbol$id_;
        };
        var e = "jscomp_symbol_" + ((1e9 * Math.random()) >>> 0) + "_",
            g = 0,
            f = function (k) {
                if (this instanceof f) throw new TypeError("Symbol is not a constructor");
                return new b(e + (k || "") + "_" + g++, k);
            };
        return f;
    },
    "es6",
    "es3"
);
$jscomp.polyfill(
    "Symbol.iterator",
    function (a) {
        if (a) return a;
        a = Symbol("Symbol.iterator");
        for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), e = 0; e < b.length; e++) {
            var g = $jscomp.global[b[e]];
            "function" === typeof g &&
                "function" != typeof g.prototype[a] &&
                $jscomp.defineProperty(g.prototype, a, {
                    configurable: !0,
                    writable: !0,
                    value: function () {
                        return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
                    },
                });
        }
        return a;
    },
    "es6",
    "es3"
);
$jscomp.iteratorPrototype = function (a) {
    a = { next: a };
    a[Symbol.iterator] = function () {
        return this;
    };
    return a;
};
$jscomp.polyfill(
    "Promise",
    function (a) {
        function b() {
            this.batch_ = null;
        }
        function e(c) {
            return c instanceof f
                ? c
                : new f(function (d, h) {
                      d(c);
                  });
        }
        if (
            a &&
            (!($jscomp.FORCE_POLYFILL_PROMISE || ($jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && "undefined" === typeof $jscomp.global.PromiseRejectionEvent)) ||
                !$jscomp.global.Promise ||
                -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))
        )
            return a;
        b.prototype.asyncExecute = function (c) {
            if (null == this.batch_) {
                this.batch_ = [];
                var d = this;
                this.asyncExecuteFunction(function () {
                    d.executeBatch_();
                });
            }
            this.batch_.push(c);
        };
        var g = $jscomp.global.setTimeout;
        b.prototype.asyncExecuteFunction = function (c) {
            g(c, 0);
        };
        b.prototype.executeBatch_ = function () {
            for (; this.batch_ && this.batch_.length; ) {
                var c = this.batch_;
                this.batch_ = [];
                for (var d = 0; d < c.length; ++d) {
                    var h = c[d];
                    c[d] = null;
                    try {
                        h();
                    } catch (l) {
                        this.asyncThrow_(l);
                    }
                }
            }
            this.batch_ = null;
        };
        b.prototype.asyncThrow_ = function (c) {
            this.asyncExecuteFunction(function () {
                throw c;
            });
        };
        var f = function (c) {
            this.state_ = 0;
            this.result_ = void 0;
            this.onSettledCallbacks_ = [];
            this.isRejectionHandled_ = !1;
            var d = this.createResolveAndReject_();
            try {
                c(d.resolve, d.reject);
            } catch (h) {
                d.reject(h);
            }
        };
        f.prototype.createResolveAndReject_ = function () {
            function c(l) {
                return function (m) {
                    h || ((h = !0), l.call(d, m));
                };
            }
            var d = this,
                h = !1;
            return { resolve: c(this.resolveTo_), reject: c(this.reject_) };
        };
        f.prototype.resolveTo_ = function (c) {
            if (c === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
            else if (c instanceof f) this.settleSameAsPromise_(c);
            else {
                a: switch (typeof c) {
                    case "object":
                        var d = null != c;
                        break a;
                    case "function":
                        d = !0;
                        break a;
                    default:
                        d = !1;
                }
                d ? this.resolveToNonPromiseObj_(c) : this.fulfill_(c);
            }
        };
        f.prototype.resolveToNonPromiseObj_ = function (c) {
            var d = void 0;
            try {
                d = c.then;
            } catch (h) {
                this.reject_(h);
                return;
            }
            "function" == typeof d ? this.settleSameAsThenable_(d, c) : this.fulfill_(c);
        };
        f.prototype.reject_ = function (c) {
            this.settle_(2, c);
        };
        f.prototype.fulfill_ = function (c) {
            this.settle_(1, c);
        };
        f.prototype.settle_ = function (c, d) {
            if (0 != this.state_) throw Error("Cannot settle(" + c + ", " + d + "): Promise already settled in state" + this.state_);
            this.state_ = c;
            this.result_ = d;
            2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
            this.executeOnSettledCallbacks_();
        };
        f.prototype.scheduleUnhandledRejectionCheck_ = function () {
            var c = this;
            g(function () {
                if (c.notifyUnhandledRejection_()) {
                    var d = $jscomp.global.console;
                    "undefined" !== typeof d && d.error(c.result_);
                }
            }, 1);
        };
        f.prototype.notifyUnhandledRejection_ = function () {
            if (this.isRejectionHandled_) return !1;
            var c = $jscomp.global.CustomEvent,
                d = $jscomp.global.Event,
                h = $jscomp.global.dispatchEvent;
            if ("undefined" === typeof h) return !0;
            "function" === typeof c
                ? (c = new c("unhandledrejection", { cancelable: !0 }))
                : "function" === typeof d
                ? (c = new d("unhandledrejection", { cancelable: !0 }))
                : ((c = $jscomp.global.document.createEvent("CustomEvent")), c.initCustomEvent("unhandledrejection", !1, !0, c));
            c.promise = this;
            c.reason = this.result_;
            return h(c);
        };
        f.prototype.executeOnSettledCallbacks_ = function () {
            if (null != this.onSettledCallbacks_) {
                for (var c = 0; c < this.onSettledCallbacks_.length; ++c) k.asyncExecute(this.onSettledCallbacks_[c]);
                this.onSettledCallbacks_ = null;
            }
        };
        var k = new b();
        f.prototype.settleSameAsPromise_ = function (c) {
            var d = this.createResolveAndReject_();
            c.callWhenSettled_(d.resolve, d.reject);
        };
        f.prototype.settleSameAsThenable_ = function (c, d) {
            var h = this.createResolveAndReject_();
            try {
                c.call(d, h.resolve, h.reject);
            } catch (l) {
                h.reject(l);
            }
        };
        f.prototype.then = function (c, d) {
            function h(n, p) {
                return "function" == typeof n
                    ? function (q) {
                          try {
                              l(n(q));
                          } catch (r) {
                              m(r);
                          }
                      }
                    : p;
            }
            var l,
                m,
                t = new f(function (n, p) {
                    l = n;
                    m = p;
                });
            this.callWhenSettled_(h(c, l), h(d, m));
            return t;
        };
        f.prototype["catch"] = function (c) {
            return this.then(void 0, c);
        };
        f.prototype.callWhenSettled_ = function (c, d) {
            function h() {
                switch (l.state_) {
                    case 1:
                        c(l.result_);
                        break;
                    case 2:
                        d(l.result_);
                        break;
                    default:
                        throw Error("Unexpected state: " + l.state_);
                }
            }
            var l = this;
            null == this.onSettledCallbacks_ ? k.asyncExecute(h) : this.onSettledCallbacks_.push(h);
            this.isRejectionHandled_ = !0;
        };
        f.resolve = e;
        f.reject = function (c) {
            return new f(function (d, h) {
                h(c);
            });
        };
        f.race = function (c) {
            return new f(function (d, h) {
                for (var l = $jscomp.makeIterator(c), m = l.next(); !m.done; m = l.next()) e(m.value).callWhenSettled_(d, h);
            });
        };
        f.all = function (c) {
            var d = $jscomp.makeIterator(c),
                h = d.next();
            return h.done
                ? e([])
                : new f(function (l, m) {
                      function t(q) {
                          return function (r) {
                              n[q] = r;
                              p--;
                              0 == p && l(n);
                          };
                      }
                      var n = [],
                          p = 0;
                      do n.push(void 0), p++, e(h.value).callWhenSettled_(t(n.length - 1), m), (h = d.next());
                      while (!h.done);
                  });
        };
        return f;
    },
    "es6",
    "es3"
);
var trackerMain = "https://bscscan.com/",
    trackerTest = "https://testnet.bscscan.com/",
    tokentracker,
    mainnet = 56,
    mainnetAlt = 56,
    testnet = 97,
    mainnetname = "Binance Smart Chain (BSC) Mainnet",
    testnetname = "Binance Smart Chain (BSC) Testnet",
    wrongnet = '<span class="err">Please use Binance Smart Chain (BSC) Mainnet</span>',
    tokenDecimals,
    tokenSymbol,
    price,
    qty = 0,
    buyAmount = 0,
    saleOn,
    available,
    contractSale,
    contractSaleSign,
    contractToken,
    abiSale = [
        {
            inputs: [
                { internalType: "address", name: "_tokenAddress", type: "address" },
                { internalType: "uint256", name: "_saleQuantity", type: "uint256" },
                { internalType: "uint256", name: "_salePrice", type: "uint256" },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
        },
        {
            anonymous: !1,
            inputs: [
                { indexed: !1, internalType: "address", name: "buyer", type: "address" },
                { indexed: !1, internalType: "uint256", name: "quantity", type: "uint256" },
            ],
            name: "TokenSold",
            type: "event",
        },
        { inputs: [], name: "buyToken", outputs: [], stateMutability: "payable", type: "function" },
        { inputs: [], name: "owner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "saleOn", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "saleQuantity", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "tokenAddress", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "tokenPrice", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "totalRaised", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "totalSold", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "unsoldQuantity", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }], name: "withdraw", outputs: [], stateMutability: "nonpayable", type: "function" },
        { inputs: [], name: "withdrawAll", outputs: [], stateMutability: "nonpayable", type: "function" },
        { stateMutability: "payable", type: "receive" },
    ],
    abiToken = [
        {
            inputs: [
                { internalType: "string", name: "_name", type: "string" },
                { internalType: "string", name: "_symbol", type: "string" },
                { internalType: "uint256", name: "_dec", type: "uint256" },
                { internalType: "uint256", name: "_supply", type: "uint256" },
                { internalType: "uint256", name: "_tax1", type: "uint256" },
                { internalType: "address", name: "_address1", type: "address" },
                { internalType: "uint256", name: "_tax2", type: "uint256" },
                { internalType: "address", name: "_address2", type: "address" },
                { internalType: "uint256", name: "_deflation", type: "uint256" },
                { internalType: "uint256", name: "_minSupply", type: "uint256" },
                { internalType: "address", name: "_owner", type: "address" },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
        },
        {
            anonymous: !1,
            inputs: [
                { indexed: !0, internalType: "address", name: "owner", type: "address" },
                { indexed: !0, internalType: "address", name: "spender", type: "address" },
                { indexed: !1, internalType: "uint256", name: "value", type: "uint256" },
            ],
            name: "Approval",
            type: "event",
        },
        {
            anonymous: !1,
            inputs: [
                { indexed: !0, internalType: "address", name: "from", type: "address" },
                { indexed: !0, internalType: "address", name: "to", type: "address" },
                { indexed: !1, internalType: "uint256", name: "value", type: "uint256" },
            ],
            name: "Transfer",
            type: "event",
        },
        { inputs: [], name: "addressTax1", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "addressTax2", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
        {
            inputs: [
                { internalType: "address", name: "owner", type: "address" },
                { internalType: "address", name: "spender", type: "address" },
            ],
            name: "allowance",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "spender", type: "address" },
                { internalType: "uint256", name: "value", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
        },
        { inputs: [{ internalType: "address", name: "owner", type: "address" }], name: "balanceOf", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "burnt", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "decimals", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "deflation", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "initialSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "minSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "name", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "symbol", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "tax1", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "tax2", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "totalSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "totalTax1", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        { inputs: [], name: "totalTax2", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
        {
            inputs: [
                { internalType: "address", name: "to", type: "address" },
                { internalType: "uint256", name: "value", type: "uint256" },
            ],
            name: "transfer",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                { internalType: "address", name: "from", type: "address" },
                { internalType: "address", name: "to", type: "address" },
                { internalType: "uint256", name: "value", type: "uint256" },
            ],
            name: "transferFrom",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
        },
    ],
    network,
    curnet,
    tracker,
    myAddress,
    signer,
    provider;
$(function () {
    $("#buyBtn").prop("disabled", !0);
    getQR();
    connect();
});
function connect() {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (a) {
        provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.on("network", function (b, e) {
            e && getNetwork();
        });
        ethereum.on("accountsChanged", function (b) {
            getNetwork();
        });
        ethereum.on("connect", function (b) {
            getNetwork();
        });
        getNetwork();
        a.jumpToEnd();
    });
}
function getNetwork() {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (a) {
        if (1 == a.nextAddress) return a.yield(provider.getNetwork(), 2);
        network = a.yieldResult;
        curnet = network.chainId;
        curnet == mainnet || curnet == mainnetAlt
            ? ($("#curnet").html(mainnetname), (tracker = trackerMain), getAddress(), init())
            : curnet == testnet && 1 == test
            ? ($("#curnet").html(testnetname), (tracker = trackerTest), getAddress(), init())
            : ($("#curnet").html(wrongnet), $("#myAddr").html(""), $("#buyBtn").prop("disabled", !0));
        a.jumpToEnd();
    });
}
function getAddress() {
    var a;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (b) {
        switch (b.nextAddress) {
            case 1:
                return (signer = provider.getSigner()), b.setCatchFinallyBlocks(2), b.yield(signer.getAddress(), 4);
            case 4:
                myAddress = b.yieldResult;
                b.leaveTryBlock(3);
                break;
            case 2:
                (a = b.enterCatchBlock()), console.log(a), !myAddress && window.ethereum && ethereum.request({ method: "eth_requestAccounts" }).then(getNetwork);
            case 3:
                $("#myAddr").html(myAddress), myAddress ? ($("#buyBtn").prop("disabled", !1), $("#errors").html("")) : ($("#buyBtn").prop("disabled", !0), $("#errors").html("Please connect to your wallet!")), b.jumpToEnd();
        }
    });
}
function init() {
    var a, b, e, g, f, k, c;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
        switch (d.nextAddress) {
            case 1:
                return (
                    $("#saleAddress").html(contractAddressSale),
                    $("#saleAddress").attr("href", tracker + "address/" + contractAddressSale),
                    (contractSale = new ethers.Contract(contractAddressSale, abiSale, provider)),
                    (contractSaleSign = contractSale.connect(signer)),
                    (contractToken = new ethers.Contract(contractAddressToken, abiToken, provider)),
                    $("#tokenAddress").html(contractAddressToken),
                    $("#tokenAddress").attr("href", tracker + "token/" + contractAddressToken),
                    d.yield(contractToken.name(), 2)
                );
            case 2:
                return (a = d.yieldResult), $("#tokenName").html(a), d.yield(contractToken.symbol(), 3);
            case 3:
                return (tokenSymbol = d.yieldResult), $("#tokenSymbol").html(tokenSymbol), d.yield(contractToken.decimals(), 4);
            case 4:
                return (tokenDecimals = d.yieldResult), $("#tokenDecimals").html(Number(tokenDecimals)), d.yield(contractToken.totalSupply(), 5);
            case 5:
                return (b = d.yieldResult), $("#tokenSupply").html(Number(ethers.utils.formatUnits(b, tokenDecimals)).toFixed(0)), d.yield(contractToken.balanceOf(myAddress), 6);
            case 6:
                return (e = d.yieldResult), $("#myTokens").html(Number(ethers.utils.formatUnits(e, tokenDecimals))), d.yield(contractSale.saleQuantity(), 7);
            case 7:
                return (g = d.yieldResult), $("#quantity").html(Number(ethers.utils.formatUnits(g, tokenDecimals))), d.yield(contractSale.totalSold(), 8);
            case 8:
                return (f = d.yieldResult), $("#sold").html(Number(ethers.utils.formatUnits(f, tokenDecimals))), $("#progress").attr("max", g), $("#progress").attr("value", f), d.yield(contractSale.unsoldQuantity(), 9);
            case 9:
                return (k = d.yieldResult), (available = ethers.utils.formatUnits(k, tokenDecimals)), $("#unsold").html(Number(available)), d.yield(contractSale.tokenPrice(), 10);
            case 10:
                return (price = d.yieldResult), $("#price").html(ethers.utils.formatEther(price)), d.yield(contractSale.totalRaised(), 11);
            case 11:
                return (c = d.yieldResult), $("#raised").html(ethers.utils.formatEther(c)), d.yield(contractSale.saleOn(), 12);
            case 12:
                (saleOn = d.yieldResult) ? $("#status").html('<span style="color: green">ON</span>') : 0 == saleOn && ($("#status").html('<span style="color: red">OFF</span>'), $("#buyBtn").prop("disabled", !0)),
                    calcRatio(),
                    calcAmount(),
                    d.jumpToEnd();
        }
    });
}
$("#buyQty").on("keyup input", function () {
    calcAmount();
});
function calcRatio() {
    var a = 1 / Number(ethers.utils.formatEther(price));
    $("#ratio").html(a);
}
function calcAmount() {
    qty = $("#buyQty").val();
    buyAmount = Number(qty) * Number(ethers.utils.formatEther(price));
    $("#buyAmount").html(buyAmount);
}
$("#copyaddress").on("click", function () {
    copyToClipboard("#saleAddress");
});
function copyToClipboard(a) {
    var b = $("<textarea>");
    $("body").append(b);
    b.val($(a).val()).select();
    document.execCommand("copy");
    b.remove();
}
function getQR() {
    var a = encodeURIComponent(contractAddressSale);
    $("#refqr").html('<img style="max-width: 80%" src="https://dappbuilder.org/php/qr.php?data=' + a + '">');
    $("#refd").attr("href", "https://dappbuilder.org/php/qr.php?data=" + a);
}
$("#buyBtn").click(function () {
    var a;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (b) {
        if (1 == b.nextAddress) {
            calcAmount();
            if (!(0 < qty && 0 < buyAmount)) return b.jumpTo(0);
            a = ethers.utils.parseEther(String(Number(buyAmount).toFixed(18)));
            return b.yield(contractSaleSign.buyToken({ value: a }), 3);
        }
        if (4 != b.nextAddress) return (tx = b.yieldResult), b.yield(tx.wait(), 4);
        init();
        b.jumpToEnd();
    });
});
$("#addToken").click(function () {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (a) {
        ethereum.request({ method: "wallet_watchAsset", params: { type: "ERC20", options: { address: String(contractAddressToken), symbol: String(tokenSymbol), decimals: Number(tokenDecimals) } } });
        a.jumpToEnd();
    });
});
$("#connect").on("click", function () {
    var a;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (b) {
        if (1 == b.nextAddress) {
            if (!window.ethereum) return $("#nometamask").fadeIn(1e3).fadeOut(1e3), b.jumpTo(0);
            b.setCatchFinallyBlocks(3);
            return b.yield(ethereum.request({ method: "eth_requestAccounts" }), 5);
        }
        if (3 != b.nextAddress) return b.leaveTryBlock(0);
        a = b.enterCatchBlock();
        console.error(a);
        b.jumpToEnd();
    });
});
