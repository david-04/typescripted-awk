namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A builder for attaching rendering rules to a stringifier. It's used via `stringify.createExtendedStringifier()`
    // when extending a stringifier:
    //
    // ```typescript
    // const myStringify = stringify.createExtendedStringifier(builder =>
    //     builder.stringifyNumber(number => 0 < number ? `+${number}` : undefined)
    // );
    // ```
    //
    // Each rendering rule can return a string or `undefined` (to  signal that it doesn't stringify the current value).
    // If a string is returned, it's used as the stringified representation. If `undefined` is returned, the value is
    // passed on to the next rendering rule in the chain.
    //
    // @brief   A builder for attaching rendering rules to a stringifier.
    // @type    T The options supported by the stringifier.
    //------------------------------------------------------------------------------------------------------------------

    export abstract class StringifierBuilder<T> {

        //--------------------------------------------------------------------------------------------------------------
        // Append a stringification handler to the end of the chain.
        //--------------------------------------------------------------------------------------------------------------

        protected abstract addStringifier(stringify: StringificationHandler<any, T>): this;

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies values of any type.
        //
        // @param   stringify A function that stringifies a given value.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyAny(stringify: StringificationHandler<any, T>) {
            return this.addStringifier(stringify);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies boolean values.
        //
        // @param   stringify A function that stringifies a given boolean value.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyBoolean(stringify: StringificationHandler<boolean, T>): this {
            return this.stringifyAny((value, context) => isBoolean(value) ? stringify(value, context) : undefined);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies numbers (including `Infinity` and `NaN`).
        //
        // @brief   Add a handler that stringifies numbers (including Infinity and NaN).
        // @param   stringify A function that stringifies a given number.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyNumber(stringify: StringificationHandler<number, T>): this {
            return this.stringifyAny((value, context) => isNumber(value) ? stringify(value, context) : undefined);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies strings.
        //
        // @param   stringify A function that stringifies a given string.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyString(stringify: StringificationHandler<string, T>): this {
            return this.stringifyAny((value, context) => isString(value) ? stringify(value, context) : undefined);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies regular expressions.
        //
        // @param   stringify A function that stringifies a given regular expression.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyRegExp(stringify: StringificationHandler<RegExp, T>): this {
            return this.stringifyAny(
                (value, context) => value instanceof RegExp ? stringify(value, context) : undefined
            );
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies objects (excluding `null`).
        //
        // @param   Add a handler that stringifies objects (excluding null).
        // @param   stringify A function that stringifies a given object.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyObject(stringify: StringificationHandler<object, T>): this {
            return this.stringifyAny((value, context) =>
                isObject(value) && !isArray(value) ? stringify(value, context) : undefined
            );
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies arrays.
        //
        // @param   stringify A function that stringifies a given array.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyArray(stringify: StringificationHandler<any[], T>): this {
            return this.stringifyAny((value, context) => isArray(value) ? stringify(value, context) : undefined);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies functions.
        //
        // @param   stringify A function that stringifies a given function.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyFunction(stringify: StringificationHandler<AnyFunction, T>): this {
            return this.stringifyAny((value, context) => isFunction(value) ? stringify(value, context) : undefined);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Implementation of internal.StringifierBuilder.
//----------------------------------------------------------------------------------------------------------------------

class StringifierBuilder<B, T> extends internal.StringifierBuilder<B & T>{

    public readonly handlers = new Array<internal.StringificationHandler<any, B & T>>();
    public readonly options: T;

    //------------------------------------------------------------------------------------------------------------------
    // Initialize the builder.
    //------------------------------------------------------------------------------------------------------------------

    public constructor(
        public readonly baseStringifier: StringifierEngine<any, B>, additionalOptions: Exclude<T, undefined | null>
    ) {
        super();
        this.options = deepMerge(baseStringifier.defaultOptions, additionalOptions);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Append a stringification handler to the chain.
    //------------------------------------------------------------------------------------------------------------------

    protected addStringifier(stringify: internal.StringificationHandler<any, B & T>): this {
        this.handlers.push(stringify);
        return this;
    }
}
