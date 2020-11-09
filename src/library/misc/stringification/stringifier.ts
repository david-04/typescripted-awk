namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // The default stringifier's options.
    //------------------------------------------------------------------------------------------------------------------

    export interface StringifierOptions {

        //--------------------------------------------------------------------------------------------------------------
        // Enable or disable line breaks among object properties and array elements. Can be set to `true` or `false`
        // strictly enforce or avoid line breaks everywhere. If set to `"auto"`, lines are only broken for objects and
        // arrays that contain nested objects and arrays.
        //
        // @brief   Enable or disable line breaks among object properties and array elements.
        //--------------------------------------------------------------------------------------------------------------

        breakLines: boolean | "auto",

        //--------------------------------------------------------------------------------------------------------------
        // The string for one level of indentation.
        //--------------------------------------------------------------------------------------------------------------

        indent: string,

        //--------------------------------------------------------------------------------------------------------------
        // Specifies the string delimiters to use. Can be set to single quotes, double quotes or backticks. When set to
        // `auto`, the type of delimiter is selected dynamically based on the content of a string. It strives to render
        // the string with as little escaping as possible - and might favor backticks for multiline strings.
        //
        // @brief   Set how strings are quoted.
        //--------------------------------------------------------------------------------------------------------------

        quotes: "auto" | '"' | "'" | "`",

        //--------------------------------------------------------------------------------------------------------------
        // Enable or disable quotes around property names. Can be set to `true` or `false` to strictly en- or disable
        // quotes. If set to`auto`, quotes are only added to property names that contain whitespace.
        //
        // @brief   Enable or disable quotes around property names.
        //--------------------------------------------------------------------------------------------------------------

        quotePropertyNames: boolean | "auto"
    };

    //------------------------------------------------------------------------------------------------------------------
    // Convert an object into a string representation similar to JSON. In contrast to `JSON.stringify()`, the result is
    // meant to be more readable, but at the same time can't be parsed back into an object:
    //
    // ```typescript
    // stringify({ a: new MyClass(123), b: [`it's`, `a "quote"`] });
    //
    // // returns:
    // {
    //     a: MyClass(value: 123),
    //     b: ["it's", 'a "quote"']
    // }
    // ```
    //
    // The stringification tries to keep the result compact and readable by:
    //
    // - including class names where applicable
    // - avoiding line breaks between properties where feasible
    // - omitting quotes around property names
    // - dynamically using backticks, single or double quotes for strings
    //
    // Special handling applies to instances of the `PreStringifiedValue`. Instead of using the default rendering logic,
    // the stringifier just inserts the pre-rendered representation:
    //
    // ```typescript
    // const myObject = {
    //     a: preStringify(123).as("one-two-three"),
    //     b: preStringify([1, 2, 3]).as("an array")
    // };
    //
    // myObject.a.value === 123;
    // myObject.a.stringifiedValue === "one-two-three";
    // stringify(myObject) === "{ a: one-two-three, b: an array }";
    // ```
    //
    // The stringification result can be customized by passing options as the second parameter:
    //
    // ```typescript
    // stringify(myObject, {
    //     breakLines: false,
    //     quotes: "'",
    //     indent: "  ",
    //     quotePropertyNames: true
    // });
    // ```
    //
    // The stringifier's `format()` method can be used to render a set of objects as specified in a format string:
    //
    // ```typescript
    // const stringified = stringify.format(
    //     "$1.filter($2) contains: $*",
    //      [1, 2, 3],
    //     (x: number) => x < 3,
    //     1,
    //     2
    // );
    //
    // stringified === "[1, 2, 3].filter((x) => x < 3) contains 1, 2";
    // ```
    //
    // There's also a shortcut to quickly stringify a value in a single line (i.e. without line breaks):
    //
    // ```typescript
    // stringify.inline(myObject);
    // // this is equivalent to:
    // stringify(myObject, { breakLines: false });
    // ```
    //
    // A pre-configured stringifier can be saved and reused by creating an extended stringifier:
    //
    // ```typescript
    // const myStringify = stringify.createExtendedStringifier({
    //     indent: "\t",
    //     quotePropertyNames: true
    // });
    //
    // myStringify(myObject);
    // // this produces the same result as:
    // stringify(myObject, {
    //     indent: "\t",
    //     quotePropertyNames: true
    // });
    // ```
    //
    // Extended stringifiers can also implement custom rendering rules:
    //
    // ```typescript
    // const myStringify = stringify.createExtendedStringifier(builder =>
    //     builder.stringifyNumber(number => 0 < number ? `+${number}` : `${number}`)
    // );
    //
    // myStringify(myObject);
    // ```
    //
    // The stringifier's result is meant to be human readable and not machine readable - and the format might change in
    // the future.
    //
    // @brief   Convert an object into a string representation similar to JSON.
    // @type    T The options supported by the stringifier.
    //------------------------------------------------------------------------------------------------------------------

    export interface Stringifier<T> {

        //--------------------------------------------------------------------------------------------------------------
        // Create a string representation of the given value:
        //
        // ```typescript
        // stringify({ a: new MyClass(123), b: [`it's`, `a "quote"`] });
        //
        // // returns:
        // {
        //     a: MyClass(value: 123),
        //     b: ["it's", 'a "quote"']
        // }
        // ```
        //
        // The stringification result can be customized by passing options as the second parameter:
        //
        // ```typescript
        // stringify(myObject, {
        //     breakLines: false,
        //     quotes: "'",
        //     indent: "  ",
        //     quotePropertyNames: true
        // });
        // ```
        //
        // The stringifier's result is meant to be human readable and not machine readable - and the format might
        // change in the future.
        //
        // @brief   Create a string representation of the given value.
        // @param   value The value to be stringified.
        // @param   options Override (some or all of) the stringifier's default options.
        // @return  Returns a string representation of the given value.
        //--------------------------------------------------------------------------------------------------------------

        (value: any, options?: Partial<T>): string;

        //--------------------------------------------------------------------------------------------------------------
        // Stringify the given values and render them as specified in the format string:
        //
        // ```typescript
        // const stringified = stringify.format(
        //     "$1.filter($2) contains: $*",
        //      [1, 2, 3],
        //     (x: number) => x < 3,
        //     1,
        //     2
        // );
        //
        // stringified === "[1, 2, 3].filter((x) => x < 3) contains 1, 2";
        // ```
        //
        // The placeholders `$1`, `$2`, `$3`... stand for the values passed after the format string. `$*` is replaced
        // with a comma-separated list of all values that have not been referenced otherwise. Use `$$` to insert a
        // single dollar sign (that's not subject to replacement).
        //
        // @brief   Stringify the given values and render them as specified in the format string.
        // @param   format A format string with placeholders ($1, $2, ... and $* for all others).
        // @return  Returns the format string with the placeholders replaced by the stringified values.
        //--------------------------------------------------------------------------------------------------------------

        format(format: string, ...values: any): string;

        //--------------------------------------------------------------------------------------------------------------
        // A shortcut for stringifying inline (without line breaks):
        //
        // ```typescript
        // stringify.inline(myObject);
        // // this is equivalent to:
        // stringify(myObject, { breakLines: false });
        // ```
        //
        // The `inline` property is a stringifier by itself, i.e. it also has the other properties like `format()` and
        // `createExtendedStringifier()`.
        //
        // @brief   Stringify a value inline (without line breaks).
        //--------------------------------------------------------------------------------------------------------------

        inline: Stringifier<T>;

        //--------------------------------------------------------------------------------------------------------------
        // Create a new stringifier with different default options:
        //
        // ```typescript
        // const myStringify = stringify.createExtendedStringifier({
        //     indent: "\t",
        //     quotePropertyNames: true
        // });
        //
        // myStringify(myObject);
        // // this produces the same result as:
        // stringify(myObject, {
        //     indent: "\t",
        //     quotePropertyNames: true
        // });
        // ```
        //
        // @brief   Create a new stringifier with different default options.
        // @param   defaultOptions The new stringifier's default options.
        // @return  Returns a new stringifier with the given default options.
        //--------------------------------------------------------------------------------------------------------------

        createExtendedStringifier(defaultOptions: Partial<T>): Stringifier<T>;

        //--------------------------------------------------------------------------------------------------------------
        // Create a new stringifier that extends the current one with additional rendering rules:
        //
        // ```typescript
        // const myStringify = stringify.createExtendedStringifier(builder =>
        //     builder.stringifyNumber(number => 0 < number ? `+${number}` : `${number}`)
        // );
        //
        // myStringify(myObject);
        // ```
        //
        // All values not handled by a stringifier are passed on to the base stringifier (that it extends).
        //
        // @brief   Create a new stringifier with additional rendering rules.
        // @param   addStringificationHandlers A function that adds additional stringification handlers.
        // @return  Returns a new stringifier instances as configured.
        //--------------------------------------------------------------------------------------------------------------

        createExtendedStringifier(addStringificationHandlers: Consumer<StringifierBuilder<T>>): Stringifier<T>;

        //--------------------------------------------------------------------------------------------------------------
        // Create a new stringifier that extends the current one with additional configuration and rendering rules:
        //
        // ```typescript
        // const myStringify = stringify.createExtendedStringifier({
        //     trueValue: "yes",
        //     falseValue: "no"
        // }, builder => builder.stringifyBoolean((value, context) =>
        //     value ? context.options.trueValue : context.options.falseValue)
        // );
        //
        // myStringify(true); // returns: yes
        // myStringify(false, { falseValue: "N" }); // returns N
        // ```
        //
        // @brief   Create a new stringifier with additional options and rendering rules.
        // @param   defaultOptions The new stringifier's default options (both new and pre-existing).
        // @param   addStringificationHandlers A function that adds additional rendering rules.
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
