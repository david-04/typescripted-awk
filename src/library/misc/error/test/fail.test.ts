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
        .when() /*                              */.throws(new Error(""))
        .when("") /*                            */.throws(new Error(""))
        .when("oops") /*                        */.throws(new Error("oops"))
        .when(new Error("oops")) /*             */.throws(new Error("oops"))
        .when(new MyError("oops")) /*           */.throws(new MyError("oops"))
        .when(() => "") /*                      */.throws(new Error(""))
        .when(() => "oops") /*                  */.throws(new Error("oops"))
        .when(() => new Error("oops")) /*       */.throws(new Error("oops"))
        .when(() => new MyError("oops")) /*     */.throws(new MyError("oops"))
        .when("1", "2") /*                      */.throws(new Error("1"))
        .when("", "2") /*                       */.throws(new Error("2"))
        .when(() => "", "2") /*                 */.throws(new Error("2"))
        .when("", () => new Error("oops")) /*   */.throws(new Error("oops"));
});
