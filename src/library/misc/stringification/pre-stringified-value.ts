namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A value with a pre-rendered stringified representation. When passed to a stringifier, it uses the pre-rendered
    // representation rather than stringifying the underlying value. The `preStringify()` function can be used to
    // construct an instance of the `PreStringifiedValue`:
    //
    // ```typescript
    // const myObject = { value: preStringify(123).as("one-two-three") };
    // stringify(myObject); // returns { value: one-two-three }
    // ```
    //
    // @brief   A value with a pre-rendered stringified representation.
    // @type    T The type of the value.
    //------------------------------------------------------------------------------------------------------------------

    export class PreStringifiedValue<T> {

        //--------------------------------------------------------------------------------------------------------------
        // Initialize a new `PreStringifiedValue`.
        //
        // @brief   Initialize a new PreStringifiedValue.
        // @param   value The underlying (non-stringified) value.
        // @param   stringifiedValue The pre-rendered string representation.
        //--------------------------------------------------------------------------------------------------------------

        public constructor(
            // The underlying (non-stringified) value.
            public readonly value: T,
            // The pre-rendered string representation.
            public readonly stringifiedValue: string
        ) { }
    }

    //------------------------------------------------------------------------------------------------------------------
    // A builder for the `PreStringifiedValue` class that attaches a pre-rendered stringified representation to a value.
    // The builder is created by and obtained through the `preStringify()` function:
    //
    // ```typescript
    // const preStringifiedValue = preStringify(123).as("one-two-three");
    // ```
    //
    // @brief   A builder for creating a pre-stringified value.
    // @type    T The type of the value.
    //------------------------------------------------------------------------------------------------------------------

    export type PreStringifiedValueBuilder<T> = {

        //--------------------------------------------------------------------------------------------------------------
        // Create a `PreStringifiedValue` by attaching the the pre-rendered stringified representation.
        //--------------------------------------------------------------------------------------------------------------

        as: (stringifiedValue: string) => internal.PreStringifiedValue<T>;
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Create a value with an attached pre-rendered representation to be used by the stringifier:
//
// ```typescript
// const myObject = { value: preStringify(123).as("one-two-three") };
// stringify(myObject); // returns { value: one-two-three }
// ```
//
// Quotes are not added automatically. If required, they must be supplied as part of the pre-rendered string.
//
// Pre-stringified values are useful for data-driven unit tests. The test framework uses the actual data value for
// running the test and the pre-stringified representation for assembling the test case description.
//
// @brief   Create a value with an attached pre-rendered stringified representation.
// @param   value The value itself.
// @return  Returns a builder that allows attaching the pre-rendered stringified representation to the value.
// @type    T The type of the value.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function preStringify<T>(value: T): internal.PreStringifiedValueBuilder<T> {
    return { as: (description: string) => new internal.PreStringifiedValue(value, description) };
}
