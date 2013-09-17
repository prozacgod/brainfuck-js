var bfCode = "";

function ord(str) {
    return (""+str).charCodeAt(0);
}

function primeFactors(n) {
    var factors = [];
    var d = 2;
    while (n > 1) {
        while ((n % d) == 0) {
            factors.push(d);
            n  = n / d;
        }            
        d = d + 1;
    }
    return factors;
}

function addOp(op) {
    bfCode = bfCode + op;
}


function code() {
    var cellPtr = 0;
    
    var allocPtr = 0;
    var maxCellPtr = 0;
    var allocTable = [];

    // guarantees sequential allocation: returns first address
    // requires that allocCell only gets sequential allocations
    function allocMany(n, initialValue) {
        if (!initialValue)
            initialValue = 0;

        var result = allocCell(initialValue & 0xFF);
        initialValue = initialValue >> 8;
        for (var i = 1; i < n; i++) {
            allocCell(initialValue & 0xFF);
            initialValue = initialValue >> 8;
        }
        return result;
    }
    
    function releaseMany(ptr, n) {
        for (var i = 0; i < n; i++) {
            releaseCell(ptr + i);
        }
    }
    
    // behavoir currently allocates sequential addresses, not reallocating "holes"
    function allocCell(initialValue) {
        if (allocTable.indexOf(allocPtr) >= 0) {
            throw "alloc error";
        }
        
        allocTable.push(allocPtr);
        if (initialValue) {
            setAbsolute(allocPtr, initialValue);
        }
        
        allocPtr += 1;
        return allocPtr - 1;
    }

    function releaseCell(ptr) {
        if (!(allocTable.indexOf(ptr) >= 0)) {
            throw "release error";
        }

        var i = allocTable.indexOf(ptr);
        allocTable.splice(i, 1);
        var maxptr = 0;
        for (var i = 0; i < allocTable.length; i++) {
            if (allocTable[i] > maxptr)
                maxptr = allocTable[i];
        }                
        allocPtr = maxptr + 1;                
    }
    
    function seek(addr) {
        if (cellPtr > addr) {
            for (var i = addr; i < cellPtr; i++) {
                addOp('<');
            }
        } else if (cellPtr < addr) {
            for (var i = cellPtr; i < addr; i++) {
                addOp('>');
            }
        }
        cellPtr = addr;
    }
    
    function setZero() {
        addOp("[-]");
    }
    
    function set(value){
        //TODO: optimize for shorter code? (might be faster with just +'s)
        setZero();
        for (i = 0; i < value; i++) {
            addOp('+');
        }
    }
    
    function incAbsolute(addr, count) {
        seek(addr);
        if (count) {
            for(var i = 0; i < count; i++) {
                addOp('+');
            }
        } else {
            addOp('+');
        }
    }
    
    function setAbsolute(addr, value) {
        seek(addr);
        set(value);
    }
    
    function doWhile(addr, func, innerSeek) {
        var currPtr = cellPtr;
        seek(addr);
        addOp('[');
        seek(currPtr);
        func();
        seek(addr);
        addOp('-');
        addOp(']');
        seek(currPtr);
    }
    
    function dup(fromAddr, toAddr) {
        var workAddr = allocCell();
        doWhile(fromAddr, function() {
            incAbsolute(toAddr);
            incAbsolute(workAddr);
        });
        doWhile(workAddr, function() {
            incAbsolute(fromAddr);
        });
    }
    
    function add(src, dest) {
        doWhile(src, function() {
            seek(dest);
            addOp('+');
        });
    }

    function subConst(dest, value) {
        seek(dest);
        for (var i = 0; i < value; i++) {
            addOp('-');
        }
    }

    function addConst(src, value) {
        seek(dest);
        for (var i = 0; i < value; i++) {
            addOp('+');
        }
    }
    
    function readInput(addr) {
        seek(addr);
        addOp(',');
    }
    
    function conditionIfElse(testCB, pass, fail) {
        var result = allocCell();
        var notResult = allocCell(1);
        var ws = allocCell();
        
        testCB(result);
        dup(result, ws);
        doWhile(ws, function() {
            setAbsolute(notResult, 0);
        });
        doWhile(result, pass);
        doWhile(notResult, fail);
        
        releaseCell(ws);
        releaseCell(notResult);
        releaseCell(result);
    }

    function testEqual(a, b) {
        return function(result) {
            // we do this early to prevent needless address shifting about
            setAbsolute(result, 1);
            
            var ws1 = allocCell();
            var ws2 = allocCell();
            
            dup(a, ws1);
            dup(b, ws2);
            doWhile(ws2, function() {
                seek(ws1);
                addOp('-');
            });
            doWhile(ws1, function() {
                setAbsolute(result, 0);
            }); 
        }
    }

    function testEqualConst(a, value) {
        return function(result) {
            // we do this early to prevent needless address shifting about
            setAbsolute(result, 1);
            var ws1 = allocCell();
            dup(a, ws1);
            subConst(ws1, value);
            doWhile(ws1, function() {
                setAbsolute(result, 0);
            }); 
        }
    }
    
    function testZero(a) {
        return function() {
        }
    }
    

    function addComment(comment) {
        addOp("\n// " + comment + "\n");
    }
    
    //var flags = allocCell(); // flags
    var input = allocCell(); // register a
    var result = allocCell();
    addComment('Get User input');
    readInput(input);        
    addComment('Test for A');
    conditionIfElse(testEqualConst(input, ord('a')), function() {
        addComment("It's an A");
        setAbsolute(result, 1);
    }, function() {
        addComment('Test for B');
        conditionIfElse(testEqualConst(input, ord('b')), function() {
            addComment("It's a B");
            setAbsolute(result, 2);
        }, function() {
            addComment("It's something entirely different");
            setAbsolute(result, 100);
        });
    });
}

console.log(ord('a'));

code();
console.log(bfCode);


// 25932134353700010

