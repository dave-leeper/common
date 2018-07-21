const ERROR_END = 'End of input.';
const ERROR_EXPRESSION_NOT_SET = 'Expression not set.';
const ERROR_EXPRESSIONS_NOT_SET = 'Expressions not set.';
const ERROR_DOES_NOT_MATCH = 'Does not match.';
const ERROR_STRING_EXPRESSION_NO_OPENING_QUOTE = 'No opening quote.';
const ERROR_STRING_EXPRESSION_NO_CLOSING_QUOTE = 'No closing quote.';
const ERROR_STRING_EXPRESSION_INVALID_ESCAPE_SEQUENCE = 'Invalid escape sequence.';
const ERROR_LITERAL_EXPRESSION_NOT_SET = 'Literal not set.';
const ERROR_CHARACTER_SEQUENCE_EXPRESSION_FIRST_CHARACTER_SEQUENCE_NOT_SET = 'First character sequence not set.';
const ERROR_CHARACTER_SEQUENCE_EXPRESSION_REMAINING_CHARACTER_SEQUENCE_NOT_SET = 'Remaining character sequence not set.';
const ERROR_CHARACTER_SEQUENCE_EXPRESSION_INVALID_FIRST_CHARACTER = 'Invalid first character.';
const ERROR_ALTERNATIVE_EXPRESSION_NO_EXPRESSIONS_MATCHED = 'No expressions matched.';
const ERROR_REPEATING_EXPRESSION_DID_NOT_MATCH_ENOUGH_TIMES = 'Did not match enough times.';
const ERROR_NESTED_EXPRESSION_MARKED_EXPRESSIONS_DO_NOT_MATCH = 'Marked expressions do not match.';

export class ParserError {
    constructor(error, parserInput, expression) {
        this.error = error;
        this.loc = parserInput.loc;
        this.line = parserInput.line;
        this.linePosition = parserInput.linePosition;
        this.expression = expression;
    }
}

export class ParserInput {
    constructor(str, loc) {
        this.str = str;
        this.loc = loc;
        this.prevChar = null;
        this.line = 0;
        this.linePosition = 0;
        this.marked = loc;
        this.markedLine = 0;
        this.markedLinePosition = 0;
    }
    mark() {
        this.marked = this.loc;
        this.markedLine = this.line;
        this.markedLinePosition = this.linePosition;
    }
    revisit() {
        this.loc = this.marked;
        this.line = this.markedLine;
        this.linePosition = this.markedLinePosition;
    }
    get() {
        if (this.end()) return -1;
        let c = this.str[this.loc];
        this.loc++;
        this.linePosition++;
        if (this.isNewLine(c)) {
            this.line++;
            this.linePosition = 0;
        }
        this.prevChar = c;
        return c;
    }
    end() { return !((this.str) && (this.str.length > this.loc)); }
    isNewLine(c) {
        if ('\r' === c) return true;
        return (('\n' === c) && ('\r' !== this.prevChar));
    }
    getError(error, expression) { return new ParserError(error, this, expression); }
}

export class ParserResult {
    constructor(expression, loc, count, data, matched, error, children) {
        this.expression = expression;
        this.loc = loc || 0;
        this.count = count || 0;
        this.data = data || null;
        this.matched = matched || false;
        this.error = error || undefined;
        this.children = children || undefined;
    }
}

