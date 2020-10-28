//----------------------------------------------------------------------------------------------------------------------
// Create a deep clone of the given value. Only objects (like arrays, instances of classes, and anonymous object
// literals) are cloned. For all other values (like numbers and functions), shallow copying is used. Circular references
// (recursive nesting of an object inside itself) are supported and preserved.
//
// @brief   Create a deep copy of the given object.
// @param   value The object to clone.
// @return  Returns a deep copy of the object.
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
