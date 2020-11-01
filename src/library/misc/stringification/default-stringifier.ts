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

function stringifyString(value: string, context: internal.StringifierContext<DefaultStringifierOptions>) {

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

function rendersWithLineBreaks(value: string, context: internal.StringifierContext<DefaultStringifierOptions>) {

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

function stringifyRegularExpression(value: RegExp, options: DefaultStringifierOptions) {

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

    return (error: Error, context: internal.StringifierContext<DefaultStringifierOptions>) => {

        const extraProperties = Object.keys(error).filter(property => !standardErrorProperties.has(property));

        if (extraProperties.length) {
            const clone = {} as any;
            if (error.message) {
                clone.message = error.message;
            }
            for (const property of extraProperties) {
                (clone as any)[property] = (error as any)[property];
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

function stringifyArray(values: any[], context: internal.StringifierContext<DefaultStringifierOptions>) {

    let { breakLines } = context.options;
    if ("auto" === breakLines) {
        breakLines = !!values.filter(item =>
            isObject(item) || isArray(item) || (isString(item) && rendersWithLineBreaks(item, context))
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

function stringifyObject(value: any, context: internal.StringifierContext<DefaultStringifierOptions>) {

    const properties = Object.keys(value).map(key => ({ key, value: value[key] }));

    let { breakLines } = context.options;
    if ("auto" === breakLines) {
        breakLines = !!properties.map(property => property.value).filter(item =>
            isObject(item) || isArray(item) || (isString(item) && rendersWithLineBreaks(item, context))
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
// Stringify a value or create an extended stringifier.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

const stringify = createStringifier(new StringifierEngine([], {

    breakLines: "auto" as boolean | "auto",
    indent: "    " as string,
    quotes: "auto" as "auto" | '"' | "'" | "`",
    quotePropertyNames: "auto" as boolean | "auto"

})).createExtendedStringifier(builder => builder

    .stringifyIf(value => undefined === value, () => "undefined")
    .stringifyIf(value => null === value, () => "null")
    .stringifyBoolean(value => value ? "true" : "false")
    .stringifyNumber(stringifyNumber)
    .stringifyString((value, context) => stringifyString(value, context))
    .stringifyRegExp((value, context) => stringifyRegularExpression(value, context.options))
    .stringifyIf(value => value instanceof Error, (value, context) => stringifyException(value, context))
    .stringifyFunction((value, context) => stringifyFunction(value, context.options.breakLines))
    .stringifyArray((value, context) => stringifyArray(value, context))
    .stringifyObject((value, context) => stringifyObject(value, context))
);
