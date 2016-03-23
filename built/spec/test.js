"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var injector_1 = require("../src/injector");
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
//# sourceMappingURL=test.js.map