//----------------------------------------------------------------------------------------------------------------------
// Create a deep copy of an object and overlay it with another one.
// @param base The base object to be overlaid.
// @param overlay The overlay object to override properties of the base object.
// @param Returns a deep clone of the base object overlaid by the overlay object.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function deepOverlay<T>(base: T, overlay: T): T {
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
