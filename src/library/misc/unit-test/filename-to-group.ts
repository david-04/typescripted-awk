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

function testGroupForFile(filename: string, action: internal.Action) {
    testGroup(filenameToTestGroups(filename), action);
}
