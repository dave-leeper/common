//@formatter:off
'use strict';
import { ParserInput, ParserResult, ParserError } from './parser'
import { AlternativeExpression, StringExpression, LiteralExpression } from './parser'
import { CharacterSequence, ExpressionSequence, RepeatingExpression } from './parser'
import { UntilExpression, MarkedExpression, NestedExpression } from './parser'

describe( 'As a developer, I need to work with parsing tools', function() {
    beforeAll(() => {
        console.log('BEGIN PARSER TEST ===========================================');
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    afterAll(() => {
    });
    it ( 'should provide a class that represents the parser input', (  ) => {
        let str = 'ABCDEFG';
        let parserInput = new ParserInput(str, 0);
        expect(parserInput.str).toEqual(str);
        expect(parserInput.loc).toEqual(0);
        expect(parserInput.marked).toEqual(0);
        expect(parserInput.get()).toEqual('A');
        expect(parserInput.end()).toEqual(false);
        expect(parserInput.get()).toEqual('B');
        expect(parserInput.end()).toEqual(false);
        expect(parserInput.get()).toEqual('C');
        expect(parserInput.end()).toEqual(false);
        expect(parserInput.get()).toEqual('D');
        expect(parserInput.end()).toEqual(false);
        expect(parserInput.get()).toEqual('E');
        expect(parserInput.end()).toEqual(false);
        expect(parserInput.get()).toEqual('F');
        expect(parserInput.end()).toEqual(false);
        expect(parserInput.get()).toEqual('G');
        expect(parserInput.end()).toEqual(true);
        expect(parserInput.get()).toEqual(-1);
        parserInput.revisit();
        expect(parserInput.end()).toEqual(false);
        expect(parserInput.get()).toEqual('A');
        parserInput.revisit();
        expect(parserInput.get()).toEqual('A');
        expect(parserInput.get()).toEqual('B');
        parserInput.revisit();
        expect(parserInput.get()).toEqual('A');
        parserInput.mark();
        expect(parserInput.get()).toEqual('B');
        expect(parserInput.get()).toEqual('C');
        parserInput.revisit();
        expect(parserInput.get()).toEqual('B');
    });
    it ( 'should keep track of line numbers and column positions', (  ) => {
        let str = 'A\r0\na\r\n!';
        let parserInput = new ParserInput(str, 0);
        let char = parserInput.get();
        expect(char).toEqual('A');
        expect(parserInput.line).toEqual(0);
        expect(parserInput.linePosition).toEqual(1);
        char = parserInput.get();
        expect(char).toEqual('\r');
        expect(parserInput.line).toEqual(1);
        expect(parserInput.linePosition).toEqual(0);
        char = parserInput.get();
        expect(char).toEqual('0');
        expect(parserInput.line).toEqual(1);
        expect(parserInput.linePosition).toEqual(1);
        char = parserInput.get();
        expect(char).toEqual('\n');
        expect(parserInput.line).toEqual(2);
        expect(parserInput.linePosition).toEqual(0);
        char = parserInput.get();
        expect(char).toEqual('a');
        expect(parserInput.line).toEqual(2);
        expect(parserInput.linePosition).toEqual(1);
        char = parserInput.get();
        expect(char).toEqual('\r');
        expect(parserInput.line).toEqual(3);
        expect(parserInput.linePosition).toEqual(0);
        char = parserInput.get();
        expect(char).toEqual('\n');
        expect(parserInput.line).toEqual(3);
        expect(parserInput.linePosition).toEqual(1);
        char = parserInput.get();
        expect(char).toEqual('!');
        expect(parserInput.line).toEqual(3);
        expect(parserInput.linePosition).toEqual(2);
    });
    it ( 'should be able to mark and revisit positions', (  ) => {
        let str = 'A\r0\na\r\n!';
        let parserInput = new ParserInput(str, 0);
        let char;
        parserInput.get();
        parserInput.get();
        parserInput.get();
        parserInput.get();
        char = parserInput.get();
        expect(char).toEqual('a');
        expect(parserInput.loc).toEqual(5);
        expect(parserInput.line).toEqual(2);
        expect(parserInput.linePosition).toEqual(1);
        parserInput.mark();
        parserInput.get();
        char = parserInput.get();
        expect(char).toEqual('\n');
        expect(parserInput.loc).toEqual(7);
        expect(parserInput.line).toEqual(3);
        expect(parserInput.linePosition).toEqual(1);
        parserInput.revisit();
        expect(parserInput.loc).toEqual(5);
        expect(parserInput.line).toEqual(2);
        expect(parserInput.linePosition).toEqual(1);
    });
    it ( 'should provide a class that represents the parser result', (  ) => {
        let parseResult = new ParserResult();
        expect(parseResult.expression).toBeUndefined();
        expect(parseResult.loc).toEqual(0);
        expect(parseResult.count).toEqual(0);
        expect(parseResult.data).toBeNull();
        expect(parseResult.matched).toEqual(false);
        expect(parseResult.error).toBeUndefined();
        parseResult = new ParserResult(CharacterSequence.NUMBER);
        expect(parseResult.expression).toEqual(CharacterSequence.NUMBER);
        expect(parseResult.loc).toEqual(0);
        expect(parseResult.count).toEqual(0);
        expect(parseResult.data).toBeNull();
        expect(parseResult.matched).toEqual(false);
        expect(parseResult.error).toBeUndefined();
        expect(parseResult.children).toBeUndefined();
        parseResult = new ParserResult(CharacterSequence.NUMBER, 5);
        expect(parseResult.expression).toEqual(CharacterSequence.NUMBER);
        expect(parseResult.loc).toEqual(5);
        expect(parseResult.count).toEqual(0);
        expect(parseResult.data).toBeNull();
        expect(parseResult.matched).toEqual(false);
        expect(parseResult.error).toBeUndefined();
        expect(parseResult.children).toBeUndefined();
        parseResult = new ParserResult(CharacterSequence.NUMBER, 5, 6);
        expect(parseResult.expression).toEqual(CharacterSequence.NUMBER);
        expect(parseResult.loc).toEqual(5);
        expect(parseResult.count).toEqual(6);
        expect(parseResult.data).toBeNull();
        expect(parseResult.matched).toEqual(false);
        expect(parseResult.error).toBeUndefined();
        expect(parseResult.children).toBeUndefined();
        parseResult = new ParserResult(CharacterSequence.NUMBER, 5, 6, 'DATA');
        expect(parseResult.expression).toEqual(CharacterSequence.NUMBER);
        expect(parseResult.loc).toEqual(5);
        expect(parseResult.count).toEqual(6);
        expect(parseResult.data).toEqual('DATA');
        expect(parseResult.matched).toEqual(false);
        expect(parseResult.error).toBeUndefined();
        expect(parseResult.children).toBeUndefined();
        parseResult = new ParserResult(CharacterSequence.NUMBER, 5, 6, 'DATA', true);
        expect(parseResult.expression).toEqual(CharacterSequence.NUMBER);
        expect(parseResult.loc).toEqual(5);
        expect(parseResult.count).toEqual(6);
        expect(parseResult.data).toEqual('DATA');
        expect(parseResult.matched).toEqual(true);
        expect(parseResult.error).toBeUndefined();
        expect(parseResult.children).toBeUndefined();
        parseResult = new ParserResult(CharacterSequence.NUMBER, 5, 6, 'DATA', true, 'ERROR');
        expect(parseResult.expression).toEqual(CharacterSequence.NUMBER);
        expect(parseResult.loc).toEqual(5);
        expect(parseResult.count).toEqual(6);
        expect(parseResult.data).toEqual('DATA');
        expect(parseResult.matched).toEqual(true);
        expect(parseResult.error).toEqual('ERROR');
        expect(parseResult.children).toBeUndefined();
        parseResult = new ParserResult(CharacterSequence.NUMBER, 5, 6, 'DATA', true, 'ERROR', 'CHILDREN');
        expect(parseResult.expression).toEqual(CharacterSequence.NUMBER);
        expect(parseResult.loc).toEqual(5);
        expect(parseResult.count).toEqual(6);
        expect(parseResult.data).toEqual('DATA');
        expect(parseResult.matched).toEqual(true);
        expect(parseResult.error).toEqual('ERROR');
        expect(parseResult.children).toEqual('CHILDREN');
    });
    it ( 'should provide an expression that can parse strings', (  ) => {
        let expression = new StringExpression();
        expect(expression.quoteCharacter).toEqual('"');
        expect(expression.escapeCharacter).toEqual('\\');
        expect(expression.parse(new ParserInput('"ABCDEFG"', 0))).toEqual(new ParserResult(expression, 9, 7, 'ABCDEFG', true));
        expect(expression.parse(new ParserInput('"ABCD\\\\EFG"', 0))).toEqual(new ParserResult(expression, 11, 8, 'ABCD\\EFG', true));
        expression.escapeCharacter = '?';
        expect(expression.parse(new ParserInput('"ABCD??EFG"', 0))).toEqual(new ParserResult(expression, 11, 8, 'ABCD?EFG', true));
        expression.quoteCharacter = '`';
        expect(expression.parse(new ParserInput('`ABCD??EFG`', 0))).toEqual(new ParserResult(expression, 11, 8, 'ABCD?EFG', true));
        let result = expression.parse(new ParserInput('`ABCD??EFG', 0));
        expect(result.loc).toEqual(10);
        expect(result.data).toEqual(null);
        expect(result.count).toEqual(0);
        expect(result.matched).toEqual(false);
        result = expression.parse(new ParserInput('ABCD??EFG`', 0));
        expect(result.loc).toEqual(1);
        expect(result.data).toEqual(null);
        expect(result.count).toEqual(0);
        expect(result.matched).toEqual(false);
    });
    it ( 'should provide an expression that can parse literals', (  ) => {
        let expression = new LiteralExpression('ABCDEFG');
        expect(expression.literal).toEqual('ABCDEFG');
        expect(expression.parse(new ParserInput('ABCDEFG', 0))).toEqual(new ParserResult(expression, 7, 7, 'ABCDEFG', true));
        let result = expression.parse(new ParserInput('ABEFGCD', 0));
        expect(result.loc).toEqual(3);
        expect(result.data).toEqual('ABE');
        expect(result.count).toEqual(0);
        expect(result.matched).toEqual(false);
    });
    it ( 'should provide an expression that can parse character sequences', (  ) => {
        let expression = new CharacterSequence('ABCDEFG');
        expect(expression.validFirstCharacters).toEqual('ABCDEFG');
        expect(expression.validRemainingCharacters).toEqual('ABCDEFG');
        expect(expression.parse(new ParserInput('ABCDEFG', 0))).toEqual(new ParserResult(expression, 7, 7, 'ABCDEFG', true));
        expect(expression.parse(new ParserInput('ABEFGCD', 0))).toEqual(new ParserResult(expression, 7, 7, 'ABEFGCD', true));

        expression = new CharacterSequence('_ABCDEFG', 'ABCDEFG0123456789');
        expect(expression.parse(new ParserInput('_ABEFG45', 0))).toEqual(new ParserResult(expression, 8, 8, '_ABEFG45', true));
        let result = expression.parse(new ParserInput('9ABEFG45', 0));
        expect(result.loc).toEqual(1);
        expect(result.data).toEqual(null);
        expect(result.count).toEqual(0);
        expect(result.matched).toEqual(false);
        expect(expression.parse(new ParserInput('_ABEFG_45', 0))).toEqual(new ParserResult(expression, 6, 6, '_ABEFG', true));
        expect(expression.parse(new ParserInput('A   ', 0))).toEqual(new ParserResult(expression, 1, 1, 'A', true));

        expect(CharacterSequence.WHITESPACE.parse(new ParserInput('    |', 0))).toEqual(new ParserResult(CharacterSequence.WHITESPACE, 4, 4, '    ', true));
        expect(CharacterSequence.NUMBER.parse(new ParserInput('1234|', 0))).toEqual(new ParserResult(CharacterSequence.NUMBER, 4, 4, '1234', true));
        expect(CharacterSequence.LETTER.parse(new ParserInput('abCD|', 0))).toEqual(new ParserResult(CharacterSequence.LETTER, 4, 4, 'abCD', true));
        expect(CharacterSequence.LOWER_CASE_LETTER.parse(new ParserInput('abcd|', 0))).toEqual(new ParserResult(CharacterSequence.LOWER_CASE_LETTER, 4, 4, 'abcd', true));
        expect(CharacterSequence.UPPER_CASE_LETTER.parse(new ParserInput('ABCD|', 0))).toEqual(new ParserResult(CharacterSequence.UPPER_CASE_LETTER, 4, 4, 'ABCD', true));
        expect(CharacterSequence.ALPHANUMERIC.parse(new ParserInput('Abc9|', 0))).toEqual(new ParserResult(CharacterSequence.ALPHANUMERIC, 4, 4, 'Abc9', true));
    });
    it ( 'should provide an expression that can parse expression sequences', (  ) => {
        let let_expression = new LiteralExpression('let');
        let identifier_expression = new CharacterSequence('_abcdefghijklmnopqrstuvwxyz', 'abcdefghijklmnopqrstuvwxyz0123456789');
        let equals_expression = new LiteralExpression('=');
        let plus_expression = new LiteralExpression('+');
        let terminator_expression = new LiteralExpression(';');
        let statement_expression = new ExpressionSequence(
            let_expression,             CharacterSequence.WHITESPACE,
            identifier_expression,      CharacterSequence.WHITESPACE,
            equals_expression,          CharacterSequence.WHITESPACE,
            CharacterSequence.NUMBER,   CharacterSequence.WHITESPACE,
            plus_expression,            CharacterSequence.WHITESPACE,
            CharacterSequence.NUMBER,   CharacterSequence.WHITESPACE,
            terminator_expression
        );
        expect(statement_expression.expressions.length).toEqual(13);
        let assignment = 'let x = 1 + 1 ;';
        let result = statement_expression.parse(new ParserInput(assignment, 0));
        expect(result.loc).toEqual(15);
        expect(result.count).toEqual(15);
        expect(result.data).toEqual(assignment);
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(13);
        expect(result.children[0].data).toEqual('let');
        expect(result.children[1].data).toEqual(' ');
        expect(result.children[2].data).toEqual('x');
        expect(result.children[3].data).toEqual(' ');
        expect(result.children[4].data).toEqual('=');
        expect(result.children[5].data).toEqual(' ');
        expect(result.children[6].data).toEqual('1');
        expect(result.children[7].data).toEqual(' ');
        expect(result.children[8].data).toEqual('+');
        expect(result.children[9].data).toEqual(' ');
        expect(result.children[10].data).toEqual('1');
        expect(result.children[11].data).toEqual(' ');
        expect(result.children[12].data).toEqual(';');

        let math_expression = new ExpressionSequence(
            CharacterSequence.NUMBER,   CharacterSequence.WHITESPACE,
            plus_expression,            CharacterSequence.WHITESPACE,
            CharacterSequence.NUMBER,   CharacterSequence.WHITESPACE,
        );
        result = math_expression.parse(new ParserInput('1 + 1 ', 0));
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(6);
        expect(result.data).toEqual('1 + 1 ');
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(6);
        expect(result.children[0].data).toEqual('1');
        expect(result.children[1].data).toEqual(' ');
        expect(result.children[2].data).toEqual('+');
        expect(result.children[3].data).toEqual(' ');
        expect(result.children[4].data).toEqual('1');
        expect(result.children[5].data).toEqual(' ');
        let assignment_expression = new ExpressionSequence(
            identifier_expression,      CharacterSequence.WHITESPACE,
            equals_expression,          CharacterSequence.WHITESPACE,
            math_expression,
        );
        result = assignment_expression.parse(new ParserInput('x = 1 + 1 ', 0));
        expect(result.loc).toEqual(10);
        expect(result.count).toEqual(10);
        expect(result.data).toEqual('x = 1 + 1 ');
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(5);
        expect(result.children[0].data).toEqual('x');
        expect(result.children[1].data).toEqual(' ');
        expect(result.children[2].data).toEqual('=');
        expect(result.children[3].data).toEqual(' ');
        expect(result.children[4].data).toEqual('1 + 1 ');
        expect(result.children[4].children.length).toEqual(6);
        expect(result.children[4].children[0].data).toEqual('1');
        expect(result.children[4].children[1].data).toEqual(' ');
        expect(result.children[4].children[2].data).toEqual('+');
        expect(result.children[4].children[3].data).toEqual(' ');
        expect(result.children[4].children[4].data).toEqual('1');
        expect(result.children[4].children[5].data).toEqual(' ');
        let statement_expression2 = new ExpressionSequence(
            let_expression,             CharacterSequence.WHITESPACE,
            assignment_expression,      terminator_expression,
        );
        result = statement_expression2.parse(new ParserInput(assignment, 0));
        expect(result.loc).toEqual(15);
        expect(result.count).toEqual(15);
        expect(result.data).toEqual(assignment);
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(4);
        expect(result.children[0].data).toEqual('let');
        expect(result.children[1].data).toEqual(' ');
        expect(result.children[2].data).toEqual('x = 1 + 1 ');
        expect(result.children[2].children.length).toEqual(5);
        expect(result.children[2].children[0].data).toEqual('x');
        expect(result.children[2].children[1].data).toEqual(' ');
        expect(result.children[2].children[2].data).toEqual('=');
        expect(result.children[2].children[3].data).toEqual(' ');
        expect(result.children[2].children[4].data).toEqual('1 + 1 ');
        expect(result.children[2].children[4].children.length).toEqual(6);
        expect(result.children[2].children[4].children[0].data).toEqual('1');
        expect(result.children[2].children[4].children[1].data).toEqual(' ');
        expect(result.children[2].children[4].children[2].data).toEqual('+');
        expect(result.children[2].children[4].children[3].data).toEqual(' ');
        expect(result.children[2].children[4].children[4].data).toEqual('1');
        expect(result.children[2].children[4].children[5].data).toEqual(' ');
        expect(result.children[3].data).toEqual(';');
    });
    it ( 'should provide an expression that can parse expression alternatives, returning the largest match', (  ) => {
        let expression1 = new LiteralExpression('big');
        let expression2 = new LiteralExpression('bigger');
        let expression3 = new LiteralExpression('biggerest');
        let alternative_expression = new AlternativeExpression(
            expression1, expression2, expression3,
        );
        expect(alternative_expression.expressions.length).toEqual(3);
        let result = alternative_expression.parse(new ParserInput('big', 0));
        expect(result.loc).toEqual(3);
        expect(result.count).toEqual(3);
        expect(result.data).toEqual('big');
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(1);
        expect(result.children[0].data).toEqual('big');

        result = alternative_expression.parse(new ParserInput('bigger', 0));
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(6);
        expect(result.data).toEqual('bigger');
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(1);
        expect(result.children[0].data).toEqual('bigger');

        result = alternative_expression.parse(new ParserInput('biggerest', 0));
        expect(result.loc).toEqual(9);
        expect(result.count).toEqual(9);
        expect(result.data).toEqual('biggerest');
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(1);
        expect(result.children[0].data).toEqual('biggerest');
    });
    it ( 'should provide an expression that can parse a repeating expression, returning as many matches as possible', (  ) => {
        let expression = new LiteralExpression('big');
        let repeating_expression = new RepeatingExpression( expression, 0, RepeatingExpression.MAXIMUM_ALLOWED_INFINITE );
        expect(repeating_expression.expression).toEqual(expression);
        expect(repeating_expression.minimumRequired).toEqual(0);
        expect(repeating_expression.maximumAllowed).toEqual(RepeatingExpression.MAXIMUM_ALLOWED_INFINITE);
        let result = repeating_expression.parse(new ParserInput('big', 0));
        expect(result.loc).toEqual(3);
        expect(result.count).toEqual(3);
        expect(result.data).toEqual('big');
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(1);
        expect(result.children[0].data).toEqual('big');

        result = repeating_expression.parse(new ParserInput('bigbig', 0));
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(6);
        expect(result.data).toEqual('bigbig');
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(2);
        expect(result.children[0].data).toEqual('big');
        expect(result.children[1].data).toEqual('big');

        result = repeating_expression.parse(new ParserInput('bigbigbig', 0));
        expect(result.loc).toEqual(9);
        expect(result.count).toEqual(9);
        expect(result.data).toEqual('bigbigbig');
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(3);
        expect(result.children[0].data).toEqual('big');
        expect(result.children[1].data).toEqual('big');
        expect(result.children[2].data).toEqual('big');

        repeating_expression = new RepeatingExpression( expression, 5, RepeatingExpression.MAXIMUM_ALLOWED_INFINITE );
        result = repeating_expression.parse(new ParserInput('bigbigbig', 0));
        expect(result.loc).toEqual(9);
        expect(result.count).toEqual(9);
        expect(result.data).toEqual('bigbigbig');
        expect(result.matched).toEqual(false);
        expect(result.children.length).toEqual(4);
        expect(result.children[0].data).toEqual('big');
        expect(result.children[1].data).toEqual('big');
        expect(result.children[2].data).toEqual('big');
        expect(result.children[3].data).toEqual(null);

        repeating_expression = new RepeatingExpression( expression, 0, 1 );
        result = repeating_expression.parse(new ParserInput('bigbigbig', 0));
        expect(result.loc).toEqual(3);
        expect(result.count).toEqual(3);
        expect(result.data).toEqual('big');
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(1);
        expect(result.children[0].data).toEqual('big');

        repeating_expression = new RepeatingExpression( expression, 0, 1 );
        result = repeating_expression.parse(new ParserInput('random stuff', 0));
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(0);

        let let_expression = new LiteralExpression('let');
        let identifier_expression = new CharacterSequence('_abcdefghijklmnopqrstuvwxyz', 'abcdefghijklmnopqrstuvwxyz0123456789');
        let equals_expression = new LiteralExpression('=');
        let plus_expression = new LiteralExpression('+');
        let terminator_expression = new LiteralExpression(';');
        let statement_expression = new ExpressionSequence(
            let_expression,             CharacterSequence.WHITESPACE,
            identifier_expression,      RepeatingExpression.OPTIONAL_WHITESPACE,
            equals_expression,          RepeatingExpression.OPTIONAL_WHITESPACE,
            CharacterSequence.NUMBER,   RepeatingExpression.OPTIONAL_WHITESPACE,
            plus_expression,            RepeatingExpression.OPTIONAL_WHITESPACE,
            CharacterSequence.NUMBER,   RepeatingExpression.OPTIONAL_WHITESPACE,
            terminator_expression
        );
        expect(statement_expression.expressions.length).toEqual(13);
        let assignment = 'let x=1+1;';
        result = statement_expression.parse(new ParserInput(assignment, 0));
        expect(result.loc).toEqual(10);
        expect(result.count).toEqual(10);
        expect(result.data).toEqual(assignment);
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(13);
        expect(result.children[0].data).toEqual('let');
        expect(result.children[1].data).toEqual(' ');
        expect(result.children[2].data).toEqual('x');
        expect(result.children[3].data).toEqual(null);
        expect(result.children[4].data).toEqual('=');
        expect(result.children[5].data).toEqual(null);
        expect(result.children[6].data).toEqual('1');
        expect(result.children[7].data).toEqual(null);
        expect(result.children[8].data).toEqual('+');
        expect(result.children[9].data).toEqual(null);
        expect(result.children[10].data).toEqual('1');
        expect(result.children[11].data).toEqual(null);
        expect(result.children[12].data).toEqual(';');
    });
    it ( 'should provide an expression that matches until another expression is encountered', (  ) => {
        let expression = new LiteralExpression('<');
        let until_expression = new UntilExpression( expression );
        expect(until_expression.expression).toEqual(expression);
        let result = until_expression.parse(new ParserInput('big<', 0));
        expect(result.loc).toEqual(3);
        expect(result.count).toEqual(3);
        expect(result.data).toEqual('big');
        expect(result.matched).toEqual(true);
        expect(result.children.length).toEqual(1);
        expect(result.children[0].data).toEqual('<');
    });
    it ( 'should be able to mark an expression', (  ) => {
        let expression = new LiteralExpression('big');
        let marked_expression = new MarkedExpression( expression );
        expect(marked_expression.expression).toEqual(expression);
        let result = marked_expression.parse(new ParserInput('big<', 0));
        expect(result.loc).toEqual(3);
        expect(result.count).toEqual(3);
        expect(result.data).toEqual('big');
        expect(result.matched).toEqual(true);
        expect(result.expression).toEqual(marked_expression);
        expect(result.children.length).toEqual(1);
        expect(result.children[0].data).toEqual('big');
    });
    it ( 'should handle nested expressions', (  ) => {
        let expression1 = new LiteralExpression('big');
        let expression2 = new LiteralExpression('small');
        let nested_expression = new NestedExpression( expression1, expression2 );
        expect(nested_expression.expression1).toEqual(expression1);
        expect(nested_expression.expression2).toEqual(expression2);
        let result = nested_expression.parse(new ParserInput('bigbigbigsmallsmallsmall', 0));
        expect(result.matched).toEqual(true);
        expect(result.data).toEqual('bigbigbigsmallsmallsmall');
        expect(result.children.length).toEqual(6);
        expect(result.children[0].data).toEqual('big');
        expect(result.children[1].data).toEqual('big');
        expect(result.children[2].data).toEqual('big');
        expect(result.children[3].data).toEqual('small');
        expect(result.children[4].data).toEqual('small');
        expect(result.children[5].data).toEqual('small');

        result = nested_expression.parse(new ParserInput('bigbigbigsmallsmallsmallsmall', 0));
        expect(result.matched).toEqual(true);
        expect(result.data).toEqual('bigbigbigsmallsmallsmall');
        expect(result.children.length).toEqual(6);
        expect(result.children[0].data).toEqual('big');
        expect(result.children[1].data).toEqual('big');
        expect(result.children[2].data).toEqual('big');
        expect(result.children[3].data).toEqual('small');
        expect(result.children[4].data).toEqual('small');
        expect(result.children[5].data).toEqual('small');

        result = nested_expression.parse(new ParserInput('bigbigbigsmallsmall', 0));
        expect(result.matched).toEqual(false);
        expect(result.data).toEqual('bigbigbigsmallsmall');
        expect(result.children.length).toEqual(6);
        expect(result.children[0].data).toEqual('big');
        expect(result.children[1].data).toEqual('big');
        expect(result.children[2].data).toEqual('big');
        expect(result.children[3].data).toEqual('small');
        expect(result.children[4].data).toEqual('small');
        expect(result.children[5].data).toEqual(null);

        let marked_character_sequence = new MarkedExpression(new CharacterSequence('xyz'));
        let expression_sequence1 = new ExpressionSequence(expression1, marked_character_sequence);
        let expression_sequence2 = new ExpressionSequence(expression2, marked_character_sequence);
        nested_expression = new NestedExpression( expression_sequence1, expression_sequence2 );
        result = nested_expression.parse(new ParserInput('bigxxbigyybigzzsmallxxsmallyysmallzz', 0));
        expect(result.matched).toEqual(true);
        expect(result.data).toEqual('bigxxbigyybigzzsmallxxsmallyysmallzz');
        expect(result.children.length).toEqual(6);
        expect(result.children[0].data).toEqual('bigxx');
        expect(result.children[1].data).toEqual('bigyy');
        expect(result.children[2].data).toEqual('bigzz');
        expect(result.children[3].data).toEqual('smallxx');
        expect(result.children[4].data).toEqual('smallyy');
        expect(result.children[5].data).toEqual('smallzz');

        result = nested_expression.parse(new ParserInput('bigxxbigyybigzzsmallzzsmallyysmallxx', 0));
        expect(result.matched).toEqual(false);
        expect(result.data).toEqual('bigxxbigyybigzzsmallzzsmallyysmallxx');
        expect(result.children.length).toEqual(6);
        expect(result.children[0].data).toEqual('bigxx');
        expect(result.children[1].data).toEqual('bigyy');
        expect(result.children[2].data).toEqual('bigzz');
        expect(result.children[3].data).toEqual('smallzz');
        expect(result.children[4].data).toEqual('smallyy');
        expect(result.children[5].data).toEqual('smallxx');
    });
    it ( 'should provide provide useful error messages', (  ) => {
        let str = 'ABCDEFG';
        let error = 'End of input.';
        let parserInput = new ParserInput(str, 0);
        let expression = new LiteralExpression('let');
        let parserError = new ParserError(error, parserInput, expression);
        expect(parserError.error).toEqual(error);
        expect(parserError.loc).toEqual(parserInput.loc);
        expect(parserError.line).toEqual(parserInput.line);
        expect(parserError.linePosition).toEqual(parserInput.linePosition);
        expect(parserError.expression).toEqual(expression);

        parserError = parserInput.getError(error, expression);
        expect(parserError.error).toEqual(error);
        expect(parserError.loc).toEqual(parserInput.loc);
        expect(parserError.line).toEqual(parserInput.line);
        expect(parserError.linePosition).toEqual(parserInput.linePosition);
        expect(parserError.expression).toEqual(expression);

        parserInput = new ParserInput('', 0);
        expression = new StringExpression();
        let result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(-1);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('End of input.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('TEXT"', 0);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(1);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('No opening quote.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(1);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(1);

        parserInput = new ParserInput('"TEXT', 0);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(5);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('No closing quote.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(5);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(5);

        parserInput = new ParserInput('"TEXT\\', 0);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Invalid escape sequence.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(6);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(6);

        parserInput = new ParserInput('', 0);
        expression = new LiteralExpression();
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(-1);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('End of input.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('TEXT', 0);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Literal not set.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('TEX', 0);
        expression = new LiteralExpression('TEXT');
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(3);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual('TEX');
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Does not match.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(3);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(3);

        parserInput = new ParserInput('TE?T', 0);
        expression = new LiteralExpression('TEXT');
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(3);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual('TE?');
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Does not match.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(3);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(3);

        parserInput = new ParserInput('', 0);
        expression = new CharacterSequence();
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(-1);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('End of input.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('abc', 0);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('First character sequence not set.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        expression = new CharacterSequence('abcdefg');
        expression.validRemainingCharacters = null;
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Remaining character sequence not set.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('TEXT', 0);
        expression = new CharacterSequence('abcdefg');
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(1);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Invalid first character.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(1);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(1);

        parserInput = new ParserInput('', 0);
        expression = new ExpressionSequence();
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(-1);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('End of input.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('TEXT', 0);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Expressions not set.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('TEXT', 0);
        let literalExpression = new LiteralExpression('TEXT');
        expression = new ExpressionSequence(literalExpression, literalExpression);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(4);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual('TEXT');
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('End of input.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(4);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(4);
        expect(result.children.length).toEqual(2);
        expect(result.children[0].data).toEqual('TEXT');
        expect(result.children[1].data).toEqual(null);
        expect(result.children[1].error.expression).toEqual(literalExpression);

        parserInput = new ParserInput('TE?T', 0);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(3);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual('TE?');
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Does not match.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(3);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(3);
        expect(result.children.length).toEqual(1);
        expect(result.children[0].data).toEqual('TE?');
        expect(result.children[0].error.expression).toEqual(literalExpression);

        parserInput = new ParserInput('', 0);
        expression = new AlternativeExpression();
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(-1);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('End of input.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('JUNK', 0);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Expressions not set.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        let literalExpression2 = new LiteralExpression('YADAYADA');
        expression = new AlternativeExpression( literalExpression, literalExpression2 );
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(1);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('No expressions matched.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(1);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(1);
        expect(result.children.length).toEqual(2);
        expect(result.children[0].data).toEqual('J');
        expect(result.children[0].error.expression).toEqual(literalExpression);
        expect(result.children[1].data).toEqual('J');
        expect(result.children[1].error.expression).toEqual(literalExpression2);

        parserInput = new ParserInput('', 0);
        expression = new RepeatingExpression();
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(-1);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('End of input.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('TEXTTEXTTEXT', 0);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Expression not set.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        expression = new RepeatingExpression(literalExpression, 5, 10);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(12);
        expect(result.count).toEqual(12);
        expect(result.data).toEqual('TEXTTEXTTEXT');
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Did not match enough times.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(12);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(12);
        expect(result.children.length).toEqual(4);
        expect(result.children[0].data).toEqual('TEXT');
        expect(result.children[1].data).toEqual('TEXT');
        expect(result.children[2].data).toEqual('TEXT');
        expect(result.children[3].data).toEqual(null);
        expect(result.children[3].error.expression).toEqual(literalExpression);

        parserInput = new ParserInput('', 0);
        expression = new UntilExpression();
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(-1);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('End of input.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('TEXT', 0);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Expression not set.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        expression = new UntilExpression(literalExpression);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Does not match.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('', 0);
        expression = new NestedExpression();
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(-1);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('End of input.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        parserInput = new ParserInput('TEXT', 0);
        result = expression.parse(parserInput);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Expressions not set.');
        expect(result.error.expression).toEqual(expression);
        expect(result.error.loc).toEqual(0);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(0);

        let expression1 = new LiteralExpression('big');
        let expression2 = new LiteralExpression('small');
        let marked_character_sequence = new MarkedExpression(new CharacterSequence('xyz'));
        let expression_sequence1 = new ExpressionSequence(expression1, marked_character_sequence);
        let expression_sequence2 = new ExpressionSequence(expression2, marked_character_sequence);
        let nested_expression = new NestedExpression( expression_sequence1, expression_sequence2 );
        result = nested_expression.parse(new ParserInput('bigxxbigyybigzzsmallzzsmallyysmallxx', 0));
        expect(result.loc).toEqual(36);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual('bigxxbigyybigzzsmallzzsmallyysmallxx');
        expect(result.matched).toEqual(false);
        expect(result.error.error).toEqual('Marked expressions do not match.');
        expect(result.error.expression).toEqual(nested_expression);
        expect(result.error.loc).toEqual(36);
        expect(result.error.line).toEqual(0);
        expect(result.error.linePosition).toEqual(41);
    });
});
