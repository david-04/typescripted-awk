//----------------------------------------------------------------------------------------------------------------------
// PreStringifiedValue
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "PreStringifiedValue", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Constructor
    //------------------------------------------------------------------------------------------------------------------

    testCase('new PreStringifiedValue(myObject, "stringified").value === myObject', () => {
        const myObject = [1, "a", { b: true }];
        assert.strictEqual(new internal.PreStringifiedValue(myObject, "stringified").value, myObject);
    });

    testCase('new PreStringifiedValue(myObject, "stringified").stringifiedValue === "stringified"', () => {
        const myObject = [1, "a", { b: true }];
        const stringified = "stringified";
        assert.strictEqual(new internal.PreStringifiedValue(myObject, stringified).stringifiedValue, stringified);
    });
});

//----------------------------------------------------------------------------------------------------------------------
// preStringify()
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "preStringify", () => {

    testCase('preStringify(myObject) instanceof PreStringifiedValue === true', () => {
        assert.ok(
            preStringify(123).as("stringified") instanceof internal.PreStringifiedValue,
            "The result is not an instance of PreStringifiedValue"
        );
    });

    testCase('preStringify(myObject).as("stringified").value === myObject', () => {
        const myObject = [1, "a", { b: true }];
        assert.strictEqual(preStringify(myObject).as("stringified").value, myObject);
    });

    testCase('preStringify(myObject).as("stringified").stringifiedValue === "stringified"', () => {
        const myObject = [1, "a", { b: true }];
        const stringified = "stringified";
        assert.strictEqual(preStringify(myObject).as(stringified).stringifiedValue, stringified);
    });
});
