//----------------------------------------------------------------------------------------------------------------------
// Typed interfaces based on the value being examined.
//----------------------------------------------------------------------------------------------------------------------

interface ExpectAny<T> {
    toBeEqualTo(value: T): this;
}

//----------------------------------------------------------------------------------------------------------------------
// Implementation of all expectations.
//----------------------------------------------------------------------------------------------------------------------

class Expect<T> implements ExpectAny<T> {

    public constructor(public readonly value: T) { }

    toBeEqualTo(value: T): this {
        testBackend.assertEquals(this.value, value);
        return this;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Factory method to create an expect wrapper.
//----------------------------------------------------------------------------------------------------------------------

function expectThat<T>(value: T): ExpectAny<T>;
function expectThat<T>(value: any): Expect<T> {
    return new Expect(value);
}

const expect = expectThat;
