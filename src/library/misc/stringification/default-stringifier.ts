//----------------------------------------------------------------------------------------------------------------------
// Stringify a number.
//----------------------------------------------------------------------------------------------------------------------

function stringifyNumber(number: number) {

    if (isNaN(number)) {
        return "NaN";
    } else if (Infinity === number) {
        return "Infinity";
    } else if (-Infinity === number) {
        return "-Infinity";
    } else {
        return `${number}`;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Stringify a string.
//----------------------------------------------------------------------------------------------------------------------

function stringifyString(value: string, context: internal.StringifierContext<internal.StringifierOptions>) {

    let { quotes, breakLines } = context.options;
    breakLines = rendersWithLineBreaks(value, context);

    if (breakLines) {
        quotes = "`";
    } else if ("auto" === quotes) {
        const escape = {
            singleQuotes: 0,
            doubleQuotes: 0,
            backtick: 0
        }
        for (let index = 0; index < value.length; index++) {
            const char = value.charAt(index);
            if ("'" === char) {
                escape.singleQuotes++;
            } else if ('"' === char) {
                escape.doubleQuotes++;
            } else if ("`" === char) {
                escape.backtick++;
            } if ("$" === char && index + 1 < value.length && "{" === value.charAt(index + 1)) {
                escape.backtick++;
            }
        }
        if (escape.doubleQuotes <= Math.min(escape.singleQuotes, escape.backtick)) {
            quotes = '"';
        } else if (escape.singleQuotes <= escape.backtick) {
            quotes = "'";
        } else {
            quotes = '`';
        }
    }

    let escapedValue = "";
    for (let index = 0; index < value.length; index++) {
        const char = value.charAt(index);
        if (quotes === char || "\\" === char || ("`" === quotes && 0 === value.substr(index).indexOf("${"))) {
            escapedValue += "\\";
        }
        escapedValue += char;
    }

    value = `${quotes}${escapedValue}${quotes}`;

    if (breakLines) {
        return value.split(/\r?\n/).map((line, index) => `${index ? context.indent : ""}${line}`).join("\n");
    } else {
        return value.replace(/\r?\n/g, "\\n");
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Determine if a string should be rendered with or without line breaks.
//----------------------------------------------------------------------------------------------------------------------

function rendersWithLineBreaks(value: string, context: internal.StringifierContext<internal.StringifierOptions>) {

    let { breakLines, quotes } = context.options;

    if (false === breakLines || ("`" !== quotes && "auto" !== quotes)) {
        return false;
    } else {
        return true === breakLines || 3 <= value.replace(/[^\n]/g, "").length;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Stringify a regular expression.
//----------------------------------------------------------------------------------------------------------------------

function stringifyRegularExpression(value: RegExp, options: internal.StringifierOptions) {

    let expression = `${value.source}`;
    if (true !== options.breakLines) {
        expression = expression.replace(/\r?\n/g, "\\n")
    }
    return `/${expression}/${value.flags}`;
}

//----------------------------------------------------------------------------------------------------------------------
// Stringify an exception.
//----------------------------------------------------------------------------------------------------------------------

const stringifyException = (() => {

    const standardErrorProperties = new Set<string>();
    Object.keys(new Error()).forEach(property => standardErrorProperties.add(property));

    return (error: Error, context: internal.StringifierContext<internal.StringifierOptions>) => {

        const extraProperties = Object.keys(error).filter(property => !standardErrorProperties.has(property));

        if (extraProperties.length) {
            const clone: any = {};
            if (error.message) {
                clone.message = error.message;
            }
            for (const property of extraProperties) {
                clone[property] = (error as any)[property];
            }
            return `${error?.constructor?.name || error.name}(${context.stringifyWithTopLevelStringifier(clone)})`;
        } else {
            const message = error.message ? context.stringifyWithTopLevelStringifier(error.message) : "";
            return `${error?.constructor?.name || error.name || "Error"}(${message})`;
        }
    }
})();

//----------------------------------------------------------------------------------------------------------------------
// Stringify a function.
//----------------------------------------------------------------------------------------------------------------------

function stringifyFunction(value: Function, breakLines: boolean | "auto") {

    if (value.name) {
        return value.name;
    } else {
        return (false === breakLines ? `${value}`.replace(/\r?\n[ \t]*/g, " ") : `${value}`) || "[function]";
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Stringify an array.
//----------------------------------------------------------------------------------------------------------------------

function stringifyArray(values: any[], context: internal.StringifierContext<internal.StringifierOptions>) {

    let { breakLines } = context.options;
    if ("auto" === breakLines) {
        breakLines = !!values.filter(item =>
            (
                isObject(item)
                && (!(item instanceof internal.PreStringifiedValue) || 0 < item.stringifiedValue.indexOf("\n"))
            )
            || isArray(item) || (isString(item) && rendersWithLineBreaks(item, context))
        ).length;
    }

    values = values.map(value => context.stringifyWithTopLevelStringifier(value, context.options.indent));
    for (let index = 0; index < values.length - 1; index++) {
        values[index] += ","
    }

    if (breakLines) {
        const indent = `${context.indent}${context.options.indent}`;
        return `[\n${indent}${values.join(`\n${indent}`)}\n${context.indent}]`;
    } else {
        return `[${values.join(" ")}]`;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Stringify an object.
//----------------------------------------------------------------------------------------------------------------------

function stringifyObject(value: any, context: internal.StringifierContext<internal.StringifierOptions>) {

    const properties = Object.keys(value).map(key => ({ key, value: value[key] }));

    let { breakLines } = context.options;
    if ("auto" === breakLines) {
        breakLines = !!properties.map(property => property.value).filter(item =>
            (
                isObject(item)
                && (!(item instanceof internal.PreStringifiedValue) || 0 < item.stringifiedValue.indexOf("\n"))
            )
            || isArray(item)
            || (isString(item) && rendersWithLineBreaks(item, context))
        ).length;
    }

    const quotePropertyNames = context.options.quotePropertyNames;
    if (false !== quotePropertyNames) {
        for (const property of properties) {
            if (true === quotePropertyNames || ("auto" === quotePropertyNames && property.key.match(/\s/))) {
                property.key = context.stringifyWithTopLevelStringifier(property.key.replace(/\r?\n/g, "\\n"));
            }
        }
    }

    for (const property of properties) {
        property.value = context.stringifyWithTopLevelStringifier(property.value, context.options.indent);
    }

    const className = value?.constructor?.name && "Object" !== value.constructor.name
        ? value.constructor.name
        : undefined;
    const keyValues = properties.map(property => `${property.key}: ${property.value}`);

    if (breakLines) {
        const indent = `${context.indent}${context.options.indent}`;
        const joinedProperties = keyValues.join(`,\n${indent}`)
        if (className) {
            return `${className}(\n${indent}${joinedProperties}\n${context.indent})`;
        } else {
            return `{\n${indent}${joinedProperties}\n${context.indent}}`;
        }
    } else {
        const joinedProperties = keyValues.join(", ");
        if (className) {
            return `${className}(${joinedProperties})`;
        } else {
            return `{ ${joinedProperties} }`;
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
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
// The stringifier's result is meant to be human readable and not machine readable - and the format might change in the
// future.
//
// @brief   Convert an object into a string representation similar to JSON.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

const stringify = (() => {

    const options: internal.StringifierOptions = {
        breakLines: "auto",
        indent: "    ",
        quotes: "auto",
        quotePropertyNames: "auto"
    };

    return createStringifier(new StringifierEngine([], options)).createExtendedStringifier(builder => builder

        .stringifyAny(value => undefined === value ? "undefined" : undefined)
        .stringifyAny(value => null === value ? "null" : undefined)
        .stringifyBoolean(value => value ? "true" : "false")
        .stringifyNumber(stringifyNumber)
        .stringifyString((value, context) => stringifyString(value, context))
        .stringifyRegExp((value, context) => stringifyRegularExpression(value, context.options))
        .stringifyAny((value, context) => value instanceof Error ? stringifyException(value, context) : undefined)
        .stringifyFunction((value, context) => stringifyFunction(value, context.options.breakLines))
        .stringifyArray((value, context) => stringifyArray(value, context))
        .stringifyObject((value, context) => stringifyObject(value, context))
    );
})();
