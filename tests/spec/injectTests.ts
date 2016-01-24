/**
 * Created by Giles on 22/01/2016.
 */

module PricklyThistle.Decorators.Tests {

    import inject = Decorators.inject;
    import injectClass = Decorators.injectClass;
    import init = Decorators.init;

    import IInjector = Decorators.IInjector;

    const valueOne: any = { message: "complexObjectOne" };
    const valueTwo: any = { message: "complexObjectTwo" };

    class MockInjector implements IInjector{

        private _lookup: {[injectId:string]:any} = {
            "injectIdOne": valueOne,
            "injectIdTwo": valueTwo
        };

        get( injectId: string ): any {
            return this._lookup[injectId];
        }
    }

    @injectClass()
    class SampleClass {

        propertyOne: any;
        propertyTwo: any;

        initOneValues: {propOne: any, propTwo: any}[] = [];
        initTwoValues: {propOne: any, propTwo: any}[] = [];

        initOne(){
            this.initOneValues.push( {propOne: this.propertyOne, propTwo: this.propertyTwo} );
        }

        initTwo(){
            this.initTwoValues.push( {propOne: this.propertyOne, propTwo: this.propertyTwo} );
        }
    }

    class SampleClassWithInit extends SampleClass{

        @init()
        initOne(){
            super.initOne();
        }

        @init()
        initTwo(){
            super.initTwo();
        }
    }

    class SampleClassWithInitAndInject extends SampleClass{

        @inject( "injectIdOne" )
        propertyOne: any;

        @inject( "injectIdTwo" )
        propertyTwo: any;

        @init()
        initOne(){
            super.initOne();
        }

        @init()
        initTwo(){
            super.initTwo();
        }
    }

    describe( "Inject decorator", () => {

        afterEach(() => {
           Decorators.updateInjector(undefined);
        });

        var injector: IInjector = new MockInjector();

        describe( "should construct a class with only injectClass decorator", () => {

            it( "with no calls or properties set after injector set", () => {
                setupInjector();
                var instance: SampleClass = new SampleClass();
                expectEmptyClass(instance);
            });

            it( "with no calls or properties set before injector set", () => {
                var instance: SampleClass = new SampleClass();
                expectEmptyClass(instance);
            });
        });

        describe( "should construct a class with injectClass and init decorators", () => {

            it( "and call init functions once when constructed after injector set", () => {
                setupInjector();
                var instance: SampleClass = new SampleClassWithInit();
                expectInitialisedEmptyClass( instance );
            } );

            it( "and call init functions once when constructed before injector set", () => {
                var instance: SampleClass = new SampleClassWithInit();
                expectEmptyClass( instance );
                setupInjector();
                expectInitialisedEmptyClass(instance);
            } );
        });

        describe( "should construct a class with injectClass, inject and init decorators", () => {

            it( "and setup class when constructed after injector set", () => {
                setupInjector();
                var instance: SampleClass = new SampleClassWithInitAndInject();
                expectInjectedInitialisedClass( instance );
            } );

            it( "and setup class when injector set", () => {
                var instance: SampleClass = new SampleClassWithInitAndInject();
                expectEmptyClass( instance );
                setupInjector();
                expectInjectedInitialisedClass(instance);
            } );
        });

        function setupInjector(){
            Decorators.updateInjector(injector);
        }

    } );

    function expectEmptyClass(instance: SampleClass) {
        expect(instance).toBeDefined();
        expect(instance.propertyOne).toBeUndefined();
        expect(instance.propertyTwo).toBeUndefined();
        expect(instance.initOneValues).toEqual([]);
        expect(instance.initTwoValues).toEqual([]);
    }

    function expectInitialisedEmptyClass(instance: SampleClass) {
        expect(instance).toBeDefined();
        expect(instance.propertyOne).toBeUndefined();
        expect(instance.propertyTwo).toBeUndefined();
        expect(instance.initOneValues).toEqual([{propOne: undefined, propTwo: undefined}]);
        expect(instance.initTwoValues).toEqual([{propOne: undefined, propTwo: undefined}]);
    }

    function expectInjectedInitialisedClass(instance: SampleClass) {
        expect(instance).toBeDefined();
        expect(instance.propertyOne).toEqual(valueOne);
        expect(instance.propertyTwo).toEqual(valueTwo);
        expect(instance.initOneValues).toEqual([{propOne: valueOne, propTwo: valueTwo}]);
        expect(instance.initTwoValues).toEqual([{propOne: valueOne, propTwo: valueTwo}]);
    }
}