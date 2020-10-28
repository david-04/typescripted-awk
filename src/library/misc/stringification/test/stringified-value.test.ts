testGroupForFile("__FILE__", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Constructor
    //------------------------------------------------------------------------------------------------------------------

    testCase("Preserves the provided value", () => {

        const value = "stringified value";
        const stringifiedValue = new StringifiedValue(value);
        nodeModules.assert.strictEqual(stringifiedValue.stringifiedValue, value);
    });
});
