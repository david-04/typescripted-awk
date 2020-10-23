//----------------------------------------------------------------------------------------------------------------------
// Create a deep copy of an object and overlay (merge) it with another one. The resulting object contains all properties
// of the overlaid object as well as any that only exist in the base object.
//
// ```ts
// deepOverlay(
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
// @brief   Deep-clone an object and overlay (merge) it with another one.
// @param   base The base object to be cloned and overlaid.
// @param   overlay The overlay object to override properties of the base object.
// @return  Returns a deep clone of the base object overlaid with the overlay object.
// @type    B The type of the base object
// @type    O The type of the overlay object
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function deepOverlay<B, O>(base: B, overlay: O): B & O {
    return recursiveOverlay(deepClone(base), deepClone(overlay));
}

//----------------------------------------------------------------------------------------------------------------------
// Recursively overlay the base object with the overlay object.
//----------------------------------------------------------------------------------------------------------------------

function recursiveOverlay(base: any, overlay: any) {

    if (isObject(base)
        && isObject(overlay)
        && !isArray(base)
        && Object.getPrototypeOf(base) === Object.getPrototypeOf(overlay)
    ) {
        for (const key in overlay) {
            base[key] = recursiveOverlay(base[key], overlay[key]);
        }
        return base;
    }

    return overlay;
}
