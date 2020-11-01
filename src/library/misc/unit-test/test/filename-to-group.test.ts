testGroupForFile("__FILE__", () => {

    //------------------------------------------------------------------------------------------------------------------
    // filenameToTestGroup()
    //------------------------------------------------------------------------------------------------------------------

    const testData: Array<[null | undefined | string, string[]]> = [

        [undefined /*                                       */, []],
        [null /*                                            */, []],
        ["  " /*                                            */, []],
        [" / " /*                                           */, []],
        ["misc/unit-test/test/filename-to-group.test.ts" /* */, ["misc", "unit-test", "filename-to-group"]]
    ];

    testData.forEach(data => {
        testCase(`filenameToTestGroup(${JSON.stringify(data[0])}) returns ${JSON.stringify(data[1])}`, () => {
            assert.deepStrictEqual(filenameToTestGroups(data[0] as string), data[1]);
        })
    });
});
