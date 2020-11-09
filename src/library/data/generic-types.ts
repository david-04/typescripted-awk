namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A function with or without parameters that returns a value. The last type parameter represents the return type.
    // Other types preceding it represent the function's parameters:
    //
    // ```typescript
    // let supplier0: Supplier<boolean> = () => true;
    //
    // let supplier2: Supplier<string[], number, boolean> = (array, maxLength) => {
    //     return array.length <= maxLength;
    // };
    // ```
    //
    // @brief   A function that returns a value.
    //------------------------------------------------------------------------------------------------------------------

    export type Supplier<
        T0,
        T1 = void,
        T2 = void,
        T3 = void,
        T4 = void,
        T5 = void,
        T6 = void,
        T7 = void,
        T8 = void,
        T9 = void
        > = {
            0: () => T0,
            1: (p1: T0) => T1,
            2: (p1: T0, p2: T1) => T2,
            3: (p1: T0, p2: T1, p3: T2) => T3,
            4: (p1: T0, p2: T1, p3: T2, p4: T3) => T4,
            5: (p1: T0, p2: T1, p3: T2, p4: T3, p5: T4) => T5,
            6: (p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, p6: T5) => T6,
            7: (p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, p6: T5, p7: T6) => T7,
            8: (p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, p6: T5, p7: T6, p8: T7) => T8,
            9: (p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, p6: T5, p7: T6, p8: T7, p9: T8) => T9,
        }[
        T9 extends void ? (
            T8 extends void ? (
                T7 extends void ? (
                    T6 extends void ? (
                        T5 extends void ? (
                            T4 extends void ? (
                                T3 extends void ? (
                                    T2 extends void ? (
                                        T1 extends void
                                        ? 0
                                        : 1
                                    ) : 2
                                ) : 3
                            ) : 4
                        ) : 5
                    ) : 6
                ) : 7
            ) : 8
        ) : 9
        ];

    //------------------------------------------------------------------------------------------------------------------
    // A function with (at least) a rest parameter that returns a value. The last type parameter represents the return
    // value. Other types preceding it represent the function's parameters, with the last one being the rest parameter:
    //
    // ```typescript
    // let supplier: SupplierR<number, object, boolean> = (maxLength, ...objects) => {
    //     return objects.length <= maxLength;
    // };
    // ```
    //
    // @brief   A function with a rest parameter that returns a value.
    //------------------------------------------------------------------------------------------------------------------

    export type SupplierR<
        T0,
        T1 = void,
        T2 = void,
        T3 = void,
        T4 = void,
        T5 = void,
        T6 = void,
        T7 = void,
        T8 = void,
        T9 = void
        > = {
            0: () => T0,
            1: (...p1: T0[]) => T1,
            2: (p1: T0, ...p2: T1[]) => T2,
            3: (p1: T0, p2: T1, ...p3: T2[]) => T3,
            4: (p1: T0, p2: T1, p3: T2, ...p4: T3[]) => T4,
            5: (p1: T0, p2: T1, p3: T2, p4: T3, ...p5: T4[]) => T5,
            6: (p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, ...p6: T5[]) => T6,
            7: (p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, p6: T5, ...p7: T6[]) => T7,
            8: (p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, p6: T5, p7: T6, ...p8: T7[]) => T8,
            9: (p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, p6: T5, p7: T6, p8: T7, ...p9: T8[]) => T9,
        }[
        T9 extends void ? (
            T8 extends void ? (
                T7 extends void ? (
                    T6 extends void ? (
                        T5 extends void ? (
                            T4 extends void ? (
                                T3 extends void ? (
                                    T2 extends void ? (
                                        T1 extends void
                                        ? 0
                                        : 1
                                    ) : 2
                                ) : 3
                            ) : 4
                        ) : 5
                    ) : 6
                ) : 7
            ) : 8
        ) : 9
        ];

    //------------------------------------------------------------------------------------------------------------------
    // A function with one or more parameters and without return value. The type parameters represent the types of the
    // function's parameters:
    //
    // ```typescript
    // let consumer: Consumer<string, number> = (text, maxLength) => {
    //     console.log(text.length <= maxLength ? "short" : "long");
    // };
    // ```
    //
    // @brief   A function without return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Consumer<
        T1,
        T2 = void,
        T3 = void,
        T4 = void,
        T5 = void,
        T6 = void,
        T7 = void,
        T8 = void,
        T9 = void
        > = {
            1: (p1: T1) => void,
            2: (p1: T1, p2: T2) => void,
            3: (p1: T1, p2: T2, p3: T3) => void,
            4: (p1: T1, p2: T2, p3: T3, p4: T4) => void,
            5: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5) => void,
            6: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6) => void,
            7: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7) => void,
            8: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7, p8: T8) => void,
            9: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7, p8: T8, p9: T9) => void,
        }[
        T9 extends void ? (
            T8 extends void ? (
                T7 extends void ? (
                    T6 extends void ? (
                        T5 extends void ? (
                            T4 extends void ? (
                                T3 extends void ? (
                                    T2 extends void ? (
                                        1
                                    ) : 2
                                ) : 3
                            ) : 4
                        ) : 5
                    ) : 6
                ) : 7
            ) : 8
        ) : 9
        ];

    //------------------------------------------------------------------------------------------------------------------
    // A function with (at least) a rest parameter and without return value. The type parameters represent the types of
    // the function's parameters, with the last one being the rest parameter:
    //
    // ```typescript
    // let consumer: ConsumerR<string, number> = (separator, ...numbers) => {
    //     console.log(numbers.join(separator));
    // };
    // ```
    //
    // @brief   A function with a rest parameter and without return value.
    //------------------------------------------------------------------------------------------------------------------

    export type ConsumerR<
        T1,
        T2 = void,
        T3 = void,
        T4 = void,
        T5 = void,
        T6 = void,
        T7 = void,
        T8 = void,
        T9 = void
        > = {
            1: (...p1: T1[]) => void,
            2: (p1: T1, ...p2: T2[]) => void,
            3: (p1: T1, p2: T2, ...p3: T3[]) => void,
            4: (p1: T1, p2: T2, p3: T3, ...p4: T4[]) => void,
            5: (p1: T1, p2: T2, p3: T3, p4: T4, ...p5: T5[]) => void,
            6: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, ...p6: T6[]) => void,
            7: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, ...p7: T7[]) => void,
            8: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7, ...p8: T8[]) => void,
            9: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7, p8: T8, ...p9: T9[]) => void,
        }[
        T9 extends void ? (
            T8 extends void ? (
                T7 extends void ? (
                    T6 extends void ? (
                        T5 extends void ? (
                            T4 extends void ? (
                                T3 extends void ? (
                                    T2 extends void ? (
                                        1
                                    ) : 2
                                ) : 3
                            ) : 4
                        ) : 5
                    ) : 6
                ) : 7
            ) : 8
        ) : 9
        ];

    //------------------------------------------------------------------------------------------------------------------
    // A function with or without parameters that returns a boolean value. If present, the type parameters represent
    // the types of the function's parameters:
    //
    // ```typescript
    // let predicate0: Predicate = () => true;
    //
    // let predicate2: Predicate<string, number> = (text, maxLength) => {
    //     return text.length <= maxLength;
    // };
    // ```
    //
    // @brief    A function that returns a boolean value.
    //------------------------------------------------------------------------------------------------------------------

    export type Predicate<
        T1 = void,
        T2 = void,
        T3 = void,
        T4 = void,
        T5 = void,
        T6 = void,
        T7 = void,
        T8 = void,
        T9 = void
        > = {
            0: () => boolean,
            1: (p1: T1) => boolean,
            2: (p1: T1, p2: T2) => boolean,
            3: (p1: T1, p2: T2, p3: T3) => boolean,
            4: (p1: T1, p2: T2, p3: T3, p4: T4) => boolean,
            5: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5) => boolean,
            6: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6) => boolean,
            7: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7) => boolean,
            8: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7, p8: T8) => boolean,
            9: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7, p8: T8, p9: T9) => boolean,
        }[
        T9 extends void ? (
            T8 extends void ? (
                T7 extends void ? (
                    T6 extends void ? (
                        T5 extends void ? (
                            T4 extends void ? (
                                T3 extends void ? (
                                    T2 extends void ? (
                                        T1 extends void ? (
                                            0
                                        ) : 1
                                    ) : 2
                                ) : 3
                            ) : 4
                        ) : 5
                    ) : 6
                ) : 7
            ) : 8
        ) : 9
        ];



    //------------------------------------------------------------------------------------------------------------------
    // A function with (at least) a rest paramter that returns a boolean value. The type parameters represent the
    // types of the function's parameters, with the last one being the rest parameter:
    //
    // ```typescript
    // let predicate: PredicateR<number, string> = (maxLength, ...words) => {
    //     return 0 < words.filter(word => maxLength < word.length).length;
    // };
    // ```
    //
    // @brief    A function that returns a boolean value.
    //------------------------------------------------------------------------------------------------------------------

    export type PredicateR<
        T1 = void,
        T2 = void,
        T3 = void,
        T4 = void,
        T5 = void,
        T6 = void,
        T7 = void,
        T8 = void,
        T9 = void
        > = {
            0: () => boolean,
            1: (...p1: T1[]) => boolean,
            2: (p1: T1, ...p2: T2[]) => boolean,
            3: (p1: T1, p2: T2, ...p3: T3[]) => boolean,
            4: (p1: T1, p2: T2, p3: T3, ...p4: T4[]) => boolean,
            5: (p1: T1, p2: T2, p3: T3, p4: T4, ...p5: T5[]) => boolean,
            6: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, ...p6: T6[]) => boolean,
            7: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, ...p7: T7[]) => boolean,
            8: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7, ...p8: T8[]) => boolean,
            9: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7, p8: T8, ...p9: T9[]) => boolean,
        }[
        T9 extends void ? (
            T8 extends void ? (
                T7 extends void ? (
                    T6 extends void ? (
                        T5 extends void ? (
                            T4 extends void ? (
                                T3 extends void ? (
                                    T2 extends void ? (
                                        T1 extends void ? (
                                            0
                                        ) : 1
                                    ) : 2
                                ) : 3
                            ) : 4
                        ) : 5
                    ) : 6
                ) : 7
            ) : 8
        ) : 9
        ];

    //------------------------------------------------------------------------------------------------------------------
    // A function without parameters and without return value:
    //
    // ```typescript
    // let action: Action = () => {
    //     console.log("action");
    // };
    // ```
    //
    // @brief   A function without parameters and without return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Action = () => void;

    //------------------------------------------------------------------------------------------------------------------
    // Any type of function that might (or might not) have parameters and/or a return value:
    //
    // ```typescript
    // let functions: AnyFunction[] = [
    //     () => { console.log("hello world"); },
    //     (text: string, maxLength: number) => text.length <= maxLength,
    //     (...words: string[]) => words.join(" ")
    // ];
    // ```
    //
    // @brief   Any type of function.
    //------------------------------------------------------------------------------------------------------------------

    export type AnyFunction = ((...parameters: any) => any) | Function;

    //------------------------------------------------------------------------------------------------------------------
    // A value or an array of values:
    //
    // ```typescript
    // function anonymize(text: string, filter: ValueOrArray<string | RegExp>) {
    //     if (Array.isArray(filter)) {
    //         filter.forEach(search => text = text.replace(search, "***"));
    //     } else {
    //         text = text.replace(filter, "***");
    //     }
    //     return text;
    // }
    // ```
    //
    // @brief   A single value or an array thereof.
    // @type    T The type of the value.
    //------------------------------------------------------------------------------------------------------------------

    export type ValueOrArray<T> = T | T[];

    //------------------------------------------------------------------------------------------------------------------
    // A value or a function that returns it. The last type parameter represents the type of the value and the return
    // type of the function. Preceding parameters (if present) represent the types of the function's parameters:
    //
    // ```typescript
    // function fail(code: number, messageOrSupplier: ValueOrSupplier<number, string>) {
    //     if ("string" === typeof messageOrSupplier) {
    //         throw new Error(messageOrSupplier);
    //     } else {
    //         throw new Error(messageOrSupplier(code))
    //     }
    // }
    // ```
    //
    // @brief   A value or a function that returns a value.
    //------------------------------------------------------------------------------------------------------------------

    export type ValueOrSupplier<
        T0,
        T1 = void,
        T2 = void,
        T3 = void,
        T4 = void,
        T5 = void,
        T6 = void,
        T7 = void,
        T8 = void,
        T9 = void
        > = {
            0: T0 | (() => T0),
            1: T1 | ((p1: T0) => T1),
            2: T2 | ((p1: T0, p2: T1) => T2),
            3: T3 | ((p1: T0, p2: T1, p3: T2) => T3),
            4: T4 | ((p1: T0, p2: T1, p3: T2, p4: T3) => T4),
            5: T5 | ((p1: T0, p2: T1, p3: T2, p4: T3, p5: T4) => T5),
            6: T6 | ((p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, p6: T5) => T6),
            7: T7 | ((p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, p6: T5, p7: T6) => T7),
            8: T8 | ((p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, p6: T5, p7: T6, p8: T7) => T8),
            9: T9 | ((p1: T0, p2: T1, p3: T2, p4: T3, p5: T4, p6: T5, p7: T6, p8: T7, p9: T8) => T9),
        }[
        T9 extends void ? (
            T8 extends void ? (
                T7 extends void ? (
                    T6 extends void ? (
                        T5 extends void ? (
                            T4 extends void ? (
                                T3 extends void ? (
                                    T2 extends void ? (
                                        T1 extends void
                                        ? 0
                                        : 1
                                    ) : 2
                                ) : 3
                            ) : 4
                        ) : 5
                    ) : 6
                ) : 7
            ) : 8
        ) : 9
        ];
}
