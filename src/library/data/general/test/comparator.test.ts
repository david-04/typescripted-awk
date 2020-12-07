testGroupForFile(getCurrentFilename("__FILE__"), () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    const myFunction1 = preStringify(() => 1).as("myFunction1");
    const myFunction2 = preStringify(() => 2).as("myFunction2");

    const testData: Array<[any, any, -1 | 0 | 1 | undefined]> = [
        [undefined /*   */, undefined /*    */, 0],
        [null /*        */, null /*         */, 0],
        [false /*       */, true /*         */, -1],
        [false /*       */, false /*        */, 0],
        [true /*        */, false /*        */, 1],
        [0 /*           */, 1 /*            */, -1],
        [0.25 /*        */, 0.25 /*         */, 0],
        [0 /*           */, -1 /*           */, 1],
        [BigInt(-5) /*  */, BigInt(10) /*   */, -1],
        [BigInt(999) /* */, BigInt(999) /*  */, 0],
        [BigInt(0) /*   */, BigInt(-1) /*   */, 1],
        ["abc" /*       */, "xyz" /*        */, -1],
        ["abc" /*       */, "abc" /*        */, 0],
        ["xyz" /*       */, "abc" /*        */, 1],
        [/abc/ /*       */, /xyz/ /*        */, -1],
        [/abc/ /*       */, /abc/ /*        */, 0],
        [/xyz/ /*       */, /abc/ /*        */, 1],
        [{ a: 1 } /*    */, { b: 1 } /*     */, undefined],
        [myFunction1 /* */, myFunction2 /*  */, -1],
        [myFunction1 /* */, myFunction1 /*  */, 0],
        [myFunction2 /* */, myFunction1 /*  */, 1],
        [Symbol(1) /*   */, Symbol(2) /*    */, -1],
        [Symbol(1) /*   */, Symbol(1) /*    */, 0],
        [Symbol(2) /*   */, Symbol(1) /*    */, 1]
    ];

    const typeOrder = [
        undefined,
        null,
        false,
        0,
        BigInt(0),
        "",
        /./,
        preStringify({ a: 1 }).as("myObject"),
        myFunction1,
        Symbol("mySymbol")
    ];

    typeOrder.forEach((a, aIndex) => {
        typeOrder.forEach((b, bIndex) => {
            if (aIndex !== bIndex) {
                testData.push([a, b, aIndex < bIndex ? -1 : 1]);
            }
        })
    });

    //------------------------------------------------------------------------------------------------------------------
    // comparator()
    //------------------------------------------------------------------------------------------------------------------

    testData.forEach(array => {
        const template = testTemplate((a: any, b: any) => ({
            group: "comparator()",
            description: "comparator($*)",
            action: () => comparator(a, b)
        })).when(array[0], array[1]);
        if (undefined !== array[2]) {
            template.returns(array[2]);
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // comparing()
    //------------------------------------------------------------------------------------------------------------------

    testData.forEach(array => {
        const template = testTemplate((a: any, b: any) => ({
            group: "comparing()",
            description: "comparing(x => x.a)($*)",
            action: () => comparing((x: any) => x.a)({ a: a }, { a: b })
        })).when(array[0], array[1]);
        if (undefined !== array[2]) {
            template.returns(array[2]);
        }
    });
});
