testGroupForFile("__FILE__", "fail", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    class MyError extends Error {
        constructor(message: string) {
            super(message);
        }
    }

    const myErrorObject = new MyError("oops");
    const myError = preStringify(myErrorObject).as("myError");
    const myErrorSupplier = preStringify(() => myErrorObject).as("() => myError");

    type ErrorParam = internal.ValueOrSupplier<string | Error> | undefined;

    //------------------------------------------------------------------------------------------------------------------
    // fail()
    //------------------------------------------------------------------------------------------------------------------

    testTemplate((p1: ErrorParam, p2: ErrorParam, p3: ErrorParam) => ({
        group: "fail()",
        description: "fail($*)",
        action: () => {
            if (undefined === p1) {
                fail();
            } else if (undefined === p2) {
                fail(p1);
            } else if (undefined === p3) {
                fail(p1, p2);
            } else {
                fail(p1, p2, p3);
            }
        }
    }))
        .when(undefined, undefined, undefined)/*          */.throwsError(new Error(""))
        .when("", undefined, undefined)/*                 */.throwsError(new Error(""))
        .when("oops", undefined, undefined)/*             */.throwsError(new Error("oops"))
        .when(myError, undefined, undefined)/*            */.throwsError(myError)
        .when(() => "oops", undefined, undefined)/*  */.throwsError(new Error("oops"))
        .when(myErrorSupplier, undefined, undefined)/*    */.throwsError(myError)
        .when("1", "2", undefined).throwsError(new Error("1"))
        ;
});
