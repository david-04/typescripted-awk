testGroupForFile("__FILE__", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    class MyClass {
        public myMethod() { }
    }

    type Anything = undefined | null | boolean | number | string | Array<any> | MyClass | Function;

    const testData = [
        "undefined     ",
        "null          ",
        "true          ",
        "false         ",
        "-1            ",
        "0             ",
        "1.5           ",
        "NaN           ",
        "-Infinity     ",
        "Infinity      ",
        "''            ",
        "' '           ",
        "'x'           ",
        "[]            ",
        "[1, 2]        ",
        "[undefined]   ",
        "{}            ",
        "{ a: 1 }      ",
        "new MyClass() ",
        "/[0-9]+/      ",
        "isNotNull     ",
        "() => true    ",
    ];

    function test(
        functionName: string,
        testRunner: internal.Predicate1<any>,
        expectedResultSupplier: internal.Predicate1<any>
    ) {
        for (const valueAsString of testData.map(value => value.trim())) {
            const value = eval(valueAsString);
            const expectedResult = expectedResultSupplier(value);
            testCase(`${functionName}(${valueAsString}) returns ${expectedResult}`, () => {
                assert.strictEqual(testRunner(value), expectedResult);
            });
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // isNotNull()
    //------------------------------------------------------------------------------------------------------------------

    testGroup("isNotNull()", () => {

        test("isNotNull", isNotNull, value => null !== value && undefined !== value);

        testCase("The type guard binds to object type", () => {

            const myObject = new MyClass() as undefined | null | MyClass;

            // @ts-expect-error - it could be undefined or null
            myObject.myMethod();

            if (isNotNull(myObject)) {

                // undefined and null have been ruled out
                myObject.myMethod();

                // @ts-expect-error - it is not typed as "any"
                myObject.toLowerCase;
            }
        });

        testCase("The type guard binds to the function signature", () => {

            const myFunction = ((p: number) => p) as undefined | null | internal.Function1<number, number>;

            // @ts-expect-error - it could be undefined or null
            myFunction(1);

            if (isNotNull(myFunction)) {

                // it's of type "function"
                myFunction.call(null, 1);

                // the signature is preserved
                myFunction(1);

                // @ts-expect-error - the signature requires a number parameter
                myFunction("abc")
            }
        });

        testCase("The type guard binds 'any' to 'any'", () => {

            const myString = { a: 1 } as any;

            // it's "any"
            myString['a'] = 2;

            if (isNotNull(myString)) {

                // it's still "any"
                myString['a'] = 2;
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // isBoolean()
    //------------------------------------------------------------------------------------------------------------------

    testGroup("isBoolean()", () => {

        test("isBoolean", isBoolean, value => true === value || false === value);

        testCase("The type guard binds to boolean", () => {

            const myBoolean = true as Anything;

            // @ts-expect-error - it could be undefined, null or something else altogether
            myBoolean.valueOf();

            if (isBoolean(myBoolean)) {

                // it's typed as boolean
                myBoolean.valueOf();
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // isNumber()
    //------------------------------------------------------------------------------------------------------------------

    testGroup("isNumber()", () => {

        test("isNumber", isNumber, value => null !== value && undefined !== value && "number" === typeof value);

        testCase("The type guard binds to number", () => {

            const myNumber = 1 as Anything;

            // @ts-expect-error - it could be undefined, null or something else altogether
            myNumber.toFixed();

            if (isNumber(myNumber)) {

                // it's typed as number
                myNumber.toFixed();
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // isString()
    //------------------------------------------------------------------------------------------------------------------

    testGroup("isString()", () => {

        test("isString", isString, value => null !== value && undefined !== value && "string" === typeof value);

        testCase("The type guard binds to string", () => {

            const myString = "abc" as Anything;

            // @ts-expect-error - it could be undefined, null or something else altogether
            myString.toLowerCase();

            if (isString(myString)) {

                // it's typed as string
                myString.toLowerCase();
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // isObject()
    //------------------------------------------------------------------------------------------------------------------

    testGroup("isObject()", () => {

        test("isObject", isObject, value => null !== value && undefined !== value && "object" === typeof value);

        testCase("The type guard binds to the object type", () => {

            const myObject = new MyClass() as Exclude<Anything, Array<any>>;

            // @ts-expect-error - it could be any type
            myObject.myMethod();

            if (isObject(myObject)) {

                // it's typed as MyClass
                myObject.myMethod();
            }
        });

        testCase("The type guard creates intersection types", () => {

            type interface1 = { method1: internal.Supplier<boolean> };
            type interface2 = { method1: internal.Supplier<boolean>, method2: internal.Supplier<boolean> }
            const myObject = { method1: () => true, method2: () => true } as
                Exclude<Anything, Array<any> | MyClass> | interface1 | interface2;

            // @ts-expect-error - it could be any type
            myObject.method1();

            if (isObject(myObject)) {

                // it could be interface1 or interface2, but both have method1
                myObject.method1();

                // @ts-expect-error - it could be interface1
                myObject.method2();
            }
        });

        testCase("The type guard leaves 'any' as 'any'", () => {

            const myObject = new MyClass() as any;

            if (isObject(myObject)) {

                // it's still "any"
                myObject.myMethod();
                myObject["property"] = "value"
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // isArray()
    //------------------------------------------------------------------------------------------------------------------

    testGroup("isObject()", () => {

        test("isArray", isArray, value => null !== value && undefined !== value && Array.isArray(value));

        testCase("The type guard binds to the array's type", () => {

            const myArray = ['abc'] as Exclude<Anything, Array<any>> | Array<string>;

            // @ts-expect-error - it could be any type
            myArray.length;

            if (isArray(myArray)) {

                // it's typed as array
                myArray.length;

                // the type is narrowed down to Array<string>
                myArray[0].toLowerCase();
            }
        });

        testCase("The type guard creates intersection types", () => {

            type interface1 = { method1: internal.Supplier<boolean> };
            type interface2 = { method1: internal.Supplier<boolean>, method2: internal.Supplier<boolean> }
            const myArray = [{ method1: () => true, method2: () => true }] as
                Exclude<Anything, Array<any> | MyClass> | Array<interface1> | Array<interface2>;

            // @ts-expect-error - it could be any type
            myArray.length;

            if (isArray(myArray)) {

                // it's typed as array
                myArray.length;

                // the typed as Array<interface1> | Array<interface2> - and both have method1
                myArray[0].method1();

                // @ts-expect-error - it could be Array<interface1> which does not have method2
                myArray[0].method2();
            }
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // isFunction()
    //------------------------------------------------------------------------------------------------------------------

    testGroup("isFunction()", () => {

        test("isFunction", isFunction, value => null !== value && undefined !== value && "function" === typeof value);

        testCase("The type guard preserves the function's signature", () => {

            const myFunction = ((p: number) => p) as Exclude<Anything, Function> | internal.Function1<number, number>;

            // @ts-expect-error - it could be undefined or null
            myFunction(1);

            if (isFunction(myFunction)) {

                // it's of type "function"
                myFunction.call(null, 1);

                // the signature is preserved
                myFunction(1);

                // @ts-expect-error - the signature requires a number parameter
                myFunction("abc")
            }
        });

        testCase("The type guard creates intersection types", () => {

            type interface1 = { method1: internal.Supplier<boolean> };
            type interface2 = { method1: internal.Supplier<boolean>, method2: internal.Supplier<boolean> }
            const myObject: interface1 & interface2 = { method1: () => true, method2: () => true };

            type function1 = internal.Function1<number, interface1>
            type function2 = internal.Function2<number, string, interface2>
            const myFunction = (() => myObject) as Exclude<Anything, Function> | function1 | function2;

            // @ts-expect-error - it could be anything
            myFunction();

            if (isFunction(myFunction)) {

                // it's of type "function"
                myFunction.bind;

                // @ts-expect-error - it could be the function2 which requires a second paramter
                myFunction(1);

                // we're allowed to pass more parameters than required to function1
                const result = myFunction(1, "abc");

                // it could be interface1 or interface2, but both have method1()
                result.method1();

                // @ts-expect-error - it could be interface1 which does not have method2()
                result.method2();
            }
        });
    });
});
