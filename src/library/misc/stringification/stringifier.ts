namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A class that employs stringification handlers to turn any kind of object into a string representation.
    // @brief   A utility to turn any value or object into a string representation.
    // @type    T The options supported by the stringifier.
    //------------------------------------------------------------------------------------------------------------------

    export interface Stringifier<T> {

        //--------------------------------------------------------------------------------------------------------------
        // Create a string representation of the given value.
        // @param   value The value to be stringified.
        // @param   options Override (some or all of) the stringifier's default options.
        // @return  Returns a string representation of the given value.
        //--------------------------------------------------------------------------------------------------------------

        (value: any, options?: Partial<T>): string;

        //--------------------------------------------------------------------------------------------------------------
        // Create a new stringifier that extends the current one with additional stringification handlers.
        // @brief   Create a new stringifier with additional stringification handlers.
        // @param   addStringificationHandlers A function that adds additional stringification handlers.
        // @return  Returns a new stringifier instances as configured.
        //--------------------------------------------------------------------------------------------------------------

        createExtendedStringifier(addStringificationHandlers: Consumer<StringifierBuilder<T>>): Stringifier<T>;

        //--------------------------------------------------------------------------------------------------------------
        // Create a new stringifier that extends the current one with additional configuration and stringification
        // handlers.
        // @brief   Create a new stringifier with additional options and stringification handlers.
        // @param   defaultOptions The new stringifier's default options (both new and pre-existing).
        // @param   addStringificationHandlers A function that adds additional stringification handlers.
        // @return  Returns a new stringifier instances as configured.
        // @type    O The additional options of the new stringifier
        //--------------------------------------------------------------------------------------------------------------

        createExtendedStringifier<O>(
            defaultOptions: O,
            addStringificationHandlers: Consumer<StringifierBuilder<T & O>>
        ): Stringifier<T & O>;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Assemble a Stringifier.
//----------------------------------------------------------------------------------------------------------------------

function createStringifier<T>(stringifierEngine: StringifierEngine<any, T>) {

    const stringify = (value: any, options?: Partial<T>) => stringifierEngine.stringifyWithOptions(value, options);

    const createExtendedStringifier = <O extends T>(
        optionsOrCallback: O | internal.Consumer<internal.StringifierBuilder<T>>,
        callback?: internal.Consumer<internal.StringifierBuilder<O>>
    ) => {

        const options = isObject(optionsOrCallback) ? optionsOrCallback : {} as O;
        const builder = new StringifierBuilder(stringifierEngine, options);
        ((callback ?? optionsOrCallback) as any)(builder);
        const newStringifierEngine = new StringifierEngine(builder.handlers, builder.options, stringifierEngine);
        return createStringifier(newStringifierEngine);
    }

    let stringifier = stringify as internal.Stringifier<T>;
    stringifier.createExtendedStringifier = createExtendedStringifier;
    (stringifier as any).engine = stringifierEngine; // used in unit tests only

    return stringifier;
}
