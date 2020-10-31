type ValueOrPreStringified<T> = T | internal.PreStringifiedValue<T>;

//----------------------------------------------------------------------------------------------------------------------
// A template test case for data-driven test repetitions.
//----------------------------------------------------------------------------------------------------------------------

class TestTemplate<R> extends Checks<R>{

    private readonly parameters: Array<any>;
    private description = "";
    private descriptor: TestDescriptor<R>;
    private groups: Array<string>;

    //------------------------------------------------------------------------------------------------------------------
    // Initialization
    //------------------------------------------------------------------------------------------------------------------

    public constructor(
        protected readonly descriptorSupplier: internal.Supplier<TestDescriptor<R>>,
        ...parameters: Array<any>
    ) {
        super();
        this.parameters = parameters.map(param => param instanceof internal.PreStringifiedValue ? param.value : param);
        this.descriptor = (this.descriptorSupplier as Function)(...this.parameters) as TestDescriptor<R>;
        this.description = this.replacePlaceholderValues(this.descriptor.description, parameters);
        if (Array.isArray(this.descriptor.group)) {
            this.groups = this.descriptor.group;
        } else if (this.descriptor.group) {
            this.groups = [this.descriptor.group];
        } else {
            this.groups = [];
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Replace all placeholders (including $*) in the given description.
    //------------------------------------------------------------------------------------------------------------------

    private replacePlaceholderValues(description: string, parameters: Array<any>) {

        let input = this.replaceRestPlaceholder(description, parameters);
        let output = "";

        while (input) {
            const match = input.match(/\$[$0-9]+/);
            if (match && match.index) {
                const placeholder = match[0];
                output += input.substr(0, match.index);
                input = input.substr(match.index + placeholder.length)
                if (placeholder !== "$$") {
                    output += stringify(parameters[parseInt(placeholder.substr(1)) - 1]);
                } else {
                    output += placeholder;
                }
            } else {
                output += input;
                input = "";
            }
        }

        return output;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Replace the $* placeholder with a variable list of placeholders (e.g. $2, $3, $4).
    //------------------------------------------------------------------------------------------------------------------

    private replaceRestPlaceholder(description: string, parameters: Array<any>) {

        if (description.indexOf("$*") < 0) {
            return description;
        }

        description = description.replace(/\$\$/g, "__PRESERVE__DOLLAR__DOLLAR__");

        parameters = parameters.slice(0);
        while (parameters.length && undefined === parameters[parameters.length - 1]) {
            parameters.length--;
        }
        for (let index = 0; index < parameters.length; index++) {
            parameters[index] = `\$${index + 1}`;
        }

        const pattern = /\$[0-9]+/g;
        let match: RegExpExecArray | null;
        while (match = pattern.exec(description)) {
            const placeholder = match[0];
            if (match && match[0]) {
                parameters = parameters.filter(parameter => parameter !== placeholder);
            }
        }

        return description.replace(/\$\*/g, parameters.join(", ")).replace(/__PRESERVE__DOLLAR__DOLLAR__/g, "$$");
    }

    //------------------------------------------------------------------------------------------------------------------
    // Run the test with the given check.
    //------------------------------------------------------------------------------------------------------------------

    protected runTestAndValidateResult(description: string, validation: internal.Consumer<R>): this {
        return this.runInCategory(`${this.description} ${description}`, () => {
            validation((this.descriptorSupplier as Function)(...this.parameters).action())
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Run the test, expect an error and pass it to the given consumer.
    //------------------------------------------------------------------------------------------------------------------

    protected runTestAndValidateError(description: string, validation: internal.Consumer<Error>): this {
        return this.runInCategory(`${this.description} ${description}`, () => {
            let hasFailed = true;
            try {
                (this.descriptorSupplier as Function)(...this.parameters).action();
                hasFailed = false;
            } catch (error) {
                validation(error);
            }
            if (!hasFailed) {
                throw new Error("No error was thrown")
            }
        }
        );
    }

    //------------------------------------------------------------------------------------------------------------------
    // Create nested "describe" blocks and run the given test inside.
    //------------------------------------------------------------------------------------------------------------------

    private runInCategory(description: string, action: internal.Action, offset = 0): this {
        if (offset < this.groups.length) {
            testGroup(this.groups[offset], () => this.runInCategory(description, action, offset + 1));
        } else {
            testCase(description, action);
        }
        return this;
    }
}


//----------------------------------------------------------------------------------------------------------------------
// Test templates per number of parameters.
//----------------------------------------------------------------------------------------------------------------------

class TestTemplate0<R> extends TestTemplate<R> {
    public constructor(actionDescriptorSupplier: internal.Supplier<TestDescriptor<R>>) {
        super(actionDescriptorSupplier)
    }
    public when(): this {
        return new TestTemplate0<R>(this.descriptorSupplier) as any as this;
    }
}

class TestTemplate1<T1, R> extends TestTemplate<R> {
    public when(p1: ValueOrPreStringified<T1>): this {
        return new TestTemplate1<T1, R>(this.descriptorSupplier, p1) as any as this;
    }
}

class TestTemplate2<T1, T2, R> extends TestTemplate<R> {
    public when(p1: ValueOrPreStringified<T1>, p2: ValueOrPreStringified<T2>): this {
        return new TestTemplate2<T1, T2, R>(this.descriptorSupplier, p1, p2) as any as this;
    }
}

class TestTemplate3<T1, T2, T3, R> extends TestTemplate<R> {
    public when(p1: ValueOrPreStringified<T1>, p2: ValueOrPreStringified<T2>, p3: ValueOrPreStringified<T3>): this {
        return new TestTemplate3<T1, T2, T3, R>(this.descriptorSupplier, p1, p2, p3) as any as this;
    }
}

class TestTemplate4<T1, T2, T3, T4, R> extends TestTemplate<R> {
    public when(p1: ValueOrPreStringified<T1>, p2: ValueOrPreStringified<T2>, p3: ValueOrPreStringified<T3>, p4: ValueOrPreStringified<T4>): this {
        return new TestTemplate4<T1, T2, T3, T4, R>(this.descriptorSupplier, p1, p2, p3, p4) as any as this;
    }
}

class TestTemplate5<T1, T2, T3, T4, T5, R> extends TestTemplate<R> {
    public when(p1: ValueOrPreStringified<T1>, p2: ValueOrPreStringified<T2>, p3: ValueOrPreStringified<T3>, p4: ValueOrPreStringified<T4>, p5: ValueOrPreStringified<T5>): this {
        return new TestTemplate5<T1, T2, T3, T4, T5, R>(this.descriptorSupplier, p1, p2, p3, p4, p5) as any as this;
    }
}

class TestTemplate6<T1, T2, T3, T4, T5, T6, R> extends TestTemplate<R> {
    public when(p1: ValueOrPreStringified<T1>, p2: ValueOrPreStringified<T2>, p3: ValueOrPreStringified<T3>, p4: ValueOrPreStringified<T4>, p5: ValueOrPreStringified<T5>, p6: ValueOrPreStringified<T6>): this {
        return new TestTemplate6<T1, T2, T3, T4, T5, T6, R>(this.descriptorSupplier, p1, p2, p3, p4, p5, p6) as any as this;
    }
}

class TestTemplate7<T1, T2, T3, T4, T5, T6, T7, R> extends TestTemplate<R> {
    public when(p1: ValueOrPreStringified<T1>, p2: ValueOrPreStringified<T2>, p3: ValueOrPreStringified<T3>, p4: ValueOrPreStringified<T4>, p5: ValueOrPreStringified<T5>, p6: ValueOrPreStringified<T6>, p7: ValueOrPreStringified<T7>): this {
        return new TestTemplate7<T1, T2, T3, T4, T5, T6, T7, R>(this.descriptorSupplier, p1, p2, p3, p4, p5, p6, p7) as any as this;
    }
}

class TestTemplate8<T1, T2, T3, T4, T5, T6, T7, T8, R> extends TestTemplate<R> {
    public when(p1: ValueOrPreStringified<T1>, p2: ValueOrPreStringified<T2>, p3: ValueOrPreStringified<T3>, p4: ValueOrPreStringified<T4>, p5: ValueOrPreStringified<T5>, p6: ValueOrPreStringified<T6>, p7: ValueOrPreStringified<T7>, p8: ValueOrPreStringified<T8>): this {
        return new TestTemplate8<T1, T2, T3, T4, T5, T6, T7, T8, R>(this.descriptorSupplier, p1, p2, p3, p4, p5, p6, p7, p8) as any as this;
    }
}

class TestTemplate9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R> extends TestTemplate<R> {
    public when(p1: ValueOrPreStringified<T1>, p2: ValueOrPreStringified<T2>, p3: ValueOrPreStringified<T3>, p4: ValueOrPreStringified<T4>, p5: ValueOrPreStringified<T5>, p6: ValueOrPreStringified<T6>, p7: ValueOrPreStringified<T7>, p8: ValueOrPreStringified<T8>, p9: ValueOrPreStringified<T9>): this {
        return new TestTemplate9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(this.descriptorSupplier, p1, p2, p3, p4, p5, p6, p7, p8, p9) as any as this;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Test descriptors per number of parameters.
//----------------------------------------------------------------------------------------------------------------------

interface TestDescriptor<R> {
    group?: internal.ValueOrArray<string>
    description: string;
    action: internal.Supplier<R>
}

//----------------------------------------------------------------------------------------------------------------------
// Factory methods for test templates.
//----------------------------------------------------------------------------------------------------------------------

type TestActionSupplier0<R> = internal.Supplier<TestDescriptor<R>>;
type TestActionSupplier1<T1, R> = internal.Function1<T1, TestDescriptor<R>>;
type TestActionSupplier2<T1, T2, R> = internal.Function2<T1, T2, TestDescriptor<R>>;
type TestActionSupplier3<T1, T2, T3, R> = internal.Function3<T1, T2, T3, TestDescriptor<R>>;
type TestActionSupplier4<T1, T2, T3, T4, R> = internal.Function4<T1, T2, T3, T4, TestDescriptor<R>>;
type TestActionSupplier5<T1, T2, T3, T4, T5, R> = internal.Function5<T1, T2, T3, T4, T5, TestDescriptor<R>>;
type TestActionSupplier6<T1, T2, T3, T4, T5, T6, R> = internal.Function6<T1, T2, T3, T4, T5, T6, TestDescriptor<R>>;
type TestActionSupplier7<T1, T2, T3, T4, T5, T6, T7, R> = internal.Function7<T1, T2, T3, T4, T5, T6, T7, TestDescriptor<R>>;
type TestActionSupplier8<T1, T2, T3, T4, T5, T6, T7, T8, R> = internal.Function8<T1, T2, T3, T4, T5, T6, T7, T8, TestDescriptor<R>>;
type TestActionSupplier9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R> = internal.Function9<T1, T2, T3, T4, T5, T6, T7, T8, T9, TestDescriptor<R>>;


//function testTemplate<R>(action: TestDescriptor<R>): TestTemplate0<R>;
function testTemplate<R>(action: TestActionSupplier0<R>): TestTemplate0<R>;
function testTemplate<T1, R>(action: TestActionSupplier1<T1, R>): TestTemplate1<T1, R>;
function testTemplate<T1, T2, R>(action: TestActionSupplier2<T1, T2, R>): TestTemplate2<T1, T2, R>;
function testTemplate<T1, T2, T3, R>(action: TestActionSupplier3<T1, T2, T3, R>): TestTemplate3<T1, T2, T3, R>;
function testTemplate<R>(action: any) {
    return new TestTemplate2<any, any, R>("function" === typeof action ? action : () => action);
}
