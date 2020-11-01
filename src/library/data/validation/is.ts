//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is neither null nor undefined.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is neither null nor undefined.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isNotNull<T>(value: T): value is Exclude<T, null | undefined> {
    return undefined !== value && null !== value;
}

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is a boolean.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is a boolean.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isBoolean(value: any): value is boolean {
    return "boolean" === typeof value;
}

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is a number (including NaN and Infinity).
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is a number.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isNumber(value: any): value is number {
    return "number" === typeof value;
}

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is a string (including empty and blank strings).
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is a string.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isString(value: any): value is string {
    return "string" === typeof value;
}

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is an object and not null.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is an object and not null.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isObject<T extends object | any>(
    value: T | undefined | null | boolean | number | string | Function
): value is Exclude<T, Function>;

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is an object and not null.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is an object and not null.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isObject(value: any): value is any;

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is an object and not null.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is an object and not null.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isObject(value: any): value is object {
    return null !== value && "object" === typeof value;
}

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is an array.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is an array.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isArray<T extends any[]>(
    value: Exclude<T, Function> | undefined | null | boolean | number | string | any[]
): value is any[];

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is an array.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is an array.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isArray<T, A extends T[]>(
    value: A | undefined | null | boolean | number | string | object | Function
): value is A;

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is an array.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is an array.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isArray(value: any): value is any[] {
    return Array.isArray(value);
}

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is a function.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is a function.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isFunction<T extends Function>(
    value: Exclude<T, Function> | undefined | null | boolean | number | string | any[]
    //@ts-ignore
): value is internal.AnyFunction;

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is a function.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is a function.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isFunction<T extends Function>(
    value: T | null | undefined | boolean | number | string | object | any[]
): value is T;

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is a function.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is a function.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isFunction(value: any): value is Function;

//----------------------------------------------------------------------------------------------------------------------
// Type guard to verify that the given value is a function.
// @param   value The value to examine.
// @return  Returns a flag indicating if the value is a function.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function isFunction(value: any): value is Function {
    return "function" === typeof value;
}
