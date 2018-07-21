import { ParserInput } from '../parser/parser'
import { COMMENT_BEGIN, COMMENT_END, COMMENT_TEXT, COMMENT, OPTIONAL_COMMENTS } from './html-parser'
import { STRING, STRING_ASSIGNMENT, OPTIONAL_STRING_ASSIGNMENT } from './html-parser'
import { ATTRIBUTE_NAME, ATTRIBUTE, OPTIONAL_ATTRIBUTE_LIST } from './html-parser'
import { ELEMENT_NAME, MARKED_ELEMENT_NAME, OPEN_ELEMENT_BEGIN, OPEN_ELEMENT_END, CLOSE_ELEMENT, CLOSE_ELEMENT_ONE_PART } from './html-parser'
import { ELEMENT_ONE_PART, TEXT_NODE, OPTIONAL_TEXT_NODE, ELEMENT_TWO_PART_BEGIN, ELEMENT_TWO_PART_END } from './html-parser'
import { ELEMENT_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE, ELEMENT_TWO_PART_END_OPTIONAL_TEXT_NODE } from './html-parser'
import { ELEMENT_TWO_PART, ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE, SIMPLE_ELEMENT, DOCTYPE_START, DOCTYPE_TEXT, DOCTYPE } from './html-parser'
import { SCRIPT_NAME, SCRIPT_START, SCRIPT_END, SCRIPT_TEXT, SCRIPT } from './html-parser'
import { STYLE_NAME, STYLE_START, STYLE_END, STYLE_TEXT, STYLE, TAG, HTML } from './html-parser'

