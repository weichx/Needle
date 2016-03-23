import {Indexable} from "./interfaces";

function noSuchMock(providerName : string, mockName : string) {
    throw new Error(`No mock named '${mockName}' exists for provider '${providerName}'`);
}

function mockAlreadyRegistered(providerName : string, mockName : string) {
    throw new Error(`Provider '${providerName} already has a mock named ${mockName} registered`);
}

class ProviderVariant {
    public name : string;
    public dependencies: Array<string>;
    public implementation : any;
    
    constructor(name : string, dependencies : Array<string> = [], implementation? : any) {
        this.name = name;
        this.dependencies = dependencies;
        this.implementation = implementation;
    }
    
    public get isResolved() : boolean {
        return this.implementation !== void 0;
    }
}

export default class Provider {

    public name : string;
    public dependencies : Array<string>;

    private mocks : Indexable<ProviderVariant>;
    private actual : ProviderVariant;
    private activeVariant : ProviderVariant;
    
    constructor(name : string, dependencies : Array<string> = []) {
        this.name = name;
        this.mocks = {};
        this.dependencies = dependencies;
        this.actual = new ProviderVariant('__actual__', dependencies);
        this.activeVariant = this.actual;
    }

    public get isResolved() : boolean {
        return this.activeVariant.isResolved;
    }
    
    public get isMocked() : boolean {
        return this.activeVariant !== this.actual;
    }
    
    public get(variantName : string = null) : any {
        if(variantName) {
            var variant = this.mocks[variantName];
            if(!variant) throw new Error("Not variant");
            return variant.implementation;
        }
        return this.activeVariant.implementation;
    }

    public has(variantName : string) : boolean {
        return this.get(variantName) !== void 0;
    }

    public setActual(value : any) {
        if (this.actual.implementation !== void 0) {
            throw new Error(`Provider ${this.name} was given a non-mock implementation more than once!`);
        }
        this.actual.implementation = value;
    }

    public useActual() : void {
        this.activeVariant = this.actual;
    }

    public useMock(key : string) : void {
        var mock = this.mocks[key];
        if (!mock) {
            noSuchMock(this.name, key);
        } else {
            this.activeVariant = mock;
        }
    }

    public addMock(key : string, dependencies : Array<string>,  implementation : any) {
        this.mocks[key] = new ProviderVariant(key, dependencies, implementation);
    }
}