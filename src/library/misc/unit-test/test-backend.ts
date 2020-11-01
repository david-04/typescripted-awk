//----------------------------------------------------------------------------------------------------------------------
// An abstraction layer representing a test backend like Jest or Jasmine.
//----------------------------------------------------------------------------------------------------------------------

abstract class TestBackend {

    protected readonly global: any = global;

    abstract testGroup(description: string, action: internal.Action): void;
    abstract testCase(description: string, action: internal.Action): void;
}

//----------------------------------------------------------------------------------------------------------------------
// A facade for Jest.
//----------------------------------------------------------------------------------------------------------------------

class Jest extends TestBackend {

    private readonly describe = this.global.describe;
    private readonly test = this.global.test;

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

class Jasmine extends TestBackend {

    private readonly describe = this.global.describe;
    private readonly it = this.global.it;

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
// Built-in test backend.
//----------------------------------------------------------------------------------------------------------------------

class BuiltInTestBackend extends TestBackend {

    private readonly groupStack = new Array<string>();
    private passed = 0;
    private failed = 0;

    constructor() {
        super();
        process.on('beforeExit', () => {
            if (0 < this.failed) {
                console.log(`${this.passed} passed, ${this.failed} failed`);
            } else if (0 < this.passed) {
                console.log(`${this.failed ? "" : "\n"}${this.passed} passed`);
            }
        });
    }

    public get isInUse() {
        return true;
    }

    public testGroup(description: string, action: internal.Action) {
        this.groupStack.push(description);
        action();
        this.groupStack.pop();
    }

    public testCase(description: string, action: internal.Action) {
        try {
            action();
            this.passed++;
        } catch (exception) {
            this.groupStack.push(description);
            description = this.groupStack.filter(description => description).join(" => ")
            this.groupStack.pop();
            console.log(`${this.failed ? "" : "\n"}FAILED: ${description}\n\n${exception}\n`);
            this.failed++;
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Set up the correct facade for the currently used test backend.
//----------------------------------------------------------------------------------------------------------------------

const testBackends = [new Jasmine(), new Jest(), new BuiltInTestBackend()].filter(backend => backend.isInUse);

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
