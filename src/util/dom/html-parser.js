import { ParserInput, ParserResult, ParserError } from './parser'
import { AlternativeExpression, StringExpression, LiteralExpression } from './parser'
import { CharacterSequence, ExpressionSequence, RepeatingExpression } from './parser'
import { UntilExpression, MarkedExpression, NestedExpression } from './parser'

const WS = CharacterSequence.WHITESPACE;
const OWS = RepeatingExpression.OPTIONAL_WHITESPACE;
export const COMMENT_BEGIN = new LiteralExpression('<!--');
export const COMMENT_END = new LiteralExpression('-->');
export const COMMENT_TEXT = new UntilExpression( COMMENT_END );
export const COMMENT = new ExpressionSequence( COMMENT_BEGIN, COMMENT_TEXT, COMMENT_END );
export const OPTIONAL_COMMENTS = new RepeatingExpression( COMMENT, 0, RepeatingExpression.MAXIMUM_ALLOWED_INFINITE );
export const STRING = new AlternativeExpression( new StringExpression( ), new StringExpression( "'" ));
export const STRING_ASSIGNMENT = new ExpressionSequence(  OWS, LiteralExpression('='), OWS, STRING, OWS );
export const OPTIONAL_STRING_ASSIGNMENT = new RepeatingExpression( STRING_ASSIGNMENT, 0, 1 );
export const ATTRIBUTE_NAME_FIRST_CHARS = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ATTRIBUTE_NAME_REMAINING_CHARS = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const ATTRIBUTE_NAME = new CharacterSequence( ATTRIBUTE_NAME_FIRST_CHARS, ATTRIBUTE_NAME_REMAINING_CHARS );
export const ATTRIBUTE = new ExpressionSequence( ATTRIBUTE_NAME, OPTIONAL_STRING_ASSIGNMENT, OWS );
export const OPTIONAL_ATTRIBUTE_LIST = new RepeatingExpression( ATTRIBUTE, 0, RepeatingExpression.MAXIMUM_ALLOWED_INFINITE );
export const TAG_NAME_FIRST_CHARS = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const TAG_NAME_REMAINING_CHARS = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const TAG_NAME = new CharacterSequence( TAG_NAME_FIRST_CHARS, TAG_NAME_REMAINING_CHARS );
export const MARKED_TAG_NAME = new MarkedExpression( TAG_NAME );
export const OPEN_TAG_BEGIN = new LiteralExpression('<');
export const OPEN_TAG_END = new LiteralExpression('</');
export const CLOSE_TAG = new LiteralExpression('>');
export const CLOSE_TAG_ONE_PART = new LiteralExpression('/>');
export const TAG_ONE_PART = new ExpressionSequence( OPEN_TAG_BEGIN, OWS, TAG_NAME, WS, OPTIONAL_ATTRIBUTE_LIST, CLOSE_TAG_ONE_PART );
export const TAG_TWO_PART_BEGIN = new ExpressionSequence( OPEN_TAG_BEGIN, OWS, MARKED_TAG_NAME, OPTIONAL_ATTRIBUTE_LIST, CLOSE_TAG );
export const TAG_TWO_PART_END = new ExpressionSequence( OPEN_TAG_END, OWS, MARKED_TAG_NAME, OWS, CLOSE_TAG );
export const TEXT_NODE = new UntilExpression( OPEN_TAG_BEGIN );
export const OPTIONAL_TEXT_NODE = new RepeatingExpression( TEXT_NODE, 0, 1 );
export const TAG_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE = new ExpressionSequence( TAG_TWO_PART_BEGIN, OPTIONAL_COMMENTS, OPTIONAL_TEXT_NODE, OPTIONAL_COMMENTS );
export const TAG_TWO_PART_END_OPTIONAL_TEXT_NODE = new ExpressionSequence( OPTIONAL_COMMENTS, OPTIONAL_TEXT_NODE, OPTIONAL_COMMENTS, TAG_TWO_PART_END );
export const TAG_TWO_PART = new NestedExpression( TAG_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE, TAG_TWO_PART_END_OPTIONAL_TEXT_NODE );
export const TAG = new AlternativeExpression( TAG_ONE_PART, TAG_TWO_PART );
export const HTML_TAGS = new AlternativeExpression( COMMENT, TAG );
export const HTML = new RepeatingExpression( HTML_TAGS, 1, RepeatingExpression.MAXIMUM_ALLOWED_INFINITE );

export default class HTMLParser {

}
