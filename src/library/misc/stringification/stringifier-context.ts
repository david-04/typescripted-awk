namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // Contextual information passed to a stringifier's rendering handler. It gives access to options and allows to
    // redirect stringification tasks to other stringifiers or handlers in the chain.
    //
    // @brief   Contextual information passed to a stringify handler method.
    // @type    T The top-level stringifier's options
    //------------------------------------------------------------------------------------------------------------------

    export interface StringifierContext<T> {

        //--------------------------------------------------------------------------------------------------------------
        // The current options of the top-level stringifier.
        //--------------------------------------------------------------------------------------------------------------

        readonly options: T;

        //--------------------------------------------------------------------------------------------------------------
        // The current indent (might be an empty string) to be prepended to each new line being rendered.
        //
        // @brief   The current line indent.
        //--------------------------------------------------------------------------------------------------------------

        readonly indent: string;

        //--------------------------------------------------------------------------------------------------------------
        // Stringify the given value with the top-level stringifier.
        //
        // @param   value The value to stringify.
        // @param   additionalIndent Extra spacing to be added on top of the already applicable indent.
        // @return  Returns the stringified value.
        //--------------------------------------------------------------------------------------------------------------

        stringifyWithTopLevelStringifier(value: any, additionalIndent?: string): string;

        //--------------------------------------------------------------------------------------------------------------
        // Stringify the given value with the next handler of the current stringifier.
        //
        // @param   value The value to stringify.
        // @param   additionalIndent Extra spacing to be added on top of the already applicable indent.
        // @return  Returns the stringified value.
        //--------------------------------------------------------------------------------------------------------------

        stringifyWithNextHandler(value: any, additionalIndent?: string): string;

        //--------------------------------------------------------------------------------------------------------------
        // Stringify the given value with the current stringifier, re-starting from the first handler in the chain.
        //
        // @brief   Stringify the given value with the current stringifier.
        // @param   value The value to stringify.
        // @param   additionalIndent Extra spacing to be added on top of the already applicable indent.
        // @return  Returns the stringified value.
        //--------------------------------------------------------------------------------------------------------------

        stringifyWithCurrentStringifier(value: any, additionalIndent?: string): string;

        //--------------------------------------------------------------------------------------------------------------
        // Stringify the given value with the base stringifier (i.e. the one extended by the current stringifier).
        //
        // @param   Stringify the given value with the base stringifier.
        // @param   value The value to stringify.
        // @param   additionalIndent Extra spacing to be added on top of the already applicable indent.
        // @return  Returns the stringified value.
        //--------------------------------------------------------------------------------------------------------------

        stringifyWithBaseStringifier(value: any, additionalIndent?: string): string;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Pre-declaration of the StringifierEngine.
//----------------------------------------------------------------------------------------------------------------------

interface ContextualStringifier<T> {
    readonly baseStringifier?: ContextualStringifier<T>;
    stringifyWithContext(value: any, context: StringifierContext<T>): string;
}

//----------------------------------------------------------------------------------------------------------------------
// Implementation of internal.StringifierContext.
//----------------------------------------------------------------------------------------------------------------------

class StringifierContext<T> implements internal.StringifierContext<T> {

    public currentHandlerIndex: number = 0;
    protected topLevelStringifier: ContextualStringifier<T>;
    public indent = "";
    public readonly stack = new Array<{ value: any, stringifierEngine: any, handler: any }>()

    //------------------------------------------------------------------------------------------------------------------
    // Initialization.
    //------------------------------------------------------------------------------------------------------------------

    public constructor(
        public readonly options: T,
        public currentStringifier: ContextualStringifier<T>
    ) {
        this.topLevelStringifier = currentStringifier;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Stringify starting from the beginning with the top-level stringifier.
    //------------------------------------------------------------------------------------------------------------------

    stringifyWithTopLevelStringifier(value: any, additionalIndent?: string) {
        return this.backupAndRestoreContext(additionalIndent, () => {
            this.currentHandlerIndex = 0;
            this.currentStringifier = this.topLevelStringifier;
            return this.topLevelStringifier.stringifyWithContext(value, this);
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Stringify with the next handler of the current stringifier.
    //------------------------------------------------------------------------------------------------------------------

    stringifyWithNextHandler(value: any, additionalIndent?: string) {
        return this.backupAndRestoreContext(additionalIndent, () => {
            this.currentHandlerIndex++;
            return this.currentStringifier.stringifyWithContext(value, this);
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Stringify with the current stringifier but re-start with its first handler.
    //------------------------------------------------------------------------------------------------------------------

    stringifyWithCurrentStringifier(value: any, additionalIndent?: string) {
        return this.backupAndRestoreContext(additionalIndent, () => {
            this.currentHandlerIndex = 0;
            return this.currentStringifier.stringifyWithContext(value, this);
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Stringify with the base stringifier.
    //------------------------------------------------------------------------------------------------------------------

    stringifyWithBaseStringifier(value: any, additionalIndent?: string) {
        return this.backupAndRestoreContext(additionalIndent, () => {
            if (this.currentStringifier.baseStringifier) {
                this.currentHandlerIndex = 0;
                this.currentStringifier = this.currentStringifier.baseStringifier;
            } else {
                this.currentHandlerIndex = Infinity;
            }
            return this.currentStringifier.stringifyWithContext(value, this);
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Back up the context properties, call the given stringifier and restore the properties thereafter.
    //------------------------------------------------------------------------------------------------------------------

    private backupAndRestoreContext(additionalIndent: string | undefined, action: internal.Supplier<string>) {

        const indent = this.indent;
        const currentHandlerIndex = this.currentHandlerIndex;
        const currentStringifier = this.currentStringifier;

        this.indent += additionalIndent ?? '';
        const result = action();

        this.indent = indent;
        this.currentHandlerIndex = currentHandlerIndex;
        this.currentStringifier = currentStringifier;

        return result;
    }
}
