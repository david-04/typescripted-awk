testGroupForFile("__FILE__", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    class MyClass {
        constructor(public readonly prop1: any, public readonly prop2: any) { }
    }

    function test(
        options: Partial<DefaultStringifierOptions> | undefined,
        value: any,
        displayValueAs: string,
        expectedResult: string
    ) {
        let optionalSecondParameter = options ? `, ${JSON.stringify(options)}` : "";
        testCase(`stringify(${displayValueAs}${optionalSecondParameter}) returns ${expectedResult}`, () => {
            assert.strictEqual(stringify(value, options), expectedResult)
        });
    }

    function testObject(
        description: string,
        options: Partial<DefaultStringifierOptions> | undefined,
        value: object | Array<any>,
        expectedResult: string
    ) {
        testCase(description, () => {
            assert.strictEqual(stringify(value, options).replace(/\r/g, ""), removeIndent(expectedResult));
        });
    }

    function removeIndent(text: string) {
        text = text.replace(/^([ \t]*\r?\n)+/, "");
        const indent = text.replace(/[^ \t](.|\n)*/, "").length;
        return text.split(/\r?\n/).map(line => line.substr(indent)).join("\n").trim();
    }

    //------------------------------------------------------------------------------------------------------------------
    // undefined, null, boolean, number, regular expressions
    //------------------------------------------------------------------------------------------------------------------

    [
        ["undefined             ", "undefined  "],
        ["null                  ", "null       "],
        ["true                  ", "true       "],
        ["false                 ", "false      "],
        ["0                     ", "0          "],
        ["-1.1                  ", "-1.1       "],
        ["9.99                  ", "9.99       "],
        ["Math.sqrt(-1)         ", "NaN        "],
        ["Infinity              ", "Infinity   "],
        ["-Infinity             ", "-Infinity  "],
        ["/^[0-9]+$/            ", "/^[0-9]+$/ "],
        ["/\\n/gi               ", "/\\n/gi    "],
        ['new RegExp("\\\\t+")    ', "/\\t+/   "],

    ].forEach(array => test(undefined, eval(array[0].trim()), array[0].trim(), array[1].trim()));

    //------------------------------------------------------------------------------------------------------------------
    // Strings
    //------------------------------------------------------------------------------------------------------------------

    test({ quotes: "auto" }, " a ", `" a "`, `" a "`);
    test({ quotes: "auto" }, "it's", `"it's"`, `"it's"`);
    test({ quotes: "auto" }, 'click "here"', `'click "here"'`, `'click "here"'`);
    test({ quotes: "auto" }, `it's "its"`, '`it\'s "its"`', '`it\'s "its"`');

    test({ quotes: "'" }, "it's", `"it's"`, "'it\\'s'");
    test({ quotes: '"' }, 'click "here"', `'click "here"'`, `"click \\"here\\""`);
    test({ quotes: "`" }, 'backtick (`)', "'backtick (`)'", "`backtick (\\`)`");

    test({ quotes: "'" }, "'", `"'"`, `'\\\''`);
    test({ quotes: '"' }, "'", `"'"`, `"'"`);
    test({ quotes: "`" }, "'", `"'"`, "`'`");

    test({ quotes: "'" }, '"', `'"'`, `'"'`);
    test({ quotes: '"' }, '"', `'"'`, `"\\""`);
    test({ quotes: "`" }, '"', `'"'`, '`"`');

    test({ quotes: "'" }, "`", '"`"', "'`'");
    test({ quotes: '"' }, "`", '"`"', '"`"');
    test({ quotes: "`" }, "`", '"`"', "`\\\``");

    test({ quotes: "'" }, "\\", '"\\"', "'\\\\'");
    test({ quotes: '"' }, "\\", '"\\"', '"\\\\"');
    test({ quotes: "`" }, "\\", '"\\"', "`\\\\`");

    test({ quotes: "'" }, "$${", '"$${"', "'$${'");
    test({ quotes: '"' }, "$${", '"$${"', '"$${"');
    test({ quotes: "`" }, "$${", '"$${"', "`$\\${`");

    test({ quotes: '`', breakLines: true }, "1\n2", '"1\\n2"', "`1\n2`");
    test({ quotes: '`', breakLines: "auto" }, "1\n2", '"1\\n2"', "`1\\n2`");
    test({ quotes: '`', breakLines: "auto" }, "1\n2\n3", '"1\\n2\\n3"', "`1\\n2\\n3`");
    test({ quotes: '`', breakLines: "auto" }, "1\n2\n3\n4", '"1\\n2\\n3\\n4"', "`1\n2\n3\n4`");
    test({ quotes: '`', breakLines: false }, "1\n2\n3\n4", '"1\\n2\\n3\\n4"', "`1\\n2\\n3\\n4`");

    //------------------------------------------------------------------------------------------------------------------
    // Functions
    //------------------------------------------------------------------------------------------------------------------

    test(undefined, testCase, "testCase", "testCase");
    test(undefined, (a: number) => a + 1, "(a: number) => a + 1", "(a) => a + 1");

    for (const breakLines of ["auto" as "auto", true, true]) {

        const options = { breakLines };

        function getFunction() {
            return () => {
                return true;
            };
        }
        const functionAsString = "() => {\\nreturn true;\\n}"

        if (false === breakLines) {
            const multiline = functionAsString.replace(/\\n/, "\\n");
            testCase(`stringify(${functionAsString}, ${JSON.stringify(options)}) returns ${multiline}`, () => {
                assert.strictEqual(stringify(Function(), options), functionAsString.replace(/\\n +/g, ' '));
            });
        } else {
            testCase(`stringify(${functionAsString}, ${JSON.stringify(options)}) returns ${functionAsString}`, () => {
                assert.strictEqual(
                    stringify(getFunction(), options).replace(/\r/g, "").replace(/\n +/g, '\n'),
                    functionAsString.replace(/\\n/g, "\n")
                );
            });
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Arrays
    //------------------------------------------------------------------------------------------------------------------

    testObject(
        "stringify(array, { breakLines: false }) renders the array inline",
        { breakLines: false, quotes: '"', indent: "    " },
        [1, true, [undefined, "test"]],
        `
            [1, true, [undefined, "test"]]
        `
    );

    testObject(
        "stringify(array, { breakLines: true }) renders the array in lines",
        { breakLines: true, quotes: '"', indent: "    " },
        [1, true, [undefined, "test"]],
        `
            [
                1,
                true,
                [
                    undefined,
                    "test"
                ]
            ]
        `
    );

    testObject(
        'stringify(array, { breakLines: "auto" }) renders lines if/as required',
        { breakLines: "auto", quotes: '"', indent: "    " },
        [1, true, [undefined, "test"]],
        `
            [
                1,
                true,
                [undefined, "test"]
            ]
        `
    );

    testObject(
        'stringify(array, { breakLines: true }) indents multiline strings',
        { breakLines: true, quotes: "`", indent: "    " },
        [["line 1\nline 2"]],
        `
            [
                [
                    \`line 1
                    line 2\`
                ]
            ]
        `
    );

    //------------------------------------------------------------------------------------------------------------------
    // Objects
    //------------------------------------------------------------------------------------------------------------------

    testObject(
        'stringify(object) renders as { key: value }',
        { breakLines: false, quotes: '"', quotePropertyNames: false },
        { a: 1, b: { c: true, d: "test" } },
        `
            { a: 1, b: { c: true, d: "test" } }
        `
    );

    testObject(
        'stringify(object, { breakLines: true }) renders multiple lines',
        { breakLines: true, quotes: '"', quotePropertyNames: false },
        { a: 1, b: { c: true, d: "test" } },
        `
            {
                a: 1,
                b: {
                    c: true,
                    d: "test"
                }
            }
        `
    );

    testObject(
        'stringify(object, { breakLines: "auto" }) renders line breaks as required',
        { breakLines: "auto", quotes: '"', quotePropertyNames: false },
        { a: 1, b: { c: true, d: "test" } },
        `
            {
                a: 1,
                b: { c: true, d: "test" }
            }
        `
    );

    testObject(
        'stringify(object, { quotePropertyNames: true }) quotes property names',
        { breakLines: false, quotes: '"', quotePropertyNames: true },
        { a: 1, b: { c: true } },
        `
            { "a": 1, "b": { "c": true } }
        `
    );

    testObject(
        'stringify(object, { quotePropertyNames: "auto" }) quotes property names that contain blanks',
        { breakLines: false, quotes: '"', quotePropertyNames: "auto" },
        { a: 1, "b c": null },
        `
            { a: 1, "b c": null }
        `
    );

    testObject(
        'stringify(object, { breakLines: true }) indents multiline strings',
        { breakLines: true, quotes: '`', quotePropertyNames: false },
        { a: { b: "line 1\nline 2" } },
        `
            {
                a: {
                    b: \`line 1
                    line 2\`
                }
            }
        `
    );

    testObject(
        'stringify(myClass) renders as MyClass(prop1=value1, prop2=value2) ',
        { breakLines: false, quotes: '"', quotePropertyNames: false },
        new MyClass(1, { a: "test" }),
        `
            MyClass(prop1: 1, prop2: { a: "test" })
        `
    );

    testObject(
        'stringify(myClass, { breakLines: true }) renders multiple lines',
        { breakLines: true, quotes: '"', quotePropertyNames: false },
        new MyClass(1, { a: "test" }),
        `
            MyClass(
                prop1: 1,
                prop2: {
                    a: "test"
                }
            )
        `
    );

    testObject(
        'stringify(myClass, { breakLines: "auto" }) renders multiple lines',
        { breakLines: "auto", quotes: '"', quotePropertyNames: false },
        new MyClass(1, new MyClass("test", undefined)),
        `
            MyClass(
                prop1: 1,
                prop2: MyClass(prop1: "test", prop2: undefined)
            )
        `
    );

    testObject(
        'stringify(myClass, { quotePropertyNames: true }) quotes property names',
        { breakLines: false, quotes: '"', quotePropertyNames: true },
        new MyClass("value", true),
        `
            MyClass("prop1": "value", "prop2": true)
        `
    );

    testObject(
        'stringify(object, { quotePropertyNames: "auto" }) quotes property names that contain blanks',
        { breakLines: false, quotes: "'", quotePropertyNames: "auto" },
        (() => { const myObject = new MyClass(1, true); (myObject as any)["prop 3"] = "test"; return myObject })(),
        `
            MyClass(prop1: 1, prop2: true, 'prop 3': 'test')
        `
    );

    //------------------------------------------------------------------------------------------------------------------
    // Circular references
    //------------------------------------------------------------------------------------------------------------------

    testObject(
        'stringify(object) does not recurse into circular references',
        { breakLines: true, quotePropertyNames: false },
        (() => { const object = { a: { b: { c: new Array<any>() } } }; object.a.b.c.push(object); return object })(),
        `
            {
                a: {
                    b: {
                        c: [
                            [circular reference: ../../..]
                        ]
                    }
                }
            }
        `
    );
});
