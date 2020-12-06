//----------------------------------------------------------------------------------------------------------------------
// Instantiation
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "Instantiation", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    const myFunction = preStringify(() => true).as("myFunction");

    //------------------------------------------------------------------------------------------------------------------
    // of()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any) => ({
        group: "of()",
        description: "Optional.of($1).get()",
        action: () => internal.Optional.of(value).get()
    }))
        .when(undefined) /*     */.returns(undefined)
        .when(null) /*          */.returns(undefined)
        .when(true) /*          */.returns(true)
        .when(false) /*         */.returns(false)
        .when(0) /*             */.returns(0)
        .when(1) /*             */.returns(1)
        .when(NaN) /*           */.returns(NaN)
        .when(Infinity) /*      */.returns(Infinity)
        .when("") /*            */.returns("")
        .when(" ") /*           */.returns(" ")
        .when(/.*/) /*          */.returns(/.*/)
        .when({ a: 1 }) /*      */.returns({ a: 1 })
        .when([1, 2, 3]) /*     */.returns([1, 2, 3])
        .when(myFunction) /*    */.returns(myFunction);

    testCase(["of()", "type checks"], () => {

        const a: internal.Optional<boolean> = internal.Optional.of(true as boolean | null | undefined);
        const b: internal.Optional<boolean | string> = internal.Optional.of(true as boolean | undefined | string);

        // @ts-expect-error
        const c: internal.Optional<string> = internal.Optional.of(true as boolean | string | null | undefined);

        [a, b, c].reverse(); // prevent "unused variable" warning
    });

    //------------------------------------------------------------------------------------------------------------------
    // empty()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate(() => ({
        group: "empty()",
        description: "Optional.empty().get()",
        action: () => internal.Optional.empty().get() as any
    }))
        .when().returns(undefined);

    testCase(["empty()", "type checks"], () => {

        const a: internal.Optional<boolean> = internal.Optional.empty<boolean | undefined | null>();
        const b: internal.Optional<boolean | string> = internal.Optional.empty<boolean | undefined | string>();

        // @ts-expect-error
        const c: internal.Optional<string> = internal.Optional.empty<boolean | null | undefined>();

        [a, b, c].reverse(); // prevent "unused variable" warning
    });

    //------------------------------------------------------------------------------------------------------------------
    // optional()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any) => ({
        group: "optional()",
        description: "optional($1).get()",
        action: () => optional(value).get()
    }))
        .when(undefined) /*     */.returns(undefined)
        .when(null) /*          */.returns(undefined)
        .when(true) /*          */.returns(true)
        .when(false) /*         */.returns(false)
        .when(0) /*             */.returns(0)
        .when(1) /*             */.returns(1)
        .when(NaN) /*           */.returns(NaN)
        .when(Infinity) /*      */.returns(Infinity)
        .when("") /*            */.returns("")
        .when(" ") /*           */.returns(" ")
        .when(/.*/) /*          */.returns(/.*/)
        .when({ a: 1 }) /*      */.returns({ a: 1 })
        .when([1, 2, 3]) /*     */.returns([1, 2, 3])
        .when(myFunction) /*    */.returns(myFunction);

    testCase(["of()", "type checks"], () => {

        const a: internal.Optional<boolean> = optional(true as boolean | null | undefined);
        const b: internal.Optional<boolean | string> = optional(true as boolean | undefined | string);

        // @ts-expect-error
        const c: internal.Optional<string> = optional(true as boolean | string | null | undefined);

        const d: internal.Optional<boolean> = optional<boolean | undefined | null>();
        const e: internal.Optional<boolean | string> = optional<boolean | undefined | string>();

        // @ts-expect-error
        const f: internal.Optional<string> = internal.Optional.empty<boolean | null | undefined>();

        [a, b, c, d, e, f].reverse(); // prevent "unused variable" warning
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Getters
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "Getters", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    const myFunction = preStringify(() => true).as("myFunction");

    class MyError extends Error {
        constructor(message: string) {
            super(message);
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // get()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any) => ({
        group: "get()",
        description: "Optional.of($1).get()",
        action: () => internal.Optional.of(value).get()
    }))
        .when(undefined) /*     */.returns(undefined)
        .when(null) /*          */.returns(undefined)
        .when(true) /*          */.returns(true)
        .when(false) /*         */.returns(false)
        .when(0) /*             */.returns(0)
        .when(1) /*             */.returns(1)
        .when(NaN) /*           */.returns(NaN)
        .when(Infinity) /*      */.returns(Infinity)
        .when("") /*            */.returns("")
        .when(" ") /*           */.returns(" ")
        .when(/.*/) /*          */.returns(/.*/)
        .when({ a: 1 }) /*      */.returns({ a: 1 })
        .when([1, 2, 3]) /*     */.returns([1, 2, 3])
        .when(myFunction) /*    */.returns(myFunction);

    testCase(["get()", "type checks"], () => {

        let a: string | undefined = internal.Optional.of("abc" as string | null).get();
        let b: string | number | undefined = internal.Optional.of("abc" as string | number).get();

        // @ts-expect-error
        let c: string = internal.Optional.of("abc").get();
        // @ts-expect-error
        let d: string | undefined = internal.Optional.of("abc" as string | number).get();

        [a, b, c, d].reverse(); // prevent "unused variable" warning
    });

    //------------------------------------------------------------------------------------------------------------------
    // getOrThrow()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any, ...messageErrorOrSupplier: internal.ValueOrSupplier<string | Error>[]) => ({
        group: "getOrThrow()",
        description: "Optional.of($1).getOrThrow($*)",
        action: () => internal.Optional.of(value).getOrThrow(...messageErrorOrSupplier)
    }))
        .when(undefined) /*                         */.throws(new Error("The Optional is empty"))
        .when(null) /*                              */.throws(new Error("The Optional is empty"))
        .when(null, "Oops") /*                      */.throws(new Error("Oops"))
        .when(null, "", "Oops") /*                  */.throws(new Error("Oops"))
        .when(null, "", "Oops") /*                  */.throws(new Error("Oops"))
        .when(null, new MyError("Oops")) /*         */.throws(new MyError("Oops"))
        .when(null, () => "Oops") /*                */.throws(new Error("Oops"))
        .when(null, () => new MyError("Oops")) /*   */.throws(new MyError("Oops"))
        .when(true) /*                              */.returns(true)
        .when(false) /*                             */.returns(false)
        .when(0) /*                                 */.returns(0)
        .when(1) /*                                 */.returns(1)
        .when(NaN) /*                               */.returns(NaN)
        .when(Infinity) /*                          */.returns(Infinity)
        .when("") /*                                */.returns("")
        .when(" ") /*                               */.returns(" ")
        .when(/.*/) /*                              */.returns(/.*/)
        .when({ a: 1 }) /*                          */.returns({ a: 1 })
        .when([1, 2, 3]) /*                         */.returns([1, 2, 3])
        .when(myFunction, "Oops") /*                */.returns(myFunction);

    testCase(["getOrThrow()", "type checks"], () => {

        let a: string = internal.Optional.of("abc" as string | null).getOrThrow();

        // @ts-expect-error
        let b: number = internal.Optional.of("abc" as string | null).getOrThrow();

        [a, b].reverse(); // prevent "unused variable" warning
    });

    //------------------------------------------------------------------------------------------------------------------
    // getOrDefault()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any, defaultValue: any) => ({
        group: "getOrDefault()",
        description: "Optional.of($1).getOrDefault($2)",
        action: () => internal.Optional.of(value).getOrDefault(defaultValue)
    }))
        .when(undefined, 1) /*          */.returns(1)
        .when(null, false) /*          */.returns(false)
        .when(true, 1) /*               */.returns(true)
        .when(false, true) /*           */.returns(false)
        .when(0, NaN) /*                */.returns(0)
        .when(1, Infinity) /*           */.returns(1)
        .when(NaN, -1) /*               */.returns(NaN)
        .when(Infinity, 0) /*           */.returns(Infinity)
        .when("", "default") /*         */.returns("")
        .when(" ", "default") /*        */.returns(" ")
        .when(/.*/, /[0-9]+/) /*        */.returns(/.*/)
        .when({ a: 1 }, { b: 2 }) /*    */.returns({ a: 1 })
        .when([1, 2, 3], ["a", "b"]) /* */.returns([1, 2, 3])
        .when(myFunction, () => 36) /*  */.returns(myFunction);

    testCase(["getOrDefault()", "type checks"], () => {

        let a: string = internal.Optional.of("abc").getOrDefault("xyz");
        let b: string | number = internal.Optional.of("abc" as string | number).getOrDefault(2);
        let c: string | number = internal.Optional.of("abc").getOrDefault(2);

        // @ts-expect-error
        let d: string = internal.Optional.of("abc" as string | number).getOrDefault(2);
        // @ts-expect-error
        let e: string | undefined = internal.Optional.of("abc" as string | number).getOrDefault(2);

        [a, b, c, d, e].reverse(); // prevent "unused variable" warning
    });

    //------------------------------------------------------------------------------------------------------------------
    // getOrCalculate()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any, supplier: internal.Supplier<any>) => ({
        group: "getOrCalculate()",
        description: "Optional.of($1).getOrCalculate($2)",
        action: () => internal.Optional.of(value).getOrCalculate(supplier)
    }))
        .when(undefined, () => 1) /*            */.returns(1)
        .when(null, () => false) /*             */.returns(false)
        .when(true, () => 1) /*                 */.returns(true)
        .when(false, () => true) /*             */.returns(false)
        .when(0, () => NaN) /*                  */.returns(0)
        .when(1, () => Infinity) /*             */.returns(1)
        .when(NaN, () => -1) /*                 */.returns(NaN)
        .when(Infinity, () => 0) /*             */.returns(Infinity)
        .when("", () => "default") /*           */.returns("")
        .when(" ", () => "default") /*          */.returns(" ")
        .when(/.*/, () => /[0-9]+/) /*          */.returns(/.*/)
        .when({ a: 1 }, () => { b: 2 }) /*      */.returns({ a: 1 })
        .when([1, 2, 3], () => ["a", "b"]) /*   */.returns([1, 2, 3])
        .when(myFunction, () => (() => 36)) /*  */.returns(myFunction);

    testCase(["getOrCalculate()", "type checks"], () => {

        let a: string = internal.Optional.of("abc").getOrCalculate(() => "xyz");
        let b: string | number = internal.Optional.of("abc" as string | number).getOrCalculate(() => 2);
        let c: string | number = internal.Optional.of("abc").getOrCalculate(() => 2);

        // @ts-expect-error
        let d: string = internal.Optional.of("abc" as string).getOrCalculate(() => 2);

        [a, b, c, d].reverse(); // prevent "unused variable" warning
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Checks
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "checks", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    const myFunction = preStringify(() => true).as("myFunction");

    //------------------------------------------------------------------------------------------------------------------
    // isPresent()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any) => ({
        group: "isPresent()",
        description: "Optional.of($1).isPresent()",
        action: () => internal.Optional.of(value).isPresent()
    }))
        .when(undefined) /*     */.returns(false)
        .when(null) /*          */.returns(false)
        .when(true) /*          */.returns(true)
        .when(false) /*         */.returns(true)
        .when(0) /*             */.returns(true)
        .when(1) /*             */.returns(true)
        .when(NaN) /*           */.returns(true)
        .when(Infinity) /*      */.returns(true)
        .when("") /*            */.returns(true)
        .when(" ") /*           */.returns(true)
        .when(/.*/) /*          */.returns(true)
        .when({ a: 1 }) /*      */.returns(true)
        .when([1, 2, 3]) /*     */.returns(true)
        .when(myFunction) /*    */.returns(true);

    //------------------------------------------------------------------------------------------------------------------
    // isEmpty()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any) => ({
        group: "isEmpty()",
        description: "Optional.of($1).isEmpty()",
        action: () => internal.Optional.of(value).isEmpty()
    }))
        .when(undefined) /*     */.returns(true)
        .when(null) /*          */.returns(true)
        .when(true) /*          */.returns(false)
        .when(false) /*         */.returns(false)
        .when(0) /*             */.returns(false)
        .when(1) /*             */.returns(false)
        .when(NaN) /*           */.returns(false)
        .when(Infinity) /*      */.returns(false)
        .when("") /*            */.returns(false)
        .when(" ") /*           */.returns(false)
        .when(/.*/) /*          */.returns(false)
        .when({ a: 1 }) /*      */.returns(false)
        .when([1, 2, 3]) /*     */.returns(false)
        .when(myFunction) /*    */.returns(false);
});

