"use strict";
var provider_1 = require("./provider");
function noSuchProvider(name) {
    throw new Error("Unable to locate provider '" + name + "'. Make sure you register this provide before attempting to use it");
}
function construct(constructor, args) {
    if (args === void 0) { args = []; }
    function F() {
        constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return new F();
}
var Needle = (function () {
    function Needle() {
        this.providerMap = {};
        this.onDefinedHandlers = {};
        this.onResolveHandlers = {};
        this.injectionMapRegistry = new Map();
    }
    Needle.prototype.inject = function (injectionKey) {
        var _this = this;
        return function (prototype, key) {
            var type = prototype.constructor;
            var injectionMap = _this.getInjectionMap(type);
            injectionMap[key] = injectionKey;
        };
    };
    Needle.prototype.provide = function (providerName, impl) {
        this.resolve(this.define(providerName), impl);
    };
    Needle.prototype.provideAsync = function (providerName, depsOrImpl, implementationPromise) {
        var _this = this;
        var deps = null;
        if (implementationPromise) {
            deps = depsOrImpl;
        }
        else {
            deps = [];
            implementationPromise = depsOrImpl;
        }
        return new Promise(function (resolve) {
            var onResolved = function () {
                var provider = _this.providerMap[providerName];
                var resolvedDependencies = provider.dependencies.map(function (depName) {
                    return _this.providerMap[depName].get();
                });
                var impl = implementationPromise.apply(null, resolvedDependencies);
                if (impl && typeof impl.then === 'function') {
                    impl.then(function (result) {
                        resolve(_this.resolve(provider, result));
                    });
                }
                else {
                    resolve(_this.resolve(provider, impl));
                }
            };
            var onDefined = function () {
                if (_this.checkCycles(providerName)) {
                    throw new Error('Cycles found!');
                }
                _this.onAllResolved(deps, onResolved);
            };
            _this.define(providerName, deps);
            _this.onAllDefined(deps, onDefined);
        });
    };
    Needle.prototype.mock = function (providerName, mockName, impl) {
        var provider = this.providerMap[providerName] || new provider_1.default(providerName);
        provider.addMock(mockName, [], impl);
        this.providerMap[providerName] = provider;
    };
    // public mockAsync(providerName : string, mockName : string, dependencies : Array<string>, impl : any) : void {
    //
    // }
    Needle.prototype.useMock = function (providerName, mockName) {
        var provider = this.providerMap[providerName];
        if (!provider)
            return noSuchProvider(providerName);
        provider.useMock(mockName);
        if (this.checkCycles(providerName)) {
            throw new Error("Cycle");
        }
        var definitionCallbacks = this.onDefinedHandlers[providerName];
        this.onDefinedHandlers[providerName] = null;
        if (!definitionCallbacks)
            return;
        for (var i = 0; i < definitionCallbacks.length; i++) {
            definitionCallbacks[i]();
        }
    };
    Needle.prototype.useActual = function (providerName) {
        var provider = this.providerMap[providerName];
        if (!provider)
            return noSuchProvider(providerName);
        provider.useActual();
    };
    Needle.prototype.get = function (providerName, variantName) {
        var provider = this.providerMap[providerName];
        if (!provider)
            return noSuchProvider(providerName);
        return provider.get(variantName);
    };
    //todo figure out the generics here for type checking, tuples dont seem to work as expected
    Needle.prototype.create = function (type, options) {
        return this.injectDependencies(construct(type, []), options);
    };
    Needle.prototype.injectDependencies = function (instance, options) {
        function injectDependencies(dependencies) {
            var keys = Object.keys(dependencies);
            for (var i = 0; i < keys.length; i++) {
                instance[keys[i]] = dependencies[keys[i]];
            }
            return instance;
        }
        return this.getInjectedDependencies(instance.constructor, options).then(injectDependencies);
    };
    Needle.prototype.checkCycles = function (providerName, stack) {
        if (stack === void 0) { stack = []; }
        var provider = this.providerMap[providerName];
        if (stack.indexOf(providerName) !== -1) {
            throw new Error("Found cycle in " + stack.join(' -> ') + ' -> ' + providerName);
        }
        stack.push(providerName);
        for (var i = 0; i < provider.dependencies.length; i++) {
            this.checkCycles(provider.dependencies[i], stack);
        }
        stack.pop();
    };
    Needle.prototype.define = function (providerName, dependencies) {
        if (dependencies === void 0) { dependencies = []; }
        var provider = this.providerMap[providerName] || new provider_1.default(providerName, dependencies);
        var definitionCallbacks = this.onDefinedHandlers[providerName];
        this.providerMap[providerName] = provider;
        if (!definitionCallbacks)
            return provider;
        for (var i = 0; i < definitionCallbacks.length; i++) {
            definitionCallbacks[i]();
        }
        this.onDefinedHandlers[providerName] = null;
        return provider;
    };
    Needle.prototype.onDefined = function (providerName, callback) {
        if (this.providerMap[providerName]) {
            return callback();
        }
        var handlers = this.onDefinedHandlers[providerName] || [];
        handlers.push(callback);
        this.onDefinedHandlers[providerName] = handlers;
    };
    Needle.prototype.onAllDefined = function (dependencies, callback) {
        var defineCount = 0;
        var defineTotal = dependencies.length;
        if (defineTotal === 0)
            return callback();
        function definedCallback() {
            if (++defineCount === defineTotal)
                callback();
        }
        for (var i = 0; i < dependencies.length; i++) {
            this.onDefined(dependencies[i], definedCallback);
        }
    };
    Needle.prototype.resolve = function (provider, impl) {
        provider.setActual(impl);
        var resolutionCallbacks = this.onResolveHandlers[provider.name];
        if (!resolutionCallbacks)
            return provider;
        for (var i = 0; i < resolutionCallbacks.length; i++) {
            resolutionCallbacks[i]();
        }
        this.onResolveHandlers[provider.name] = null;
        return provider;
    };
    Needle.prototype.onResolved = function (providerName, callback) {
        var provider = this.providerMap[providerName];
        if (provider.isResolved) {
            return callback();
        }
        var resolutionCallbacks = this.onResolveHandlers[providerName] || [];
        resolutionCallbacks.push(callback);
        this.onResolveHandlers[providerName] = resolutionCallbacks;
    };
    Needle.prototype.onAllResolved = function (dependencies, callback) {
        var resolvedCount = 0;
        var totalToResolve = dependencies.length;
        if (totalToResolve === 0)
            return callback();
        function onProviderResolved() {
            if (++resolvedCount === totalToResolve)
                callback();
        }
        for (var i = 0; i < dependencies.length; i++) {
            this.onResolved(dependencies[i], onProviderResolved);
        }
    };
    Needle.prototype.getInjectedDependencies = function (type, overrides) {
        var _this = this;
        if (overrides === void 0) { overrides = {}; }
        return new Promise(function (resolve) {
            var propertyLookup = _this.injectionMapRegistry.get(type) || {};
            var propertyNames = Object.keys(propertyLookup);
            var providerNames = [];
            for (var i = 0; i < propertyNames.length; i++) {
                providerNames[i] = propertyLookup[propertyNames[i]];
            }
            var awaitedProviderNames = propertyNames.filter(function (name) {
                return overrides[name] === void 0;
            }).map(function (name) {
                return propertyLookup[name];
            });
            _this.onAllDefined(awaitedProviderNames, function () {
                _this.onAllResolved(awaitedProviderNames, function () {
                    var injectedDependencies = {};
                    for (var i = 0; i < propertyNames.length; i++) {
                        var providerName = providerNames[i];
                        var propertyName = propertyNames[i];
                        injectedDependencies[propertyName] = overrides[propertyName] || _this.get(providerName);
                    }
                    resolve(injectedDependencies);
                });
            });
        });
    };
    Needle.prototype.getInjectionMap = function (type) {
        if (!type)
            return {};
        var map = this.injectionMapRegistry.get(type);
        if (!map) {
            var parentMap = this.getInjectionMap(Object.getPrototypeOf(type));
            map = (parentMap) ? JSON.parse(JSON.stringify(parentMap)) : {};
        }
        this.injectionMapRegistry.set(type, map);
        return map;
    };
    Needle.prototype.reset = function () {
        Needle.call(this);
    };
    return Needle;
}());
exports.Needle = Needle;
exports.Injector = new Needle();
function inject(injectionKey) {
    return exports.Injector.inject(injectionKey);
}
exports.inject = inject;
//# sourceMappingURL=injector.js.map