export class StringExpression {
    static EXPRESSION_NAME = 'StringExpression';
    constructor(quote, escape) { this.reset(quote, escape); }
    reset(quote, escape) {
        this.quoteCharacter = quote || '"';
        this.escapeCharacter = escape || '\\';
    }
    expressionName(){ return StringExpression.EXPRESSION_NAME; }
    parse(input) {
        if (input.end()) return new ParserResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        let str = '';
        let count = 0;
        let char = input.get();
        let matched = false;
        if (this.quoteCharacter !== char) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_STRING_EXPRESSION_NO_OPENING_QUOTE, this));

        while (!input.end()) {
            char = input.get();
            if (this.quoteCharacter === char) {
                matched = true;
                break;
            }
            if (this.escapeCharacter === char) {
                char = input.get();
                if (-1 === char) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_STRING_EXPRESSION_INVALID_ESCAPE_SEQUENCE, this));
            }
            str += char;
            count++;
        }
        if (false === matched) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_STRING_EXPRESSION_NO_CLOSING_QUOTE, this));
        return new ParserResult(this, input.loc, count, str, true);
    }
}

export class LiteralExpression {
    static EXPRESSION_NAME = 'LiteralExpression';
    constructor(literal) { this.reset(literal); }
    reset(literal) { this.literal = literal; }
    expressionName(){ return LiteralExpression.EXPRESSION_NAME; }
    parse(input) {
        if (input.end()) return new ParserResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if ((!this.literal) || (0 === this.literal.length)) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_LITERAL_EXPRESSION_NOT_SET, this));
        let str = '';
        let char;
        let count = 0;
        let matched = false;

        while (!input.end()) {
            char = input.get();
            str += char;
            if (char !== this.literal[count]) return new ParserResult(this, input.loc, 0, str, false, input.getError(ERROR_DOES_NOT_MATCH, this));
            count++;
            if (count === this.literal.length) {
                matched = true;
                break;
            }
        }
        if (!matched) return new ParserResult(this, input.loc, 0, str, false, input.getError(ERROR_DOES_NOT_MATCH, this));
        return new ParserResult(this, input.loc, count, str, true);
    }
}

/**
 * CharacterSequence
 * A character sequence is a collection of characters that can appear in a sequence. The first
 * character has its own sequence distinct from the rest of the characters in the sequence.
 * If the second sequence is not provided, it defaults to being identical to the first.
 */
export class CharacterSequence {
    static EXPRESSION_NAME = 'CharacterSequence';
    static WHITESPACE = new CharacterSequence(' \t\n\r');
    static NUMBER = new CharacterSequence('123456789');
    static LETTER = new CharacterSequence('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    static LOWER_CASE_LETTER = new CharacterSequence('abcdefghijklmnopqrstuvwxyz');
    static UPPER_CASE_LETTER = new CharacterSequence('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    static ALPHANUMERIC = new CharacterSequence('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    constructor(validFirstCharacters, validRemainingCharacters) { this.reset(validFirstCharacters, validRemainingCharacters); }
    reset(validFirstCharacters, validRemainingCharacters) {
        this.validFirstCharacters = validFirstCharacters;
        this.validRemainingCharacters = validRemainingCharacters? validRemainingCharacters : validFirstCharacters ;
    }
    expressionName(){ return CharacterSequence.EXPRESSION_NAME; }
    parse(input) {
        if (input.end()) return new ParserResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if ((!this.validFirstCharacters) || (0 === this.validFirstCharacters.length)) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_CHARACTER_SEQUENCE_EXPRESSION_FIRST_CHARACTER_SEQUENCE_NOT_SET, this));
        if ((!this.validRemainingCharacters) || (0 === this.validRemainingCharacters.length)) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_CHARACTER_SEQUENCE_EXPRESSION_REMAINING_CHARACTER_SEQUENCE_NOT_SET, this));
        let str = '';
        let char = input.get();
        let count = 0;
        if (-1 === this.validFirstCharacters.indexOf(char)) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_CHARACTER_SEQUENCE_EXPRESSION_INVALID_FIRST_CHARACTER, this));
        str += char;
        count++;

        while (!input.end()) {
            char = input.get();
            if (-1 === char) break;
            if (-1 === this.validRemainingCharacters.indexOf(char)) {
                input.loc = input.loc - 1;
                break;
            }
            str += char;
            count++;
        }
        return new ParserResult(this, input.loc, count, str, true);
    }
}

