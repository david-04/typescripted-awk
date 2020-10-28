//----------------------------------------------------------------------------------------------------------------------
// Create a deep copy of an object and merge (overlay) it with another one. The resulting object contains all properties
// of the overlaid object as well as any that only exist in the base object.
//
// ```ts
// deepMerge(
//     {
//         name: 'John Smith',
//         contact: {
//             email: 'john.smith@domain.com',
//             phone: '123456789'
//         }
//     },
//     {
//         contact: {
//             phone: undefined,
//             address: 'Queen St'
//         }
//     }
// );
//
// // This will produce the following result:
//
// const mergedResult = {
//     name: 'John Smith',
//     contact: {
//         email: 'john.smith@domain.com',
//         phone: undefined,
//         address: 'Queen St'
//     }
// }
// ```
//
// @brief   Deep-clone an object and merge it with another one.
// @param   base The base object to be cloned and overlaid.
// @param   overlay The overlay object to override properties of the base object.
// @return  Returns a deep clone of the base object overlaid with the overlay object.
// @type    B The type of the base object
// @type    O The type of the overlay object
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function deepMerge<B, O>(base: B, overlay: O): B & O {
    return recursiveMerge(deepClone(base), overlay, []);
}

//----------------------------------------------------------------------------------------------------------------------
// Recursively merge the overlay object into the base object.
//----------------------------------------------------------------------------------------------------------------------

function recursiveMerge(base: any, overlay: any, stack: Array<{ base: any, overlay: any }>) {

    if (isObject(base)
        && isObject(overlay)
        && !isArray(base)
        && !(base instanceof RegExp)
        && Object.getPrototypeOf(base) === Object.getPrototypeOf(overlay)
    ) {
        if (!stack.filter(item => item.base === base && item.overlay === overlay).length) {
            for (const key in overlay) {
                stack.push({ base, overlay });
                base[key] = recursiveMerge(base[key], overlay[key], stack);
                stack.pop();
            }
        }
        return base;
    }

    return deepClone(overlay);
}