//----------------------------------------------------------------------------------------------------------------------
// Actions
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "actions", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    const myFunction = preStringify(() => true).as("myFunction");

    //------------------------------------------------------------------------------------------------------------------
    // ifPresent()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any) => ({
        group: "ifPresent()",
        description: "Optional.of($1).ifPresent(...)",
        action: () => {
            let result = "consumer was not called" as "consumer was not called" | "consumer was called";
            internal.Optional.of(value).ifPresent(() => { result = "consumer was called" })
            return result;
        }
    }))
        .when(undefined) /*     */.returns("consumer was not called")
        .when(null) /*          */.returns("consumer was not called")
        .when(true) /*          */.returns("consumer was called")
        .when(false) /*         */.returns("consumer was called")
        .when(0) /*             */.returns("consumer was called")
        .when(1) /*             */.returns("consumer was called")
        .when(NaN) /*           */.returns("consumer was called")
        .when(Infinity) /*      */.returns("consumer was called")
        .when("") /*            */.returns("consumer was called")
        .when(" ") /*           */.returns("consumer was called")
        .when(/.*/) /*          */.returns("consumer was called")
        .when({ a: 1 }) /*      */.returns("consumer was called")
        .when([1, 2, 3]) /*     */.returns("consumer was called")
        .when(myFunction) /*    */.returns("consumer was called");

    testTemplate((value: any) => ({
        group: "ifPresent()",
        description: "Optional.of($1).ifPresent(...)",
        action: () => internal.Optional.of(value).ifPresent(() => { })
    }))
        .when(undefined) /*     */.returns(internal.Optional.of(undefined))
        .when(null) /*          */.returns(internal.Optional.of(null))
        .when(true) /*          */.returns(internal.Optional.of(true));

    //------------------------------------------------------------------------------------------------------------------
    // ifEmpty()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any) => ({
        group: "ifEmpty()",
        description: "Optional.of($1).ifEmpty(...)",
        action: () => {
            let result = "consumer was not called" as "consumer was not called" | "consumer was called";
            internal.Optional.of(value).ifEmpty(() => { result = "consumer was called" })
            return result;
        }
    }))
        .when(undefined) /*     */.returns("consumer was called")
        .when(null) /*          */.returns("consumer was called")
        .when(true) /*          */.returns("consumer was not called")
        .when(false) /*         */.returns("consumer was not called")
        .when(0) /*             */.returns("consumer was not called")
        .when(1) /*             */.returns("consumer was not called")
        .when(NaN) /*           */.returns("consumer was not called")
        .when(Infinity) /*      */.returns("consumer was not called")
        .when("") /*            */.returns("consumer was not called")
        .when(" ") /*           */.returns("consumer was not called")
        .when(/.*/) /*          */.returns("consumer was not called")
        .when({ a: 1 }) /*      */.returns("consumer was not called")
        .when([1, 2, 3]) /*     */.returns("consumer was not called")
        .when(myFunction) /*    */.returns("consumer was not called");

    testTemplate((value: any) => ({
        group: "ifEmpty()",
        description: "Optional.of($1).ifEmpty(...)",
        action: () => internal.Optional.of(value).ifEmpty(() => { })
    }))
        .when(undefined) /*     */.returns(internal.Optional.of(undefined))
        .when(null) /*          */.returns(internal.Optional.of(null))
        .when(true) /*          */.returns(internal.Optional.of(true));
});

