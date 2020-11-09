//----------------------------------------------------------------------------------------------------------------------
// Implementation of all test assertions.
//----------------------------------------------------------------------------------------------------------------------

abstract class TestAssertions<P extends any[], R> implements
    internal.TestAssertionsVoid<P>,
    internal.TestAssertionsAny<P, R> {

    //------------------------------------------------------------------------------------------------------------------
    // Start a new test run with a different set of test data.
    //------------------------------------------------------------------------------------------------------------------

    public abstract with(...parameters: { [i in keyof P]: P[i] | internal.PreStringifiedValue<P[i]>; }): this;

    //------------------------------------------------------------------------------------------------------------------
    // Run the given validation on the return value.
    //------------------------------------------------------------------------------------------------------------------

    protected abstract validateResult(description: string, validate: internal.Consumer<R>): this;

    //------------------------------------------------------------------------------------------------------------------
    // Run the given validation on the exception thrown (and fail if no exception was raised).
    //------------------------------------------------------------------------------------------------------------------

    protected abstract validateException(description: string, validate: internal.Consumer<any>): this;

    //------------------------------------------------------------------------------------------------------------------
    // Assert that the current set of test data returns the given return value.
    //------------------------------------------------------------------------------------------------------------------

    public resultIs(expectedValue: R | internal.PreStringifiedValue<R>): this {

        const description = `returns ${stringify.inline(expectedValue)}`
        expectedValue = expectedValue instanceof internal.PreStringifiedValue ? expectedValue.value : expectedValue;
        return this.validateResult(description, result => assert.deepStrictEqual(result, expectedValue));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Assert that the current set of test data causes the given exception to be thrown.
    //------------------------------------------------------------------------------------------------------------------

    public exceptionIs(expectedError: Error | internal.PreStringifiedValue<Error>): this {

        const description = `throws ${stringify.inline(expectedError)}`;
        expectedError = expectedError instanceof internal.PreStringifiedValue ? expectedError.value : expectedError;
        return this.validateException(description, actualError =>
            assert.deepStrictEqual(stringify.inline(actualError), stringify.inline(expectedError))
        );
    }
}
