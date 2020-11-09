//----------------------------------------------------------------------------------------------------------------------
// Add a test case with the given description and action:
//
// ```typescript
// testCase('isBoolean(1) returns false', () => {
//     // test case implementation
// });
// ```
//
// Passing an array instead of a string description creates nested groups.
//
// ```typescript
// testCase(['Checks', 'isBoolean(1) returns false'], () => {
//     // test case implementation
// });
// ```
//
// The same effect can be achieved by nesting `testGroup()` and `testCase()`.
//
// ```typescript
// testGroup('Checks', () => {
//     testCase('isBoolean(1) returns false', () => {
//         // test case implementation
//     });
// });
// ```
//
// Test cases can be run through Jasmine, Jest, or (without external test framework) directly via Node by executing
// the source file that contains the test cases.
//
// @brief   Add a unit test.
// @param   description The test case description or an array with additional nested groups.
// @param   action The test case implementation.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function testCase(description: internal.ValueOrArray<string>, action: internal.Action) {

    if (Array.isArray(description)) {
        if (description.length <= 1) {
            getTestBackend().testCase(description[0]?.trim() ?? '', () => { action(); });
        } else {
            testGroup(description.slice(0, description.length - 1), () => testCase(description[description.length - 1], action));
        }
    } else {
        getTestBackend().testCase(description?.trim() ?? '', () => { action(); });
    }
}
