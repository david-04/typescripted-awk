//----------------------------------------------------------------------------------------------------------------------
// Format the given values with the specified format string (can include $1, $2, $3, ... and $* for all other values).
//----------------------------------------------------------------------------------------------------------------------

function format(format: string, ...values: any) {

    let input = replaceVariableArgumentList(format, values);
    let output = "";

    while (input) {

        const match = input.match(/\$(\$|[0-9]+)/);
        if (match && undefined !== match.index) {
            const placeholder = match[0];
            output += input.substr(0, match.index);
            input = input.substr(match.index + placeholder.length)
            if (placeholder !== "$$") {
                output += values[parseInt(placeholder.substr(1)) - 1];
            } else {
                output += "$";
            }
        } else {
            output += input;
            input = "";
        }
    }

    return output;
}

//------------------------------------------------------------------------------------------------------------------
// Replace the $* placeholder with a variable list of placeholders (e.g. $2, $3, $4).
//------------------------------------------------------------------------------------------------------------------

function replaceVariableArgumentList(format: string, values: Array<any>) {

    if (format.indexOf("$*") < 0) {
        return format;
    }

    format = format.replace(/\$\$/g, "__@@@@PRESERVE__DOLLAR__DOLLAR__");
    values = values.slice(0);
    for (let index = 0; index < values.length; index++) {
        values[index] = `\$${index + 1}`;
    }

    const pattern = /\$[0-9]+/g;
    let match: RegExpExecArray | null;
    while (match = pattern.exec(format)) {
        const placeholder = match[0];
        if (match && match[0]) {
            values = values.filter(parameter => parameter !== placeholder);
        }
    }

    return format.replace(/\$\*/g, values.join(", ")).replace(/__@@@@PRESERVE__DOLLAR__DOLLAR__/g, "$$$$");
}
