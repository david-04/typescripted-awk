namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // Assertions that are applicable to all test cases with a return value.
    //
    // @brief   Assertions for all test cases with a return value.
    // @type    P The types of the parameters constituting a set of test data.
    //------------------------------------------------------------------------------------------------------------------

    export interface TestAssertionsAny<P extends any[], R> extends TestAssertionsVoid<P> {

        //--------------------------------------------------------------------------------------------------------------
        // Assert that the current set of test data returns the given return value.
        //
        // @param   expectedReturnValue The expected return value.
        //--------------------------------------------------------------------------------------------------------------

        resultIs(expectedReturnValue: R | PreStringifiedValue<R>): this;
    }
}
