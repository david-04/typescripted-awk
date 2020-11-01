//----------------------------------------------------------------------------------------------------------------------
// Inject the given items (functions, variables and the likes) into the specified module.
//----------------------------------------------------------------------------------------------------------------------

exports.injectExports = (module: any, moduleItems: string[], globalItems: string[]) => {
    injectExportedItems(module, moduleItems);
    injectExportedItems(global, globalItems);
}

//----------------------------------------------------------------------------------------------------------------------
// Export the selected items into the given module.
//----------------------------------------------------------------------------------------------------------------------

function injectExportedItems(target: any, items: string[]) {
    for (const item of items) {
        if (module.exports[item]) {
            target[item] = module.exports[item];
        } else {
            throw new Error(`Failed to export "${item}" - the item does not exist`);
        }
    }
}
