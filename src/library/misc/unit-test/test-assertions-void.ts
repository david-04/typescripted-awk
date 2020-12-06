namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // Assertions that are applicable to all test cases, including those without return value.
    //
    // @brief   Assertions for all test cases.
    // @type    P The types of the parameters constituting a set of test data.
    //------------------------------------------------------------------------------------------------------------------

    export interface TestAssertionsVoid<P extends any[]> {

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

        when(...parameters: { [i in keyof P]: P[i] | PreStringifiedValue<P[i]> }): this;

        //--------------------------------------------------------------------------------------------------------------
        // Assert that the current set of test data causes the given exception to be thrown. Both, the actual and the
        // expected error are stringified before the comparison. The stack trace is not stringified and therefore does
        // not need to match..
        //
        // @brief   Assert that the given exception was thrown.
        // @param   expectedError The expected Error that should be thrown.
        //--------------------------------------------------------------------------------------------------------------

        throws(expectedError?: Error | string | RegExp | PreStringifiedValue<Error | string | RegExp>): this;
    }
}
