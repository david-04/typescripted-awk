//----------------------------------------------------------------------------------------------------------------------
// Create a deep copy of an object by recursively cloning each property. The object may contain circular references
// (objects nested inside themselves). These references are preserved and replicated in the clone. Class instances can
// be copied as well, but there might be a few limitations (for example, the stack trace of `Error` objects is not
// carried over).
//
// @brief   Create a deep copy of an object.
// @param   value The object to clone.
// @return  Returns a deep copy of the object.
// @type    T The type of the object to clone.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function deepClone<T>(value: T): T {
    return recursiveClone(value, []);
}

//----------------------------------------------------------------------------------------------------------------------
// Recursively clone an object.
//----------------------------------------------------------------------------------------------------------------------

function recursiveClone(value: any, stack: Array<{ value: any, clone: any }>) {

    let clone: any = value;

    if (isObject(value) && !(value instanceof RegExp)) {
        const parent = stack.filter(item => item.value === value)[0];
        if (parent) {
            return parent.clone;
        }
        if (isArray(value)) {
            clone = [];
            stack.push({ value: value, clone });
            value.forEach(item => clone.push(recursiveClone(item, stack)));
        } else {
            clone = Object.create(Object.getPrototypeOf(value));
            if (value instanceof Error) {
                clone.stack = `${value.stack}`;
                clone.message = value.message;
                clone.name = value.name;
            }
            stack.push({ value: value, clone });
            for (const key in value) {
                if ("constructor" !== key) {
                    clone[key] = recursiveClone(value[key], stack);
                }
            }
        }
        stack.pop();
    }

    return clone;
}
