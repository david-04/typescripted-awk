//----------------------------------------------------------------------------------------------------------------------
// Verify that the given value is neither null nor undefined.
// @param value The value to examine.
// @return Returns a flag indicating if the value is neither null nor undefined.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function isNotNull<T>(value: T | undefined | null): value is T {
    return undefined !== value && null !== value;
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that the given value is a boolean.
// @param value The value to examine.
// @return Returns a flag indicating if the value is a boolean.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function isBoolean(value: boolean | undefined | null): value is boolean {
    return "boolean" === typeof value;
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that the given value is a number (including NaN and Infinity).
// @param value The value to examine.
// @return Returns a flag indicating if the value is a number.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function isNumber(value: number | undefined | null): value is number {
    return "number" === typeof value;
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that the given value is a (potentially empty) string.
// @param value The value to examine.
// @return Returns a flag indicating if the value is a string.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function isString(value: string | undefined | null): value is string {
    return "string" === typeof value;
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that the given value is an object and not null.
// @param value The value to examine.
// @return Returns a flag indicating if the value is an object and not null.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function isObject<T extends object>(value: T | undefined | null): value is T {
    return null !== value && "object" === typeof value;
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that the given value is an array.
// @param value The value to examine.
// @return Returns a flag indicating if the value is an array.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function isArray<T>(value: Array<T> | undefined | null): value is Array<T> {
    return Array.isArray(value);
}
