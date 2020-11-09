namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A function that stringifies a value. It's added via `stringify.createExtendedStringifier()` and can return either
    // a string or `undefined`:
    //
    // ```typescript
    // const myStringify = stringify.createExtendedStringifier(builder =>
    //     builder.stringifyNumber(number => 0 < number ? `+${number}` : undefined)
    // );
    // ```
    //
    // If a string is returned, it's used as the stringified representation of the value. If `undefined` is returned,
    // the value will be passed on to the next stringification handler in the chain.
    //
    // A `StringifierContext` is passed as the second parameter. It can be used to retrieve the options and the current
    // indent, and to delegate the value to other rendering handlers of the stringifier.
    //
    // @brief   A function that stringifies a value.
    // @type    T The type of value handled by the function (might be "any").
    // @type    O The options supported by the stringifier this rendering rule belongs to.
    //------------------------------------------------------------------------------------------------------------------

    export type StringificationHandler<T, O> = (value: T, context: StringifierContext<O>) => string | undefined;
}

//----------------------------------------------------------------------------------------------------------------------
// The engine that orchestrates the invocation of handlers and base stringifiers.
//----------------------------------------------------------------------------------------------------------------------

class StringifierEngine<B, T extends B> implements ContextualStringifier<T> {

    //------------------------------------------------------------------------------------------------------------------
    // Initialization
    //------------------------------------------------------------------------------------------------------------------

    constructor(
        private readonly handlers: internal.StringificationHandler<any, T>[],
        public readonly defaultOptions: T,
        public readonly baseStringifier?: StringifierEngine<any, B>
    ) { }

    //------------------------------------------------------------------------------------------------------------------
    // The stringify method exposed by the top-level stringifier.
    //------------------------------------------------------------------------------------------------------------------

    public stringifyWithOptions(value: any, options?: Partial<T>) {
        return this.stringifyWithContext(
            this.containsCircularReferences(value, [])
                ? this.removeCircularReferences(deepClone(value), [])
                : value,
            new StringifierContext(deepMerge(this.defaultOptions, options ?? {}), this)
        );
    }

    //------------------------------------------------------------------------------------------------------------------
    // Determine if the given object contains circular references.
    //------------------------------------------------------------------------------------------------------------------

    private containsCircularReferences(value: any, stack: any[]) {

        let isCircular = false;

        if (isObject(value)) {
            if (stack.filter(parent => parent === value).length) {
                return true;
            }
            stack.push(value);
            if (isArray(value)) {
                for (const item of value) {
                    if (this.containsCircularReferences(item, stack)) {
                        isCircular = true;
                        break;
                    }
                }
            } else {
                for (const key of Object.keys(value)) {
                    if (this.containsCircularReferences(value[key], stack)) {
                        isCircular = true;
                        break;
                    }
                }
            }
            stack.pop();
        }

        return isCircular;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Remove circular references with a notification message.
    //------------------------------------------------------------------------------------------------------------------

    private removeCircularReferences(value: any, stack: any[]) {

        if (isObject(value)) {

            for (let index = 0; index < stack.length; index++) {
                if (stack[index] === value) {
                    let reference = "..";
                    while (++index < stack.length - 1) {
                        reference += "/.."
                    }
                    return preStringify(undefined).as(`[circular reference: ${reference}]`);
                }
            }

            stack.push(value);
            if (isArray(value)) {
                value = value.map(item => this.removeCircularReferences(item, stack));
            } else {
                for (const key of Object.keys(value)) {
                    value[key] = this.removeCircularReferences(value[key], stack);
                }
            }
            stack.pop();
        }

        return value;
    }

    //------------------------------------------------------------------------------------------------------------------
    // The stringify implementation used internally and invoked through the StringifierContext.
    //------------------------------------------------------------------------------------------------------------------

    public stringifyWithContext(value: any, context: StringifierContext<T>) {

        if (value instanceof internal.PreStringifiedValue) {
            return value.stringifiedValue.replace(/\r?\n/g, `\n${context.indent}`);
        }

        for (; context.currentHandlerIndex < this.handlers.length; context.currentHandlerIndex++) {
            const handler = this.handlers[context.currentHandlerIndex];
            for (const item of context.stack) {
                if (item.value === value && item.stringifierEngine === this && item.handler === handler) {
                    throw new Error("The stringification handlers created an infinite recursion");
                }
            };
            context.stack.push({ value, stringifierEngine: this, handler });
            const result = handler(value, context);
            context.stack.pop();
            if ("string" === typeof result) {
                return result;
            } else if (undefined !== result) {
                throw new Error(`The stringification handler returned neither a string nor undefined:\n\n${result}`);
            }
        }

        if (this.baseStringifier) {
            return context.stringifyWithBaseStringifier(value);
        }

        return JSON.stringify(value);
    }
}
