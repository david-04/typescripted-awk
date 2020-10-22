testGroupForFile("__FILE__", () => {

    //------------------------------------------------------------------------------------------------------------------
    // filenameToTestGroup()
    //------------------------------------------------------------------------------------------------------------------

    [
        [undefined /*                                 */, []],
        [null /*                                      */, []],
        ["  " /*                                      */, []],
        [" / " /*                                     */, []],
        ["misc/unit-test/test/filename-to-group.test.ts", ["misc", "unit-test", "filename-to-group"]]
    ]
        .forEach(data => {
            testCase(`filenameToTestGroup(${JSON.stringify(data[0])}) returns ${JSON.stringify(data[1])}`, () => {
                nodeModules.assert.deepStrictEqual(filenameToTestGroups(data[0] as any), data[1]);
            })
        });
});
