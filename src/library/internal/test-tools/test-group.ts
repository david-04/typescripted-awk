//----------------------------------------------------------------------------------------------------------------------
// Create nested groups and run the given test (or test group) inside of it.
//----------------------------------------------------------------------------------------------------------------------

function testGroup(g1: string, action: internal.Action): void;
function testGroup(g1: string, g2: string, action: internal.Action): void;
function testGroup(g1: string, g2: string, g3: string, action: internal.Action): void;
function testGroup(g1: string, g2: string, g3: string, g4: string, action: internal.Action): void;
function testGroup(g1: string, g2: string, g3: string, g4: string, g5: string, action: internal.Action): void;
function testGroup(g1: string, g2: string, g3: string, g4: string, g5: string, g6: string, action: internal.Action): void;
function testGroup(g1: string, g2: string, g3: string, g4: string, g5: string, g6: string, g7: string, action: internal.Action): void;
function testGroup(g1: string, g2: string, g3: string, g4: string, g5: string, g6: string, g7: string, g8: string, action: internal.Action): void;
function testGroup(g1: string, g2: string, g3: string, g4: string, g5: string, g6: string, g7: string, g8: string, g9: string, action: internal.Action): void;

function testGroup(...parameters: Array<any>) {
    let firstParameter = parameters.shift();
    if ('string' === typeof firstParameter) {
        if (0 <= firstParameter.indexOf('/')) {
            const segments = firstParameter.split(/\s*\/\s*/).filter(segment => segment.length);
            if (segments.length) {
                firstParameter = segments.shift() ?? '';
                parameters = [...segments, ...parameters]
            }
        }
        testBackend.testGroup(`${firstParameter.replace(/\.test\.ts$$/, '')}`, () => {
            (testGroup as any)(...parameters);
        });
    } else if ('function' === typeof firstParameter) {
        firstParameter();
    }
}
