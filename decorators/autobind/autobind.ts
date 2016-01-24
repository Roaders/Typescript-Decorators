
module PricklyThistle.Decorators {
    
    export function autobind(): (target: Object, functionName: string, descriptor ) => PropertyDescriptor {
        
        return ( target: any, functionName: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
            
            const originalFunction = descriptor.value;

            delete descriptor.value;
            delete descriptor.writable;
            
            descriptor.get = function() {
                if( this === target.prototype || this.hasOwnProperty(functionName) ) {
                    return originalFunction;
                }
                
                let boundFunction = originalFunction.bind(this);

                Object.defineProperty( this, functionName, {
                   value:  boundFunction,
                   configurable: true,
                   writable: true
                });
                
                return boundFunction;
            };
            
            return descriptor;
        }
    }
}