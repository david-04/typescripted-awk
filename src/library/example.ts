//----------------------------------------------------------------------------------------------------------------------
// The result of a sum operation and the values that went into the sum.
//
// @brief Result of a sum operation
// @level 2
//----------------------------------------------------------------------------------------------------------------------

interface SumResult {

    /** The values that have been summed up */
    components: number[];

    /** The sum of all components */
    sum: number;
}

//----------------------------------------------------------------------------------------------------------------------
// Add two numbers and return the sum, for example:
//
// ```
// add(2, 3) // returns 5
// ```
//
// There's really nothing more to say about this function
//
// @brief Sum up two numbers and return the result
// @param numbers The values to sum up
// @return The sum result including the values that went into the sum
// @level 1
//----------------------------------------------------------------------------------------------------------------------

function sum(...numbers: number[]): SumResult {
    return { components: numbers, sum: numbers.reduce((a, b) => a + b, 0) };
}