/**
 * ExpressionSequence
 * An expression sequence is a sequence of expressions that must appear one after the other.
 */
export class ExpressionSequence {
    static EXPRESSION_NAME = 'ExpressionSequence';
    constructor(...theArgs) { this.reset(...theArgs); }
    reset(...theArgs) {
        this.expressions = [];
        this.add(...theArgs);
    }
    expressionName(){ return ExpressionSequence.EXPRESSION_NAME; }
    add(...theArgs) { this.expressions = this.expressions.concat(theArgs); }
    remove() { this.expressions = this.expressions.filter(( item ) => { return 0 > arguments.indexOf( item ); }); }
    parse(input) {
        if (input.end()) return new ParserResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if ((!this.expressions) || (0 === this.expressions.length)) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_EXPRESSIONS_NOT_SET, this));
        let loc = input.loc;
        let line = input.line;
        let linePosition = input.linePosition;
        let str = '';
        let count = 0;
        let totalCount = 0;
        let children = [];
        let matchedChildren = [];

        for (let loop = 0; loop < this.expressions.length; loop++) {
            let expression = this.expressions[loop];
            let result = expression.parse(input);
            children.push(result);
            count = result.count;
            if (result.data) str += result.data;
            if (-1 === count) {
                let parserResult = new ParserResult(this, input.loc, 0, str, false, input.getError(ERROR_END, this), children);
                input.loc = loc;
                input.line = line;
                input.linePosition = linePosition;
                return parserResult;
            }
            if ((0 === count) && (false === result.matched)) {
                let parserResult = new ParserResult(this, input.loc, 0, str, false, input.getError(ERROR_DOES_NOT_MATCH, this), children);
                input.loc = loc;
                input.line = line;
                input.linePosition = linePosition;
                return parserResult;
            }
            totalCount += count;
            matchedChildren.push(result);
        }
        return new ParserResult(this, input.loc, totalCount, str, true, null, matchedChildren);
    }
}

/**
 * AlternativeExpression
 * An alternative expression is a collections of expressions where the longest match is selected.
 */
export class AlternativeExpression {
    static EXPRESSION_NAME = 'AlternativeExpression';
    constructor(...theArgs) { this.reset(...theArgs); }
    reset(...theArgs) {
        this.expressions = [];
        this.add(...theArgs);
    }
    expressionName(){ return AlternativeExpression.EXPRESSION_NAME; }
    add(...theArgs) { this.expressions = this.expressions.concat(theArgs); }
    remove() { this.expressions = this.expressions.filter(( item ) => { return 0 > arguments.indexOf( item ); }); }
    parse(input) {
        if (input.end()) return new ParserResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if ((!this.expressions) || (0 === this.expressions.length)) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_EXPRESSIONS_NOT_SET, this));
        let loc = input.loc;
        let line = input.line;
        let linePosition = input.linePosition;
        let endLoc = input.loc;
        let endLine = input.line;
        let endLinePosition = input.linePosition;
        let count = 0;
        let str;
        let matched = false;
        let children = [];
        let matchedChildren = [];

        for (let loop = 0; loop < this.expressions.length; loop++) {
            let expression = this.expressions[loop];
            input.loc = loc;
            input.line = line;
            input.linePosition = linePosition;
            let result = expression.parse(input);
            children.push(result);
            if (!result.matched) continue;
            if (result.count < count) continue;
            count = result.count;
            endLoc = input.loc;
            endLine = input.line;
            endLinePosition = input.linePosition;
            str = result.data;
            matched = true
            matchedChildren = [ result ];
        }
        if (!matched) {
            let error = new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_ALTERNATIVE_EXPRESSION_NO_EXPRESSIONS_MATCHED, this), children);
            input.loc = loc;
            input.line = line;
            input.linePosition = linePosition;
            return error;
        }
        input.loc = endLoc;
        input.line = endLine;
        input.linePosition = endLinePosition;
        return new ParserResult(this, input.loc, count, str, matched, null, matchedChildren);
    }
}

