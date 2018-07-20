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

export class ParseResult {
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

export class Expression {
    constructor() { this.reset(); }
    reset() {}
    clone(){ return {...this}; }
    /**
     * Parses the expression from a string.
     * @param input {ParserInput}: The string and current index used to parse.
     * @return {ParseResult} Returns the ParseResult.
     */
    parse(input) { return new ParseResult(this, 0, 0, null, false); }
}

export class StringExpression extends Expression {
    constructor() { super(); this.reset(); }
    reset() {
        super.reset();
        this.quoteCharacter = '"';
        this.escapeCharacter = '\\';
    }
    expressionName(){ return 'StringExpression'; }
    parse(input) {
        if (input.end()) return new ParseResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        super.reset();
        let str = '';
        let count = 0;
        let char = input.get();
        let matched = false;
        if (this.quoteCharacter !== char) return new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_STRING_EXPRESSION_NO_OPENING_QUOTE, this));

        while (!input.end()) {
            char = input.get();
            if (this.quoteCharacter === char) {
                matched = true;
                break;
            }
            if (this.escapeCharacter === char) {
                char = input.get();
                if (-1 === char) return new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_STRING_EXPRESSION_INVALID_ESCAPE_SEQUENCE, this));
            }
            str += char;
            count++;
        }
        if (false === matched) return new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_STRING_EXPRESSION_NO_CLOSING_QUOTE, this));
        return new ParseResult(this, input.loc, count, str, true);
    }
}

export class LiteralExpression extends Expression {
    constructor(literal) { super(); this.reset(literal); }
    reset(literal) {
        super.reset();
        this.literal = literal;
    }
    expressionName(){ return 'LiteralExpression'; }
    parse(input) {
        if (input.end()) return new ParseResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if ((!this.literal) || (0 === this.literal.length)) return new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_LITERAL_EXPRESSION_NOT_SET, this));
        super.reset();
        let str = '';
        let char;
        let count = 0;
        let matched = false;

        while (!input.end()) {
            char = input.get();
            str += char;
            if (char !== this.literal[count]) return new ParseResult(this, input.loc, 0, str, false, input.getError(ERROR_DOES_NOT_MATCH, this));
            count++;
            if (count === this.literal.length) {
                matched = true;
                break;
            }
        }
        if (!matched) return new ParseResult(this, input.loc, 0, str, false, input.getError(ERROR_DOES_NOT_MATCH, this));
        return new ParseResult(this, input.loc, count, str, true);
    }
}

/**
 * CharacterSequence
 * A character sequence is a collection of characters that can appear in a sequence. The first
 * character has its own sequence distinct from the rest of the characters in the sequence.
 * If the second sequence is not provided, it defaults to being identical to the first.
 */
export class CharacterSequence extends Expression {
    static WHITESPACE = new CharacterSequence(' \t\n\r');
    static NUMBER = new CharacterSequence('123456789');
    static LETTER = new CharacterSequence('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    static LOWER_CASE_LETTER = new CharacterSequence('abcdefghijklmnopqrstuvwxyz');
    static UPPER_CASE_LETTER = new CharacterSequence('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    static ALPHANUMERIC = new CharacterSequence('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    constructor(validFirstCharacters, validRemainingCharacters) {
        super();
        this.reset(validFirstCharacters, validRemainingCharacters);
    }
    reset(validFirstCharacters, validRemainingCharacters) {
        super.reset();
        this.validFirstCharacters = validFirstCharacters;
        this.validRemainingCharacters = validRemainingCharacters? validRemainingCharacters : validFirstCharacters ;
    }
    expressionName(){ return 'CharacterSequence'; }
    parse(input) {
        if (input.end()) return new ParseResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if ((!this.validFirstCharacters) || (0 === this.validFirstCharacters.length)) return new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_CHARACTER_SEQUENCE_EXPRESSION_FIRST_CHARACTER_SEQUENCE_NOT_SET, this));
        if ((!this.validRemainingCharacters) || (0 === this.validRemainingCharacters.length)) return new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_CHARACTER_SEQUENCE_EXPRESSION_REMAINING_CHARACTER_SEQUENCE_NOT_SET, this));
        super.reset();
        let str = '';
        let char = input.get();
        let count = 0;
        if (-1 === this.validFirstCharacters.indexOf(char)) return new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_CHARACTER_SEQUENCE_EXPRESSION_INVALID_FIRST_CHARACTER, this));
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
        return new ParseResult(this, input.loc, count, str, true);
    }
}

/**
 * ExpressionSequence
 * An expression sequence is a sequence of expressions that must appear one after the other.
 */
