//----------------------------------------------------------------------------------------------------------------------
// Add a test case group. It can only be called when running in Jasmine or Jest and throws an exception otherwise.
// Test groups can be nested to organize test cases in a hierarchical structure.
//
// ```ts
// testGroup('Checks', () => {
//     testGroup('isBoolean', () => {
//         testCase('isBoolean(1) returns false', () => {
//             // test case implementation
//         });
//     });
// });
// ```
//
// The same group nesting can be achieved with fewer code nesting by passing all groups as an array.
//
// ```ts
// testGroup(['Checks', 'isBoolean'], () => {
//     testCase('isBoolean(1) returns false', () => {
//         // test case implementation
//     });
// });
// ```
//
// Nested groups can also be passed directly to `testCase()` as an array.
//
// ```ts
// testCase(['Checks', 'isBoolean', 'isBoolean(1) returns false'], () => {
//     // test case implementation
// });
// ```
//
// @brief   Run the given action inside a test group.
// @param   group The group name or an array of nested group names.
// @param   action The code to run inside the test group.
// @throws  Throws an exception when not running in Jasmine or Jest.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function testGroup(group: internal.ValueOrArray<string>, action: internal.Action): void {

    const groups = Array.isArray(group) ? group : [group]
        .map(group => group.trim())
        .filter(group => group.length);

    if (groups.length) {
        getTestBackend().testGroup(groups[0], () => {
            if (1 < groups.length) {
                testGroup(groups.slice(1), action)
            } else {
                action();
            }
        });
    } else {
        action();
    }
}
