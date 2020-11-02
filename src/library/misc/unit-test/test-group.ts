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


namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // Create nested test groups mirroring the folder hierarchy.
    //------------------------------------------------------------------------------------------------------------------

    export interface TestGroupForFile {

        //--------------------------------------------------------------------------------------------------------------
        // Create nested test groups for the given file.
        // @param   filename The filename and path.
        // @param   nestedGroups Additional groups to be nested within the folder groups.
        // @param   action The test case (or other test groups) to run.
        //--------------------------------------------------------------------------------------------------------------

        (filename: string, nestedGroups: ValueOrArray<string>, action: Action): void;

        //--------------------------------------------------------------------------------------------------------------
        // Create nested test groups for the given file.
        // @param   filename The filename and path.
        // @param   action The test case (or other test groups) to run.
        //--------------------------------------------------------------------------------------------------------------

        (filename: string, action: Action): void;

        //--------------------------------------------------------------------------------------------------------------
        // Set the top-most folders to be excluded from the groups. If a file resides within one of the given folders,
        // only it's child folders are used as groups.
        // @brief   Set the top-most folders to be excluded from the groups.
        // @param   folders All folders that should be treated as root folders.
        //--------------------------------------------------------------------------------------------------------------

        setRootFolders(...folders: string[]): void;

        //--------------------------------------------------------------------------------------------------------------
        // Set the search-and-replace (or delete) rules to pre-cleanse the filename and path.
        // @param   rules The search-and-replace rules to cleanse the filename and path.
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

    cleansingRules.forEach(rule => file = file.replace(rule.search, rule.replace));

    let groups = file.split(/\/|\\/);
    for (let index = 0; index < groups.length; index++) {
        if (rootFolders.filter(folder => folder === groups[index]).length) {
            groups = groups.slice(index + 1);
            break;
        }
    }

    return groups;
}

//----------------------------------------------------------------------------------------------------------------------
//  Create nested test groups mirroring the folder hierarchy of the given filename and path.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

const testGroupForFile: internal.TestGroupForFile = (() => {

    let rootFolders = ["src"]
    let cleansingRules: Array<{ search: RegExp, replace: string }> = [
        { search: /\.(tsx?|jsx?)$/, replace: "" },
        { search: /\.test$/, replace: "" },
        { search: /\\test\\/, replace: "\\" },
        { search: /\/test\//, replace: "/" },
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
    result.setRootFolders = setRootFolders;
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
