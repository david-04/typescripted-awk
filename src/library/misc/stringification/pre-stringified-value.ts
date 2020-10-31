namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A value with a pre-rendered stringified representation. When a StringifiedValue is passed to a stringifier, it
    // will use the pre-rendered representation (instead of stringifying the value).
    // @brief   A value with a pre-rendered stringified representation.
    // @type    T The type of the value.
    //------------------------------------------------------------------------------------------------------------------

    export class PreStringifiedValue<T> {

        //--------------------------------------------------------------------------------------------------------------
        // Initialize a new PreStringifiedValue.
        // @param   value The value itself.
        // @param   stringifiedValue The pre-rendered string representation of the value.
        //--------------------------------------------------------------------------------------------------------------

        public constructor(public readonly value: T, public readonly stringifiedValue: string) { }
    }

    //------------------------------------------------------------------------------------------------------------------
    // A builder for attaching a pre-rendered stringified representation to a value.
    // @type    T The type of the value.
    //------------------------------------------------------------------------------------------------------------------

    export class PreStringifiedValueBuilder<T> {

        //--------------------------------------------------------------------------------------------------------------
        // Initialize a new PreStringifiedValueBuilder.
        // @param   value The value itself.
        //-----------------------------------------------------------------------------------------------------------

        public constructor(protected readonly value: T) { }

        //--------------------------------------------------------------------------------------------------------------
        // Attach a pre-rendered stringified representation to the value.
        // @param   stringifiedValue The stringified representation of the value.
        // @return  Returns a PreStringifiedValue that holds the value and its pre-stringified representation.
        //--------------------------------------------------------------------------------------------------------------

        public as(stringifiedValue: string) {
            return new PreStringifiedValue(this.value, stringifiedValue);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Create a value with an attached pre-rendered stringified representation. When passed to a stringifier, it will use
// the pre-rendered representation rather than stringifying the value.
// @brief   Create a value with an attached pre-rendered stringified representation.
// @param   value The value itself.
// @return  Returns a builder that allows attaching the pre-rendered stringified representation to the value.
// @type    T The type of the value.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function preStringify<T>(value: T) {
    return new internal.PreStringifiedValueBuilder(value);
}
