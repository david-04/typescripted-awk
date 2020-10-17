//----------------------------------------------------------------------------------------------------------------------
// An abstraction layer representing a test backend like Jest or Jasmine.
//----------------------------------------------------------------------------------------------------------------------

abstract class TestBackend {

    public abstract testGroup(description: string, action: internal.Action): void;
    public abstract testCase(description: string, action: internal.Action): void;
}

//----------------------------------------------------------------------------------------------------------------------
// A facade for Jest.
//----------------------------------------------------------------------------------------------------------------------

class Jest extends TestBackend {

    private readonly describe = (global as any)['describe'];
    private readonly test = (global as any)['test'];

    public get isInUse() {
        return 0 < process.argv.filter(argument => argument.match(/jest/i)).length;
    }

    public testGroup(description: string, action: internal.Action): void {

        this.describe(description, () => { action() });
    }

    public testCase(description: string, action: internal.Action): void {
        this.test(description, () => { action() });
    }
}

//----------------------------------------------------------------------------------------------------------------------
// A facade for Jasmine.
//----------------------------------------------------------------------------------------------------------------------

class Jasmine extends TestBackend {

    private readonly describe = (global as any)['describe'];
    private readonly it = (global as any)['it'];

    public get isInUse() {
        return 0 < process.argv.filter(argument => argument.match(/jasmine/i)).length;
    }

    public testGroup(description: string, action: internal.Action) {
        this.describe(`${description} =>`, () => { action() });
    }

    public testCase(description: string, action: internal.Action) {
        this.it(description, () => { action() });
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Set up the correct facade for the currently used test backend.
//----------------------------------------------------------------------------------------------------------------------

const testBackend = [new Jasmine(), new Jest()].filter(backend => backend.isInUse)[0] as TestBackend;
