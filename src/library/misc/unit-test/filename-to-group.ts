//----------------------------------------------------------------------------------------------------------------------
// Convert a filename (and path) into a set of nested test group names.
//----------------------------------------------------------------------------------------------------------------------

function filenameToTestGroups(filename: string) {

    return (filename ?? '')
        .replace(/\.test\.ts$$/, "")
        .replace(/\/test\//g, "/")
        .split("/")
        .map(item => item.trim())
        .filter(item => item.length);
}

//----------------------------------------------------------------------------------------------------------------------
// Create nested test groups based on the filename and path.
//----------------------------------------------------------------------------------------------------------------------

function testGroupForFile(filename: string, action: internal.Action): void;
function testGroupForFile(filename: string, group: string, action: internal.Action): void;
function testGroupForFile(filename: string, group1: string, group2: string, action: internal.Action): void;
function testGroupForFile(filename: string, ...moreGroupsAndAction: Array<string | internal.Action>) {

    const groups = filenameToTestGroups(filename);
    moreGroupsAndAction.slice(0, moreGroupsAndAction.length - 1).forEach(group => groups.push(group as string));
    testGroup(groups, moreGroupsAndAction[moreGroupsAndAction.length - 1] as internal.Action);
}
