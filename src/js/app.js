import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode));
        document.getElementsByTagName('body')[0].innerHTML = arrayToTableHtml(parsedCode);
    });
});

function arrayToTableHtml(parsedCode) {
    var result = '<table border=0>';
    result += '<tr>';
    result += '<td bgcolor="#81DAF5"> Line </td>';
    result += '<td bgcolor="#81DAF5"> Type </td>';
    result += '<td bgcolor="#81DAF5"> Name </td>';
    result += '<td bgcolor="#81DAF5"> Condition </td>';
    result += '<td bgcolor="#81DAF5"> Value </td>';
    for (var i = 0; i < parsedCode.length; i++) {
        if (i % 2 == 0) {
            result = colorEvenLines(result, parsedCode, i);
        }
        else {
            result = colorLines(result, parsedCode, i);
        }
    }
    result += '</tr>';
    result += '</table>';
    return result;
}

function colorEvenLines(result, parsedCode, i){
    result += '<tr>';
    result += '<td bgcolor="#FFFFFF">' + parsedCode[i].line + '</td>';
    result += '<td bgcolor="#FFFFFF">' + parsedCode[i].type + '</td>';
    result += '<td bgcolor="#FFFFFF">' + parsedCode[i].name + '</td>';
    result += '<td bgcolor="#FFFFFF">' + parsedCode[i].condition + '</td>';
    result += '<td bgcolor="#FFFFFF">' + parsedCode[i].value + '</td>';
    return result;
}

function colorLines(result, parsedCode, i){
    result += '<tr>';
    result += '<td bgcolor="#81DAF5">' + parsedCode[i].line + '</td>';
    result += '<td bgcolor="#81DAF5">' + parsedCode[i].type + '</td>';
    result += '<td bgcolor="#81DAF5">' + parsedCode[i].name + '</td>';
    result += '<td bgcolor="#81DAF5">' + parsedCode[i].condition + '</td>';
    result += '<td bgcolor="#81DAF5">' + parsedCode[i].value + '</td>';
    return result;
}
