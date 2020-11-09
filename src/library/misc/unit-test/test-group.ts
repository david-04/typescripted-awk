//----------------------------------------------------------------------------------------------------------------------
// Create a group for test cases. Groups can be nested to organize tests in a hierarchical structure:
//
// ```typescript
// testGroup('Checks', () => {
//     testGroup('isBoolean', () => {
//         testCase('isBoolean(1) returns false', () => {
//             // test case implementation
//         });
//     });
// });
// ```
//
// The same group nesting can also be achieved by passing all groups as an array:
//
// ```typescript
// testGroup(['Checks', 'isBoolean'], () => {
//     testCase('isBoolean(1) returns false', () => {
//         // test case implementation
//     });
// });
// ```
//
// Groups can also be passed as an array directly to `testCase()`:
//
// ```typescript
// testCase(['Checks', 'isBoolean', 'isBoolean(1) returns false'], () => {
//     // test case implementation
// });
// ```
//
// Test cases can be run through Jasmine, Jest, or (without external test framework) directly via Node by executing
// the source file that contains the test cases.
//
// @brief   Create a test case group.
// @param   name The group name or an array of nested group names.
// @param   action A function that creates test cases or further nested groups.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function testGroup(name: internal.ValueOrArray<string>, action: internal.Action): void {

    const groups = Array.isArray(name) ? name : [name]
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

namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // Create nested test case groups mirroring the folder hierarchy.
    //
    // @brief   Create test case groups based on the given file's folder hierarchy.
    //----------------------------------------------------------------------------------------------------------------------

    export interface TestGroupForFile {

        //--------------------------------------------------------------------------------------------------------------
        // Run tests within auto-generated groups based on a file's folder hierarchy. Pass the predefined variable
        // `__filename` to have Node insert the current filename at runtime:
        //
        // ```typescript
        // // Current file: C:\My-Project\src\tools\tests\helpers.spec.ts
        //
        // testGroupForFile(__filename, () => {
        //     testCase("my test case", () => {
        //         // runs as: tools => helpers => my test case
        //     });
        // });
        // ```
        //
        // @brief   Run tests within auto-generated groups based on a file's folder hierarchy.
        // @param   filename The filename and path.
        // @param   action The test case (or other test groups) to run.
        //--------------------------------------------------------------------------------------------------------------

        (filename: string, action: Action): void;

        //--------------------------------------------------------------------------------------------------------------
        // Run tests within auto-generated groups based on a file's folder hierarchy. Pass the predefined variable
        // `__filename` to have Node insert the current filename at runtime:
        //
        // ```typescript
        // // Current file: C:\My-Project\src\tools\tests\helpers.spec.ts
        //
        // testGroupForFile(__filename, () => {
        //     testCase("my test case", () => {
        //         // runs as: tools => helpers => my test case
        //     });
        // });
        // ```
        //
        // Further arbitrary groups can be nested within the folder hierarchy by passing a group name as an optional
        // second parameter:
        //
        // ```typescript
        // // Current file: C:\My-Project\src\tools\tests\helpers.spec.ts
        //
        // testGroupForFile(__filename, "error handling", () => {
        //     testCase("my test case", () => {
        //         // runs as: tools => helpers => error handling => my test case
        //     });
        // });
        // ```
        //
        // The optional group parameter can also be an array, causing multiple nested groups to be created.
        //
        // @brief   Run tests within auto-generated groups based on a file's folder hierarchy.
        // @param   filename The filename and path.
        // @param   nestedGroups Additional groups to be nested within the folder hierarchy.
        // @param   action The test case (or other test groups) to run.
        //--------------------------------------------------------------------------------------------------------------

        (filename: string, nestedGroups: ValueOrArray<string>, action: Action): void;

        //--------------------------------------------------------------------------------------------------------------
        // By default, only sub-folders below the `src` folder are used to create the test case groups. This can be
        // changed via `setRootFolder()` to a different folder name:
        //
        // ```typescript
        // // Current file: C:\My-Project\src\tools\tests\helpers.spec.ts
        //
        // testGroupForFile.setRootFolder("my-project"); // it's case-insensitive
        //
        // testGroupForFile(__filename, () => {
        //     testCase("my test case", () => {
        //         // runs as: src => tools => helpers => my test case
        //     });
        // });
        // ```
        //
        // The folder name is treated case-insensitive. If multiple names are passed, only the top-most in the folder
        // hierarchy is used.
        //
        // @brief   Set the folder up to which the path should not be used to form groups.
        // @param   folderNames All folders that should be treated as root folders.
        //--------------------------------------------------------------------------------------------------------------

        setRootFolder(...folderNames: string[]): void;

        //--------------------------------------------------------------------------------------------------------------
        // Before generating test case groups, some intermediate folders (like `test` and `specs`) and some file
        // extensions(like`.test.ts` or`.tsx`) are removed from the path. The built-in cleansing rules can be overridden
        // by passing alternative rules to `setCleansingRules()`:
        //
        // ```typescript
        // testGroupForFile.setCleansingRules(
        //     { search: /(\.(tests?|specs?|tsx?|jsx?))+$/g, replace: "" },
        //     { search: /\/(test|spec)s?\//g, replace: "/" }
        // );
        // ```
        //
        // The rules in this example are the built-in default ones.
        //
        // @brief   Set the search-and-replace rules for cleansing the path before forming groups.
        // @param   rules The search-and-replace rules for cleansing.
        //--------------------------------------------------------------------------------------------------------------

        setCleansingRules(...rules: Array<{ search: RegExp, replace?: string } | { delete: RegExp }>): void;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Convert a filename and path into groups.
//----------------------------------------------------------------------------------------------------------------------

function filenameToTestGroup(
    file: string,
    rootFolders: string[],
    cleansingRules: Array<{ search: RegExp, replace: string }>
) {

    file = file.replace(/\\/g, "/");
    cleansingRules.forEach(rule => file = file.replace(rule.search, rule.replace));

    let groups = file.split(/\//);
    for (let index = 0; index < groups.length; index++) {
        if (rootFolders.filter(folder => folder.toLowerCase() === groups[index].toLowerCase()).length) {
            groups = groups.slice(index + 1);
            break;
        }
    }

    return groups;
}

//----------------------------------------------------------------------------------------------------------------------
// Run tests within auto-generated groups based on a file's folder hierarchy. Pass the predefined variable `__filename`
// to have Node insert the current filename at runtime:
//
// ```typescript
// // Current file: C:\My-Project\src\tools\tests\helpers.spec.ts
//
// testGroupForFile(__filename, () => {
//     testCase("my test case", () => {
//         // runs as: tools => helpers => my test case
//     });
// });
// ```
//
// All leading path components up to the `src` folder are omitted. The start folder can be changed via
// `setRootFolder()`:
//
// ```typescript
// // Current file: C:\My-Project\src\tools\tests\helpers.spec.ts
//
// testGroupForFile.setRootFolder("my-project"); // it's case-insensitive
//
// testGroupForFile(__filename, () => {
//     testCase("my test case", () => {
//         // runs as: src => tools => helpers => my test case
//     });
// });
// ```
//
// Some intermediate folders (like `test` and `specs`) and file extensions (like `.test.ts` or `.tsx`) are omitted.
// The built-in rules can be replaced via `setCleansingRules()`:
//
// ```typescript
// testGroupForFile.setCleansingRules(
//     { search: /(\.(tests?|specs?|tsx?|jsx?))+$/g, replace: "" },
//     { search: /\/(test|spec)s?\//g, replace: "/" }
// );
// ```
//
// The rules in this example are the same as the default built-in ones. All cleansing rules are applied after the path
// has been converted to forward slashes(e.g. `C:/My-Project/src/...`). There's no need to handle backslashes.
//
// Further arbitrary groups can be nested within the folder hierarchy by passing a group name as an optional second
// parameter:
//
// ```typescript
// // Current file: C:\My-Project\src\tools\tests\helpers.spec.ts
//
// testGroupForFile(__filename, "error handling", () => {
//     testCase("my test case", () => {
//         // runs as: tools => helpers => error handling => my test case
//     });
// });
// ```
//
// The optional group parameter can also be an array, causing multiple nested groups to be created.
//
// @brief   Create test case groups based on the given file's folder hierarchy.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

const testGroupForFile: internal.TestGroupForFile = (() => {

    let rootFolders = ["src"]
    let cleansingRules: Array<{ search: RegExp, replace: string }> = [
        { search: /(\.(tests?|specs?|tsx?|jsx?))+$/g, replace: "" },
        { search: /\/(test|spec)s?\//g, replace: "/" },
    ];

    type Groups = internal.ValueOrArray<string>;
    type Action = internal.Action;

    function testGroupForFile(filename: string, nestedGroups: Groups, action: Action): void;
    function testGroupForFile(filename: string, action: internal.Action): void;
    function testGroupForFile(filename: string, nestedGroupsOrAction: Groups | Action, action?: Action) {

        const groups = filenameToTestGroup(filename, rootFolders, cleansingRules);
        if ("string" === typeof nestedGroupsOrAction) {
            groups.push(nestedGroupsOrAction);
        } else if (isArray(nestedGroupsOrAction)) {
            nestedGroupsOrAction.forEach(group => groups.push(group));
        }

        testGroup(
            groups, isFunction(nestedGroupsOrAction) ? nestedGroupsOrAction : isFunction(action) ? action : () => { }
        );
    }

    function setRootFolders(...folders: string[]) {
        rootFolders = folders.map(folder => folder.trim()).filter(folder => folder);
    }

    function setCleansingRules(...rules: Array<{ search?: RegExp, replace?: string, delete?: RegExp }>) {

        cleansingRules = rules.map(rule => {
            if (undefined !== rule.delete) {

                return { search: rule.delete, replace: "" };
            } else {
                return { search: rule.search!, replace: rule.replace! }
            }
        });
    }

    let result = testGroupForFile as internal.TestGroupForFile;
    result.setRootFolder = setRootFolders;
    result.setCleansingRules = setCleansingRules;

    return result;

})();

//----------------------------------------------------------------------------------------------------------------------
// Get the name and path of the current file.
//----------------------------------------------------------------------------------------------------------------------

function getCurrentFilename(filename?: string): string {

    if (!filename || "__" + "FILE__" === filename) {

        const error = new Error();
        Error.captureStackTrace(error, getCurrentFilename);
        if (error.stack) {
            let line = `${error.stack}`.split(/\r?\n/).filter(line => line.match(/^[ \t]+at /))[0];
            if (line.match(/\)/)) {
                line = line.replace(/^[^\(]*\(/, "").replace(/\)$/, "")
            } else {
                line = line.replace(/^[ \t]*at /, "")
            }
            return line.replace(/(:\d+)+$/, "");
        }
    }

    return filename ?? "";
}
