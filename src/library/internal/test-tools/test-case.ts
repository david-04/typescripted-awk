//----------------------------------------------------------------------------------------------------------------------
// Register a test case and optionally wrap it into a group.
//----------------------------------------------------------------------------------------------------------------------

function testCase(action: type.Action): void;
function testCase(g1: string, action: type.Action): void;
function testCase(g1: string, g2: string, action: type.Action): void;
function testCase(g1: string, g2: string, g3: string, action: type.Action): void;
function testCase(g1: string, g2: string, g3: string, g4: string, action: type.Action): void;
function testCase(g1: string, g2: string, g3: string, g4: string, g5: string, action: type.Action): void;
function testCase(g1: string, g2: string, g3: string, g4: string, g5: string, g6: string, action: type.Action): void;
function testCase(g1: string, g2: string, g3: string, g4: string, g5: string, g6: string, g7: string, action: type.Action): void;
function testCase(g1: string, g2: string, g3: string, g4: string, g5: string, g6: string, g7: string, g8: string, action: type.Action): void;
function testCase(g1: string, g2: string, g3: string, g4: string, g5: string, g6: string, g7: string, g8: string, g9: string, action: type.Action): void;

function testCase(...parameters: Array<any>) {
    const firstParameter = parameters.shift();
    if ('string' === typeof firstParameter) {
        testBackend.testCase(firstParameter, () => { (testCase as any)(...parameters); });
    } else if ('function' === typeof firstParameter) {
        firstParameter();
    }
}
