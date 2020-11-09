namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // The description and implementation of a test case that can be run with different sets of test data. It's returned
    // by the supplier passed to the `testTemplate()` function:
    //
    // ```typescript
    // const test = testTemplate((array: number[], filter: (n: number) => boolean) => ({
    //     description: "$1.filter($2)",
    //     action: () => array.filter(filter)
    // }));
    // ```
    //
    // @brief   Description and implementation of a data-driven test case.
    // @type    R The type of the value returned by the test action.
    //------------------------------------------------------------------------------------------------------------------

    export interface TestDescriptor<R> {

        //--------------------------------------------------------------------------------------------------------------
        // If set, the `group` property creates a test case group and runs all test iterations inside of it:
        //
        // ```typescript
        // testTemplate((value: any) => ({
        //     group: "is-functions",
        //     description: "isNumber($1)",
        //     action: () => isNumber(value)
        // }));
        // ```
        //
        // It can be set to an array of strings to create multiple nested groups:
        //
        // ```typescript
        // testTemplate((value: any) => ({
        //     group: ["misc", "assertions"],
        //     description: "isNumber($1)",
        //     action: () => isNumber(value)
        // }));
        // ```
        //
        // @brief   Test group(s) to be wrapped around the test runs.
        //--------------------------------------------------------------------------------------------------------------

        group?: ValueOrArray<string>;

        //--------------------------------------------------------------------------------------------------------------
        // The description of the test case. It's passed through `stringifier.format()` and can contain placeholders
        // for the actual test data (`$1`, `$2`, ... for individual parameters and `$*` for all parameters that are not
        // referenced otherwise):
        //
        // ```typescript
        // testTemplate((array: number[], filter: (n: number) => boolean) => ({
        //     description: "$1.filter($2)",
        //     action: () => array.filter(filter)
        // }));
        // ```
        //
        // The description should only summarize the action and not the the outcome (unless the test case implementation
        // includes assertions).
        //
        // @brief   Description of the test action (but not the expected result).
        //--------------------------------------------------------------------------------------------------------------

        description: string;

        //--------------------------------------------------------------------------------------------------------------
        // Implementation of the test case. Rather than checking the test result, it should rather just return it, so
        // so that test template's assertions can be applied.
        //
        // @brief   Implementation of the test case action.
        //--------------------------------------------------------------------------------------------------------------

        action: Supplier<R>;
    };

    //------------------------------------------------------------------------------------------------------------------
    // A generic test case that can be run with different sets of test data. It's created via the `testTemplate()`
    // function:
    //
    // ```typescript
    // testTemplate((array: number[], filter: (n: number) => boolean) => ({
    //     description: "$1.filter($2)",
    //     action: () => array.filter(filter)
    // }))
    //     .with([1, 2, 3], number => number <= 2).resultIs([1, 2]);
    // ```
    //
    // @brief   A generic test case that can be run with different sets of test data.
    // @type    P Tuple of the test data's types.
    // @type    T The class providing the applicable assertions (depends on the return type of the test action)
    //------------------------------------------------------------------------------------------------------------------

    export interface TestTemplate<P extends any[], T> {

        //--------------------------------------------------------------------------------------------------------------
        // Run the test with the given set of test data. The parameters are passed on to the test action. Subsequently,
        // assertions can then be applied to evaluate the test result:
        //
        // ```typescript
        // testTemplate((array: number[], filter: (n: number) => boolean) => ({
        //     description: "$1.filter($2)",
        //     action: () => array.filter(filter)
        // }))
        //     .with([1, 2, 3], number => number <= 2).resultIs([1, 2]);
        // ```
        //
        // @brief   Run the test with the given set of test data.
        // @return  An object providing assertion methods.
        //--------------------------------------------------------------------------------------------------------------

        with(...parameters: { [i in keyof P]: P[i] | internal.PreStringifiedValue<P[i]> }): this & T;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Implementation of the internal.TestTemplate.
//----------------------------------------------------------------------------------------------------------------------

class TestTemplate<P extends any[], R, T extends TestTemplate<P, R, any>>
    extends TestAssertions<P, R>
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
// Create a data-driven set of unit tests. The call to `testTemplate()` defines the test case description, the type of
// data required to run the test, and the test case implementation. It returns an object with a fluent API for passing
// actual test data and evaluating the results:
//
// ```typescript
// testTemplate((array: number[], filter: (n: number) => boolean) => ({
//     description: "$1.filter($2)",
//     action: () => array.filter(filter)
// }))
//     // pass a set of test data
//     .with([1, 2, 3], number => number <= 2)
//         // evaluate the results
//         .resultIs([1, 2])
//     // pass another set of test data
//     .with([1, 2, 3], () => false)
//         // evaluate the results
//         .resultIs([]);
// ```
//
// The test description is passed through `stringifier.format()` and can contain placeholders for the actual test data
// (`$1`, `$2`, ... for individual parameters and `$*` for all parameters that are not referenced otherwise). The test
// data and the expected result can be provided in a pre-stringified format. The native value is used to run the test,
// while the pre-rendered string representation is embedded into the test description:
//
// ```typescript
// testTemplate((array: number[], filter: (n: number) => boolean) => ({
//     description: "$1.filter($2)",
//     action: () => array.filter(filter)
// }))
//     // description: [1, 2].filter(n => n <= 2) returns [1, 2]
//     .with([1, 2], n => n <= 2)
//         .resultIs([1, 2])
//     // description: nonEmptyArray.filter(() => false) returns an empty array
//     .with(preStringify([1, 2]).as("nonEmptyArray"), () => false)
//         .resultIs(preStringify([]).as("an empty array"))
// ```
//
// Expected results can also be passed as part of the test data and evaluated in the test case implementation:
//
// ```typescript
// testTemplate((input: number[], filter: (n: number) => boolean, output: number[]) => ({
//     description: "$1.filter($2) = $3",
//     action: () => assert.deepStrictEqual(input.filter(filter), output)
// }))
//     .with([1, 2, 3], number => number <= 2, [1, 2])
//     .with([1, 2, 3], () => false, []);
// ```
//
// Data-driven test sets can be nested within `testGroup()`, to create a hierarchical structure. Groups can also be
// created, by passing them as string or as an array of nested groups directly to `testTemplate()`:
//
// ```typescript
// testTemplate((array: number[], filter: (n: number) => boolean) => ({
//     group: "array operations", // or ["arrays", "operations"] for nested groups
//     description: "$1.filter($2)",
//     action: () => array.filter(filter)
// }))
//     .with([1, 2, 3], number => number <= 2).resultIs([1, 2])
//     .with([1, 2, 3], () => false).resultIs([]);
// ```
//
// Data driven test cases can be run through Jasmine, Jest, or (without external test framework) directly via Node by
// executing the source file that contains the test cases.
//
// @brief   Create a generic test that can be run with different sets of test data.
// @param   supplier A function that supplies the test description and implementation.
// @return  An object with a fluent API for passing test data and evaluating the results.
// @type    R The test action's return type.
// @type    P Tuple of the test data's types.
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





