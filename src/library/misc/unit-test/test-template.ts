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

    export interface TestTemplate<P extends Array<any>, T> {

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

class TestTemplate<P extends Array<any>, R, T extends TestTemplate<P, R, any>>
    extends internal.TestAssertions<P, R>
    implements internal.TestTemplate<P, T> {

    private descriptor: internal.TestDescriptor<R> = undefined as any;
    private result: R = undefined as any as R;
    private exception: any = undefined;

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

        const testTemplate = new TestTemplate(this.supplier);
        testTemplate.descriptor = (this.supplier as any)(
            ...parameters.map(param => param instanceof internal.PreStringifiedValue ? param.value : param)
        );

        try {
            testTemplate.result = testTemplate.descriptor.action();
        } catch (exception) {
            testTemplate.exception = exception;
        }

        return testTemplate as any;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Add a test case that performs the given validation on the test action's current return value.
    //------------------------------------------------------------------------------------------------------------------

    protected validateResult(description: string, validate: internal.Function1<R, void>): this {

        testCase(`${this.descriptor.description} ${description}`, () => {
            if (this.exception) {
                throw this.exception;
            } else {
                validate(this.result);
            }
        });

        return this;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Add a test case that performs the given validation on the test action's current exception.
    //------------------------------------------------------------------------------------------------------------------

    protected validateException(description: string, validate: internal.Function1<any, void>): this {

        testCase(`${this.descriptor.description} ${description}`, () => {
            if (!this.exception) {
                throw new Error("No exception was raised");
            } else {
                validate(this.exception);
            }
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

function testTemplate<R extends undefined | null | boolean | number | string | Function | object, P extends Array<any>>(
    supplier: (...parameters: P) => internal.TestDescriptor<R>
): internal.TestTemplate<P, internal.TestAssertionsAny<P, R>>;

//----------------------------------------------------------------------------------------------------------------------
// Create a test that can be run with different sets of input data.
// @param   supplier A function that supplies the test description and action.
// @type    R The test action's return type.
// @type    P Tuple of the supplier's parameter types.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function testTemplate<P extends Array<any>>(
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

function testTemplate<R, P extends Array<any>>(supplier: (...parameters: P) => internal.TestDescriptor<R>) {
    return new TestTemplate(supplier);
}
