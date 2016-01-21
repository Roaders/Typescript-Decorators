
module PricklyThistle.Decorators.Tests {
    
    import autobind = PricklyThistle.Decorators.autobind;
        
    class Person{
        
        constructor( firstName: string, lastname: string ) {
            this.firstName = firstName;
            this.lastName = lastname;
        }
        
        firstName: string;
        lastName: string;
        
        @autobind()
        printName(): string {
            return this.firstName + " " + this.lastName;
        }
    }
    
    describe( "autobind descriptor", () => {
        
        const freddy: Person = new Person( "Freddy", "Krueger");
        const hannibal: Person = new Person( "Hannibal", "Lecter");
        
        const freddyFullName: string = "Freddy Krueger";
        const hannibalFullName: string = "Hannibal Lecter";
        
        const freddyPrintFunc: () => string = freddy.printName;
        const hannibalPrintFunc: () => string = hannibal.printName;
        
        it( "should return expected value when calling function directly", () => {
            expect( freddy.printName() ).toEqual( freddyFullName );
            expect( hannibal.printName() ).toEqual( hannibalFullName );
        });
        
        it( "should return expected value when calling function anonymously", () => {
            expect( freddyPrintFunc() ).toEqual( freddyFullName );
            expect( hannibalPrintFunc() ).toEqual( hannibalFullName );
        });
        
        it( "should return expected value when calling function with different this context", () => {
            expect( freddy.printName.apply(hannibal) ).toEqual( freddyFullName );
            expect( hannibal.printName.apply(freddy) ).toEqual( hannibalFullName );
        });
        
    } );
    
}

