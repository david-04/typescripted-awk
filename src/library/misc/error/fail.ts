//----------------------------------------------------------------------------------------------------------------------
// Throw an exception with the specified error message or `Error` object:
//
// - If no parameter is passed, an `Error` with an empty error message is thrown.
// - If a non-empty string is passed, a new `Error` with the given message is thrown.
// - If an object is passed, it's thrown as it is.
// - If a function is passed, its return value is used as described above.
//
// If multiple parameters are passed, the first one that neither is nor returns an empty string will be used.
//
// @brief   Throw an exception.
// @param   messageErrorOrSupplier An error message, Error object or a supplier that returns either.
// @level   3
//----------------------------------------------------------------------------------------------------------------------

function fail(...messageErrorOrSupplier: internal.ValueOrSupplier<string | Error>[]): never {

    let error: Error | undefined;

    for (let index = 0; index < messageErrorOrSupplier.length && !error; index++) {
        const currentMessageErrorOrSupplier = messageErrorOrSupplier[index];
        let messageOrError = "function" === typeof currentMessageErrorOrSupplier
            ? currentMessageErrorOrSupplier()
            : currentMessageErrorOrSupplier;
        if ("string" === typeof messageOrError) {
            messageOrError = messageOrError.trim();
        }
        if (messageOrError instanceof Error) {
            error = messageOrError;
        } else if ("string" !== typeof messageOrError || messageOrError.length) {
            error = new Error(`${messageOrError}`);
        }
    }

    error = error ?? new Error("");
    if (error instanceof Error) {
        Error.captureStackTrace(error, fail);
    }
    throw error;
}