export class ExpressionSequence extends Expression
{
    constructor(...theArgs) {
        super();
        this.reset(...theArgs);
    }
    reset(...theArgs) {
        super.reset();
        this.expressions = [];
        this.add(...theArgs);
    }
    expressionName(){ return 'ExpressionSequence'; }
    add(...theArgs) {
        this.expressions = this.expressions.concat(theArgs);
    }
    remove() {
        this.expressions = this.expressions.filter(( item ) => {
            return 0 > arguments.indexOf( item );
        });
    }
    parse(input) {
        if (input.end()) return new ParseResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if ((!this.expressions) || (0 === this.expressions.length)) return new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_EXPRESSIONS_NOT_SET, this));
        super.reset();
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
                return new ParseResult(this, input.loc, 0, str, false, input.getError(ERROR_END, this), children);
                input.loc = loc;
                input.line = line;
                input.linePosition = linePosition;
            }
            if ((0 === count) && (false === result.matched)) {
                return new ParseResult(this, input.loc, 0, str, false, input.getError(ERROR_DOES_NOT_MATCH, this), children);
                input.loc = loc;
                input.line = line;
                input.linePosition = linePosition;
            }
            totalCount += count;
            matchedChildren.push(result);
        }
        return new ParseResult(this, input.loc, totalCount, str, true, null, matchedChildren);
    }
}

/**
 * AlternativeExpression
 * An alternative expression is a collections of expressions where the longest match is selected.
 */
export class AlternativeExpression extends Expression {
    constructor(...theArgs) {
        super();
        this.reset(...theArgs);
    }
    reset(...theArgs) {
        super.reset();
        this.expressions = [];
        this.add(...theArgs);
    }
    expressionName(){ return 'AlternativeExpression'; }
    add(...theArgs) {
        this.expressions = this.expressions.concat(theArgs);
    }
    remove() {
        this.expressions = this.expressions.filter(( item ) => {
            return 0 > arguments.indexOf( item );
        });
    }
    parse(input) {
        if (input.end()) return new ParseResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if ((!this.expressions) || (0 === this.expressions.length)) return new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_EXPRESSIONS_NOT_SET, this));
        super.reset();
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
            let error = new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_ALTERNATIVE_EXPRESSION_NO_EXPRESSIONS_MATCHED, this), children);
            input.loc = loc;
            input.line = line;
            input.linePosition = linePosition;
            return error;
        }
        input.loc = endLoc;
        input.line = endLine;
        input.linePosition = endLinePosition;
        return new ParseResult(this, input.loc, count, str, matched, null, matchedChildren);
    }
}

/**
 * RepeatingExpression
 * A repeating expression appears 0 or more times.
 */
export class RepeatingExpression extends Expression
{
    static MAXIMUM_ALLOWED_INFINITE = -1;
    static OPTIONAL_WHITESPACE = new RepeatingExpression(CharacterSequence.WHITESPACE, 0, 1);

    constructor(expression, minimumRequired, maximumAllowed) {
        super();
        this.reset(expression, minimumRequired, maximumAllowed);
    }
    reset(expression, minimumRequired, maximumAllowed) {
        super.reset();
        this.expression = expression;
        this.minimumRequired = minimumRequired;
        this.maximumAllowed = maximumAllowed;
        if ((!minimumRequired) && (0 !== minimumRequired)) this.minimumRequired = 0;
        if (!maximumAllowed) this.maximumAllowed = RepeatingExpression.MAXIMUM_ALLOWED_INFINITE;
    }
    expressionName(){ return 'RepeatingExpression'; }
    parse(input) {
        if (input.end()) return new ParseResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if (!this.expression) return new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_EXPRESSION_NOT_SET, this));
        super.reset();
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
            let error = new ParseResult(this, input.loc, totalCount, str, false, input.getError(ERROR_REPEATING_EXPRESSION_DID_NOT_MATCH_ENOUGH_TIMES, this), children);
            input.loc = loc;
            input.line = line;
            input.linePosition = linePosition;
            return error;
        }
        return new ParseResult(this, input.loc, totalCount, str, matched, null, matchedChildren);
    }
}

/**
 * UntilExpression
 * Consumes characters until a given expression is found.
 */
export class UntilExpression extends Expression
{
    constructor(expression) {
        super();
        this.reset(expression);
    }
    reset(expression) {
        super.reset();
        this.expression = expression;
    }
    expressionName(){ return 'UntilExpression'; }
    parse(input) {
        if (input.end()) return new ParseResult(this, input.loc, -1, null, false, input.getError(ERROR_END, this));
        if (!this.expression) return new ParseResult(this, input.loc, 0, null, false, input.getError(ERROR_EXPRESSION_NOT_SET, this));
        super.reset();
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
            let error = new ParseResult(this, input.loc, 0, str, false, input.getError(ERROR_DOES_NOT_MATCH, this), children);
            input.loc = loc;
            input.line = line;
            input.linePosition = linePosition;
            return error;
        }
        return new ParseResult(this, input.loc, str.length, str, matched, null, children);
    }
}
