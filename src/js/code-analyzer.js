import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    let json = esprima.parseScript(codeToParse);
    iterateBlock(json);
    return data_map;
};

export {parseCode};
let data_map = [];
let line_number = 0;
let typeToHandlerMapping = {'Program': iterateProgram,
    'FunctionDeclaration': iterateFunction,
    'VariableDeclaration': iterateVariable,
    'IfStatement': ifStatement,
    'WhileStatement': whileStatement,
    'ForStatement': forStatement,
    'Identifier': identifierStatement,
    'BlockStatement': BlockStatement,
    'ExpressionStatement': ExpressionStatement,
    'ReturnStatement': ReturnStatement};

let expressionTypeMapping = {'BinaryExpression': BinaryExpression,
    'UnaryExpression': UnaryExpression,
    'UpdateExpression': UpdateExpression,
    'AssignmentExpression': AssignmentExpression,
    'MemberExpression': MemberExpression};


function iterateBlock(json){
    let func = typeToHandlerMapping[json.type];
    func ? func.call(undefined, json) : '';
}

function iterateProgram(json) {
    line_number = 0;
    data_map = [];
    for (var i in json.body) {
        line_number++;
        iterateBlock(json.body[i]);
    }
}

function iterateFunction(json) {
    var function_name = json.id.name;
    let data = new DataLine(line_number, 'function declaration', function_name, '', '');
    data_map.push(data);

    for (var i in json.params) {
        iterateBlock(json.params[i]);
    }
    iterateBlock(json.body);
}

function iterateVariable(json) {
    for (var i in json.declarations) {
        var value;
        var name = json.declarations[i].id.name;
        if (json.declarations[i].init != null) {
            if(json.declarations[i].init.type == 'Identifier')
                value = json.declarations[i].init.name;
            else
                value = iterateExpression(json.declarations[i].init);
        }
        else
            value = ' ';
        let data = new DataLine(line_number, 'variable declaration', name, '', value);
        data_map.push(data);
    }
}

function ifStatement(json, isElse) {
    var cond = handleCondition(json.test);
    var type;
    if (isElse)
        type = 'else if statement';
    else
        type = 'if statement';
    let data = new DataLine(line_number, type, '', cond, '');
    data_map.push(data);
    if(json.consequent.type != 'BlockStatement')
        line_number++;
    iterateBlock(json.consequent);
    if (json.alternate) {
        alternate(json);
    }
}

function alternate(json){
    line_number++;
    if (json.alternate.type == 'IfStatement')
        elseIfStatement(json.alternate);
    else{
        line_number++;
        iterateBlock(json.alternate);
        if(json.alternate.type == 'BlockStatement')
            line_number++;
    }
}

function handleCondition(test) {
    return iterateExpression(test);
}

function whileStatement(json) {
    var cond = handleCondition(json.test);
    let data = new DataLine(line_number, 'while statement', '', cond, '');
    data_map.push(data);

    iterateBlock(json.body);
    if(json.body.type == 'BlockStatement')
        line_number++;
}

function forStatement(json) {
    var cond;
    var init = iterateExpression(json.init);
    var test = iterateExpression(json.test);
    var update = iterateExpression(json.update);
    cond = init + ' ' + test + ' ' + update;

    let data = new DataLine(line_number, 'for statement', '', cond, '');
    data_map.push(data);

    iterateBlock(json.body);
    if(json.body.type == 'BlockStatement')
        line_number++;
}

function elseIfStatement(json){
    ifStatement(json, true);
}

function identifierStatement(json) {
    var name = json.name;
    let data = new DataLine(line_number, 'variable declaration', name, '', '');
    data_map.push(data);
}

function BlockStatement(json) {
    for (var i in json.body) {
        line_number++;
        iterateBlock(json.body[i]);
    }
}

function ExpressionStatement(json) {
    var name;
    var value;

    if (json.expression.type == 'UpdateExpression'){
        value = iterateExpression(json.expression);
        name = json.expression.argument.name;
    }else {
        name = json.expression.left.name;
        value = iterateExpression(json.expression.right);
    }
    let data = new DataLine(line_number, 'assignment expression', name, '', value);
    data_map.push(data);
}

function iterateExpression(expressionElement) {
    if (expressionElement.type == 'Literal')
        return expressionElement.value;
    else {
        let func = expressionTypeMapping[expressionElement.type];
        return func ? func.call(undefined, expressionElement) : '';
    }
}

function BinaryExpression(json){
    var left;
    var op = json.operator;
    var right;

    if (json.left.name)
        left = json.left.name;
    else if (json.left.value)
        left = json.left.value;
    else
        left = iterateExpression(json.left);

    if (json.right.name)
        right = json.right.name;
    else if(json.right.value)
        right = json.right.value;
    else
        right = iterateExpression(json.right);
    return (left + ' ' + op + ' ' + right);
}

function UnaryExpression(json) {
    var op = json.operator;
    var value = iterateExpression(json.argument);
    return (op + value);
}

function UpdateExpression(expressionElement) {
    var name = expressionElement.argument.name;
    var op = expressionElement.operator;
    if (expressionElement.prefix)
        return (op + name);
    else
        return (name + op);
}

function AssignmentExpression(expressionElement) {
    var name = expressionElement.left.name;
    var value = iterateExpression(expressionElement.right);
    return (name + ' = ' + value);
}

function MemberExpression(json){
    var object = json.object.name;
    var property;
    if (json.property.name)
        property = json.property.name;
    else
        property = iterateExpression((json.property));
    return (object + '[' + property + ']');
}

function ReturnStatement(json) {
    var value;
    if (json.argument.type == 'Identifier')
        value = json.argument.name;
    else
        value = iterateExpression(json.argument);
    let data = new DataLine(line_number, 'return statement', '', '', value);
    data_map.push(data);
}

function DataLine(line, type, name, condition, value){
    this.line = line;
    this.type = type;
    this.name = name;
    this.condition = condition;
    this.value = value;
}
