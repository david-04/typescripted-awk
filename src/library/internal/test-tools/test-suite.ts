//----------------------------------------------------------------------------------------------------------------------
// Run unit tests within nested "describe" blocks
//----------------------------------------------------------------------------------------------------------------------

function testSuite(action: type.Action): void;
function testSuite(d1: string, action: type.Action): void;
function testSuite(d1: string, d2: string, action: type.Action): void;
function testSuite(d1: string, d2: string, d3: string, action: type.Action): void;
function testSuite(d1: string, d2: string, d3: string, d4: string, action: type.Action): void;
function testSuite(d1: string, d2: string, d3: string, d4: string, d5: string, action: type.Action): void;
function testSuite(d1: string, d2: string, d3: string, d4: string, d5: string, d6: string, action: type.Action): void;

function testSuite(...parameters: Array<any>) {
    const firstParameter = parameters.shift();
    if ('string' === typeof firstParameter) {
        describe(firstParameter, () => {
            (testSuite as any)(...parameters);
        });
    } else if ('function' === typeof firstParameter) {
        firstParameter();
    }
}
