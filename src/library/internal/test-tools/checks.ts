//----------------------------------------------------------------------------------------------------------------------
// Verifications to run on a data-driven test template.
//----------------------------------------------------------------------------------------------------------------------

abstract class Checks<R> {

    //------------------------------------------------------------------------------------------------------------------
    // Callback to actually run the test.
    //------------------------------------------------------------------------------------------------------------------

    protected abstract runTestAndValidateResult(description: string, validation: internal.Consumer<R>): this;
    protected abstract runTestAndValidateError(description: string, validation: internal.Consumer<Error>): this;

    //------------------------------------------------------------------------------------------------------------------
    // Verify that a specific value is returned.
    //------------------------------------------------------------------------------------------------------------------

    public returns(expectedValue: R): this {
        return this.runTestAndValidateResult(
            `returns ${stringify(expectedValue)}`,
            result => expect(result).toBeEqualTo(expectedValue instanceof internal.PreStringifiedValue ? expectedValue.value : expectedValue)
        );
    }

    //------------------------------------------------------------------------------------------------------------------
    // Verify that a specific exception is thrown.
    //------------------------------------------------------------------------------------------------------------------

    public throwsError(expectedError: ValueOrPreStringified<Error>): this {
        return this.runTestAndValidateError(
            `throws ${stringifyErrorForDisplay(expectedError)}`,
            actualError => expect(stringifyErrorForComparison(actualError))
                .toBeEqualTo(stringifyErrorForComparison(expectedError))
        );
    }
}
