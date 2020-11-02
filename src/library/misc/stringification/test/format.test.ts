testGroupForFile(getCurrentFilename("__FILE__"), () => {

    //------------------------------------------------------------------------------------------------------------------
    // undefined, null, boolean, number, regular expressions
    //------------------------------------------------------------------------------------------------------------------

    const testData: Array<[string, any[], string]> = [

        ["isNumber($1)  ", [1, false] /*                    */, "isNumber(1)                "],
        ["<$1>          ", [] /*                            */, "<undefined>                "],
        ["$$$1          ", [1] /*                           */, "$1                         "],
        ["$1 $2         ", ["$2", "$1"] /*                  */, "$2 $1                      "],
        ["[$*]          ", ["myObject", false, 2] /*        */, "[myObject, false, 2]       "],
        ["[$1, $3, $*]  ", ["myObject", false, 2, null] /*  */, "[myObject, 2, false, null] "],
    ];

    testData.forEach(array => {

        const data = {
            format: array[0].trim(),
            values: array[1],
            expectedResult: array[2].trim()
        };

        const stringified = {
            format: JSON.stringify(data.format),
            values: data.values.length ? ", " + data.values.map(value => JSON.stringify(value)).join(", ") : "",
            expectedResult: JSON.stringify(data.expectedResult)
        };

        testCase(`format(${stringified.format}${stringified.values}) === ${stringified.expectedResult}`, () => {
            assert.strictEqual(format(data.format, ...data.values), data.expectedResult);
        });
    });
});