/**
 * RepeatingExpression
 * A repeating expression appears 0 or more times.
 */
export class RepeatingExpression {
    static EXPRESSION_NAME = 'RepeatingExpression';
    static MAXIMUM_ALLOWED_INFINITE = -1;
    static OPTIONAL_WHITESPACE = new RepeatingExpression(CharacterSequence.WHITESPACE, 0, 1);

    constructor(expression, minimumRequired, maximumAllowed) { this.reset(expression, minimumRequired, maximumAllowed); }
    reset(expression, minimumRequired, maximumAllowed) {
        this.expression = expression;
        this.minimumRequired = minimumRequired;
        this.maximumAllowed = maximumAllowed;
        if ((!minimumRequired) && (0 !== minimumRequired)) this.minimumRequired = 0;
        if (!maximumAllowed) this.maximumAllowed = RepeatingExpression.MAXIMUM_ALLOWED_INFINITE;
    }
    expressionName(){ return RepeatingExpression.EXPRESSION_NAME; }
    parse(input) {
        if (input.end()) return new ParserResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if (!this.expression) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_EXPRESSION_NOT_SET, this));
        let str = '';
        let totalCount = 0;
        let matchCount = 0;
        let loc = input.loc;
        let line = input.line;
        let linePosition = input.linePosition;
        let matched = false;
        let matches = [];
        let children = [];
        let matchedChildren = [];

        while (true) {
            let markerLoc = input.loc;
            let markerLine = input.line;
            let markerLinePosition = input.linePosition;
            let result = this.expression.parse(input)
            children.push(result);
            if ((0 >= result.count) || (!result.matched)) {
                input.loc = markerLoc;
                input.line = markerLine;
                input.linePosition = markerLinePosition;
                break;
            }
            matchCount++;
            totalCount += result.count;
            str += result.data;
            matches.push(result.data);
            matchedChildren.push(result);
            if ((RepeatingExpression.MAXIMUM_ALLOWED_INFINITE !== this.maximumAllowed) && (matchCount >= this.maximumAllowed)) break;
        }
        if (matchCount >= this.minimumRequired) {
            matched = true;
        } else {
            let error = new ParserResult(this, input.loc, totalCount, str, false, input.getError(ERROR_REPEATING_EXPRESSION_DID_NOT_MATCH_ENOUGH_TIMES, this), children);
            input.loc = loc;
            input.line = line;
            input.linePosition = linePosition;
            return error;
        }
        return new ParserResult(this, input.loc, totalCount, str, matched, null, matchedChildren);
    }
}

/**
 * UntilExpression
 * Consumes characters until a given expression is found.
 */
export class UntilExpression {
    static EXPRESSION_NAME = 'UntilExpression';
    constructor(expression) { this.reset(expression); }
    reset(expression) { this.expression = expression; }
    expressionName(){ return UntilExpression.EXPRESSION_NAME; }
    parse(input) {
        if (input.end()) return new ParserResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if (!this.expression) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_EXPRESSION_NOT_SET, this));
        let str = '';
        let matched = false;
        let children = [];
        let loc = input.loc;
        let line = input.line;
        let linePosition = input.linePosition;

        while (!input.end()) {
            let markerLoc = input.loc;
            let markerLine = input.line;
            let markerLinePosition = input.linePosition;
            let result = this.expression.parse(input);
            input.loc = markerLoc;
            input.line = markerLine;
            input.linePosition = markerLinePosition;
            if (result.matched) {
                children.push(result);
                break;
            }
            str += input.get();
        }
        if (0 < str.length) {
            matched = true;
        } else {
            let error = new ParserResult(this, input.loc, 0, str, false, input.getError(ERROR_DOES_NOT_MATCH, this), children);
            input.loc = loc;
            input.line = line;
            input.linePosition = linePosition;
            return error;
        }
        return new ParserResult(this, input.loc, str.length, str, matched, null, children);
    }
}

