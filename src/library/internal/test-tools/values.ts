//----------------------------------------------------------------------------------------------------------------------
// A boxed version of any type of value which can have a separate display representation.
//----------------------------------------------------------------------------------------------------------------------

class Value<T> {

    private _displayValue: string;

    public constructor(public readonly value: T) {
        this._displayValue = stringifyValue(value);
        if ('function' === typeof value) {
            if (value.name) {
                this._displayValue = value.name;
            } else if (value.toString()) {
                this._displayValue = (value as any).toString();
            }
        }
    }

    public get displayName() {
        return this._displayValue;
    }

    public as(displayName: string): T {
        this._displayValue = displayName;
        return this as any as T;
    }
}

function use<T>(value: T) {
    return new Value(value) as Value<T> & T;
}

function unboxValue<T>(value: T): T {
    return value instanceof Value ? value.value : value;
}

//----------------------------------------------------------------------------------------------------------------------
// Convert a value into a JSON-style string representation.
//----------------------------------------------------------------------------------------------------------------------

function stringifyValue(value: any) {
    if (value instanceof Value) {
        return value.displayName;
    }
    if (undefined === value) {
        return 'undefined';
    } else if (null === value) {
        return 'null';
    } else if ('number' === typeof value && isNaN(value)) {
        return 'NaN';
    } else if (Infinity === value) {
        return 'Infinity';
    } else if (-Infinity === value) {
        return '-Infinity'
    } else if (value instanceof RegExp) {
        return `/${value.source}/${value.flags}`;
    } else if ('string' === typeof value) {
        let asString = JSON.stringify(value);
        if (2 === asString.replace(/[^"]/g, '').length) {
            asString = asString.replace(/"/g, "'");
        } else if (0 === asString.replace(/[^`]/g, '').length && asString.indexOf('${') < 0) {
            asString = asString.replace(/"/g, "`");
        }
        return asString;
    } else {
        return JSON.stringify(value);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Convert a error into a JSON-style string representation.
//----------------------------------------------------------------------------------------------------------------------

function stringifyErrorForComparison(error: any) {
    if (error instanceof Value) {
        error = error.value;
    }
    if (undefined === error) {
        return 'undefined';
    } else if (null === error) {
        return 'null';
    } else if (error instanceof Error) {
        const prototype = error?.constructor?.name;
        if (error.message) {
            return `${prototype || Error}('${error.message}')`;
        } else {
            return `${prototype || Error}()`;
        }
    } else {
        return `${stringifyValue(error)}`;
    }
}

function stringifyErrorForDisplay(error: any) {
    return error instanceof Value ? error.value : stringifyErrorForComparison(error);
}
