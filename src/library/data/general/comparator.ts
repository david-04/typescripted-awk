//----------------------------------------------------------------------------------------------------------------------
// A standard comparator to compare two values. The sort order is by type first:
//
// 1. undefined
// 2. null
// 3. boolean
// 4. number
// 5. BigInt
// 6. string
// 7. RegExp
// 8. object
// 9. function
// 10. symbol
//
// If both values have the same type, they are compared via `<` and `>`. For functions and symbols, the result
// of the `toString()` method is compared (instead of comparing the objects directly).
//
// @level   3
// @brief   A standard comparator for values.
// @param   a The first value.
// @param   b The second value.
// @return  Returns -1 if a < b, 0 if a == b and 1 if a > b.
//----------------------------------------------------------------------------------------------------------------------

function comparator(a: any, b: any): -1 | 0 | 1 {

    if (isRegExp(a) && isRegExp(b)) {
        a = a.source as any;
        b = b.source as any;
    } else if (isFunction(a) && isFunction(b) && a !== b) {
        a = a.toString() as any;
        b = b.toString() as any;
    } else if ("symbol" === typeof a && "symbol" === typeof b) {
        a = a.toString() as any;
        b = b.toString() as any;
    }

    if (typeof a !== typeof b || (null === a) !== (null === b)) {

        if (undefined === a) return -1;
        if (undefined === b) return 1;
        if (null === a) return -1;
        if (null === b) return 1;
        if ("boolean" === typeof a) return -1;
        if ("boolean" === typeof b) return 1;
        if ("number" === typeof a) return -1;
        if ("number" === typeof b) return 1;
        if ("bigint" === typeof a) return -1;
        if ("bigint" === typeof b) return 1;
        if ("string" === typeof a) return -1;
        if ("string" === typeof b) return 1;
        if (a instanceof RegExp) return -1;
        if (b instanceof RegExp) return 1;
        if ("object" === typeof a) return -1;
        if ("object" === typeof b) return 1;
        if ("function" === typeof a) return -1;
        if ("function" === typeof b) return 1;
        if ("symbol" === typeof a) return -1;
        if ("symbol" === typeof b) return 1;

        return typeof a < typeof b ? -1 : 1;
    }

    if (a === b) return 0;
    if ("boolean" === typeof a && "boolean" === typeof b) {
        return a === false ? -1 : 1;
    }

    return a < b ? -1 : 1;
}

//----------------------------------------------------------------------------------------------------------------------
// Create a comparator that maps values before comparing them. It calls the provided mapper function to transform or
// extract the values and then compares them with the standard `comparator()` function.
//
// @level   3
// @brief   Create a comparator that maps values before comparing them.
// @param   mapper The  mapper function that transforms a value.
// @return  Returns a comparator that compares two values.
//----------------------------------------------------------------------------------------------------------------------

function comparing<T, M>(mapper?: (value: T) => M) {
    return mapper ? (a: T, b: T) => comparator(mapper(a), mapper(b)) : comparator;
}
