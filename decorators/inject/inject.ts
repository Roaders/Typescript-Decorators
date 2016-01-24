/**
 * Created by Giles on 22/01/2016.
 */


module PricklyThistle.Decorators {

    export interface IInjector {
        get(name: string): any;
    }

    interface IHasInjections {
        ___inject___: {[propertyName: string]:string};
    }
    interface IHasInit {
        ___init___: string[];
    }

    var _injector: IInjector;
    var _pendingInstances: any[];

    //  Decorator Functions

    export function inject( injectionId: string ): (target: Object, propertyName: string ) => void {

        return(target: Object, propertyName: string ): void => {

            let hasInjections: IHasInjections = <any>target.constructor;

            if (!hasInjections.hasOwnProperty("___inject___")) {
                hasInjections.___inject___ = {};
            }

            hasInjections.___inject___[propertyName] = injectionId;
        }
    }

    export function init(): (target: any, functionName: string, descriptor: TypedPropertyDescriptor<any> ) => TypedPropertyDescriptor<any> {

        return(target: any, functionName: string, descriptor: TypedPropertyDescriptor<any> ) => {

            let hasInit: IHasInit = <any>target.constructor;

            if (!hasInit.hasOwnProperty("___init___")) {
                hasInit.___init___ = [];
            }

            hasInit.___init___.push(functionName);


            return descriptor;
        }
    }

    export function injectClass(): (target: Object ) => void {

        return(target: Object ): void => {

            var originalConstructor: any = target;

            function constructInstance( constructor, args) {
                var c : any = function () {
                    return constructor.apply(this, args);
                };
                c.prototype = constructor.prototype;
                return new c();
            }

            var newConstructor : any = function (...args) {
                const instance: any = constructInstance(originalConstructor, args);

                configureInstance(instance);

                return instance;
            };

            newConstructor.prototype = originalConstructor.prototype;
            return newConstructor;
        }
    }

    //  Injection Functions

    export function updateInjector(injector: IInjector): void{
        _injector = injector;

        if(_pendingInstances){
            _pendingInstances.forEach((instance) => {
                configureInstance(instance);
            });
        }
    }

    function configureInstance( instance: any ): void {

        if( !_injector ){
            if(!_pendingInstances){
                _pendingInstances = [];
            }
            _pendingInstances.push(instance);
            return;
        }

        performInjections(instance);
        initialiseInstance(instance);
    }

    function performInjections(instance: any): void {
        let hasInjections: IHasInjections = <any>instance.constructor;

        if( hasInjections.___inject___ ) {
            for( var propertyName in hasInjections.___inject___ ){
                const injectionKey: string = hasInjections.___inject___[propertyName];
                console.log( `Injecting ${injectionKey} injection key into property ${propertyName}` );
                instance[propertyName] = _injector.get(injectionKey);
            }
        }
    }

    function initialiseInstance(instance: any): void {
        let hasInit: IHasInit = <any>instance.constructor;

        if( hasInit.___init___ ) {
            hasInit.___init___.forEach(( methodName) => {
                console.log( `Calling init function ${methodName}` );
                instance[methodName]();
            });
        }
    }

}