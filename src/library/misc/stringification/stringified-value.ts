//----------------------------------------------------------------------------------------------------------------------
// A wrapper for an already stringified representation of another value. When passed to a stringifier, the contained
// string will be rendered as it is, without quote-wrapping and escaping.
// @brief   A stringified representation of another value.
//----------------------------------------------------------------------------------------------------------------------

class StringifiedValue {

    //------------------------------------------------------------------------------------------------------------------
    // Create a new stringified value.
    // @param   stringifiedValue The pre-rendered string representation of the value.
    //------------------------------------------------------------------------------------------------------------------

    public constructor(public readonly stringifiedValue: string) { }
}
