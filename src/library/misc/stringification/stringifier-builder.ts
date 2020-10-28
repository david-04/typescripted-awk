namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A function that stringifies a value.
    // @type    T The type of value handled by the function (might be "any")
    // @type    O The options supported by the stringifier this function belongs to.
    //------------------------------------------------------------------------------------------------------------------

    export type StringificationHandler<T, O> = internal.Function2<T, StringifierContext<O>, string>;

    //------------------------------------------------------------------------------------------------------------------
    // An object that allows adding stringification handlers while constructing a stringifier.
    //------------------------------------------------------------------------------------------------------------------

    export abstract class StringifierBuilder<T> {

        //--------------------------------------------------------------------------------------------------------------
        // Append a stringification handler to the end of the chain.
        //--------------------------------------------------------------------------------------------------------------

        protected abstract addStringifier(appliesTo: Predicate1<any>, stringify: StringificationHandler<any, T>): this;

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler for any value that matches a custom condition.
        // @param   condition A function that returns true if and only if the handler is applicable to the given value.
        // @param   stringify A function that stringifies the given value.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyIf(condition: Predicate1<any>, stringify: StringificationHandler<any, T>) {
            return this.addStringifier(condition, stringify);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies boolean values.
        // @param   stringify A function that stringifies the given boolean value.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyBoolean(stringify: StringificationHandler<boolean, T>): this {
            return this.stringifyIf(isBoolean, stringify);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies numbers (including Infinity and NaN).
        // @param   stringify A function that stringifies the given number.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyNumber(stringify: StringificationHandler<number, T>): this {
            return this.stringifyIf(isNumber, stringify);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies strings.
        // @param   stringify A function that stringifies the given string.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyString(stringify: StringificationHandler<string, T>): this {
            return this.stringifyIf(isString, stringify);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies regular expressions.
        // @param   stringify A function that stringifies the given regular expression.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyRegExp(stringify: StringificationHandler<RegExp, T>): this {
            return this.stringifyIf(value => value instanceof RegExp, stringify);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies objects (including arrays and regular expressions but excluding null).
        // @param   stringify A function that stringifies the given object.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyObject(stringify: StringificationHandler<object, T>): this {
            return this.stringifyIf(isObject, stringify);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies arrays.
        // @param   stringify A function that stringifies the given array.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyArray(stringify: StringificationHandler<Array<any>, T>): this {
            return this.stringifyIf(isArray, stringify);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Add a handler that stringifies functions (including arrow function expressions).
        // @param   stringify A function that stringifies the given function.
        //--------------------------------------------------------------------------------------------------------------

        public stringifyFunction(stringify: StringificationHandler<AnyFunction, T>): this {
            return this.stringifyIf(isFunction, stringify);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Implementation of internal.StringifierBuilder.
//----------------------------------------------------------------------------------------------------------------------

class StringifierBuilder<B, T> extends internal.StringifierBuilder<B & T>{

    public readonly handlers = new Array<StringifierHandler<B & T>>();
    public readonly options: T;

    //------------------------------------------------------------------------------------------------------------------
    // Initialize the builder.
    //------------------------------------------------------------------------------------------------------------------

    public constructor(public readonly baseStringifier: StringifierEngine<any, B>, additionalOptions: T) {
        super();
        this.options = deepMerge(baseStringifier.defaultOptions, additionalOptions);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Append a stringification handler to the chain.
    //------------------------------------------------------------------------------------------------------------------

    protected addStringifier(
        appliesTo: internal.Predicate1<any>,
        stringify: internal.StringificationHandler<any, B & T>
    ): this {
        this.handlers.push({ appliesTo, stringify });
        return this;
    }
}
