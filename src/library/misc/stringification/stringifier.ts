namespace internal {

    //----------------------------------------------------------------------------------------------------------------------
    // The default stringifier's options.
    //----------------------------------------------------------------------------------------------------------------------

    export interface StringifierOptions {
        breakLines: boolean | "auto",
        indent: string,
        quotes: "auto" | '"' | "'" | "`",
        quotePropertyNames: boolean | "auto"
    };

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
        // Stringify the given values and render them as specified in the format string.
        // @brief   Stringify the given values and render them as specified in the format string.
        // @param   format A format string with placeholders ($1, $2, ... and $* for all others).
        // @return  Returns the format string with the placeholders replaced by the stringified values.
        //--------------------------------------------------------------------------------------------------------------

        format(format: string, ...values: any): string;

        //--------------------------------------------------------------------------------------------------------------
        // Create an inline string representation of the given value (without line breaks).
        // @param   value The value to be stringified.
        // @param   options Override (some or all of) the stringifier's default options.
        // @return  Returns a string representation of the given value.
        //--------------------------------------------------------------------------------------------------------------

        inline: Stringifier<T>;

        //--------------------------------------------------------------------------------------------------------------
        // Create a new stringifier with different default options.
        // @param   defaultOptions The new stringifier's default options.
        // @return  Returns a new stringifier with the given default options.
        //--------------------------------------------------------------------------------------------------------------

        createExtendedStringifier(defaultOptions: Partial<T>): Stringifier<T>;

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
        // @type    O Additional options of the new stringifier.
        //--------------------------------------------------------------------------------------------------------------

        createExtendedStringifier<O>(
            defaultOptions: O & Partial<T>,
            addStringificationHandlers: Consumer<StringifierBuilder<T & O>>
        ): Stringifier<T & O>;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Assemble a Stringifier.
//----------------------------------------------------------------------------------------------------------------------

function createStringifier<T extends internal.StringifierOptions>(stringifierEngine: StringifierEngine<any, T>) {

    const stringify = (value: any, options?: Partial<T>) => stringifierEngine.stringifyWithOptions(value, options);
    const createExtendedStringifier = <O extends Partial<T>>(
        optionsOrCallback: O | internal.Consumer<internal.StringifierBuilder<T>>,
        callback?: internal.Consumer<internal.StringifierBuilder<T>>
    ) => {

        const options = isObject(optionsOrCallback) ? optionsOrCallback : {};
        const builder = new StringifierBuilder(stringifierEngine, options);
        if (callback) {
            callback(builder);
        } else if ("function" === typeof optionsOrCallback) {
            optionsOrCallback(builder);
        }
        const newStringifierEngine = new StringifierEngine(
            builder.handlers,
            { ...stringifierEngine.defaultOptions, ...builder.options },
            stringifierEngine
        );
        return createStringifier(newStringifierEngine);
    }

    const inlineOptions: Partial<T> = {};
    inlineOptions.breakLines = false;
    const inline = false === stringifierEngine.defaultOptions.breakLines
        ? stringify as internal.Stringifier<T>
        : createExtendedStringifier(inlineOptions);

    const formatter = (formatString: string, ...values: any) => {
        return format(formatString, ...values.map((value: any) => stringify(value)));
    }

    let stringifier = stringify as internal.Stringifier<T>;
    stringifier.createExtendedStringifier = createExtendedStringifier;
    stringifier.inline = inline;
    stringifier.format = formatter;
    (stringifier as any).engine = stringifierEngine; // used in unit tests only

    return stringifier;
}
