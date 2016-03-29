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
})();
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
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Provider;
//# sourceMappingURL=provider.js.map