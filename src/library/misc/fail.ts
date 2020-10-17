//----------------------------------------------------------------------------------------------------------------------
// Create an error object.
//----------------------------------------------------------------------------------------------------------------------

function createError(...messagesErrorsOrSuppliers: internal.ValueOrSupplier<string | Error>[]) {

    let error: Error | undefined;
    for (let index = 0; index < messagesErrorsOrSuppliers.length && !error; index++) {
        const messageErrorOrSupplier = messagesErrorsOrSuppliers[index];
        const messageOrError = 'function' === typeof messageErrorOrSupplier
            ? messageErrorOrSupplier()
            : messageErrorOrSupplier;
        if (null !== messageOrError && undefined !== messageOrError && '' !== messageOrError) {
            error = messageOrError instanceof Error ? messageOrError : new Error(messageOrError ?? '');
        }
    }

    error = error ?? new Error('');
    Error.captureStackTrace(error, createError);
    return error;
}

//----------------------------------------------------------------------------------------------------------------------
// Throw an error depending on the parameter passed:
// - If no parameter is passed, an error without error message is thrown.
// - If a string is supplied, it's used as the error message.
// - If an Error object is supplied, it's thrown as it is.
// - If a function is supplied, it's return value is either thrown (if it is an error) or used as the error message.
// @brief Throw an error.
// @param messageErrorOrSupplier An optional error message, Error object or a supplier that returns one of them.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function fail(messageErrorOrSupplier?: internal.ValueOrSupplier<string | Error>): never {
    const error = messageErrorOrSupplier ? createError(messageErrorOrSupplier) : createError();
    Error.captureStackTrace(error, fail);
    throw error;
}
