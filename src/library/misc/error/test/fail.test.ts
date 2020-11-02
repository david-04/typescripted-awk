testGroupForFile(getCurrentFilename("__FILE__"), () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    class MyError extends Error {
        constructor(message?: string) {
            super(message);
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // fail()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((...parameters: internal.ValueOrSupplier<string | Error>[]) => ({
        description: "fail($*)",
        action: () => fail(...parameters)
    }))
        .with() /*                              */.exceptionIs(new Error(""))
        .with("") /*                            */.exceptionIs(new Error(""))
        .with("oops") /*                        */.exceptionIs(new Error("oops"))
        .with(new Error("oops")) /*             */.exceptionIs(new Error("oops"))
        .with(new MyError("oops")) /*           */.exceptionIs(new MyError("oops"))
        .with(() => "") /*                      */.exceptionIs(new Error(""))
        .with(() => "oops") /*                  */.exceptionIs(new Error("oops"))
        .with(() => new Error("oops")) /*       */.exceptionIs(new Error("oops"))
        .with(() => new MyError("oops")) /*     */.exceptionIs(new MyError("oops"))
        .with("1", "2") /*                      */.exceptionIs(new Error("1"))
        .with("", "2") /*                       */.exceptionIs(new Error("2"))
        .with(() => "", "2") /*                 */.exceptionIs(new Error("2"))
        .with("", () => new Error("oops")) /*   */.exceptionIs(new Error("oops"));
});
