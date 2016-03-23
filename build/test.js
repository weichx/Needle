/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var injector_1 = __webpack_require__(1);
	describe('Injector', function () {
	    beforeEach(function () {
	        injector_1.Injector.reset();
	    });
	    describe('api', function () {
	        it('should handle provision', function () {
	            var myThing = {};
	            injector_1.Injector.provide('test_thing', myThing);
	            expect(injector_1.Injector.get('test_thing')).toBe(myThing);
	        });
	        it('should handle mocking', function () {
	            var myThing = {};
	            var mockThing = {};
	            injector_1.Injector.provide('test.thing', myThing);
	            injector_1.Injector.mock('test.thing', 'mock', mockThing);
	            injector_1.Injector.useMock('test.thing', 'mock');
	            expect(injector_1.Injector.get('test.thing')).toBe(mockThing);
	        });
	        it('should default to actual implementation', function () {
	            var actual = {};
	            injector_1.Injector.mock('test', 'test', {});
	            injector_1.Injector.provide('test', actual);
	            expect(injector_1.Injector.get('test')).toBe(actual);
	        });
	        it('should use actual implementation', function () {
	            var actual = {};
	            injector_1.Injector.mock('test', 'mock1', {});
	            injector_1.Injector.provide('test', actual);
	            injector_1.Injector.useMock('test', 'mock1');
	            expect(injector_1.Injector.get('test')).not.toBe(actual);
	            injector_1.Injector.useActual('test');
	            expect(injector_1.Injector.get('test')).toBe(actual);
	        });
	        it('should throw when a provider is declared twice', function () {
	            expect(function () {
	                injector_1.Injector.provide('test', 1);
	                injector_1.Injector.provide('test', 2);
	            }).toThrow(new Error('Provider test was given a non-mock implementation more than once!'));
	        });
	        it('should throw when attempting to use a non-existing mock', function () {
	            expect(function () {
	                injector_1.Injector.useMock('test', 'not here');
	            }).toThrow(new Error("Unable to locate provider 'test'. Make sure you register this provide before attempting to use it"));
	        });
	    });
	    describe('creation', function () {
	        it('should get class dependencies', function (done) {
	            var TestThing = (function () {
	                function TestThing() {
	                }
	                __decorate([
	                    injector_1.inject('test_thing1')
	                ], TestThing.prototype, "str1", void 0);
	                __decorate([
	                    injector_1.inject('test_thing2')
	                ], TestThing.prototype, "str2", void 0);
	                return TestThing;
	            }());
	            injector_1.Injector.provide('test_thing1', 'oh hi 1');
	            injector_1.Injector.provide('test_thing2', 'oh hi 2');
	            injector_1.Injector.create(TestThing).then(function (thing) {
	                expect(thing.str1).toBe('oh hi 1');
	                expect(thing.str2).toBe('oh hi 2');
	                done();
	            }).catch(function (e) {
	                console.log(e.stack);
	            });
	        });
	        it('should create with mock dependency', function (done) {
	            var TestThing = (function () {
	                function TestThing() {
	                }
	                __decorate([
	                    injector_1.inject('test_thing1')
	                ], TestThing.prototype, "str1", void 0);
	                __decorate([
	                    injector_1.inject('test_thing2')
	                ], TestThing.prototype, "str2", void 0);
	                return TestThing;
	            }());
	            injector_1.Injector.provide('test_thing1', 'oh hi');
	            injector_1.Injector.provide('test_thing2', 'real');
	            injector_1.Injector.mock('test_thing2', 'mock', 'mocked');
	            injector_1.Injector.useMock('test_thing2', 'mock');
	            injector_1.Injector.create(TestThing).then(function (thing) {
	                expect(thing.str1).toBe('oh hi');
	                expect(thing.str2).toBe('mocked');
	                done();
	            });
	        });
	        it('should await providers', function (done) {
	            var TestThing = (function () {
	                function TestThing() {
	                }
	                __decorate([
	                    injector_1.inject('test_thing1')
	                ], TestThing.prototype, "str1", void 0);
	                __decorate([
	                    injector_1.inject('test_thing2')
	                ], TestThing.prototype, "str2", void 0);
	                return TestThing;
	            }());
	            injector_1.Injector.create(TestThing).then(function (thing) {
	                expect(thing.str1).toBe('str1');
	                expect(thing.str2).toBe('str2');
	                done();
	            });
	            setTimeout(function () {
	                injector_1.Injector.provide('test_thing1', 'str1');
	                injector_1.Injector.provide('test_thing2', 'str2');
	            }, 100);
	        });
	        it('should create with overrides', function (done) {
	            var TestThing = (function () {
	                function TestThing() {
	                }
	                __decorate([
	                    injector_1.inject('test_thing1')
	                ], TestThing.prototype, "str1", void 0);
	                __decorate([
	                    injector_1.inject('test_thing2')
	                ], TestThing.prototype, "str2", void 0);
	                return TestThing;
	            }());
	            injector_1.Injector.create(TestThing, {
	                str1: 'totally mocked out dude'
	            }).then(function (instance) {
	                expect(instance instanceof TestThing).toBeTruthy();
	                expect(instance.str1).toBe('totally mocked out dude');
	                expect(instance.str2).toBe('not mocked dude');
	                done();
	            }).catch(function (e) {
	                console.log(e.stack);
	            });
	            injector_1.Injector.provide('test_thing2', 'not mocked dude');
	        });
	    });
	    describe('injection', function () {
	        it('should inject dependencies into an existing instance', function (done) {
	            var TestThing = (function () {
	                function TestThing() {
	                }
	                __decorate([
	                    injector_1.inject('test_thing1')
	                ], TestThing.prototype, "str1", void 0);
	                __decorate([
	                    injector_1.inject('test_thing2')
	                ], TestThing.prototype, "str2", void 0);
	                return TestThing;
	            }());
	            var instance = new TestThing();
	            injector_1.Injector.injectDependencies(instance).then(function (inst) {
	                expect(inst).toBe(instance);
	                expect(inst.str1).toBe('str1');
	                expect(inst.str2).toBe('str2');
	                done();
	            });
	            injector_1.Injector.provide('test_thing1', 'str1');
	            injector_1.Injector.provide('test_thing2', 'str2');
	        });
	        it('should inject mocked dependencies into an existing instance', function (done) {
	            var TestThing = (function () {
	                function TestThing() {
	                }
	                __decorate([
	                    injector_1.inject('test_thing1')
	                ], TestThing.prototype, "str1", void 0);
	                __decorate([
	                    injector_1.inject('test_thing2')
	                ], TestThing.prototype, "str2", void 0);
	                return TestThing;
	            }());
	            var instance = new TestThing();
	            injector_1.Injector.injectDependencies(instance).then(function (inst) {
	                expect(inst).toBe(instance);
	                expect(inst.str1).toBe('mocked str1');
	                expect(inst.str2).toBe('str2');
	                done();
	            });
	            injector_1.Injector.mock('test_thing1', 'mock', 'mocked str1');
	            injector_1.Injector.useMock('test_thing1', 'mock');
	            injector_1.Injector.provide('test_thing2', 'str2');
	        });
	        it('should inject with overrides', function (done) {
	            var TestThing = (function () {
	                function TestThing() {
	                }
	                __decorate([
	                    injector_1.inject('test_thing1')
	                ], TestThing.prototype, "str1", void 0);
	                __decorate([
	                    injector_1.inject('test_thing2')
	                ], TestThing.prototype, "str2", void 0);
	                return TestThing;
	            }());
	            var instance = new TestThing();
	            injector_1.Injector.injectDependencies(instance, {
	                str1: 'totally mocked out dude'
	            }).then(function (instance) {
	                expect(instance instanceof TestThing).toBeTruthy();
	                expect(instance.str1).toBe('totally mocked out dude');
	                expect(instance.str2).toBe('not mocked dude');
	                done();
	            });
	            injector_1.Injector.provide('test_thing2', 'not mocked dude');
	        });
	        it('should await providers', function (done) {
	            var TestThing = (function () {
	                function TestThing() {
	                }
	                __decorate([
	                    injector_1.inject('test_thing1')
	                ], TestThing.prototype, "str1", void 0);
	                __decorate([
	                    injector_1.inject('test_thing2')
	                ], TestThing.prototype, "str2", void 0);
	                return TestThing;
	            }());
	            var instance = new TestThing();
	            injector_1.Injector.injectDependencies(instance).then(function (thing) {
	                expect(thing.str1).toBe('str1');
	                expect(thing.str2).toBe('str2');
	                done();
	            });
	            setTimeout(function () {
	                injector_1.Injector.provide('test_thing1', 'str1');
	                injector_1.Injector.provide('test_thing2', 'str2');
	            }, 100);
	        });
	    });
	    describe('nested', function () {
	        it('should register a provider asynchronously', function (done) {
	            var impl = {};
	            injector_1.Injector.provideAsync('someservice', function () {
	                return new Promise(function (resolve) {
	                    setTimeout(function () {
	                        resolve(impl);
	                    }, 10);
	                });
	            }).then(function () {
	                expect(injector_1.Injector.get('someservice')).toBe(impl);
	                done();
	            });
	        });
	        it('should register a provider with dependencies asynchronously', function (done) {
	            var impl1 = {};
	            var impl2 = {};
	            injector_1.Injector.provideAsync('someservice', ['dep1', 'dep2'], function (dep1, dep2) {
	                expect(dep1).toBe(impl1);
	                expect(dep2).toBe(impl2);
	                return new Promise(function (resolve) {
	                    resolve('stuff');
	                });
	            }).then(function () {
	                done();
	            });
	            injector_1.Injector.provide('dep1', impl1);
	            injector_1.Injector.provide('dep2', impl2);
	        });
	        it('should register a provider with async dependencies asynchronously', function (done) {
	            var impl1 = {};
	            var impl2 = {};
	            injector_1.Injector.provideAsync('some.service', ['dep1', 'dep2'], function (dep1, dep2) {
	                expect(dep1).toBe(impl1);
	                expect(dep2).toBe(impl2);
	                return new Promise(function (resolve) {
	                    resolve('stuff');
	                });
	            }).then(function () {
	                done();
	            });
	            injector_1.Injector.provide('dep1', impl1);
	            injector_1.Injector.provideAsync('dep2', function () {
	                return new Promise(function (resolve) {
	                    setTimeout(function () {
	                        resolve(impl2);
	                    }, 10);
	                });
	            });
	        });
	    });
	    describe('cycles', function () {
	        it('should catch cycles', function (done) {
	            injector_1.Injector.provideAsync('a', ['b'], function () {
	                return {};
	            });
	            injector_1.Injector.provideAsync('b', ['a'], function () {
	                return {};
	            }).then(function () {
	                done();
	            }).catch(function (e) {
	                done();
	            });
	        });
	    });
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var provider_1 = __webpack_require__(2);
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	function noSuchMock(providerName, mockName) {
	    throw new Error("No mock named '" + mockName + "' exists for provider '" + providerName + "'");
	}
	function mockAlreadyRegistered(providerName, mockName) {
	    throw new Error("Provider '" + providerName + " already has a mock named " + mockName + " registered");
	}
	var ProviderVariant = (function () {
	    function ProviderVariant(name, dependencies, implementation) {
	        if (dependencies === void 0) { dependencies = []; }
	        this.name = name;
	        this.dependencies = dependencies;
	        this.implementation = implementation;
	    }
	    Object.defineProperty(ProviderVariant.prototype, "isResolved", {
	        get: function () {
	            return this.implementation !== void 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return ProviderVariant;
	}());
	var Provider = (function () {
	    function Provider(name, dependencies) {
	        if (dependencies === void 0) { dependencies = []; }
	        this.name = name;
	        this.mocks = {};
	        this.dependencies = dependencies;
	        this.actual = new ProviderVariant('__actual__', dependencies);
	        this.activeVariant = this.actual;
	    }
	    Object.defineProperty(Provider.prototype, "isResolved", {
	        get: function () {
	            return this.activeVariant.isResolved;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Provider.prototype, "isMocked", {
	        get: function () {
	            return this.activeVariant !== this.actual;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Provider.prototype.get = function (variantName) {
	        if (variantName === void 0) { variantName = null; }
	        if (variantName) {
	            var variant = this.mocks[variantName];
	            if (!variant)
	                throw new Error("Not variant");
	            return variant.implementation;
	        }
	        return this.activeVariant.implementation;
	    };
	    Provider.prototype.has = function (variantName) {
	        return this.get(variantName) !== void 0;
	    };
	    Provider.prototype.setActual = function (value) {
	        if (this.actual.implementation !== void 0) {
	            throw new Error("Provider " + this.name + " was given a non-mock implementation more than once!");
	        }
	        this.actual.implementation = value;
	    };
	    Provider.prototype.useActual = function () {
	        this.activeVariant = this.actual;
	    };
	    Provider.prototype.useMock = function (key) {
	        var mock = this.mocks[key];
	        if (!mock) {
	            noSuchMock(this.name, key);
	        }
	        else {
	            this.activeVariant = mock;
	        }
	    };
	    Provider.prototype.addMock = function (key, dependencies, implementation) {
	        this.mocks[key] = new ProviderVariant(key, dependencies, implementation);
	    };
	    return Provider;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Provider;


/***/ }
/******/ ]);