describe( 'As a developer, I need to work with parsing tools', function() {
    beforeAll(() => {
        console.log('BEGIN HTML PARSER TEST ===========================================');
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    afterAll(() => {
    });
    it ( 'should recognise comments', (  ) => {
        let result = COMMENT_BEGIN.parse(new ParserInput('<!--', 0));
        expect(result.loc).toEqual(4);
        expect(result.count).toEqual(4);
        expect(result.data).toEqual('<!--');
        expect(result.matched).toEqual(true);

        result = COMMENT_END.parse(new ParserInput('-->', 0));
        expect(result.loc).toEqual(3);
        expect(result.count).toEqual(3);
        expect(result.data).toEqual('-->');
        expect(result.matched).toEqual(true);

        result = COMMENT_TEXT.parse(new ParserInput('Comment Text-->', 0));
        expect(result.loc).toEqual(12);
        expect(result.count).toEqual(12);
        expect(result.data).toEqual('Comment Text');
        expect(result.matched).toEqual(true);

        result = COMMENT.parse(new ParserInput('<!--Comment Text-->', 0));
        expect(result.loc).toEqual(19);
        expect(result.count).toEqual(19);
        expect(result.data).toEqual('<!--Comment Text-->');
        expect(result.matched).toEqual(true);

        result = OPTIONAL_COMMENTS.parse(new ParserInput('<!--Comment Text--><!--Comment Text-->', 0));
        expect(result.loc).toEqual(38);
        expect(result.count).toEqual(38);
        expect(result.data).toEqual('<!--Comment Text--><!--Comment Text-->');
        expect(result.matched).toEqual(true);

        result = OPTIONAL_COMMENTS.parse(new ParserInput('stuff', 0));
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(true);
    });
    it ( 'should recognise strings and string assignments', (  ) => {
        let result = STRING.parse(new ParserInput('"TEXT"', 0));
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(6);
        expect(result.data).toEqual('"TEXT"');
        expect(result.matched).toEqual(true);

        result = STRING.parse(new ParserInput("'TEXT'", 0));
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(6);
        expect(result.data).toEqual("'TEXT'");
        expect(result.matched).toEqual(true);

        result = STRING_ASSIGNMENT.parse(new ParserInput("='TEXT';", 0));
        expect(result.loc).toEqual(7);
        expect(result.count).toEqual(7);
        expect(result.data).toEqual("='TEXT'");
        expect(result.matched).toEqual(true);

        result = STRING_ASSIGNMENT.parse(new ParserInput(" = 'TEXT' ", 0));
        expect(result.loc).toEqual(10);
        expect(result.count).toEqual(10);
        expect(result.data).toEqual(" = 'TEXT' ");
        expect(result.matched).toEqual(true);

        result = OPTIONAL_STRING_ASSIGNMENT.parse(new ParserInput(" = 'TEXT' ", 0));
        expect(result.loc).toEqual(10);
        expect(result.count).toEqual(10);
        expect(result.data).toEqual(" = 'TEXT' ");
        expect(result.matched).toEqual(true);

        result = OPTIONAL_STRING_ASSIGNMENT.parse(new ParserInput("stuff", 0));
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(true);
    });
    it ( 'should recognise attributes', (  ) => {
        let result = ATTRIBUTE_NAME.parse(new ParserInput('_ATTR1', 0));
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(6);
        expect(result.data).toEqual('_ATTR1');
        expect(result.matched).toEqual(true);

        result = ATTRIBUTE.parse(new ParserInput('_ATTR1;', 0));
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(6);
        expect(result.data).toEqual('_ATTR1');
        expect(result.matched).toEqual(true);

        result = ATTRIBUTE.parse(new ParserInput('_ATTR1 = "TEXT" >', 0));
        expect(result.loc).toEqual(16);
        expect(result.count).toEqual(16);
        expect(result.data).toEqual('_ATTR1 = "TEXT" ');
        expect(result.matched).toEqual(true);

        let text = '_ATTR1 = "TEXT" _ATTR2 = "MOAR_TEXT">';
        result = OPTIONAL_ATTRIBUTE_LIST.parse(new ParserInput(text, 0));
        expect(result.loc).toEqual(36);
        expect(result.count).toEqual(36);
        expect(result.data).toEqual("_ATTR1 = \"TEXT\" _ATTR2 = \"MOAR_TEXT\"");
        expect(result.matched).toEqual(true);

        result = OPTIONAL_ATTRIBUTE_LIST.parse(new ParserInput('stuff', 0));
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(true);
    });
    it ( 'should recognise tag names and tag begin/end symbols', (  ) => {
        let result = ELEMENT_NAME.parse(new ParserInput('TAG1', 0));
        expect(result.loc).toEqual(4);
        expect(result.count).toEqual(4);
        expect(result.data).toEqual('TAG1');
        expect(result.matched).toEqual(true);

        result = MARKED_ELEMENT_NAME.parse(new ParserInput('TAG1', 0));
        expect(result.loc).toEqual(4);
        expect(result.count).toEqual(4);
        expect(result.data).toEqual('TAG1');
        expect(result.matched).toEqual(true);

        result = OPEN_ELEMENT_BEGIN.parse(new ParserInput('<', 0));
        expect(result.loc).toEqual(1);
        expect(result.count).toEqual(1);
        expect(result.data).toEqual('<');
        expect(result.matched).toEqual(true);

        result = OPEN_ELEMENT_END.parse(new ParserInput('</', 0));
        expect(result.loc).toEqual(2);
        expect(result.count).toEqual(2);
        expect(result.data).toEqual('</');
        expect(result.matched).toEqual(true);

        result = CLOSE_ELEMENT.parse(new ParserInput('>', 0));
        expect(result.loc).toEqual(1);
        expect(result.count).toEqual(1);
        expect(result.data).toEqual('>');
        expect(result.matched).toEqual(true);

        result = CLOSE_ELEMENT_ONE_PART.parse(new ParserInput('/>', 0));
        expect(result.loc).toEqual(2);
        expect(result.count).toEqual(2);
        expect(result.data).toEqual('/>');
        expect(result.matched).toEqual(true);
    });
    it ( 'should recognise one part tags, text nodes, and the beginning and ending of two part tags', (  ) => {
        let result = ELEMENT_ONE_PART.parse(new ParserInput('<TAG1/>', 0));
        expect(result.loc).toEqual(7);
        expect(result.count).toEqual(7);
        expect(result.data).toEqual('<TAG1/>');
        expect(result.matched).toEqual(true);

        let text = '<TAG1 _ATTR1 = "TEXT" _ATTR2 = "MOAR_TEXT"/>';
        result = ELEMENT_ONE_PART.parse(new ParserInput(text, 0));
        expect(result.loc).toEqual(44);
        expect(result.count).toEqual(44);
        expect(result.data).toEqual(text);
        expect(result.matched).toEqual(true);

        text = '<TAG1 _ATTR1 = "TEXT" _ATTR2 = "MOAR_TEXT">';
        result = ELEMENT_ONE_PART.parse(new ParserInput(text, 0));
        expect(result.loc).toEqual(43);
        expect(result.count).toEqual(43);
        expect(result.data).toEqual(text);
        expect(result.matched).toEqual(true);

        result = TEXT_NODE.parse(new ParserInput('stuff<', 0));
        expect(result.loc).toEqual(5);
        expect(result.count).toEqual(5);
        expect(result.data).toEqual('stuff');
        expect(result.matched).toEqual(true);

        result = OPTIONAL_TEXT_NODE.parse(new ParserInput('stuff<', 0));
        expect(result.loc).toEqual(5);
        expect(result.count).toEqual(5);
        expect(result.data).toEqual('stuff');
        expect(result.matched).toEqual(true);

        result = OPTIONAL_TEXT_NODE.parse(new ParserInput('<', 0));
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);
        expect(result.matched).toEqual(true);

        text = '<TAG1 _ATTR1="TEXT" _ATTR2 = "MOAR_TEXT">';
        result = ELEMENT_TWO_PART_BEGIN.parse(new ParserInput(text, 0));
        expect(result.loc).toEqual(41);
        expect(result.count).toEqual(41);
        expect(result.data).toEqual(text);
        expect(result.matched).toEqual(true);

        result = ELEMENT_TWO_PART_END.parse(new ParserInput('</TAG1>', 0));
        expect(result.loc).toEqual(7);
        expect(result.count).toEqual(7);
        expect(result.data).toEqual('</TAG1>');
        expect(result.matched).toEqual(true);
    });
    it ( 'should recognise the beginning and ending of two part tags with optional text nodes and optional comments', (  ) => {
        let result = ELEMENT_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE.parse(new ParserInput('<TAG1><', 0));
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(6);
        expect(result.data).toEqual('<TAG1>');
        expect(result.matched).toEqual(true);

        result = ELEMENT_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE.parse(new ParserInput('<TAG1>text<', 0));
        expect(result.loc).toEqual(10);
        expect(result.count).toEqual(10);
        expect(result.data).toEqual('<TAG1>text');
        expect(result.matched).toEqual(true);

        result = ELEMENT_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE.parse(new ParserInput('<TAG1><!--Comment-->text<', 0));
        expect(result.loc).toEqual(24);
        expect(result.count).toEqual(24);
        expect(result.data).toEqual('<TAG1><!--Comment-->text');
        expect(result.matched).toEqual(true);

        result = ELEMENT_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE.parse(new ParserInput('<TAG1><!--Comment-->text<!--Comment--><', 0));
        expect(result.loc).toEqual(38);
        expect(result.count).toEqual(38);
        expect(result.data).toEqual('<TAG1><!--Comment-->text<!--Comment-->');
        expect(result.matched).toEqual(true);

        result = ELEMENT_TWO_PART_BEGIN_OPTIONAL_TEXT_NODE.parse(new ParserInput('<TAG1><!--Comment--><!--Comment--><', 0));
        expect(result.loc).toEqual(34);
        expect(result.count).toEqual(34);
        expect(result.data).toEqual('<TAG1><!--Comment--><!--Comment-->');
        expect(result.matched).toEqual(true);

        result = ELEMENT_TWO_PART_END_OPTIONAL_TEXT_NODE.parse(new ParserInput('</TAG1>', 0));
        expect(result.loc).toEqual(7);
        expect(result.count).toEqual(7);
        expect(result.data).toEqual('</TAG1>');
        expect(result.matched).toEqual(true);

        result = ELEMENT_TWO_PART_END_OPTIONAL_TEXT_NODE.parse(new ParserInput('text</TAG1>', 0));
        expect(result.loc).toEqual(11);
        expect(result.count).toEqual(11);
        expect(result.data).toEqual('text</TAG1>');
        expect(result.matched).toEqual(true);

        result = ELEMENT_TWO_PART_END_OPTIONAL_TEXT_NODE.parse(new ParserInput('<!--Comment-->text</TAG1>', 0));
        expect(result.loc).toEqual(25);
        expect(result.count).toEqual(25);
        expect(result.data).toEqual('<!--Comment-->text</TAG1>');
        expect(result.matched).toEqual(true);

        result = ELEMENT_TWO_PART_END_OPTIONAL_TEXT_NODE.parse(new ParserInput('<!--Comment-->text<!--Comment--></TAG1>', 0));
        expect(result.loc).toEqual(39);
        expect(result.count).toEqual(39);
        expect(result.data).toEqual('<!--Comment-->text<!--Comment--></TAG1>');
        expect(result.matched).toEqual(true);

        result = ELEMENT_TWO_PART_END_OPTIONAL_TEXT_NODE.parse(new ParserInput('<!--Comment--><!--Comment--></TAG1>', 0));
        expect(result.loc).toEqual(35);
        expect(result.count).toEqual(35);
        expect(result.data).toEqual('<!--Comment--><!--Comment--></TAG1>');
        expect(result.matched).toEqual(true);
    });
    it ( 'should recognise two part tags, including nested tags', (  ) => {
        let result = ELEMENT_TWO_PART.parse(new ParserInput('<TAG1></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(13);
        expect(result.count).toEqual(13);
        expect(result.data).toEqual('<TAG1></TAG1>');

        result = ELEMENT_TWO_PART.parse(new ParserInput('<TAG1></TIG1>', 0));
        expect(result.matched).toEqual(false);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);

        result = ELEMENT_TWO_PART.parse(new ParserInput('<TAG1><TAG2><TAG3></TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(39);
        expect(result.count).toEqual(39);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3></TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART.parse(new ParserInput('<TAG1><TAG2><TAG3>text</TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(43);
        expect(result.count).toEqual(43);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3>text</TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART.parse(new ParserInput('<TAG1><TAG2><TAG3><!--Comment-->text</TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(57);
        expect(result.count).toEqual(57);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3><!--Comment-->text</TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART.parse(new ParserInput('<TAG1><TAG2><TAG3><!--Comment-->text<!--Comment--></TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(71);
        expect(result.count).toEqual(71);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3><!--Comment-->text<!--Comment--></TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART.parse(new ParserInput('<TAG1><TAG2><!--Comment-->text<!--Comment--><TAG3><!--Comment-->text<!--Comment--></TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(103);
        expect(result.count).toEqual(103);
        expect(result.data).toEqual('<TAG1><TAG2><!--Comment-->text<!--Comment--><TAG3><!--Comment-->text<!--Comment--></TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART.parse(new ParserInput('<TAG1><!--Comment-->text<!--Comment--><TAG2><!--Comment-->text<!--Comment--><TAG3><!--Comment-->text<!--Comment--></TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(135);
        expect(result.count).toEqual(135);
        expect(result.data).toEqual('<TAG1><!--Comment-->text<!--Comment--><TAG2><!--Comment-->text<!--Comment--><TAG3><!--Comment-->text<!--Comment--></TAG3></TAG2></TAG1>');

        let text = '<TAG1 ATTR1="TEXT"><!--Comment-->text<!--Comment--><TAG2 ATTR1="TEXT"><!--Comment-->text<!--Comment--><TAG3 ATTR1="TEXT"><!--Comment-->text<!--Comment--></TAG3></TAG2></TAG1>';
        result = ELEMENT_TWO_PART.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(174);
        expect(result.count).toEqual(174);
        expect(result.data).toEqual(text);
    });
    it ( 'should recognise two part tags that have a one part tag in the center', (  ) => {
        let result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAGM/></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(20);
        expect(result.count).toEqual(20);
        expect(result.data).toEqual('<TAG1><TAGM/></TAG1>');

        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAGM/></TIG1>', 0));
        expect(result.matched).toEqual(false);
        expect(result.loc).toEqual(0);
        expect(result.count).toEqual(0);
        expect(result.data).toEqual(null);

        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAG2><TAG3><TAGM/></TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(46);
        expect(result.count).toEqual(46);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3><TAGM/></TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAG2><TAG3>text<TAGM/></TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(50);
        expect(result.count).toEqual(50);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3>text<TAGM/></TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAG2><TAG3><TAGM/>text</TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(50);
        expect(result.count).toEqual(50);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3><TAGM/>text</TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAG2><TAG3><!--Comment-->text<TAGM/></TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(64);
        expect(result.count).toEqual(64);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3><!--Comment-->text<TAGM/></TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAG2><TAG3><!--Comment--><TAGM/>text</TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(64);
        expect(result.count).toEqual(64);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3><!--Comment--><TAGM/>text</TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAG2><TAG3><TAGM/><!--Comment-->text</TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(64);
        expect(result.count).toEqual(64);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3><TAGM/><!--Comment-->text</TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAG2><TAG3><TAGM/><!--Comment-->text<!--Comment--></TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(78);
        expect(result.count).toEqual(78);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3><TAGM/><!--Comment-->text<!--Comment--></TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAG2><TAG3><!--Comment--><TAGM/>text<!--Comment--></TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(78);
        expect(result.count).toEqual(78);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3><!--Comment--><TAGM/>text<!--Comment--></TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAG2><TAG3><!--Comment-->text<TAGM/><!--Comment--></TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(78);
        expect(result.count).toEqual(78);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3><!--Comment-->text<TAGM/><!--Comment--></TAG3></TAG2></TAG1>');

        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput('<TAG1><TAG2><TAG3><!--Comment-->text<!--Comment--><TAGM/></TAG3></TAG2></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(78);
        expect(result.count).toEqual(78);
        expect(result.data).toEqual('<TAG1><TAG2><TAG3><!--Comment-->text<!--Comment--><TAGM/></TAG3></TAG2></TAG1>');

        let text = '<TAG1 ATTR1="TEXT"><TAG2 ATTR1="TEXT"><TAG3 ATTR1="TEXT"><!--Comment-->text<!--Comment--><TAGM ATTR1="TEXT"/></TAG3></TAG2></TAG1>';
        result = ELEMENT_TWO_PART_WITH_ONE_PART_MIDDLE.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(130);
        expect(result.count).toEqual(130);
        expect(result.data).toEqual(text);
    });
    it ( 'should handle one part, two part, and two part with middle one part tags', (  ) => {
        let result = SIMPLE_ELEMENT.parse(new ParserInput('<TAG1><TAGM/></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(20);
        expect(result.count).toEqual(20);
        expect(result.data).toEqual('<TAG1><TAGM/></TAG1>');

        result = SIMPLE_ELEMENT.parse(new ParserInput('<TAG1></TAG1>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(13);
        expect(result.count).toEqual(13);
        expect(result.data).toEqual('<TAG1></TAG1>');

        result = SIMPLE_ELEMENT.parse(new ParserInput('<TAG1/>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(7);
        expect(result.count).toEqual(7);
        expect(result.data).toEqual('<TAG1/>');
    });
    it ( 'should support <!DOCTYPE', (  ) => {
        let result = DOCTYPE_START.parse(new ParserInput('<!DOCTYPE', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(9);
        expect(result.count).toEqual(9);
        expect(result.data).toEqual('<!DOCTYPE');

        result = DOCTYPE_START.parse(new ParserInput('<!dOcTyPe', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(9);
        expect(result.count).toEqual(9);
        expect(result.data).toEqual('<!dOcTyPe');

        result = DOCTYPE_TEXT.parse(new ParserInput('stuff>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(5);
        expect(result.count).toEqual(5);
        expect(result.data).toEqual('stuff');

        result = DOCTYPE.parse(new ParserInput('<!DOCTYPE stuff>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(16);
        expect(result.count).toEqual(16);
        expect(result.data).toEqual('<!DOCTYPE stuff>');
    });
    it ( 'should support the script tag', (  ) => {
        let result = SCRIPT_NAME.parse(new ParserInput('SCRIPT', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(6);
        expect(result.data).toEqual('SCRIPT');

        result = SCRIPT_NAME.parse(new ParserInput('script', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(6);
        expect(result.data).toEqual('script');

        result = SCRIPT_NAME.parse(new ParserInput('ScRiPt', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(6);
        expect(result.count).toEqual(6);
        expect(result.data).toEqual('ScRiPt');

        result = SCRIPT_START.parse(new ParserInput('<SCRIPT>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(8);
        expect(result.count).toEqual(8);
        expect(result.data).toEqual('<SCRIPT>');

        result = SCRIPT_START.parse(new ParserInput('< SCRIPT >', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(10);
        expect(result.count).toEqual(10);
        expect(result.data).toEqual('< SCRIPT >');

        result = SCRIPT_START.parse(new ParserInput('<SCRIPT attr1="text">', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(21);
        expect(result.count).toEqual(21);
        expect(result.data).toEqual('<SCRIPT attr1="text">');

        result = SCRIPT_END.parse(new ParserInput('</SCRIPT>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(9);
        expect(result.count).toEqual(9);
        expect(result.data).toEqual('</SCRIPT>');

        result = SCRIPT_END.parse(new ParserInput('</ script>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(10);
        expect(result.count).toEqual(10);
        expect(result.data).toEqual('</ script>');

        result = SCRIPT_END.parse(new ParserInput('</ ScRiPt >', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(11);
        expect(result.count).toEqual(11);
        expect(result.data).toEqual('</ ScRiPt >');

        result = SCRIPT_TEXT.parse(new ParserInput('if (window.ytcsi) {window.ytcsi.tick("csl", null, \'\');}</SCRIPT>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(55);
        expect(result.count).toEqual(55);
        expect(result.data).toEqual('if (window.ytcsi) {window.ytcsi.tick("csl", null, \'\');}');

        result = SCRIPT.parse(new ParserInput('<SCRIPT>if (window.ytcsi) {window.ytcsi.tick("csl", null, \'\');}</SCRIPT>', 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(72);
        expect(result.count).toEqual(72);
        expect(result.data).toEqual('<SCRIPT>if (window.ytcsi) {window.ytcsi.tick("csl", null, \'\');}</SCRIPT>');
    });
    it ( 'should support the style tag', (  ) => {
        let text = 'STYLE';
        let result = STYLE_NAME.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(5);
        expect(result.count).toEqual(5);
        expect(result.data).toEqual(text);

        text = 'style';
        result = STYLE_NAME.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(5);
        expect(result.count).toEqual(5);
        expect(result.data).toEqual(text);

        text = 'StYlE';
        result = STYLE_NAME.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(5);
        expect(result.count).toEqual(5);
        expect(result.data).toEqual(text);

        text = '<STYLE>';
        result = STYLE_START.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(7);
        expect(result.count).toEqual(7);
        expect(result.data).toEqual(text);

        text = '< STYLE >';
        result = STYLE_START.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(9);
        expect(result.count).toEqual(9);
        expect(result.data).toEqual(text);

        text = '<STYLE attr1="text">';
        result = STYLE_START.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(20);
        expect(result.count).toEqual(20);
        expect(result.data).toEqual(text);

        text = '</STYLE>';
        result = STYLE_END.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(8);
        expect(result.count).toEqual(8);
        expect(result.data).toEqual(text);

        text = '</ style>';
        result = STYLE_END.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(9);
        expect(result.count).toEqual(9);
        expect(result.data).toEqual(text);

        text = '</ StYlE >';
        result = STYLE_END.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(10);
        expect(result.count).toEqual(10);
        expect(result.data).toEqual(text);

        text = '#logo-red-icon-container.ytd-topbar-logo-renderer {width: 86px;}</STYLE>';
        result = STYLE_TEXT.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(64);
        expect(result.count).toEqual(64);
        expect(result.data).toEqual('#logo-red-icon-container.ytd-topbar-logo-renderer {width: 86px;}');

        text = '<STYLE>#logo-red-icon-container.ytd-topbar-logo-renderer {width: 86px;}</STYLE>';
        result = STYLE.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(79);
        expect(result.count).toEqual(79);
        expect(result.data).toEqual(text);
    });
    it ( 'should support the comment, element, doctype, and script tags', (  ) => {
        let text = '<SCRIPT>if (window.ytcsi) {window.ytcsi.tick("csl", null, \'\');}</SCRIPT>';
        let result = TAG.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(72);
        expect(result.count).toEqual(72);
        expect(result.data).toEqual(text);

        text = '<!DOCTYPE stuff>';
        result = TAG.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(16);
        expect(result.count).toEqual(16);
        expect(result.data).toEqual(text);

        text = '<TAG1 ATTR1="TEXT"><TAG2 ATTR1="TEXT"><TAG3 ATTR1="TEXT"><!--Comment-->text<!--Comment--><TAGM ATTR1="TEXT"/></TAG3></TAG2></TAG1>';
        result = TAG.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(130);
        expect(result.count).toEqual(130);
        expect(result.data).toEqual(text);

        text = '<TAG1 ATTR1="TEXT"><!--Comment-->text<!--Comment--><TAG2 ATTR1="TEXT"><!--Comment-->text<!--Comment--><TAG3 ATTR1="TEXT"><!--Comment-->text<!--Comment--></TAG3></TAG2></TAG1>';
        result = TAG.parse(new ParserInput(text, 0));
        expect(result.matched).toEqual(true);
        expect(result.loc).toEqual(174);
        expect(result.count).toEqual(174);
        expect(result.data).toEqual(text);

        text = '<TAG1 _ATTR1 = "TEXT" _ATTR2 = "MOAR_TEXT"/>';
        result = TAG.parse(new ParserInput(text, 0));
        expect(result.loc).toEqual(44);
        expect(result.count).toEqual(44);
        expect(result.data).toEqual(text);
        expect(result.matched).toEqual(true);

        text = '<TAG1 _ATTR1 = "TEXT" _ATTR2 = "MOAR_TEXT">';
        result = TAG.parse(new ParserInput(text, 0));
        expect(result.loc).toEqual(43);
        expect(result.count).toEqual(43);
        expect(result.data).toEqual(text);
        expect(result.matched).toEqual(true);

        text = '<!--Comment Text-->';
        result = TAG.parse(new ParserInput(text, 0));
        expect(result.loc).toEqual(19);
        expect(result.count).toEqual(19);
        expect(result.data).toEqual(text);
        expect(result.matched).toEqual(true);
    });
    it ( 'should support parsing an HTML header', (  ) => {
        let header = '<head><title>My Page</title></head>';
        let result = HTML.parse(new ParserInput(header, 0));
        expect(result.loc).toEqual(35);
        expect(result.count).toEqual(35);
        expect(result.data).toEqual(header);
        expect(result.matched).toEqual(true);

        header = '<head>';
        header += '<title>My Page</title>';
        header += '<script  src="https://s.ytimg.com/yts/jsbin/network-vflNZTggj/network.js" type="text/javascript" name="network/network" ></script>';
        header += '</head>';
        result = HTML.parse(new ParserInput(header, 0));
        expect(result.loc).toEqual(165);
        expect(result.count).toEqual(165);
        expect(result.data).toEqual(header);
        expect(result.matched).toEqual(true);

        header = '<head>';
        header += '<title>My Page</title>';
        header += '<meta http-equiv="origin-trial" data-feature="Media Capabilities"data-expires="2018-04-12">';
        header += '<link rel="icon" href="https://s.ytimg.com/yts/img/favicon_32-vflOogEID.png" sizes="32x32" >';
        header += '<script >if (window.ytcsi) {window.ytcsi.tick("rsbe_dpsashh", null, \'\');}</script>';
        header += '<script  src="https://s.ytimg.com/yts/jsbin/network-vflNZTggj/network.js" type="text/javascript" name="network/network" ></script>';
        header += '</head>';
        result = HTML.parse(new ParserInput(header, 0));
        expect(result.loc).toEqual(430);
        expect(result.count).toEqual(430);
        expect(result.data).toEqual(header);
        expect(result.matched).toEqual(true);

        header = '<head>';
        header += '<title>My Page</title>';
        header += '<meta http-equiv="origin-trial" data-feature="Media Capabilities"data-expires="2018-04-12">';
        header += '<link rel="icon" href="https://s.ytimg.com/yts/img/favicon_32-vflOogEID.png" sizes="32x32" >';
        header += '<script >if (window.ytcsi) {window.ytcsi.tick("rsbe_dpsashh", null, \'\');}</script>';
        header += '<script  src="https://s.ytimg.com/yts/jsbin/network-vflNZTggj/network.js" type="text/javascript" name="network/network" ></script>';
        header += '<STYLE>#logo-red-icon-container.ytd-topbar-logo-renderer {width: 86px;}</STYLE>';
        header += '</head>';
        result = HTML.parse(new ParserInput(header, 0));
        expect(result.loc).toEqual(509);
        expect(result.count).toEqual(509);
        expect(result.data).toEqual(header);
        expect(result.matched).toEqual(true);

        header = '<!DOCTYPE html>';
        header += '<head>';
        header += '<title>My Page</title>';
        header += '<meta http-equiv="origin-trial" data-feature="Media Capabilities"data-expires="2018-04-12">';
        header += '<link rel="icon" href="https://s.ytimg.com/yts/img/favicon_32-vflOogEID.png" sizes="32x32" >';
        header += '<script >if (window.ytcsi) {window.ytcsi.tick("rsbe_dpsashh", null, \'\');}</script>';
        header += '<script  src="https://s.ytimg.com/yts/jsbin/network-vflNZTggj/network.js" type="text/javascript" name="network/network" ></script>';
        header += '<STYLE>#logo-red-icon-container.ytd-topbar-logo-renderer {width: 86px;}</STYLE>';
        header += '</head>';
        result = HTML.parse(new ParserInput(header, 0));
        expect(result.loc).toEqual(524);
        expect(result.count).toEqual(524);
        expect(result.data).toEqual(header);
        expect(result.matched).toEqual(true);
    });
    it ( 'should support parsing an HTML body', (  ) => {
        let body = '<body><div>Hello World!</div></body>';
        let result = HTML.parse(new ParserInput(body, 0));
        expect(result.loc).toEqual(36);
        expect(result.count).toEqual(36);
        expect(result.data).toEqual(body);
        expect(result.matched).toEqual(true);

        // console.log('>>>>>>>>>>>>>>>>>>>> result: ' +JSON.stringify(result));
        body = '<body><noscript>You need to enable JavaScript to run this app.</noscript>';
        body += '<div className="td-meta-info-container">';
        body += '<div className="td-meta-align">';
        body += '<div className="td-big-grid-meta">';
        body += '   <div className="entry-title">';
        body += '       <a href="http://localhost/wordpress/2018/06/06/post-1/">LibsLobs Post 1</a>';
        body += '   </div>';
        body += '</div>';
        body += '</div>';
        body += '</div>';
        body += '<!--';
        body += '  This HTML file is a template.';
        body += '  If you open it directly in the browser, you will see an empty users.';
        body += ' ';
        body += '  You can add webfonts, meta tags, or analytics to this file.';
        body += '  The build step will place the bundled scripts into the <body> tag.';
        body += ' ';
        body += '  To begin the development, run `npm start` or `yarn start`.';
        body += '  To create a production bundle, use `npm run build` or `yarn build`.';
        body += '-->';
        body += '</body>';
        result = HTML.parse(new ParserInput(body, 0));
        expect(result.loc).toEqual(694);
        expect(result.count).toEqual(694);
        expect(result.data).toEqual(body);
        expect(result.matched).toEqual(true);

        body = '<body>';
        body += '<noscript>You need to enable JavaScript to run this app.</noscript>';
        body += '<STYLE>#logo-red-icon-container.ytd-topbar-logo-renderer {width: 86px;}</STYLE>';
        body += '<div className="td-meta-info-container">';
        body += '   <div className="td-meta-align">';
        body += '       <div className="td-big-grid-meta">';
        body += '           <div className="entry-title">';
        body += '               <a href="http://localhost/wordpress/2018/06/06/post-1/">LibsLobs Post 1</a>';
        body += '           </div>';
        body += '       </div>';
        body += '   </div>';
        body += '</div>';
        body += '<!--';
        body += '  This HTML file is a template.';
        body += '  If you open it directly in the browser, you will see an empty users.';
        body += ' ';
        body += '  You can add webfonts, meta tags, or analytics to this file.';
        body += '  The build step will place the bundled scripts into the <body> tag.';
        body += ' ';
        body += '  To begin the development, run `npm start` or `yarn start`.';
        body += '  To create a production bundle, use `npm run build` or `yarn build`.';
        body += '-->';
        body += '<script>';
        body += '$.ajax({';
        body += '    url: "/api/getWeather",';
        body += '        data: {';
        body += '        zipcode: 97201';
        body += '    },';
        body += '    success: function( result ) {';
        body += '        $( "#weather-temp" ).html( "<strong>" + result + "</strong> degrees" );';
        body += '    }';
        body += '});';
        body += '</script>';
        body += '</body>';
        result = HTML.parse(new ParserInput(body, 0));
        expect(result.loc).toEqual(1032);
        expect(result.count).toEqual(1032);
        expect(result.data).toEqual(body);
        expect(result.matched).toEqual(true);
    });
    it ( 'should support parsing an HTML page', (  ) => {
        let html = '<!DOCTYPE html>';
        html += '<head>';
        html += '<title>My Page</title>';
        html += '<meta http-equiv="origin-trial" data-feature="Media Capabilities"data-expires="2018-04-12">';
        html += '<link rel="icon" href="https://s.ytimg.com/yts/img/favicon_32-vflOogEID.png" sizes="32x32" >';
        html += '<script >if (window.ytcsi) {window.ytcsi.tick("rsbe_dpsashh", null, \'\');}</script>';
        html += '<script  src="https://s.ytimg.com/yts/jsbin/network-vflNZTggj/network.js" type="text/javascript" name="network/network" ></script>';
        html += '<STYLE>#logo-red-icon-container.ytd-topbar-logo-renderer {width: 86px;}</STYLE>';
        html += '</head>';
        html += '<body>';
        html += '<noscript>You need to enable JavaScript to run this app.</noscript>';
        html += '<STYLE>#logo-red-icon-container.ytd-topbar-logo-renderer {width: 86px;}</STYLE>';
        html += '<div className="td-meta-info-container">';
        html += '   <div className="td-meta-align">';
        html += '       <div className="td-big-grid-meta">';
        html += '           <div className="entry-title">';
        html += '               <a href="http://localhost/wordpress/2018/06/06/post-1/">LibsLobs Post 1</a>';
        html += '           </div>';
        html += '       </div>';
        html += '   </div>';
        html += '</div>';
        html += '<!--';
        html += '  This HTML file is a template.';
        html += '  If you open it directly in the browser, you will see an empty users.';
        html += ' ';
        html += '  You can add webfonts, meta tags, or analytics to this file.';
        html += '  The build step will place the bundled scripts into the <body> tag.';
        html += ' ';
        html += '  To begin the development, run `npm start` or `yarn start`.';
        html += '  To create a production bundle, use `npm run build` or `yarn build`.';
        html += '-->';
        html += '<script>';
        html += '$.ajax({';
        html += '    url: "/api/getWeather",';
        html += '        data: {';
        html += '        zipcode: 97201';
        html += '    },';
        html += '    success: function( result ) {';
        html += '        $( "#weather-temp" ).html( "<strong>" + result + "</strong> degrees" );';
        html += '    }';
        html += '});';
        html += '</script>';
        html += '</body>';
        let result = HTML.parse(new ParserInput(html, 0));
        expect(result.loc).toEqual(1556);
        expect(result.count).toEqual(1556);
        expect(result.data).toEqual(html);
        expect(result.matched).toEqual(true);
    });
});
