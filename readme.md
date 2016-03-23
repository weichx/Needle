# Needle

A standalone annotation based dependency injection framework

### Declaring Class Dependencies
Tag properties for injection with `@inject(providerName : string)`
```typescript
class XWing {
  @inject('pilot') public pilot : Pilot;
  @inject('lasers') public lasers : Array<LaserCannon>;
  @inject('engines') public engines : Array<Engine>;
  @inject('warheads') public warheads : Array<Warhead>;
}
```

### Registering Providers
An injection is only resolved when something can provide a value for it. A provider's job is to 'provide' a value for an injection. This can happen synchronously or asynchronously.

##### Synchronous Providers
A provider can be registered synchronously via `Injector.provider(providerName : string, implementation : any);`.
for example, to synchronously provide `engines` in the above example we could write:
```typescript
  Injector.provide("engines", [ 
    new SmallFighterEngine(), 
    new SmallFighterEngine(),
    new SmallFighterEngine(),
    new SmallFighterEngine()
  ]);
```
However, the order that the injection and the provider it is looking for are declared in does not matter, the injection wont resolve until the provider has resolved.

##### Asynchronous Providers
A provider can also be registered asynchronously, for example you may have a provider that needs to make an http call before it can provide a value to be injected. Heres how that works:

```typescript
Injector.provideAsync('warheads', function() {
  return new Promise(function(resolve : ResolveFn) {
    http.get('api/warheads/xwing').then(function(warheads : Array<Warhead>) {
      resolve(warheads);
    });
  });
});
```

##### Providers with Dependencies
Often you will want a provider to depend on other providers. This works in much the same way as the `@inject` annotation in that the implementation funciton won't run until all dependencies for your provider are resolved. (Note that if you have any dependency cycles you will get an exception)

```typescript
//provide a blue laser color
Injector.provide('laserColors.blue', new Color(0, 0, 255));

//provide a set of lasers using the blue color, this provider wont run its function until `laserColors.blue` has resolved.
//note that the function arguments map ordinally to the array of provider names
Injector.provideAsync('lasers', ['laserColors.blue'], function(color : LaserColor) {
  //this is not a promise, but it could be if you want it to
  return [new Laser(color), new Laser(color), new Laser(color), new Laser(color)];
});
```

### Creating Instances
To create an instance of class that you have `@inject` annotations on, use `Injector.create(type : typeof Type) : Promise<Type>`
```typescript
//using XWing class from above
Injector.create(XWing).then(function(fighter : XWing) {
  expect(fighter instanceof XWing).toBe(true);
  expect(fighter.lasers.length).toBe(4);
  expect(fighter.engines.length).toBe(4);
  expect(fighter.warheads.toBeDefined();
});
```
### Injecting Dependencies
If you already have an instance of something you can re-inject dependencies with

`Injector.injectDependencies<T>(instance : T) : Promise<T>`


### Mocks

Mocks provide a way to swap out dependencies for testing or development. Before we defined a `warheads` provider that makes an http call to get a list of warheads to add to our XWing. When testing we may want to mock that call out. We can do so by using `Injector.mock(providerName : string, mockName : string, implementation : any)`

```typescript
  Injector.mock('warheads', 'mockedWarheads', [new Torpedo(), new Torpedo()])
```
we can then apply this mock with `Injector.useMock('warheads', 'mockedWarheads')`. Now anytime we inject `warheads` we get our mocked array back, not the server response.

We can revert to the actual implementation with `Injector.useActual(providerName : string)`


### Overrides
Both `create` and `injectDependencies` can take an optional override object. 

```typescript
  Injector.provide('warheads', [new Torpedo(), new Torpedo()]);
  
  //override warheads provider to return concussion missiles instead
  Injector.create(XWing, {warheads: [new ConcussionMissile(), new ConcussionMissile()]}).then(function(fighter : XWing) {
    expect(fighter.warheads[0] instanceof ConcussionMissile).toBeTruthy();
  });
  
  Injector.create(XWing).then(function(fighter) {
    expect(fighter.warheads[0] instanceof Torpedo).toBeTruthy();
  });
```

