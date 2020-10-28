//----------------------------------------------------------------------------------------------------------------------
// A handler that can be added to the StringifierEngine.
//----------------------------------------------------------------------------------------------------------------------

interface StringifierHandler<T> {
    appliesTo: internal.Predicate1<any>;
    stringify: internal.Function2<any, StringifierContext<T>, string>;
}

//----------------------------------------------------------------------------------------------------------------------
// The engine that orchestrates the invocation of handlers and base stringifiers.
//----------------------------------------------------------------------------------------------------------------------

class StringifierEngine<B, T extends B> implements ContextualStringifier<T> {

    //------------------------------------------------------------------------------------------------------------------
    // Initialization
    //------------------------------------------------------------------------------------------------------------------

    constructor(
        private readonly handlers: Array<StringifierHandler<T>>,
        public readonly defaultOptions: T,
        public readonly baseStringifier?: StringifierEngine<any, B>
    ) { }

    //------------------------------------------------------------------------------------------------------------------
    // The stringify method exposed by the top-level stringifier.
    //------------------------------------------------------------------------------------------------------------------

    public stringifyWithOptions(value: any, options?: Partial<T>) {
        return this.stringifyWithContext(
            this.removeCircularReferences(deepClone(value), []),
            new StringifierContext(deepMerge(this.defaultOptions, options ?? {}), this)
        );
    }

    //------------------------------------------------------------------------------------------------------------------
    // Remove circular references with a notification message.
    //------------------------------------------------------------------------------------------------------------------

    private removeCircularReferences(value: any, stack: Array<any>) {

        if (isObject(value)) {

            for (let index = 0; index < stack.length; index++) {
                if (stack[index] === value) {
                    let reference = "..";
                    while (++index < stack.length - 1) {
                        reference += "/.."
                    }
                    return new StringifiedValue(`[circular reference: ${reference}]`);
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

        if (value instanceof StringifiedValue) {
            return value.stringifiedValue;
        }

        for (; context.currentHandlerIndex < this.handlers.length; context.currentHandlerIndex++) {
            const handler = this.handlers[context.currentHandlerIndex];
            if (handler.appliesTo(value)) {
                for (const item of context.stack) {
                    if (item.value === value && item.stringifierEngine === this && item.handler === handler) {
                        throw new Error("The stringification handlers created an infinite recursion");
                    }
                };
                context.stack.push({ value, stringifierEngine: this, handler });
                const result = handler.stringify(value, context);
                context.stack.pop();
                return result;
            }
        }

        if (this.baseStringifier) {
            return context.stringifyWithBaseStringifier(value);
        }

        return JSON.stringify(value);
    }
}
