namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // The description and action of a  test case.
    //------------------------------------------------------------------------------------------------------------------

    export interface TestDescriptor<R> {

        // Optional group(s) to wrap the test case
        group?: ValueOrArray<string>;

        // The test case description with placeholders for the actual parameters ($1, $2... and $*).
        description: string;

        // The test case implementation.
        action: Supplier<R>;
    };

    //------------------------------------------------------------------------------------------------------------------
    // Blueprint of a test case that can be run with different sets of input data.
    // @type    P Tuple of the test parameters' types.
    // @type    T The class providing the applicable assertions
    //------------------------------------------------------------------------------------------------------------------

    export interface TestTemplate<P extends any[], T> {

        //--------------------------------------------------------------------------------------------------------------
        // Instantiate the test template with the given set of test data.
        // @param   parameters The test data set.
        // @return  Returns an assertion class specific to the test case's return type.
        //--------------------------------------------------------------------------------------------------------------

        with(...parameters: { [i in keyof P]: P[i] | internal.PreStringifiedValue<P[i]> }): this & T;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Implementation of the internal.TestTemplate.
//----------------------------------------------------------------------------------------------------------------------

class TestTemplate<P extends any[], R, T extends TestTemplate<P, R, any>>
    extends internal.TestAssertions<P, R>
    implements internal.TestTemplate<P, T> {

    private _testRun?: { description: string, descriptor: internal.TestDescriptor<R>, result?: R, exception?: any };

    //------------------------------------------------------------------------------------------------------------------
    // Initialize a new TestTemplate.
    //------------------------------------------------------------------------------------------------------------------

    constructor(private readonly supplier: (...parameters: P) => internal.TestDescriptor<R>) {
        super();
    }

    //------------------------------------------------------------------------------------------------------------------
    // Instantiate a new TestTemplate with the given set of test data.
    //------------------------------------------------------------------------------------------------------------------

    public with(...parameters: { [i in keyof P]: P[i] | internal.PreStringifiedValue<P[i]> }): this & T {

        const descriptor = this.supplier(
            ...parameters.map(param => param instanceof internal.PreStringifiedValue ? param.value : param) as P
        );
        const description = stringify.inline.format(descriptor.description, ...parameters);

        try {
            this._testRun = { description, descriptor, result: descriptor.action() };
        } catch (exception) {
            this._testRun = { description, descriptor, exception };
        }

        return this as this & T;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Getters.
    //------------------------------------------------------------------------------------------------------------------

    private get testRun() {
        if (!this._testRun) {
            throw new Error("A test result validation was invoked before passing any test data");
        }
        return this._testRun;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Add a test case that performs the given validation on the test action's current return value.
    //------------------------------------------------------------------------------------------------------------------

    protected validateResult(description: string, validate: internal.Consumer<R>): this {

        testGroup(this.testRun.descriptor.group ?? "", () => {
            testCase(`${this.testRun.description} ${description}`, () => {
                if (this.testRun.exception) {
                    throw this.testRun.exception;
                } else {
                    validate(this.testRun.result!);
                }
            });
        });

        return this;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Add a test case that performs the given validation on the test action's current exception.
    //------------------------------------------------------------------------------------------------------------------

    protected validateException(description: string, validate: internal.Consumer<any>): this {

        testGroup(this.testRun.descriptor.group ?? "", () => {
            testCase(`${this.testRun.description} ${description}`, () => {
                if (!this.testRun.exception) {
                    throw new Error("No exception was raised");
                } else {
                    validate(this.testRun.exception);
                }
            });
        });

        return this;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Create a test that can be run with different sets of input data.
// @param   supplier A function that supplies the test description and action.
// @type    R The test action's return type.
// @type    P Tuple of the supplier's parameter types.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function testTemplate<R extends undefined | null | boolean | number | string | Function | object, P extends any[]>(
    supplier: (...parameters: P) => internal.TestDescriptor<R>
): internal.TestTemplate<P, internal.TestAssertionsAny<P, R>>;

//----------------------------------------------------------------------------------------------------------------------
// Create a test that can be run with different sets of input data.
// @param   supplier A function that supplies the test description and action.
// @type    R The test action's return type.
// @type    P Tuple of the supplier's parameter types.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function testTemplate<P extends any[]>(
    supplier: (...parameters: P) => internal.TestDescriptor<void | never>
): internal.TestTemplate<P, internal.TestAssertionsVoid<P>>;

//----------------------------------------------------------------------------------------------------------------------
// Create a test that can be run with different sets of input data.
// @param   supplier A function that supplies the test description and action.
// @param   supplier A function that supplies the test description and action.
// @type    R The test action's return type.
// @type    P Tuple of the supplier's parameter types.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function testTemplate<R, P extends any[]>(supplier: (...parameters: P) => internal.TestDescriptor<R>) {
    return new TestTemplate(supplier);
}
