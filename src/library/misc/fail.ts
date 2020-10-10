//----------------------------------------------------------------------------------------------------------------------
// Create an error message
//----------------------------------------------------------------------------------------------------------------------

function createError(...messagesErrorsOrSuppliers: type.ValueOrSupplier<string | Error>[]) {

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
// Throw an error without error message.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function fail(): never;

//----------------------------------------------------------------------------------------------------------------------
// Throw an error with the given error message.
// @param message The error message to include.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function fail(message: string): never;

//----------------------------------------------------------------------------------------------------------------------
// Throw the error provided by the supplier. If it returns an Error instance, the object is thrown as it is. Otherwise
// a new Error is created and the return value of the supplier is passed to its constructor.
// @brief Throw the error returned by the given supplier.
// @param supplier Supplier for an error message or an Error object.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function fail(supplier: type.Supplier<string | Error>): never;

//----------------------------------------------------------------------------------------------------------------------
// Throw an error.
// @param messageErrorOrSupplier An optional error message, Error object or a supplier that returns either.
// @level 3
//----------------------------------------------------------------------------------------------------------------------

function fail(messageErrorOrSupplier?: type.ValueOrSupplier<string | Error>): never {
    const error = messageErrorOrSupplier ? createError(messageErrorOrSupplier) : createError();
    Error.captureStackTrace(error, fail);
    throw error;
}
