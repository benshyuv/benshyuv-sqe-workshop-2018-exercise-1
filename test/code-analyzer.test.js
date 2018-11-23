import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    testEmpty();
    testForLoop();
    testWhile();
    testIfLoop();
    testIfElse();
    testFunction();
    testFunction2();
    testFullFunction();
    testUnary();
    testBinaryLeftValue();
    testBinaryRightValue();
    testFunction3();
    testPrefix();
    testVarPrefix();
    testWhileAndArray();
    testWhileEmpty();
    testSwitch();
    testnewArray();
});

function testEmpty(){
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });
}

function testForLoop(){
    it('is parsing a for loop declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f(){\n' +
                '    for (i=0;i<5;i++){\n' +
                '        i=i+1;\n' +
                '    }\n' +
                '    let a = i;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"f","condition":"","value":""},{"line":2,"type":"for statement","name":"","condition":"i = 0 i < 5 i++","value":""},{"line":3,"type":"assignment expression","name":"i","condition":"","value":"i + 1"},{"line":5,"type":"variable declaration","name":"a","condition":"","value":"i"}]'
        );
    });
}

function testWhile(){
    it('is parsing a while loop declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f(){\n' +
                '   while(i<10){\n' +
                '      i++;\n' +
                '   }\n' +
                '   return a;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"f","condition":"","value":""},{"line":2,"type":"while statement","name":"","condition":"i < 10","value":""},{"line":3,"type":"assignment expression","name":"i","condition":"","value":"i++"},{"line":5,"type":"return statement","name":"","condition":"","value":"a"}]'
        );
    });
}

function testIfLoop(){
    it('is parsing a if loop + else if declarations correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function func(){\n' +
                '    if(i<10)\n' +
                '        i=i*2;\n' +
                '    else if(i>11)\n' +
                '        i=8;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"func","condition":"","value":""},{"line":2,"type":"if statement","name":"","condition":"i < 10","value":""},{"line":3,"type":"assignment expression","name":"i","condition":"","value":"i * 2"},{"line":4,"type":"else if statement","name":"","condition":"i > 11","value":""},{"line":5,"type":"assignment expression","name":"i","condition":"","value":8}]'
        );
    });
}

function testFunction(){
    it('is parsing a function declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f(){\n' +
                '    for(i=0; i<10; i++)\n' +
                '        a = a+2;\n' +
                '    return a;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"f","condition":"","value":""},{"line":2,"type":"for statement","name":"","condition":"i = 0 i < 10 i++","value":""},{"line":2,"type":"assignment expression","name":"a","condition":"","value":"a + 2"},{"line":3,"type":"return statement","name":"","condition":"","value":"a"}]'
        );
    });
}

function testIfElse(){
    it('is parsing a if else loop declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(X,Y){\n' +
                '   let a = 10;\n' +
                '   if(a<30)\n' +
                '      a++;\n' +
                '   else\n' +
                '      a--;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"variable declaration","name":"X","condition":"","value":""},{"line":1,"type":"variable declaration","name":"Y","condition":"","value":""},{"line":2,"type":"variable declaration","name":"a","condition":"","value":10},{"line":3,"type":"if statement","name":"","condition":"a < 30","value":""},{"line":4,"type":"assignment expression","name":"a","condition":"","value":"a++"},{"line":6,"type":"assignment expression","name":"a","condition":"","value":"a--"}]'
        );
    });
}

function testFunction2(){
    it('is parsing a full function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function fun(X){\n' +
                '    for(i=0; i<5;i++){\n' +
                '        while(i>1)\n' +
                '            X=9;\n' +
                '        if(X==9)\n' +
                '           return 2;\n' +
                '    }\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"fun","condition":"","value":""},{"line":1,"type":"variable declaration","name":"X","condition":"","value":""},{"line":2,"type":"for statement","name":"","condition":"i = 0 i < 5 i++","value":""},{"line":3,"type":"while statement","name":"","condition":"i > 1","value":""},{"line":3,"type":"assignment expression","name":"X","condition":"","value":9},{"line":4,"type":"if statement","name":"","condition":"X == 9","value":""},{"line":5,"type":"return statement","name":"","condition":"","value":2}]'
        );
    });
}

function testFullFunction(){
    it('is parsing a full function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' + '    }\n' +
                '    return -1;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"variable declaration","name":"X","condition":"","value":""},{"line":1,"type":"variable declaration","name":"V","condition":"","value":""},{"line":1,"type":"variable declaration","name":"n","condition":"","value":""},{"line":2,"type":"variable declaration","name":"low","condition":"","value":" "},{"line":2,"type":"variable declaration","name":"high","condition":"","value":" "},{"line":2,"type":"variable declaration","name":"mid","condition":"","value":" "},{"line":3,"type":"assignment expression","name":"low","condition":"","value":0},{"line":4,"type":"assignment expression","name":"high","condition":"","value":"n - 1"},{"line":5,"type":"while statement","name":"","condition":"low <= high","value":""},{"line":6,"type":"assignment expression","name":"mid","condition":"","value":"low + high / 2"},{"line":7,"type":"if statement","name":"","condition":"X < V[mid]","value":""},{"line":8,"type":"assignment expression","name":"high","condition":"","value":"mid - 1"},{"line":9,"type":"else if statement","name":"","condition":"X > V[mid]","value":""},{"line":10,"type":"assignment expression","name":"low","condition":"","value":"mid + 1"},{"line":12,"type":"return statement","name":"","condition":"","value":"mid"},{"line":14,"type":"return statement","name":"","condition":"","value":"-1"}]' );
    });
}

