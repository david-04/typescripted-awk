//----------------------------------------------------------------------------------------------------------------------
// An abstraction layer representing a test backend like Jest or Jasmine.
//----------------------------------------------------------------------------------------------------------------------

interface TestBackend {

    testGroup(description: string, action: internal.Action): void;
    testCase(description: string, action: internal.Action): void;
}

//----------------------------------------------------------------------------------------------------------------------
// A facade for Jest.
//----------------------------------------------------------------------------------------------------------------------

class Jest implements TestBackend {

    private readonly describe = (global as any)["describe"];
    private readonly test = (global as any)["test"];

    public get isInUse() {
        return 0 < process.argv.filter(argument => argument.match(/jest/i)).length && this.describe && this.test;
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

class Jasmine implements TestBackend {

    private readonly describe = (global as any)["describe"];
    private readonly it = (global as any)["it"];

    public get isInUse() {
        return 0 < process.argv.filter(argument => argument.match(/jasmine/i)).length && this.describe && this.it;
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

const testBackends = [new Jasmine(), new Jest()].filter(backend => backend.isInUse);

//----------------------------------------------------------------------------------------------------------------------
// Get the current test backend instance and throw an error when not running in a supported test backend.
//----------------------------------------------------------------------------------------------------------------------

function getTestBackend() {

    if (!testBackends.length) {
        throw new Error("testGroup() and testCase() can only be called when running inside Jasmine or Jest");
    } else {
        return testBackends[0];
    }
}
