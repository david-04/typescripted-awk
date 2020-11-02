testGroupForFile.setRootFolders("library");

//----------------------------------------------------------------------------------------------------------------------
// filenameToTestGroup()
//----------------------------------------------------------------------------------------------------------------------

testGroup(["misc", "unit-test", "test-group", "filenameToTestGroup()"], () => {

    const testData: Array<[string, string[], Array<{ search: RegExp, replace: string }>, string[]]> = [
        [
            "C:\\Projects\\typescripted-awk\\src\\library\\misc\\unit-test\\test\\test-group.test.ts",
            ["src", "library"],
            [
                { search: /\.(tsx?|jsx?)$/, replace: "" },
                { search: /\.test$/, replace: "" },
                { search: /\\test\\/, replace: "\\" },
                { search: /\/test\//, replace: "/" },
            ],
            ["library", "misc", "unit-test", "test-group"]
        ],
        [
            "/projects/typescripted-awk/src/library/misc/unit-test/test/test-group.test.ts",
            ["library"],
            [
                { search: /\.(tsx?|jsx?)$/, replace: "" },
                { search: /\.test$/, replace: "" },
                { search: /\\test\\/, replace: "\\" },
                { search: /\/test\//, replace: "/" },
            ],
            ["misc", "unit-test", "test-group"]
        ],
        [
            "C:\\Projects\\typescripted-awk\\src\\library\\misc\\unit-test\\test\\test-group.test.ts",
            ["???", "library"],
            [],
            ["misc", "unit-test", "test", "test-group.test.ts"]
        ],
    ];

    testData.forEach((data, index) => {
        testCase(`filenameToTestGroup() test case ${index + 1}`, () => {
            assert.deepStrictEqual(filenameToTestGroup(data[0], data[1], data[2]), data[3]);
        });
    })
});

//----------------------------------------------------------------------------------------------------------------------
// getCurrentFilename()
//----------------------------------------------------------------------------------------------------------------------

testGroup(["misc", "unit-test", "test-group", "getCurrentFilename()"], () => {

    testCase("getCurrentFilename() returns the current file's path)", () => {
        const filename = getCurrentFilename().replace(/\\/g, "/").replace(/.*\/src\//, "").toLowerCase();
        if (filename.match(/\/build\//)) {
            assert.strictEqual(filename, __filename.replace(/\\/g, "/").toLowerCase());
        } else {
            assert.strictEqual(filename, "library/misc/unit-test/test/test-group.test.ts");
        }
    });

    testCase(`getCurrentFilename("__` + `FILE__") returns the current file's path)`, () => {
        const filename = getCurrentFilename("__" + "FILE__").replace(/\\/g, "/").replace(/.*\/src\//, "").toLowerCase();
        if (filename.match(/\/build\//)) {
            assert.strictEqual(filename, __filename.replace(/\\/g, "/").toLowerCase());
        } else {
            assert.strictEqual(filename, "library/misc/unit-test/test/test-group.test.ts");
        }
    });

    testCase('getCurrentFilename("myFile") returns the "myFile")', () => {
        const filename = getCurrentFilename("myFile");
        assert.strictEqual(filename, "myFile");
    });
});
