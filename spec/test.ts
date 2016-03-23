import {Injector, inject} from "../src/injector";

type DoneFn = () => void;

describe('Injector', function () {

    beforeEach(function () {
        Injector.reset();
    });

    describe('api', function () {

        it('should handle provision', function () {
            var myThing = {};
            Injector.provide('test_thing', myThing);
            expect(Injector.get('test_thing')).toBe(myThing);
        });

        it('should handle mocking', function () {
            var myThing = {};
            var mockThing = {};
            Injector.provide('test.thing', myThing);
            Injector.mock('test.thing', 'mock', mockThing);
            Injector.useMock('test.thing', 'mock');
            expect(Injector.get('test.thing')).toBe(mockThing);
        });

        it('should default to actual implementation', function () {
            var actual = {};
            Injector.mock('test', 'test', {});
            Injector.provide('test', actual);
            expect(Injector.get('test')).toBe(actual);
        });

        it('should use actual implementation', function () {
            var actual = {};
            Injector.mock('test', 'mock1', {});
            Injector.provide('test', actual);
            Injector.useMock('test', 'mock1');
            expect(Injector.get('test')).not.toBe(actual);
            Injector.useActual('test');
            expect(Injector.get('test')).toBe(actual);
        });

        it('should throw when a provider is declared twice', function () {
            expect(function () {
                Injector.provide('test', 1);
                Injector.provide('test', 2);
            }).toThrow(new Error('Provider test was given a non-mock implementation more than once!'));
        });

        it('should throw when attempting to use a non-existing mock', function () {
            expect(function () {
                Injector.useMock('test', 'not here');
            }).toThrow(new Error(`Unable to locate provider 'test'. Make sure you register this provide before attempting to use it`));
        });
    });

    describe('creation', function () {

        it('should get class dependencies', function (done : DoneFn) {
            class TestThing {
                @inject('test_thing1')
                public str1 : string;
                @inject('test_thing2')
                public str2 : string;
            }
            Injector.provide('test_thing1', 'oh hi 1');
            Injector.provide('test_thing2', 'oh hi 2');
            Injector.create(TestThing).then(function (thing : TestThing) {
                expect(thing.str1).toBe('oh hi 1');
                expect(thing.str2).toBe('oh hi 2');
                done();
            }).catch(function (e : any) {
                console.log(e.stack);
            })
        });

        it('should create with mock dependency', function (done : DoneFn) {
            class TestThing {
                @inject('test_thing1')
                public str1 : string;
                @inject('test_thing2')
                public str2 : string;
            }

            Injector.provide('test_thing1', 'oh hi');
            Injector.provide('test_thing2', 'real');

            Injector.mock('test_thing2', 'mock', 'mocked');
            Injector.useMock('test_thing2', 'mock');

            Injector.create(TestThing).then(function (thing : TestThing) {
                expect(thing.str1).toBe('oh hi');
                expect(thing.str2).toBe('mocked');
                done();
            });
        });

        it('should await providers', function (done : DoneFn) {
            class TestThing {
                @inject('test_thing1')
                public str1 : string;
                @inject('test_thing2')
                public str2 : string;
            }

            Injector.create(TestThing).then(function (thing : TestThing) {
                expect(thing.str1).toBe('str1');
                expect(thing.str2).toBe('str2');
                done();
            });

            setTimeout(function () {
                Injector.provide('test_thing1', 'str1');
                Injector.provide('test_thing2', 'str2');
            }, 100);
        });

        it('should create with overrides', function (done : DoneFn) {
            class TestThing {
                @inject('test_thing1')
                public str1 : string;
                @inject('test_thing2')
                public str2 : string;
            }

            Injector.create(TestThing, {
                str1: 'totally mocked out dude'
            }).then(function (instance : TestThing) {
                expect(instance instanceof TestThing).toBeTruthy();
                expect(instance.str1).toBe('totally mocked out dude');
                expect(instance.str2).toBe('not mocked dude');
                done();
            }).catch(function (e : any) {
                console.log(e.stack);
            });

            Injector.provide('test_thing2', 'not mocked dude');
        });

    });

    describe('injection', function () {

        it('should inject dependencies into an existing instance', function (done : DoneFn) {
            class TestThing {
                @inject('test_thing1')
                public str1 : string;
                @inject('test_thing2')
                public str2 : string;
            }

            var instance = new TestThing();

            Injector.injectDependencies(instance).then(function (inst : TestThing) {
                expect(inst).toBe(instance);
                expect(inst.str1).toBe('str1');
                expect(inst.str2).toBe('str2');
                done();
            });

            Injector.provide('test_thing1', 'str1');
            Injector.provide('test_thing2', 'str2');
        });

        it('should inject mocked dependencies into an existing instance', function (done : DoneFn) {
            class TestThing {
                @inject('test_thing1')
                public str1 : string;
                @inject('test_thing2')
                public str2 : string;
            }

            var instance = new TestThing();

            Injector.injectDependencies(instance).then(function (inst : TestThing) {
                expect(inst).toBe(instance);
                expect(inst.str1).toBe('mocked str1');
                expect(inst.str2).toBe('str2');
                done();
            });

            Injector.mock('test_thing1', 'mock', 'mocked str1');
            Injector.useMock('test_thing1', 'mock');
            Injector.provide('test_thing2', 'str2');
        });

        it('should inject with overrides', function (done : DoneFn) {
            class TestThing {
                @inject('test_thing1')
                public str1 : string;
                @inject('test_thing2')
                public str2 : string;
            }

            var instance = new TestThing();

            Injector.injectDependencies(instance, {
                str1: 'totally mocked out dude'
            }).then(function (instance : TestThing) {
                expect(instance instanceof TestThing).toBeTruthy();
                expect(instance.str1).toBe('totally mocked out dude');
                expect(instance.str2).toBe('not mocked dude');
                done();
            });

            Injector.provide('test_thing2', 'not mocked dude');
        });

        it('should await providers', function (done : DoneFn) {
            class TestThing {
                @inject('test_thing1')
                public str1 : string;
                @inject('test_thing2')
                public str2 : string;
            }

            var instance = new TestThing();

            Injector.injectDependencies(instance).then(function (thing : TestThing) {
                expect(thing.str1).toBe('str1');
                expect(thing.str2).toBe('str2');
                done();
            });

            setTimeout(function () {
                Injector.provide('test_thing1', 'str1');
                Injector.provide('test_thing2', 'str2');
            }, 100);

        });

    });

    describe('nested', function () {

        it('should register a provider asynchronously', function (done : DoneFn) {
            var impl : any = {};
            Injector.provideAsync('someservice', function () {
                return new Promise(function (resolve : any) {
                    setTimeout(function () {
                        resolve(impl);
                    }, 10)
                })
            }).then(() => {
                expect(Injector.get('someservice')).toBe(impl);
                done();
            });
        });

        it('should register a provider with dependencies asynchronously', function (done : DoneFn) {
            var impl1 : any = {};
            var impl2 : any = {};

            Injector.provideAsync('someservice', ['dep1', 'dep2'], function (dep1 : any, dep2 : any) {
                expect(dep1).toBe(impl1);
                expect(dep2).toBe(impl2);
                return new Promise(function (resolve : any) {
                    resolve('stuff');
                })
            }).then(() => {
                done();
            });

            Injector.provide('dep1', impl1);
            Injector.provide('dep2', impl2);
        });

        it('should register a provider with async dependencies asynchronously', function (done : DoneFn) {
            var impl1 : any = {};
            var impl2 : any = {};

            Injector.provideAsync('some.service', ['dep1', 'dep2'], function (dep1 : any, dep2 : any) {

                expect(dep1).toBe(impl1);
                expect(dep2).toBe(impl2);
                return new Promise(function (resolve : any) {
                    resolve('stuff');
                })
            }).then(() => {
                done();
            });

            Injector.provide('dep1', impl1);
            Injector.provideAsync('dep2', function () {
                return new Promise(function (resolve : any) {
                    setTimeout(function () {
                        resolve(impl2);
                    }, 10);
                });
            });
        });

    });

    describe('cycles', function () {
        it('should catch cycles', function (done : DoneFn) {
            
                Injector.provideAsync('a', ['b'], function () {
                    return {};
                });
                Injector.provideAsync('b', ['a'], function () {
                    return {};
                }).then(function () {
                    done();
                }).catch(function (e : any) {
                    done();
                })

        });
    });
});