//----------------------------------------------------------------------------------------------------------------------
// PreStringifiedValue
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile("__FILE__", "PreStringifiedValue", () => {

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
// PreStringifiedValueBuilder
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile("__FILE__", "PreStringifiedValueBuilder", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    class TestPreStringifiedValueBuilder<T> extends internal.PreStringifiedValueBuilder<T> {
        constructor(value: T) {
            super(value)
        }
        public getValue() {
            return this.value;
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Constructor
    //------------------------------------------------------------------------------------------------------------------

    testCase("new PreStringifiedValueBuilder(myObject).value === myObject", () => {
        const myObject = [1, "a", { b: true }];
        const builder = new TestPreStringifiedValueBuilder(myObject);
        assert.strictEqual(builder.getValue(), myObject);
    });

    //------------------------------------------------------------------------------------------------------------------
    // as()
    //------------------------------------------------------------------------------------------------------------------

    testCase('new PreStringifiedValueBuilder(myObject).as("stringified") instanceof PreStringifiedValue === true', () => {
        const myObject = [1, "a", { b: true }];
        assert.ok(
            new internal.PreStringifiedValueBuilder(myObject).as("stringified") instanceof internal.PreStringifiedValue,
            "The result is not an instance of PreStringifiedValue"
        );
    });

    testCase('new PreStringifiedValueBuilder(myObject).as("stringified").value === myObject', () => {
        const myObject = [1, "a", { b: true }];
        assert.strictEqual(new internal.PreStringifiedValueBuilder(myObject).as("stringified").value, myObject);
    });

    testCase('new PreStringifiedValueBuilder(myObject).as("stringified").stringifiedValue === "stringified"', () => {
        const myObject = [1, "a", { b: true }];
        const stringified = "stringified";
        const preStringifiedValue = new internal.PreStringifiedValueBuilder(myObject).as(stringified);
        assert.strictEqual(preStringifiedValue.stringifiedValue, stringified);
    });
});

//----------------------------------------------------------------------------------------------------------------------
// preStringify()
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile("__FILE__", "preStringify()", () => {

    testCase("preStringify(myObject) instanceof PreStringifiedValueBuilder === true", () => {
        const myObject = [1, "a", { b: true }];
        assert.ok(
            preStringify(myObject) instanceof internal.PreStringifiedValueBuilder,
            "The result is not an instance of PreStringifiedValueBuilder"
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
