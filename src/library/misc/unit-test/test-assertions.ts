//----------------------------------------------------------------------------------------------------------------------
// Implementation of all test assertions.
//----------------------------------------------------------------------------------------------------------------------

abstract class TestAssertions<P extends any[], R> implements
    internal.TestAssertionsVoid<P>,
    internal.TestAssertionsAny<P, R> {

    //------------------------------------------------------------------------------------------------------------------
    // Start a new test run with a different set of test data.
    //------------------------------------------------------------------------------------------------------------------

    public abstract when(...parameters: { [i in keyof P]: P[i] | internal.PreStringifiedValue<P[i]>; }): this;

    //------------------------------------------------------------------------------------------------------------------
    // Run the given validation on the return value.
    //------------------------------------------------------------------------------------------------------------------

    protected abstract validateResult(description: string, validate: internal.Consumer<R>): this;

    //------------------------------------------------------------------------------------------------------------------
    // Run the given validation on the exception thrown (and fail if no exception was raised).
    //------------------------------------------------------------------------------------------------------------------

    protected abstract validateException(description: string, validate: internal.Consumer<any>): this;

    //------------------------------------------------------------------------------------------------------------------
    // Run the given validation on the exception thrown (and fail if no exception was raised).
    //------------------------------------------------------------------------------------------------------------------

    protected abstract getException(): any;

    //------------------------------------------------------------------------------------------------------------------
    // Assert that the current set of test data returns the given return value.
    //------------------------------------------------------------------------------------------------------------------

    public returns(expectedValue: R | internal.PreStringifiedValue<R>): this {

        const description = `returns ${stringify.inline(expectedValue)}`
        expectedValue = expectedValue instanceof internal.PreStringifiedValue ? expectedValue.value : expectedValue;
        return this.validateResult(description, result => {
            if ("object" === typeof expectedValue || "object" === typeof result || isNaN(expectedValue as any)) {
                assert.deepStrictEqual(result, expectedValue);
            } else if (result !== expectedValue) {
                throw new Error(`Expected ${stringify.inline(expectedValue)} but got ${stringify.inline(result)}`);
            }
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Assert that the current set of test data causes the given exception to be thrown.
    //------------------------------------------------------------------------------------------------------------------

    public throws(
        expectedError?: Error | string | RegExp | internal.PreStringifiedValue<Error | string | RegExp>
    ): this {

        const expected = expectedError instanceof internal.PreStringifiedValue ? expectedError.value : expectedError;
        const expectedStringified = stringify.inline(expected);
        const actual = this.getException();
        const actualMessage = actual instanceof Error ? actual.message : `${actual}`;
        const actualStringified = stringify.inline(actualMessage);

        if (undefined === expected) {
            return this.validateException(
                `throws an exception`,
                () => { }
            );
        } else if (isString(expected)) {
            return this.validateException(`throws ${expectedStringified}`, () => {
                if (actualMessage !== expected) {
                    assert.fail(
                        `Expected an error message containing ${expectedStringified} but got ${actualStringified}`
                    );
                }
            });
        } else if (isRegExp(expected)) {
            return this.validateException(`throws a message containing ${expectedStringified}`, () => {
                if (!actualMessage.match(expected)) {
                    assert.fail(
                        `Expected an error message containing ${expectedStringified} but got ${actualStringified}`
                    );
                }
            });
        } else {
            return this.validateException(
                `throws ${stringify.inline(expectedError)}`,
                actualError => assert.deepStrictEqual(stringify.inline(actualError), stringify.inline(expected))
            );
        }
    }
}