function testUnary(){
    it('is parsing a return unary loop declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function f(){\n' +
                '    if(a<2){\n' +
                '        return a;\n' +
                '    }\n' +
                '    return -2;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"f","condition":"","value":""},{"line":2,"type":"if statement","name":"","condition":"a < 2","value":""},{"line":3,"type":"return statement","name":"","condition":"","value":"a"},{"line":4,"type":"return statement","name":"","condition":"","value":"-2"}]'
        );
    });
}

function testBinaryLeftValue() {
    it('is parsing a return Binary Left Value correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function func(X,Y){\n' +
                '    if(5+X<Y)\n' +
                '        return X-15;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"func","condition":"","value":""},{"line":1,"type":"variable declaration","name":"X","condition":"","value":""},{"line":1,"type":"variable declaration","name":"Y","condition":"","value":""},{"line":2,"type":"if statement","name":"","condition":"5 + X < Y","value":""},{"line":3,"type":"return statement","name":"","condition":"","value":"X - 15"}]'
        );
    });
}

function testBinaryRightValue() {
    it('is parsing a return Binary Right Value correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function func(X,Y){\n' +
                '    if(Y>X*(5+8))\n' +
                '        return X-15;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"func","condition":"","value":""},{"line":1,"type":"variable declaration","name":"X","condition":"","value":""},{"line":1,"type":"variable declaration","name":"Y","condition":"","value":""},{"line":2,"type":"if statement","name":"","condition":"Y > X * 5 + 8","value":""},{"line":3,"type":"return statement","name":"","condition":"","value":"X - 15"}]'
        );
    });
}

function testFunction3() {
    it('is parsing a return Binary Right Value correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function s(E,R){\n' +
                '   let a = E;\n' +
                '   let b = R;\n' +
                '   if(a<b)\n' +
                '      return a;\n' +
                '   else if(a==b){\n' +
                '      return b;\n' +
                '   }\n' +
                '   else{\n' +
                '      a = 9;\n' +
                '   }\n' +
                '   return 3;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"s","condition":"","value":""},{"line":1,"type":"variable declaration","name":"E","condition":"","value":""},{"line":1,"type":"variable declaration","name":"R","condition":"","value":""},{"line":2,"type":"variable declaration","name":"a","condition":"","value":"E"},{"line":3,"type":"variable declaration","name":"b","condition":"","value":"R"},{"line":4,"type":"if statement","name":"","condition":"a < b","value":""},{"line":5,"type":"return statement","name":"","condition":"","value":"a"},{"line":6,"type":"else if statement","name":"","condition":"a == b","value":""},{"line":7,"type":"return statement","name":"","condition":"","value":"b"},{"line":10,"type":"assignment expression","name":"a","condition":"","value":9},{"line":12,"type":"return statement","name":"","condition":"","value":3}]'
        );
    });
}

function testPrefix() {
    it('is parsing a Prefix Value correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('for(i=0;i<5;i++){\n' +
                '    ++i;\n' +
                '}')),
            '[{"line":1,"type":"for statement","name":"","condition":"i = 0 i < 5 i++","value":""},{"line":2,"type":"assignment expression","name":"i","condition":"","value":"++i"}]'
        );
    });
}

function testVarPrefix() {
    it('is parsing a variable with Prefix Value correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let x=++i;')),
            '[{"line":1,"type":"variable declaration","name":"x","condition":"","value":"++i"}]'
        );
    });
}

function testWhileAndArray() {
    it('is parsing a while with array correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let mid = 5;\n' +
                'while(A[4]<mid){\n' +
                '    let a = 9;\n' +
                '    mid = 0;\n' +
                '}')),
            '[{"line":1,"type":"variable declaration","name":"mid","condition":"","value":5},{"line":2,"type":"while statement","name":"","condition":"A[4] < mid","value":""},{"line":3,"type":"variable declaration","name":"a","condition":"","value":9},{"line":4,"type":"assignment expression","name":"mid","condition":"","value":0}]'
        );
    });
}

function testWhileEmpty() {
    it('is parsing a while with no body correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 8;\n' +
                'while(a<10){\n' +
                '}')),
            '[{"line":1,"type":"variable declaration","name":"a","condition":"","value":8},{"line":2,"type":"while statement","name":"","condition":"a < 10","value":""}]'
        );
    });
}

function testSwitch() {
    it('is parsing a switch case correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('switch(expression) {\n' +
                '    case x:\n' +
                '        a = 7;\n' +
                '        break;\n' +
                '    case y:\n' +
                '        a = 5;\n' +
                '        break;\n' +
                '    default:\n' +
                '        a = 0;\n' +
                '}')),
            '[]'
        );
    });
}

function testnewArray() {
    it('is parsing a new array declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let A = new array(5);')),
            '[{"line":1,"type":"variable declaration","name":"A","condition":"","value":""}]'
        );
    });
}

