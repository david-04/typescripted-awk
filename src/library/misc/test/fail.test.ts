testGroupForFile("__FILE__", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Test setup
    //------------------------------------------------------------------------------------------------------------------

    class MyError extends Error {
        constructor(message: string) {
            super(message);
        }
    }

    const myErrorObject = new MyError("oops");
    const myError = use(myErrorObject).as("myError");
    const myErrorSupplier = use(() => myErrorObject).as("() => myError");
    const error = (message: string) => stringifyErrorForComparison(new Error(message))

    //------------------------------------------------------------------------------------------------------------------
    // createError()
    //------------------------------------------------------------------------------------------------------------------

    type CreateErrorParam = internal.ValueOrSupplier<string | Error>;

    testTemplate((p1?: CreateErrorParam, p2?: CreateErrorParam, p3?: CreateErrorParam) => ({
        group: "createError()",
        description: "createError($*)",
        action: () => stringifyErrorForComparison(createError(p1!, p2!, p3!))
    }))
        .when(undefined, undefined, undefined).returns(error(""))
        .when("1", "2", undefined).returns(error("1"))
        .when(undefined, "2", undefined).returns(error("2"))
        ;

    //------------------------------------------------------------------------------------------------------------------
    // fail()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((parameter?: internal.ValueOrSupplier<string | Error>) => ({
        group: "fail()",
        description: "fail($*)",
        action: () => undefined === parameter ? fail() : fail(parameter as any)
    }))
        .when(undefined)/*          */.throwsError(new Error(""))
        .when("")/*                 */.throwsError(new Error(""))
        .when("oops")/*             */.throwsError(new Error("oops"))
        .when(myError)/*            */.throwsError(myError)
        .when(use(() => "oops"))/*  */.throwsError(new Error("oops"))
        .when(myErrorSupplier)/*    */.throwsError(myError)
        ;
});
