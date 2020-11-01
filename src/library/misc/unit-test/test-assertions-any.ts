namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // Assertions for all test cases that have a return value.
    // @type    P The test template's tuple of parameters.
    //------------------------------------------------------------------------------------------------------------------

    export interface TestAssertionsAny<P extends any[], R> extends TestAssertionsVoid<P> {

        //--------------------------------------------------------------------------------------------------------------
        // Assert that the current set of test data returns the given return value.
        // @param   expectedReturnValue The expected return value.
        // @return  Returns a reference to itself.
        //--------------------------------------------------------------------------------------------------------------

        resultIs(expectedReturnValue: R | PreStringifiedValue<R>): this;
    }
}
