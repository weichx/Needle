import { Creator, IndexableObject } from "./interfaces";
export declare type ImplementationFn = (...args: any[]) => any;
export declare class Needle {
    private providerMap;
    private onDefinedHandlers;
    private onResolveHandlers;
    private injectionMapRegistry;
    constructor();
    inject(injectionKey: string): PropertyDecorator;
    provide(providerName: string, impl: any): void;
    provideAsync(providerName: string, depsOrImpl: Array<string> | ImplementationFn, implementationPromise?: ImplementationFn): Promise<any>;
    mock(providerName: string, mockName: string, impl: any): void;
    useMock(providerName: string, mockName: string): void;
    useActual(providerName: string): void;
    get(providerName: string, variantName?: string): any;
    create<T>(type: Creator<T>, options?: IndexableObject): Promise<T>;
    injectDependencies<T>(instance: T, options?: IndexableObject): Promise<T>;
    getInjectedDependencies(type: Function, overrides?: IndexableObject): Promise<IndexableObject>;
    private checkCycles(providerName, stack?);
    private define(providerName, dependencies?);
    private onDefined(providerName, callback);
    private onAllDefined(dependencies, callback);
    private resolve(provider, impl);
    private onResolved(providerName, callback);
    private onAllResolved(dependencies, callback);
    private getInjectionMap(type);
    reset(): void;
}
export declare var Injector: Needle;
export declare function inject(injectionKey: string): PropertyDecorator;
