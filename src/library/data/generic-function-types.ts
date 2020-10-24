//----------------------------------------------------------------------------------------------------------------------
// Function
//----------------------------------------------------------------------------------------------------------------------

namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A function with 1 parameter and a return value.
    // @type    P1 The parameter type.
    // @type    R The type of the return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Function1<P1, R> = (p1: P1) => R;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 2 parameters and a return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    R The type of the return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Function2<P1, P2, R> = (p1: P1, p2: P2) => R;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 3 parameters and a return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    R The type of the return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Function3<P1, P2, P3, R> = (p1: P1, p2: P2, p3: P3) => R;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 4 parameters and a return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    R The type of the return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Function4<P1, P2, P3, P4, R> = (p1: P1, p2: P2, p3: P3, p4: P4) => R;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 5 parameters and a return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    R The type of the return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Function5<P1, P2, P3, P4, P5, R> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5) => R;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 6 parameters and a return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    // @type    R The type of the return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Function6<P1, P2, P3, P4, P5, P6, R> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6) => R;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 7 parameters and a return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    // @type    P7 The type of the 7. parameter.
    // @type    R The type of the return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Function7<P1, P2, P3, P4, P5, P6, P7, R> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7) => R;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 8 parameters and a return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    // @type    P7 The type of the 7. parameter.
    // @type    P8 The type of the 8. parameter.
    // @type    R The type of the return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Function8<P1, P2, P3, P4, P5, P6, P7, P8, R> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8) => R;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 9 parameters and a return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    // @type    P7 The type of the 7. parameter.
    // @type    P8 The type of the 8. parameter.
    // @type    P9 The type of the 9. parameter.
    // @type    R The type of the return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Function9<P1, P2, P3, P4, P5, P6, P7, P8, P9, R> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9) => R;
}

//----------------------------------------------------------------------------------------------------------------------
// Consumer
//----------------------------------------------------------------------------------------------------------------------

namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A function with 1 parameter and no return value.
    // @type    P1 The type of the 1. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Consumer1<P1> = Function1<P1, void>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 2 parameters and no return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Consumer2<P1, P2> = Function2<P1, P2, void>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 3 parameters and no return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Consumer3<P1, P2, P3> = Function3<P1, P2, P3, void>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 4 parameters and no return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Consumer4<P1, P2, P3, P4> = Function4<P1, P2, P3, P4, void>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 5 parameters and no return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Consumer5<P1, P2, P3, P4, P5> = Function5<P1, P2, P3, P4, P5, void>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 6 parameters and no return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Consumer6<P1, P2, P3, P4, P5, P6> = Function6<P1, P2, P3, P4, P5, P6, void>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 7 parameters and no return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    // @type    P7 The type of the 7. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Consumer7<P1, P2, P3, P4, P5, P6, P7> = Function7<P1, P2, P3, P4, P5, P6, P7, void>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 8 parameters and no return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    // @type    P7 The type of the 7. parameter.
    // @type    P8 The type of the 8. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Consumer8<P1, P2, P3, P4, P5, P6, P7, P8> = Function8<P1, P2, P3, P4, P5, P6, P7, P8, void>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 9 parameters and no return value.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    // @type    P7 The type of the 7. parameter.
    // @type    P8 The type of the 8. parameter.
    // @type    P9 The type of the 9. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Consumer9<P1, P2, P3, P4, P5, P6, P7, P8, P9> = Function9<P1, P2, P3, P4, P5, P6, P7, P8, P9, void>;
}

//----------------------------------------------------------------------------------------------------------------------
// Predicate
//----------------------------------------------------------------------------------------------------------------------

namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A function with 1 parameter that returns a boolean.
    // @type    P1 The type of the 1. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Predicate1<P1> = Function1<P1, boolean>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 2 parameters that returns a boolean.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Predicate2<P1, P2> = Function2<P1, P2, boolean>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 3 parameters that returns a boolean.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Predicate3<P1, P2, P3> = Function3<P1, P2, P3, boolean>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 4 parameters that returns a boolean.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Predicate4<P1, P2, P3, P4> = Function4<P1, P2, P3, P4, boolean>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 5 parameters that returns a boolean.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Predicate5<P1, P2, P3, P4, P5> = Function5<P1, P2, P3, P4, P5, boolean>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 6 parameters that returns a boolean.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Predicate6<P1, P2, P3, P4, P5, P6> = Function6<P1, P2, P3, P4, P5, P6, boolean>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 7 parameters that returns a boolean.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    // @type    P7 The type of the 7. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Predicate7<P1, P2, P3, P4, P5, P6, P7> = Function7<P1, P2, P3, P4, P5, P6, P7, boolean>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 8 parameters that returns a boolean.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    // @type    P7 The type of the 7. parameter.
    // @type    P8 The type of the 8. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Predicate8<P1, P2, P3, P4, P5, P6, P7, P8> = Function8<P1, P2, P3, P4, P5, P6, P7, P8, boolean>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 9 parameters that returns a boolean.
    // @type    P1 The type of the 1. parameter.
    // @type    P2 The type of the 2. parameter.
    // @type    P3 The type of the 3. parameter.
    // @type    P4 The type of the 4. parameter.
    // @type    P5 The type of the 5. parameter.
    // @type    P6 The type of the 6. parameter.
    // @type    P7 The type of the 7. parameter.
    // @type    P8 The type of the 8. parameter.
    // @type    P9 The type of the 9. parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Predicate9<P1, P2, P3, P4, P5, P6, P7, P8, P9> = Function9<P1, P2, P3, P4, P5, P6, P7, P8, P9, boolean>;
}

//----------------------------------------------------------------------------------------------------------------------
// Function aliases
//----------------------------------------------------------------------------------------------------------------------

namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A function without parameters and without return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Action = () => void;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 1 parameter and not return value.
    // @type    T The type of the parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Consumer<T> = Consumer1<T>;

    //------------------------------------------------------------------------------------------------------------------
    // A function with no parameters that returns a value.
    // @type    T The type of the return value.
    //------------------------------------------------------------------------------------------------------------------

    export type Supplier<T> = () => T;

    //------------------------------------------------------------------------------------------------------------------
    // A function with 1 parameter that returns a boolean.
    // @type    T The type of the parameter.
    //------------------------------------------------------------------------------------------------------------------

    export type Predicate<T> = Predicate1<T>;

    //------------------------------------------------------------------------------------------------------------------
    // Any type of function with or without parameters and return value.
    //------------------------------------------------------------------------------------------------------------------

    export type AnyFunction = ((...parameters: any) => any) | Function;
}

//----------------------------------------------------------------------------------------------------------------------
// Union types
//----------------------------------------------------------------------------------------------------------------------

namespace internal {

    //------------------------------------------------------------------------------------------------------------------
    // A value or an array of values.
    // @type    T The type of the value (and array elements).
    //------------------------------------------------------------------------------------------------------------------

    export type ValueOrArray<T> = T | Array<T>;

    //------------------------------------------------------------------------------------------------------------------
    // A value or a function that can be called to produce the value.
    // @type    T The type of the value (or the return type of the function).
    //------------------------------------------------------------------------------------------------------------------

    export type ValueOrSupplier<T> = T | Supplier<T>;
}
