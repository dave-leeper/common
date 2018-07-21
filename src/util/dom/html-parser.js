import { AlternativeExpression, StringExpression, LiteralExpression } from '../parser/parser'
import { CharacterSequence, ExpressionSequence, RepeatingExpression } from '../parser/parser'
import { UntilExpression, MarkedExpression, NestedExpression } from '../parser/parser'

const WS = CharacterSequence.WHITESPACE;
const OWS = RepeatingExpression.OPTIONAL_WHITESPACE;
export const COMMENT_BEGIN = new LiteralExpression('<!--');
export const COMMENT_END = new LiteralExpression('-->');
export const COMMENT_TEXT = new UntilExpression( COMMENT_END );
export const COMMENT = new ExpressionSequence( COMMENT_BEGIN, COMMENT_TEXT, COMMENT_END );
export const OPTIONAL_COMMENTS = new RepeatingExpression( COMMENT, 0, RepeatingExpression.MAXIMUM_ALLOWED_INFINITE );
export const OPEN_ELEMENT_BEGIN = new LiteralExpression('<');
export const OPEN_ELEMENT_END = new LiteralExpression('</');
export const CLOSE_ELEMENT = new LiteralExpression('>');
export const CLOSE_ELEMENT_ONE_PART = new AlternativeExpression(new LiteralExpression('/>'), CLOSE_ELEMENT );
export const DOCTYPE_START = new LiteralExpression('<!DOCTYPE', { case: LiteralExpression.IGNORE });
export const DOCTYPE_TEXT = new UntilExpression( CLOSE_ELEMENT );
export const DOCTYPE = new ExpressionSequence( DOCTYPE_START, WS, DOCTYPE_TEXT, CLOSE_ELEMENT );
export const STRING = new AlternativeExpression( new StringExpression( ), new StringExpression( "'" ));
export const STRING_ASSIGNMENT = new ExpressionSequence(  OWS, new LiteralExpression('='), OWS, STRING, OWS );
export const OPTIONAL_STRING_ASSIGNMENT = new RepeatingExpression( STRING_ASSIGNMENT, 0, 1 );
// http://www.w3.org/TR/2000/REC-xml-20001006#NT-Name
export const ATTRIBUTE_NAME_FIRST_CHARS = '_:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ATTRIBUTE_NAME_REMAINING_CHARS = '_:.-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const ATTRIBUTE_NAME = new CharacterSequence( ATTRIBUTE_NAME_FIRST_CHARS, ATTRIBUTE_NAME_REMAINING_CHARS );
export const ATTRIBUTE = new ExpressionSequence( ATTRIBUTE_NAME, OPTIONAL_STRING_ASSIGNMENT, OWS );
export const OPTIONAL_ATTRIBUTE_LIST = new RepeatingExpression( ATTRIBUTE, 0, RepeatingExpression.MAXIMUM_ALLOWED_INFINITE );
export const SCRIPT_NAME = new LiteralExpression('SCRIPT', { case: LiteralExpression.IGNORE });
export const SCRIPT_START = new ExpressionSequence( OPEN_ELEMENT_BEGIN, OWS, SCRIPT_NAME, OWS, OPTIONAL_ATTRIBUTE_LIST, CLOSE_ELEMENT );
export const SCRIPT_END = new ExpressionSequence( OPEN_ELEMENT_END, OWS, SCRIPT_NAME, OWS, CLOSE_ELEMENT );
export const SCRIPT_TEXT = new UntilExpression( SCRIPT_END );
export const SCRIPT = new ExpressionSequence( SCRIPT_START, SCRIPT_TEXT, SCRIPT_END );
export const STYLE_NAME = new LiteralExpression('STYLE', { case: LiteralExpression.IGNORE });
export const STYLE_START = new ExpressionSequence( OPEN_ELEMENT_BEGIN, OWS, STYLE_NAME, OWS, OPTIONAL_ATTRIBUTE_LIST, CLOSE_ELEMENT );
export const STYLE_END = new ExpressionSequence( OPEN_ELEMENT_END, OWS, STYLE_NAME, OWS, CLOSE_ELEMENT );
export const STYLE_TEXT = new UntilExpression( STYLE_END );
export const STYLE = new ExpressionSequence( STYLE_START, STYLE_TEXT, STYLE_END );
export const ELEMENT_NAME_FIRST_CHARS = '_:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ELEMENT_NAME_REMAINING_CHARS = '_:.-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const ELEMENT_NAME = new CharacterSequence( ELEMENT_NAME_FIRST_CHARS, ELEMENT_NAME_REMAINING_CHARS );
export const MARKED_ELEMENT_NAME = new MarkedExpression( ELEMENT_NAME );
export const ELEMENT_ONE_PART = new ExpressionSequence( OPEN_ELEMENT_BEGIN, OWS, ELEMENT_NAME, OWS, OPTIONAL_ATTRIBUTE_LIST, CLOSE_ELEMENT_ONE_PART );
export const ELEMENT_TWO_PART_BEGIN = new ExpressionSequence( OPEN_ELEMENT_BEGIN, OWS, MARKED_ELEMENT_NAME, OWS, OPTIONAL_ATTRIBUTE_LIST, CLOSE_ELEMENT );
export const ELEMENT_TWO_PART_END = new ExpressionSequence( OPEN_ELEMENT_END, OWS, MARKED_ELEMENT_NAME, OWS, CLOSE_ELEMENT );
export const TEXT_NODE = new UntilExpression( OPEN_ELEMENT_BEGIN );
export const OPTIONAL_TEXT_NODE = new RepeatingExpression( TEXT_NODE, 0, 1 );
export const ELEMENT_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE = new ExpressionSequence( ELEMENT_TWO_PART_BEGIN, OPTIONAL_COMMENTS, OPTIONAL_TEXT_NODE, OPTIONAL_COMMENTS );
export const ELEMENT_TWO_PART_END_OPTIONAL_TEXT_NODE = new ExpressionSequence( OPTIONAL_COMMENTS, OPTIONAL_TEXT_NODE, OPTIONAL_COMMENTS, ELEMENT_TWO_PART_END );
export const ELEMENT_TWO_PART = new NestedExpression( ELEMENT_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE, ELEMENT_TWO_PART_END_OPTIONAL_TEXT_NODE, { reverse: true } );
export const ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE = new NestedExpression( ELEMENT_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE, ELEMENT_TWO_PART_END_OPTIONAL_TEXT_NODE, { reverse: true, middle: ELEMENT_ONE_PART });
export const SIMPLE_ELEMENT = new AlternativeExpression( ELEMENT_ONE_PART, ELEMENT_TWO_PART, ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE, OPTIONAL_COMMENTS, SCRIPT, STYLE );
export const SIMPLE_ELEMENT_LIST = new RepeatingExpression( SIMPLE_ELEMENT, 1, RepeatingExpression.MAXIMUM_ALLOWED_INFINITE );
export const ELEMENT = new ExpressionSequence( ELEMENT_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE, SIMPLE_ELEMENT_LIST, ELEMENT_TWO_PART_END_OPTIONAL_TEXT_NODE );
export const TAG = new AlternativeExpression( SIMPLE_ELEMENT, ELEMENT, DOCTYPE );
export const HTML = new RepeatingExpression( TAG, 1, RepeatingExpression.MAXIMUM_ALLOWED_INFINITE );

export default class HTMLParser {

}
