namespace internal {

    export type Function1<P1, R> = (p1: P1) => R;
    export type Function2<P1, P2, R> = (p1: P1, p2: P2) => R;
    export type Function3<P1, P2, P3, R> = (p1: P1, p2: P2, p3: P3) => R;
    export type Function4<P1, P2, P3, P4, R> = (p1: P1, p2: P2, p3: P3, p4: P4) => R;
    export type Function5<P1, P2, P3, P4, P5, R> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5) => R;
    export type Function6<P1, P2, P3, P4, P5, P6, R> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6) => R;
    export type Function7<P1, P2, P3, P4, P5, P6, P7, R> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7) => R;
    export type Function8<P1, P2, P3, P4, P5, P6, P7, P8, R> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8) => R;
    export type Function9<P1, P2, P3, P4, P5, P6, P7, P8, P9, R> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6, p7: P7, p8: P8, p9: P9) => R;

    export type Consumer1<P1> = Function1<P1, void>;
    export type Consumer2<P1, P2> = Function2<P1, P2, void>;
    export type Consumer3<P1, P2, P3> = Function3<P1, P2, P3, void>;
    export type Consumer4<P1, P2, P3, P4> = Function4<P1, P2, P3, P4, void>;
    export type Consumer5<P1, P2, P3, P4, P5> = Function5<P1, P2, P3, P4, P5, void>;
    export type Consumer6<P1, P2, P3, P4, P5, P6> = Function6<P1, P2, P3, P4, P5, P6, void>;
    export type Consumer7<P1, P2, P3, P4, P5, P6, P7> = Function7<P1, P2, P3, P4, P5, P6, P7, void>;
    export type Consumer8<P1, P2, P3, P4, P5, P6, P7, P8> = Function8<P1, P2, P3, P4, P5, P6, P7, P8, void>;
    export type Consumer9<P1, P2, P3, P4, P5, P6, P7, P8, P9> = Function9<P1, P2, P3, P4, P5, P6, P7, P8, P9, void>;

    export type Predicate1<P1> = Function1<P1, boolean>;
    export type Predicate2<P1, P2> = Function2<P1, P2, boolean>;
    export type Predicate3<P1, P2, P3> = Function3<P1, P2, P3, boolean>;
    export type Predicate4<P1, P2, P3, P4> = Function4<P1, P2, P3, P4, boolean>;
    export type Predicate5<P1, P2, P3, P4, P5> = Function5<P1, P2, P3, P4, P5, boolean>;
    export type Predicate6<P1, P2, P3, P4, P5, P6> = Function6<P1, P2, P3, P4, P5, P6, boolean>;
    export type Predicate7<P1, P2, P3, P4, P5, P6, P7> = Function7<P1, P2, P3, P4, P5, P6, P7, boolean>;
    export type Predicate8<P1, P2, P3, P4, P5, P6, P7, P8> = Function8<P1, P2, P3, P4, P5, P6, P7, P8, boolean>;
    export type Predicate9<P1, P2, P3, P4, P5, P6, P7, P8, P9> = Function9<P1, P2, P3, P4, P5, P6, P7, P8, P9, boolean>;

    export type Action = () => void;
    export type Consumer<T> = Consumer1<T>;
    export type Supplier<T> = () => T;
    export type Predicate<T> = Predicate1<T>;
    export type ValueOrArray<T> = T | Array<T>;
    export type ValueOrSupplier<T> = T | Supplier<T>;
}