/**
 * MarkedExpression
 * Marked expression acts as a signal to NestedExpression that the data values of a nested pair
 * of expressions should match.
 */
export class MarkedExpression {
    static EXPRESSION_NAME = 'MarkedExpression';
    constructor(expression) { this.reset(expression); }
    reset(expression) { this.expression = expression; }
    expressionName(){ return MarkedExpression.EXPRESSION_NAME; }
    parse(input) {
        if (!this.expression) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_EXPRESSION_NOT_SET, this));
        let result = this.expression.parse(input);
        return {...result, expression: this, children: [ result ]};
    }
}

/**
 * NestedExpression
 * An expression built from two child expressions. The first expression can repeat n number of times. After this,
 * the second expression MUST repeat n number of times. If the first expression is a MarkedExpression or has
 * children that are MarkedExpressions, the second expression must have matching MarkedExpressions and their run time
 * data values must match.
 *
 * Originally used for HTML tags, which can have HTML tags nested inside them. The tag names are marked.
 */
export class NestedExpression {
    static EXPRESSION_NAME = 'NestedExpression';
    constructor(expression1, expression2) { this.reset(expression1, expression2); }
    reset(expression1, expression2) {
        this.expression1 = expression1;
        this.expression2 = expression2;
    }
    expressionName(){ return NestedExpression.EXPRESSION_NAME; }
    parse(input) {
        if (input.end()) return new ParserResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if ((!this.expression1) || (!this.expression2)) return new ParserResult(this, input.loc, 0, null, false, input.getError(ERROR_EXPRESSIONS_NOT_SET, this));
        let loc = input.loc;
        let line = input.line;
        let linePosition = input.linePosition;
        let firstExpression = new RepeatingExpression( this.expression1, 0, RepeatingExpression.MAXIMUM_ALLOWED_INFINITE );
        let firstResult = firstExpression.parse(input);
        if (!firstResult.matched) return {...firstResult, expression: this, children: [ result ]};
        let firstMatchCount = firstResult.children.length;
        let secondExpression = new RepeatingExpression( this.expression2, firstMatchCount, firstMatchCount );
        let secondResult = secondExpression.parse(input);
        let children = [].concat(firstResult.children).concat(secondResult.children);
        let data = firstResult.data + secondResult.data;
        if (!secondResult.matched) return {...secondResult, expression: this, data: data, children: children };

        let markedExpressionsMatch = this.doMarkedExpressionsMatch( firstResult, secondResult );
        if (!markedExpressionsMatch) {
            let error = new ParserResult(this, input.loc, 0, data, false, input.getError(ERROR_NESTED_EXPRESSION_MARKED_EXPRESSIONS_DO_NOT_MATCH, this), children);
            input.loc = loc;
            input.line = line;
            input.linePosition = linePosition;
            return error;
        }
        return {...secondResult, expression: this, data: data, children: children };
    }
    doMarkedExpressionsMatch(parserResult1, parserResult2) {
        if (!parserResult1 || !parserResult1.expression) return false;
        if (!parserResult2 || !parserResult2.expression) return false;
        if (parserResult1.expression.expressionName() === MarkedExpression.EXPRESSION_NAME) {
            if (parserResult2.expression.expressionName() !== MarkedExpression.EXPRESSION_NAME) return false;
            if (parserResult1.data !== parserResult2.data) return false;
        }
        if (!parserResult1.children) return !parserResult2.children;
        for (let loop = 0; loop < parserResult1.children.length; loop++) {
            if (loop >= parserResult2.children.length) return false;
            let child1 = parserResult1.children[loop];
            let child2 = parserResult2.children[loop];
            let matches = this.doMarkedExpressionsMatch(child1, child2);
            if (!matches) return false;
        }
        return true;
    }
}
