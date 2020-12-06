namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A wrapper class for a value that might be `null` or `undefined`. Provides getter methods and operations to
    // transform the value or perform actions depending on the value being present or `null`/`undefined`. Optionals
    // are immutable and all mapping/transformation operations return a new Optional instance.
    //
    // @brief   A wrapper class for values/objects that could be undefined/null.
    // @type    T The type of the value stored in the Optional.
    //------------------------------------------------------------------------------------------------------------------

    export class Optional<T> {

        private static readonly EMPTY = new Optional<any>();

        //--------------------------------------------------------------------------------------------------------------
        // Initialize a new Optional instance.
        //--------------------------------------------------------------------------------------------------------------

        private constructor(protected readonly value?: T) {
            if (null === this.value) {
                this.value = undefined;
            }
        }

        //--------------------------------------------------------------------------------------------------------------
        // Create a new Optional instance (or re-use the static empty instance if the value is null/undefined).
        //--------------------------------------------------------------------------------------------------------------

        private static create<T>(value?: T): Optional<NonNullable<T>> {
            if (undefined === value || null === value) {
                return Optional.EMPTY;
            } else {
                return new Optional(value as NonNullable<T>);
            }
        }

        //--------------------------------------------------------------------------------------------------------------
        // Create an Optional instance with the given value.
        //
        // @param   value The value to store within the Optional.
        // @return  Returns an Optional instance with the given value.
        // @type    T The type of the value stored in the Optional.
        //--------------------------------------------------------------------------------------------------------------

        public static of<T>(value: T): Optional<NonNullable<T>> {
            return Optional.create(value);
        }

        //--------------------------------------------------------------------------------------------------------------
        // Create an empty Optional instance of the given type.
        //
        // @return  Returns an empty Optional instance without a value.
        // @type    T The type of the value if one had been supplied.
        //--------------------------------------------------------------------------------------------------------------

        public static empty<T>(): Optional<NonNullable<T>> {
            return Optional.create();
        }

        //--------------------------------------------------------------------------------------------------------------
        // Retrieve the value.
        //
        // @return  Returns the value (which might be undefined if the Optional is empty).
        //--------------------------------------------------------------------------------------------------------------

        public get(): T | undefined {
            return this.value;
        }

        //--------------------------------------------------------------------------------------------------------------
        // Retrieve the value or throw an exception if the Optional is empty.
        //
        // @param   messageErrorOrSupplier An error message, error object or a supplier.
        // @return  Returns the Optional's value.
        // @throws  Throws an exception if the optional is empty.
        //--------------------------------------------------------------------------------------------------------------

        public getOrThrow(...messageErrorOrSupplier: internal.ValueOrSupplier<string | Error>[]): T {
            if (undefined === this.value) {
                fail(...messageErrorOrSupplier, "The Optional is empty");
            } else {
                return this.value;
            }
        }

        //--------------------------------------------------------------------------------------------------------------
        // Retrieve the value or return the provided default if the Optional is empty.
        //
        // @param   defaultValue The default value to return if the Optional is empty.
        // @return  Returns the Optional's value or the provided defaultValue if it is empty.
        // @type    D The type of the default value.
        //--------------------------------------------------------------------------------------------------------------

        public getOrDefault<D>(defaultValue: D): T | D {
            if (undefined === this.value) {
                return defaultValue;
            } else {
                return this.value;
            }
        }

        //--------------------------------------------------------------------------------------------------------------
        // Retrieve the value or extract it from the supplier if the Optional is empty.
        //
        // @brief   Retrieve the value if present or extract it from the given supplier.
        // @param   supplier A method that can supply a (default) value.
        // @return  Returns the Optional's value if it's not empty, or the return value of the supplier otherwise.
        // @type    D The return type of the supplier.
        //--------------------------------------------------------------------------------------------------------------

        public getOrCalculate<D>(supplier: internal.Supplier<D>): T | D {
            if (undefined === this.value) {
                return supplier();
            } else {
                return this.value;
            }
        }

        //--------------------------------------------------------------------------------------------------------------
        // Verify that the Optional has a value (and is not empty).
        //
        // @return  Returns a flag indicating if the Optional has a value.
        //--------------------------------------------------------------------------------------------------------------

        public isPresent() {
            return undefined !== this.value;
        }

        //--------------------------------------------------------------------------------------------------------------
        // Verify that the Optional is empty.
        //
        // @return  Returns a flag indicating if the Optional is empty.
        //--------------------------------------------------------------------------------------------------------------

        public isEmpty() {
            return undefined === this.value;
        }

        //--------------------------------------------------------------------------------------------------------------
        // Perform an action if the Optional has a value (and is not empty).
        //
        // @param   action The action to perform.
        //--------------------------------------------------------------------------------------------------------------

        public ifPresent(action: internal.Consumer<T>): this {
            if (undefined !== this.value) {
                action(this.value);
            }
            return this;
        }

        //--------------------------------------------------------------------------------------------------------------
        // Perform an action if the Optional is empty.
        //
        // @param   action The action to perform.
        //--------------------------------------------------------------------------------------------------------------

        public ifEmpty(action: internal.Action): this {
            if (undefined === this.value) {
                action();
            }
            return this;
        }

        //--------------------------------------------------------------------------------------------------------------
        // Map the value (if present) to another one. If the Optional is empty, no mapping is performed and an empty
        // Optional is returned.
        //
        // @brief   Map the value (if present) to another one.
        // @param   mapper A function that maps a value to another one.
        // @return  Returns an Optional with the mapped value.
        // @type    R The return type of the mapper function.
        //--------------------------------------------------------------------------------------------------------------

        public map<R>(mapper: (value: T) => R): Optional<NonNullable<R>> {
            return undefined === this.value ? Optional.EMPTY : Optional.create(mapper(this.value));
        }

        //--------------------------------------------------------------------------------------------------------------
        // Map the value and unbox the Optional returned by the mapper function. Mapping is only performed if the
        // the Optional has a value (otherwise an empty Optional is returned).
        //
        // @brief   Map the value and unbox the Optional returned by the mapper function.
        // @param   mapper A method that receives the current value and returns an Optional with another value.
        // @return  Returns the current Optional if it is empty and the Optional returned by the mapper otherwise.
        // @throws  Throws an exception if the mapper function does not return an Optional instance.
        // @type    R The type of the value in the Optional returned by the mapper.
        //--------------------------------------------------------------------------------------------------------------

        public flatMap<R>(mapper: (value: T) => Optional<NonNullable<R>>): this | Optional<NonNullable<R>> {
            if (undefined === this.value) {
                return Optional.EMPTY;
            } else {
                const optional = mapper(this.value);
                if (optional instanceof Optional) {
                    return optional;
                } else {
                    fail(
                        `The mapping function did not return an Optional instance:\n\n${stringify.inline(optional)}`
                    );
                }
            }
        }

        //--------------------------------------------------------------------------------------------------------------
        // Map the current Optional to an empty Optional if it doesn't have a value or if the value does not match
        // the provided filter.
        //
        // @brief   Delete the value if it doesn't match the filter.
        // @param   filter A function that returns a truthy value indicating if the value matches.
        // @return  Returns the current Optional if the value matches the filter and an empty Optional otherwise.
        //--------------------------------------------------------------------------------------------------------------

        public filter(filter: (value: T) => any): Optional<T> {
            if (undefined !== this.value && filter(this.value)) {
                return this;
            } else {
                return Optional.EMPTY;
            }
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Create an Optional instance with the given value, or an empty Optional if the value is `null`, `undefined` or not
// supplied.
//
// @level   3
// @brief   Create an Optional instance with the given value.
// @param   value The value to store within the Optional.
// @return  Returns an Optional instance with the given value.
// @type    T The type of the value stored in the Optional.
//----------------------------------------------------------------------------------------------------------------------

function optional<T>(value?: T): internal.Optional<NonNullable<T>> {
    return internal.Optional.of(value);
}
