//----------------------------------------------------------------------------------------------------------------------
// An abstraction layer representing a test backend like Jest or Jasmine.
//----------------------------------------------------------------------------------------------------------------------

abstract class TestBackend {

    public abstract testGroup(description: string, action: type.Action): void;
    public abstract testCase(description: string, action: type.Action): void;
    public abstract assertEquals(actualValue: any, expectedValue: any): void;
}

//----------------------------------------------------------------------------------------------------------------------
// A facade for Jest.
//----------------------------------------------------------------------------------------------------------------------

class Jest extends TestBackend {

    private readonly describe = (global as any)['describe'];
    private readonly test = (global as any)['test'];
    private readonly expect = (global as any)['expect'];

    public get isInUse() {
        return 0 < process.argv.filter(argument => argument.match(/jest/i)).length;
    }

    public testGroup(description: string, action: type.Action): void {

        this.describe(description, () => { action() });
    }

    public testCase(description: string, action: type.Action): void {
        this.test(description, () => { action() });
    }

    public assertEquals(actualValue: any, expectedValue: any) {
        this.expect(actualValue).toEqual(expectedValue);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// A facade for Jasmine.
//----------------------------------------------------------------------------------------------------------------------

class Jasmine extends TestBackend {

    private readonly describe = (global as any)['describe'];
    private readonly it = (global as any)['it'];
    private readonly expect = (global as any)['expect'];

    public get isInUse() {
        return 0 < process.argv.filter(argument => argument.match(/jasmine/i)).length;
    }

    public testGroup(description: string, action: type.Action) {
        this.describe(`${description} =>`, () => { action() });
    }

    public testCase(description: string, action: type.Action) {
        this.it(description, () => { action() });
    }

    public assertEquals(actualValue: any, expectedValue: any) {
        this.expect(actualValue).toEqual(expectedValue);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Set up the correct facade for the currently used test backend.
//----------------------------------------------------------------------------------------------------------------------

const testBackend = [new Jasmine(), new Jest()].filter(backend => backend.isInUse)[0] as TestBackend;
