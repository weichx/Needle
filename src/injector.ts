import Provider from "./provider";
import {Indexable, Creator, IndexableObject}  from "./interfaces";

export type ImplementationFn = (...args : any[]) => any;

function noSuchProvider(name : string) : void {
    throw new Error(`Unable to locate provider '${name}'. Make sure you register this provide before attempting to use it`);
}

function construct<T>(constructor : any, args : any[] = []) : T {
    function F() : void {
        constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return new (<any>F)();
}

export class Needle {

    private providerMap : Indexable<Provider>;
    private onDefinedHandlers : Indexable<Array<() => void>>;
    private onResolveHandlers : Indexable<Array<() => void>>;
    private injectionMapRegistry : Map<Function, IndexableObject>;

    constructor() {
        this.providerMap = {};
        this.onDefinedHandlers = {};
        this.onResolveHandlers = {};
        this.injectionMapRegistry = new Map<Function, IndexableObject>();
    }

    public inject(injectionKey : string) : PropertyDecorator {
        return (prototype : Object, key : string) => {
            var type = prototype.constructor;
            var injectionMap = this.getInjectionMap(type);
            injectionMap[key] = injectionKey;
        }
    }

    public provide(providerName : string, impl : any) : void {
        this.resolve(this.define(providerName), impl);
    }

    public provideAsync(providerName : string, depsOrImpl : Array<string>|ImplementationFn, implementationPromise? : ImplementationFn) : Promise<any> {
        var deps : Array<string> = null;
        if (implementationPromise) {
            deps = <string[]>depsOrImpl;
        }
        else {
            deps = [];
            implementationPromise = <ImplementationFn>depsOrImpl;
        }

        return new Promise((resolve : any) => {

            var onResolved = () => {
                var provider = this.providerMap[providerName];
                var resolvedDependencies = provider.dependencies.map((depName : string) => {
                    return this.providerMap[depName].get();
                });

                var impl = implementationPromise.apply(null, resolvedDependencies);
                if (impl && typeof impl.then === 'function') {
                    impl.then((result : any) => {
                        resolve(this.resolve(provider, result));
                    });
                }
                else {
                    resolve(this.resolve(provider, impl));
                }
            };

            var onDefined = () => {
                if (this.checkCycles(providerName)) {
                    throw new Error('Cycles found!');
                }
                this.onAllResolved(deps, onResolved);
            };

            this.define(providerName, deps);
            this.onAllDefined(deps, onDefined);

        });
    }

    public mock(providerName : string, mockName : string, impl : any) : void {
        var provider = this.providerMap[providerName] || new Provider(providerName);
        provider.addMock(mockName, [], impl);
        this.providerMap[providerName] = provider;
    }

    public mockAsync(providerName : string, mockName : string, dependencies : Array<string>, impl : any) : void {
    
    }

    public useMock(providerName : string, mockName : string) : void {
        var provider = this.providerMap[providerName];
        if (!provider) return noSuchProvider(providerName);
        provider.useMock(mockName);

        if (this.checkCycles(providerName)) {
            throw new Error("Cycle");
        }

        var definitionCallbacks = this.onDefinedHandlers[providerName];
        this.onDefinedHandlers[providerName] = null;
        if (!definitionCallbacks) return;
        for (var i = 0; i < definitionCallbacks.length; i++) {
            definitionCallbacks[i]();
        }
    }

    public useActual(providerName : string) : void {
        var provider = this.providerMap[providerName];
        if (!provider) return noSuchProvider(providerName);
        provider.useActual();
    }

    public get(providerName : string, variantName? : string) : any {
        var provider = this.providerMap[providerName];
        if (!provider) return noSuchProvider(providerName);
        return provider.get(variantName);
    }

    //todo figure out the generics here for type checking, tuples dont seem to work as expected
    public create<T>(type : Creator<T>, options? : IndexableObject) : Promise<T> {
        return this.injectDependencies(construct(type, []), options);
    }

    public injectDependencies<T>(instance : T, options? : IndexableObject) : Promise<T> {

        function injectDependencies(dependencies : IndexableObject) : T {
            var keys = Object.keys(dependencies);
            for (var i = 0; i < keys.length; i++) {
                (<any>instance)[keys[i]] = dependencies[keys[i]];
            }
            return instance;
        }

        return this.getInjectedDependencies(instance.constructor, options).then(injectDependencies);
    }

    public getInjectedDependencies(type : Function, overrides : IndexableObject = {}) : Promise<IndexableObject> {

        return new Promise((resolve : any) => {
            var propertyLookup : IndexableObject = this.injectionMapRegistry.get(type) || {};
            var propertyNames = Object.keys(propertyLookup);
            var providerNames : Array<string> = [];

            for (var i = 0; i < propertyNames.length; i++) {
                providerNames[i] = propertyLookup[propertyNames[i]];
            }

            var awaitedProviderNames = propertyNames.filter(function (name : string) {
                return overrides[name] === void 0;
            }).map(function (name : string) {
                return propertyLookup[name];
            });

            this.onAllDefined(awaitedProviderNames, () => {
                this.onAllResolved(awaitedProviderNames, () => {
                    var injectedDependencies : IndexableObject = {};
                    for (var i = 0; i < propertyNames.length; i++) {
                        var providerName = providerNames[i];
                        var propertyName = propertyNames[i];
                        injectedDependencies[propertyName] = overrides[propertyName] || this.get(providerName);
                    }
                    resolve(injectedDependencies);
                });
            });
        });
    }
    
    private checkCycles(providerName : string, stack : Array<string> = []) : void {
        var provider = this.providerMap[providerName];
        if (stack.indexOf(providerName) !== -1) {
            throw new Error("Found cycle in " + stack.join(' -> ') + ' -> ' + providerName);
        }
        stack.push(providerName);
        for (var i = 0; i < provider.dependencies.length; i++) {
            this.checkCycles(provider.dependencies[i], stack);
        }
        stack.pop();
    }

    private define(providerName : string, dependencies : Array<string> = []) {
        var provider = this.providerMap[providerName] || new Provider(providerName, dependencies);
        var definitionCallbacks = this.onDefinedHandlers[providerName];
        this.providerMap[providerName] = provider;
        if (!definitionCallbacks) return provider;
        for (var i = 0; i < definitionCallbacks.length; i++) {
            definitionCallbacks[i]();
        }
        this.onDefinedHandlers[providerName] = null;
        return provider;
    }

    private onDefined(providerName : string, callback : () => void) : void {
        if (this.providerMap[providerName]) {
            return callback();
        }
        var handlers = this.onDefinedHandlers[providerName] || [];
        handlers.push(callback);
        this.onDefinedHandlers[providerName] = handlers;
    }

    private onAllDefined(dependencies : Array<string>, callback : () => void) : void {
        var defineCount = 0;
        var defineTotal = dependencies.length;

        if (defineTotal === 0) return callback();

        function definedCallback() {
            if (++defineCount === defineTotal) callback();
        }

        for (var i = 0; i < dependencies.length; i++) {
            this.onDefined(dependencies[i], definedCallback);
        }

    }

    private resolve(provider : Provider, impl : any) : Provider {
        provider.setActual(impl);
        var resolutionCallbacks = this.onResolveHandlers[provider.name];
        if (!resolutionCallbacks) return provider;
        for (var i = 0; i < resolutionCallbacks.length; i++) {
            resolutionCallbacks[i]();
        }
        this.onResolveHandlers[provider.name] = null;
        return provider;
    }

    private onResolved(providerName : string, callback : () => void) : void {
        var provider = this.providerMap[providerName];
        if (provider.isResolved) {
            return callback();
        }
        var resolutionCallbacks = this.onResolveHandlers[providerName] || [];
        resolutionCallbacks.push(callback);
        this.onResolveHandlers[providerName] = resolutionCallbacks;
    }

    private onAllResolved(dependencies : Array<string>, callback : () => void) : void {
        var resolvedCount = 0;
        var totalToResolve = dependencies.length;

        if (totalToResolve === 0) return callback();

        function onProviderResolved() {
            if (++resolvedCount === totalToResolve) callback();
        }

        for (var i = 0; i < dependencies.length; i++) {
            this.onResolved(dependencies[i], onProviderResolved);
        }
    }

    private getInjectionMap(type : Function) : IndexableObject {
        if (!type) return {};
        var map = this.injectionMapRegistry.get(type);
        if (!map) {
            var parentMap = this.getInjectionMap(Object.getPrototypeOf(type));
            map = <IndexableObject> (parentMap) ? JSON.parse(JSON.stringify(parentMap)) : {};
        }
        this.injectionMapRegistry.set(type, map);
        return map;
    }

    public reset() : void {
        Needle.call(this);
    }
}

export var Injector = new Needle();

export function inject(injectionKey : string) : PropertyDecorator {
    return Injector.inject(injectionKey);
}

