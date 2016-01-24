/**
 * Created by Giles on 22/01/2016.
 */


module PricklyThistle.Decorators {

    export interface IInjector {
        get(name: string): any;
    }

    //  Decorator Functions

    export function inject( injectionId: string ): (target: any, propertyName: string ) => void {

        return(target: Object, propertyName: string ) => void{

        }
    }

    export function init(): (target: any, functionName: string, descriptor: TypedPropertyDescriptor<any> ) => TypedPropertyDescriptor<any> {

        return(target: any, functionName: string, descriptor: TypedPropertyDescriptor<any> ) => {
            return descriptor;
        }
    }

    export function injectClass(): (target: Object ) => void {

        return(target: Object ) => void{

        }
    }

    //  Injection Functions

    export function updateInjector(injector: IInjector): void{

    }

}