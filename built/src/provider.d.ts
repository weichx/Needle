export default class Provider {
    name: string;
    dependencies: Array<string>;
    private mocks;
    private actual;
    private activeVariant;
    constructor(name: string, dependencies?: Array<string>);
    isResolved: boolean;
    isMocked: boolean;
    get(variantName?: string): any;
    has(variantName: string): boolean;
    setActual(value: any): void;
    useActual(): void;
    useMock(key: string): void;
    addMock(key: string, dependencies: Array<string>, implementation: any): void;
}