//----------------------------------------------------------------------------------------------------------------------
// Mapping
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "transformations", () => {

    //------------------------------------------------------------------------------------------------------------------
    // map()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any) => ({
        group: "map()",
        description: "Optional.of($1).map(value => `<${value}>`)",
        action: () => internal.Optional.of(value).map(value => `<${value}>`)
    }))
        .when(undefined) /* */.returns(internal.Optional.empty())
        .when(null) /*      */.returns(internal.Optional.empty())
        .when(true) /*      */.returns(internal.Optional.of("<true>"))
        .when(0) /*         */.returns(internal.Optional.of("<0>"))
        .when("abc") /*     */.returns(internal.Optional.of("<abc>"));

    testCase(["map()", "type checks"], () => {

        let a: number = internal.Optional.of("abc").map(() => 1).getOrThrow();
        let b: string | number = internal.Optional.of("abc").map(() => 1 as string | number).getOrThrow();

        // @ts-expect-error
        let c: string = internal.Optional.of("abc").map(() => 2 as string | number).getOrThrow();

        [a, b, c].reverse(); // prevent "unused variable" warning
    });

    //------------------------------------------------------------------------------------------------------------------
    // flatMap()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any, mappedValue: any) => ({
        group: "flatMap()",
        description: "Optional.of($1).flatMap(() => $2)",
        action: () => internal.Optional.of(value).flatMap(() => mappedValue).get()
    }))
        .when(undefined, /* */ internal.Optional.of(1)) /*      */.returns(undefined)
        .when(null, /*      */ internal.Optional.of(1)) /*      */.returns(undefined)
        .when(true, /*      */ internal.Optional.of(1)) /*      */.returns(1)
        .when(0, /*         */ internal.Optional.of("abc")) /*  */.returns("abc")
        .when("abc", /*     */ internal.Optional.of(1)) /*      */.returns(1)
        .when("abc", /*     */ internal.Optional.empty()) /*    */.returns(undefined)
        .when("abc", /*     */ 1 as any) /*                     */.throws(/did not return an Optional/);

    testCase(["flatMap()", "type checks"], () => {

        let a: string = internal.Optional.of("abc").flatMap(() => internal.Optional.of("xyz")).getOrThrow();
        let b: number = internal.Optional.of(1).flatMap(() => internal.Optional.of(2)).getOrThrow();
        let c: string | number = internal.Optional.of("abc").flatMap(() => internal.Optional.of(1)).getOrThrow();

        // @ts-expect-error
        let d: string = internal.Optional.of("abc").flatMap(() => internal.Optional.of(2)).getOrThrow();

        [a, b, c, d].reverse(); // prevent "unused variable" warning
    });

    //------------------------------------------------------------------------------------------------------------------
    // filter()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((value: any, filter: (value: any) => any) => ({
        group: "filter()",
        description: "Optional.of($1).filter($1).get()",
        action: () => internal.Optional.of(value).filter(filter).get()
    }))
        .when(undefined /* */, () => assert.fail("The filter was called")) /*   */.returns(undefined)
        .when(null /*      */, () => assert.fail("The filter was called")) /*   */.returns(undefined)
        .when(true /*      */, value => value) /*                               */.returns(true)
        .when(false /*     */, value => value) /*                               */.returns(undefined)
        .when("" /*        */, value => value) /*                               */.returns(undefined)
        .when("abc" /*     */, value => value) /*                               */.returns("abc");

    testCase(["filter()", "type checks"], () => {

        let a: string = internal.Optional.of("abc").filter(() => true).getOrThrow();

        // @ts-expect-error
        let b: string | undefined = internal.Optional.of("abc" as string | number).filter(() => false).get();

        [a, b].reverse(); // prevent "unused variable" warning
    });
});
