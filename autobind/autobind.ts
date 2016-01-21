

module PricklyThistle.Decorators {
    
    export function autobind(): (target: Object, functionName: string, descriptor ) => PropertyDescriptor {
        return ( target: Object, functionName: string, descriptor: PropertyDescriptor) => {
            return descriptor;
        }
    }
    
}