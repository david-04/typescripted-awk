//----------------------------------------------------------------------------------------------------------------------
// Convert a error into a JSON-style string representation.
//----------------------------------------------------------------------------------------------------------------------

function stringifyErrorForComparison(error: any) {
    if (error instanceof internal.PreStringifiedValue) {
        error = error.value;
    }
    if (undefined === error) {
        return "undefined";
    } else if (null === error) {
        return "null";
    } else if (error instanceof Error) {
        const prototype = error?.constructor?.name;
        if (error.message) {
            return `${prototype || Error}("${error.message}")`;
        } else {
            return `${prototype || Error}()`;
        }
    } else {
        return `${stringify(error)}`;
    }
}

function stringifyErrorForDisplay(error: any) {
    return error instanceof internal.PreStringifiedValue ? error.value : stringifyErrorForComparison(error);
}
