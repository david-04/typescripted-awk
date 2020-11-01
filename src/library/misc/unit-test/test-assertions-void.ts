namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // Assertions for all test cases, including those without return value.
    // @type    P The test template's tuple of parameters.
    //------------------------------------------------------------------------------------------------------------------

    export interface TestAssertionsVoid<P extends any[]> {

        //--------------------------------------------------------------------------------------------------------------
        // Re-run the test with a new set of test data.
        // @param   parameters The test data (can be passed as pre-stringified value).
        // @return  Returns a reference to itself.
        //--------------------------------------------------------------------------------------------------------------

        with(...parameters: { [i in keyof P]: P[i] | PreStringifiedValue<P[i]> }): this;

        //--------------------------------------------------------------------------------------------------------------
        // Assert that the current set of test data causes the given exception to be thrown.
        // @param   expectedError The expected Error instance that should be thrown.
        // @return  Returns a reference to itself.
        //--------------------------------------------------------------------------------------------------------------

        exceptionIs(expectedError: Error | PreStringifiedValue<Error>): this;
    }
}
