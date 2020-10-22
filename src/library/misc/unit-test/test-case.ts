//----------------------------------------------------------------------------------------------------------------------
// Add a test case with the given description. This function can only be called when running in Jasmine or Jest.
// Otherwise it throws an exception.
//
// ```ts
// testCase('isBoolean(1) returns false', () => {
//     // test case implementation
// });
// ```
//
// Passing an array instead of a string description creates nested groups.
//
// ```ts
// testCase(['Checks', 'isBoolean(1) returns false'], () => {
//     // test case implementation
// });
// ```
//
// The same effect can be achieved by nesting `testGroup()` and `testCase()`.
//
// ```ts
// testGroup('Checks', () => {
//     testCase('isBoolean(1) returns false', () => {
//         // test case implementation
//     });
// });
// ```
//
// @brief   Run the given action as a test case.
// @param   name The test case name or an array with nested group names.
// @param   action The test case implementation.
// @throws  Throws an exception when not running in Jasmine or Jest.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function testCase(name: internal.ValueOrArray<string>, action: internal.Action) {

    if (Array.isArray(name)) {
        if (name.length <= 1) {
            getTestBackend().testCase(name[0] ?? '', () => { action(); });
        } else {
            testGroup(name.slice(0, name.length - 1), () => testCase(name[name.length - 1], action));
        }
    } else {
        getTestBackend().testCase(name ?? '', () => { action(); });
    }
}
