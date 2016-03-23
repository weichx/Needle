webpackJsonp([0],[
/* 0 */
/***/ function(module, exports) {

	// import Vue = require('vue');
	// import ComponentOption = vuejs.ComponentOption;
	// import PropOption = vuejs.PropOption;
	// import VueStatic = vuejs.VueStatic;
	//
	// var internalHooks = [
	//     'data',
	//     'el',
	//     'init',
	//     //'created', ignore because of custom constructor usage
	//     'ready',
	//     'beforeCompile',
	//     'compiled',
	//     'beforeDestroy',
	//     'destroyed',
	//     'attached',
	//     'detached',
	//     'activate'
	// ];
	//
	// interface IEventDescriptor {
	//     once : boolean;
	//     method: (...args : any[]) => any;
	// }
	//
	// interface IWatchOptions {
	//     deep? : boolean;
	//     immediate? : boolean;
	// }
	//
	// //noinspection ReservedWordAsName
	// interface IPropOptions {
	//     type : any;
	//     default : any;
	//     required : boolean;
	//     twoWay : boolean;
	//     validator : (value : any) => boolean
	//     coerce : (value : any) => any;
	// }
	//
	// interface Indexable<T> {
	//     [key : string] : T;
	// }
	//
	// type DataFields = Indexable<string>;
	// type PropFields = Indexable<IPropOptions>;
	// type EventFields = Indexable<IEventDescriptor>;
	// type WatchFields = Indexable<any>;
	//
	// var componentMap = new Map<Object, VueStatic>();
	// var dataFieldMap = new Map<Function, DataFields>();
	// var propFieldMap = new Map<Function, PropFields>();
	// var eventMap = new Map<Function, EventFields>();
	// var watchMap = new Map<Function, WatchFields>();
	//
	// function data(targetPrototype : Object, key : string) {
	//     var type = targetPrototype.constructor;
	//     var dataFields = dataFieldMap.get(type) || <DataFields>{};
	//     dataFields[key] = key;
	//     dataFieldMap.set(type, dataFields);
	// }
	//
	// function prop(targetPrototypeOrOptions? : Object|IPropOptions, key? : string) : (proto : Object, key : string) => void|void {
	//     if (Vue.util.isPlainObject(targetPrototypeOrOptions)) {
	//
	//         return function (targetPrototype : Object, key : string) {
	//             let propOptions = <IPropOptions>targetPrototypeOrOptions;
	//             let type = targetPrototype.constructor;
	//             let propFields = propFieldMap.get(type) || <PropFields>{};
	//             let propDescriptor = propFields[key] || <IPropOptions>{};
	//
	//             propDescriptor.coerce = propOptions.coerce || propDescriptor.coerce;
	//             propDescriptor.required = propOptions.required || propDescriptor.required;
	//             propDescriptor.type = propOptions.type || propDescriptor.type;
	//             propDescriptor.twoWay = propOptions.twoWay || propDescriptor.twoWay;
	//             propDescriptor.validator = propOptions.validator || propDescriptor.validator;
	//             propDescriptor.default = propOptions.default || propDescriptor.default;
	//
	//             propFields[key] = propDescriptor;
	//             propFieldMap.set(type, propFields);
	//         }
	//
	//     }
	//     else {
	//         let type = targetPrototypeOrOptions.constructor;
	//         let propFields = propFieldMap.get(type) || <PropFields>{};
	//         propFields[key] = <IPropOptions>{};
	//         propFieldMap.set(type, propFields);
	//     }
	//
	// }
	// //
	// // function prop_required(targetPrototype : Object, key : string) {
	// //     var type = targetPrototype.constructor;
	// //     var propFields = propFieldMap.get(type) || <any>{};
	// //     var propField = propFields[key] || new PropDescriptor();
	// //     propField.required = true;
	// //     propFields[key] = propField;
	// //     propFieldMap.set(type, propFields);
	// // }
	// //
	// // function prop_validate(fn : (value : any) => boolean) {
	// //     return function (targetPrototype : Object, key : string) {
	// //         var type = targetPrototype.constructor;
	// //         var propFields = propFieldMap.get(type) || <any>{};
	// //         var propField = propFields[key] || new PropDescriptor();
	// //         propField.validator = fn;
	// //         propFields[key] = propField;
	// //         propFieldMap.set(type, propFields);
	// //     }
	// // }
	// //
	// // function prop_coerce(fn : (value : any) => any) {
	// //     return function (targetPrototype : Object, key : string) {
	// //         var type = targetPrototype.constructor;
	// //         var propFields = propFieldMap.get(type) || <any>{};
	// //         var propField = propFields[key] || new PropDescriptor();
	// //         propField.coerce = fn;
	// //         propFields[key] = propField;
	// //         propFieldMap.set(type, propFields);
	// //     }
	// // }
	// //
	// // function prop_type(type : typeof String | typeof Number | typeof Boolean | typeof Function | typeof Object | typeof Array) {
	// //     return function (targetPrototype : Object, key : string) {
	// //         var type = targetPrototype.constructor;
	// //         var propFields = propFieldMap.get(type) || <any>{};
	// //         var propField = propFields[key] || new PropDescriptor();
	// //         propField.type = type;
	// //         propFields[key] = propField;
	// //         propFieldMap.set(type, propFields);
	// //     }
	// // }
	// //
	// // function prop_twoWay(targetPrototype : Object, key : string) {
	// //     var type = targetPrototype.constructor;
	// //     var propFields = propFieldMap.get(type) || <any>{};
	// //     var propField = propFields[key] || new PropDescriptor();
	// //     propField.twoWay = true;
	// //     propFields[key] = propField;
	// //     propFieldMap.set(type, propFields);
	// // }
	// //
	// // function prop_default(value : any) {
	// //     return function (targetPrototype : Object, key : string) {
	// //         var type = targetPrototype.constructor;
	// //         var propFields = propFieldMap.get(type) || <any>{};
	// //         var propField = propFields[key] || new PropDescriptor();
	// //         propField.default = value;
	// //         propFields[key] = propField;
	// //         propFieldMap.set(type, propFields);
	// //     }
	// // }
	//
	// function on(eventName : string) {
	//     return function on<T extends Function>(targetPrototype : any, key : string, descriptor : TypedPropertyDescriptor<T>) {
	//         var type = targetPrototype.constructor;
	//         var events = eventMap.get(type) || <EventFields> {};
	//         events[eventName] = { once: false, method: targetPrototype[key] };
	//         eventMap.set(type, events);
	//     }
	// }
	//
	// function once(eventName : string) {
	//     return function once<T extends Function>(targetPrototype : any, key : string, descriptor : TypedPropertyDescriptor<T>) {
	//         var type = targetPrototype.constructor;
	//         var events = eventMap.get(type) || <EventFields> {};
	//         events[eventName] = { once: true, method: targetPrototype[key] };
	//         eventMap.set(type, events);
	//     }
	// }
	//
	// function watch(expression : string, watchOptions? : IWatchOptions) {
	//     return function once<T extends Function>(targetPrototype : any, key : string, descriptor : TypedPropertyDescriptor<T>) {
	//         var type = targetPrototype.constructor;
	//         var watches = watchMap.get(type) || <WatchFields> {};
	//         watches[expression] = watches[expression] || [];
	//         watches[expression].push({ options: watchOptions, method: targetPrototype[key] });
	//         watchMap.set(type, watches);
	//     }
	// }
	//
	// function VueMixin(mixin : any) {
	//     return function (target : Function) {
	//         console.log('ran mixin');
	//     }
	// }
	//
	//
	//
	// function VueComponent(name : string, template : string) {
	//
	//     return function (target : any) {
	//
	//         var proto : any = target.prototype;
	//         var events : EventFields = eventMap.get(target) || {};
	//         var watches : WatchFields = watchMap.get(target) || {};
	//         var dataFields : DataFields = dataFieldMap.get(target) || {};
	//         var propFields : PropFields = propFieldMap.get(target) || {};
	//
	//         //todo error if something is prop & data
	//
	//         var dataFn = function () {
	//             var output : any = {};
	//             Object.keys(dataFields).forEach((key : string) => {
	//                 output[key] = this[key];
	//             });
	//             return output;
	//         };
	//
	//         var getProps = function () {
	//             var output : any = {};
	//             Object.keys(propFields).forEach((key : string) => {
	//                 output[key] = propFields[key];
	//             });
	//             return output;
	//         };
	//
	//         var options : ComponentOption = {
	//             name: name,
	//             template: template,
	//             methods: {},
	//             computed: {},
	//             props: getProps(),
	//             data: dataFn,
	//             //because of the way Vue extension works (with object.create) we never get our constructors invoked
	//             //this code will invoke the class constructors as expected, handle some annotation actions and
	//             //handle any dependency injection
	//             created: function () : void {
	//                 //todo convert this to a plug-in architecture
	//                 Object.keys(watches).forEach((expression : string) => {
	//                     watches[expression].forEach((watch : any) => {
	//                         this.$watch(expression, watch.method, watch.options);
	//                     });
	//                 });
	//                 Object.keys(events).forEach((key : string) => {
	//                     var descriptor = events[key];
	//                     if (descriptor.once) {
	//                         this.$once(key, descriptor.method);
	//                     }
	//                     else {
	//                         this.$on(key, descriptor.method);
	//                     }
	//                 });
	//                 target.call(this); //todo if we want to do dependency injection this is the place
	//                 if (typeof proto.created === 'function') proto.created.call(this);
	//             }
	//         };
	//
	//         Object.getOwnPropertyNames(proto).forEach(function (key : string) {
	//
	//             if (key === 'constructor') return;
	//
	//             // hooks
	//             if (internalHooks.indexOf(key) > -1) {
	//                 options[key] = proto[key];
	//                 return;
	//             }
	//
	//             var descriptor = Object.getOwnPropertyDescriptor(proto, key);
	//             // methods
	//             if (typeof descriptor.value === 'function') {
	//                 options.methods[key] = descriptor.value;
	//             }
	//             // computed properties
	//             else if (descriptor.get || descriptor.set) {
	//                 options.computed[key] = {
	//                     get: descriptor.get,
	//                     set: descriptor.set
	//                 }
	//             }
	//
	//         });
	//
	//         var Super : any = componentMap.get(target.prototype.__proto__) || Vue;
	//         var subclass = Super.extend(options);
	//         componentMap.set(proto, subclass);
	//         //todo support async registration for dependency injection
	//         Vue.component(name, function(resolve : any) {
	//             //Injector.resolve(subclass).then( => subclass);
	//             resolve(subclass);
	//         });
	//         return target;
	//     }
	// }
	//
	// function inject(resolutionId : string) {
	//
	// }
	//
	// //this is purely for type data
	// class VueApi {
	//     public $data : any;
	//     public $el : HTMLElement;
	//     public $options : Object;
	//     public $parent : VueApi;
	//     public $root : VueApi;
	//     public $children : VueApi[];
	//     public $refs : Object;
	//     public $els : Object;
	//     public $get : vuejs.$get;
	//     public $set : vuejs.$set;
	//     public $delete : vuejs.$delete;
	//     public $eval : vuejs.$eval;
	//     public $interpolate : vuejs.$interpolate;
	//     public $log : vuejs.$log;
	//     public $watch : vuejs.$watch;
	//     public $on : vuejs.$on<this>;
	//     public $once : vuejs.$once<this>;
	//     public $off : vuejs.$off<this>;
	//     public $emit : vuejs.$emit<this>;
	//     public $dispatch : vuejs.$dispatch<this>;
	//     public $broadcast : vuejs.$broadcast<this>;
	//     public $appendTo : vuejs.$appendTo<this>;
	//     public $before : vuejs.$before<this>;
	//     public $after : vuejs.$after<this>;
	//     public $remove : vuejs.$remove<this>;
	//     public $nextTick : vuejs.$nextTick;
	//     public $mount : vuejs.$mount<this>;
	//     public $destroy : vuejs.$destroy;
	//     public $compile : vuejs.$compile;
	// }
	//
	// @VueComponent('test-component', '#template-id')
	// class TestComponent extends VueApi {
	//
	//     //tag things with @data for them to be in the data package vue expects
	//     @data public message : string;
	//
	//     public notData : any; //omit the @data to have a non-observed variable
	//
	//     //tag things with @prop to declare them as prop, the parameters here are all optional
	//     @prop({ required: true, validator: function(v : any) { return true; } })
	//     public someProp : string = 'default value'; //set prop with a default value
	//
	//     //inject http, this is available before your constructor runs
	//     @inject('services.http') public http : any;
	//
	//     constructor() {
	//         super();
	//         //http is defined here because it was injected
	//         //note that you dont have to do any this.http = http in the constructor
	//         this.http.get('stuff');
	//         this.message = 'oh hello there';
	//         this.someProp = 'constructor value';
	//     }
	//
	//     //fires when this.message is assigned to
	//     @watch('message')
	//     doThing(newMessage : string, oldMessage : string) : void {
	//         console.log('message changed from', oldMessage, 'to', newMessage);
	//     }
	//
	//     //every time the component recieves this event
	//     //run this method, handles `this` properly
	//     @on('someEvent')
	//     doMoreThings() : void {
	//     }
	//
	//
	//     @once('someEvent')
	//     public handleEventOnce() : void {}
	//
	//     //this is a computed property and is observed by the template
	//     public get batman() : any {
	//         return 'the bat man';
	//     }
	// }
	//
	// @VueComponent('test-subclass', '#template-id')
	// class TestSubclass extends VueApi {
	//
	//     public thing2 : string;
	//
	//     //@inject('dataSource.prescription')
	//     public rxSource : any;
	//
	//     //@inject('search.local')
	//     @data public exposedThing : string;
	//
	//     constructor() {
	//         super();
	//         this.thing2 = 'here';
	//         this.exposedThing = 'excellent';
	//     }
	//
	//     public ready() : void {
	//         setTimeout(() => {
	//             this.$emit('someTimeout');
	//         }, 1000);
	//     }
	//
	//     @on('someTimeout')
	//     public doMoreThings() : void {
	//         this.exposedThing = 'even more excellent';
	//     }
	//
	//     @once('someTimeout')
	//     public handleEventOnce() : void {}
	// }
	//
	// // Injector.create(Type).then(() => {});
	//
	// // Injector.mock(thing, key, mockName, impl);
	//
	// // Injector.create(thing).then(function () {
	// //
	// // });
	//
	// // Injector.provide('key', value);
	// // Injector.provide('search.local', value);
	//
	// // new TestComponent(); //dont do this find a way to prevent it since we should always have no constructor arguments for components
	// //
	// // Injector.provide('search.local', new Service());
	// // Injector.provide('search.global', new Service());
	//
	// // Injector.create(TestSubclass);
	// //
	// // VueComponent('test-component2', '#alternate')(TestComponent, {
	// //     injectedFieldName: 'instance'
	// // });
	// //
	// // Injector.create(TestComponent, {
	// //     $http: Injector.get('http')
	// // });
	// //
	// // Injector.provide('key', function () {
	// //     return new Service();
	// // });
	// //
	// new Vue({ el: '#app' }); 


/***/ }
]);