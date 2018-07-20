//! A simple parser for a tiny subset of HTML.
//!
//! Can parse basic opening and closing tags, and text nodes.
//!
//! Not yet supported:
//!
//! * Comments
//! * Doctypes and processing instructions
//! * Self-closing tags
//! * Non-well-formed markup
//! * Character entities

import {MockCanvasContext, MockClassList, MockDOM, MockDOMElement} from "./mock-dom";

export class DOMParser {

}

/// Parse an HTML document and return the root element.
pub fn parse(source: String) -> dom::Node {
    let mut nodes = Parser { pos: 0, input: source }.parse_nodes();

    // If the document contains a root element, just return it. Otherwise, create one.
    if nodes.len() == 1 {
        nodes.swap_remove(0)
    } else {
        dom::elem("html".to_string(), HashMap::new(), nodes)
    }
}

struct Parser {
    pos: usize,
    input: String,
}

impl Parser {
    /// Parse a sequence of sibling nodes.
    fn parse_nodes(&mut self) -> Vec<dom::Node> {
        let mut nodes = vec!();
        loop {
            self.consume_whitespace();
            if self.end() || self.starts_with("</") {
                break;
            }
            nodes.push(self.parse_node());
        }
        nodes
    }

    /// Parse a single node.
    fn parse_node(&mut self) -> dom::Node {
        match self.next_char() {
            '<' => self.parse_element(),
            _   => self.parse_text()
        }
    }

    /// Parse a single element, including its open tag, contents, and closing tag.
    fn parse_element(&mut self) -> dom::Node {
        // Opening tag.
        assert_eq!(self.consume_char(), '<');
        let tag_name = self.parse_tag_name();
        let attrs = self.parse_attributes();
        assert_eq!(self.consume_char(), '>');

        // Contents.
        let children = self.parse_nodes();

        // Closing tag.
        assert_eq!(self.consume_char(), '<');
        assert_eq!(self.consume_char(), '/');
        assert_eq!(self.parse_tag_name(), tag_name);
        assert_eq!(self.consume_char(), '>');

        dom::elem(tag_name, attrs, children)
    }

    /// Parse a tag or attribute name.
    fn parse_tag_name(&mut self) -> String {
        self.consume_while(|c| match c {
            'a'...'z' | 'A'...'Z' | '0'...'9' => true,
            _ => false
        })
    }

    /// Parse a list of name="value" pairs, separated by whitespace.
    fn parse_attributes(&mut self) -> dom::AttrMap {
        let mut attributes = HashMap::new();
        loop {
            self.consume_whitespace();
            if self.next_char() == '>' {
                break;
            }
            let (name, value) = self.parse_attr();
            attributes.insert(name, value);
        }
        attributes
    }

    /// Parse a single name="value" pair.
    fn parse_attr(&mut self) -> (String, String) {
        let name = self.parse_tag_name();
        assert_eq!(self.consume_char(), '=');
        let value = self.parse_attr_value();
        (name, value)
    }

    /// Parse a quoted value.
    fn parse_attr_value(&mut self) -> String {
        let open_quote = self.consume_char();
        assert!(open_quote == '"' || open_quote == '\'');
        let value = self.consume_while(|c| c != open_quote);
        assert_eq!(self.consume_char(), open_quote);
        value
    }

    /// Parse a text node.
    fn parse_text(&mut self) -> dom::Node {
        dom::text(self.consume_while(|c| c != '<'))
    }

    /// Consume and discard zero or more whitespace characters.
    fn consume_whitespace(&mut self) {
        self.consume_while(char::is_whitespace);
    }

    /// Consume characters until `test` returns false.
    fn consume_while<F>(&mut self, test: F) -> String
        where F: Fn(char) -> bool {
        let mut result = String::new();
        while !self.end() && test(self.next_char()) {
            result.push(self.consume_char());
        }
        result
    }

    /// Return the current character, and advance self.pos to the next character.
    fn consume_char(&mut self) -> char {
        let mut iter = self.input[self.pos..].char_indices();
        let (_, cur_char) = iter.next().unwrap();
        let (next_pos, _) = iter.next().unwrap_or((1, ' '));
        self.pos += next_pos;
        cur_char
    }

    /// Read the current character without consuming it.
    fn next_char(&self) -> char {
        self.input[self.pos..].chars().next().unwrap()
    }

    /// Does the current input start with the given string?
    fn starts_with(&self, s: &str) -> bool {
        self.input[self.pos ..].starts_with(s)
    }

    /// Return true if all input is consumed.
    fn eof(&self) -> bool {
        self.pos >= self.input.len()
    }
}


///////////////////////////////////////////
// Tests
// cargo test -- --nocapture
#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_parser() {
        let mut parser = Parser { pos: 0, input: "ABC".to_string() };
        assert_eq!(parser.pos, 0);
        assert_eq!(parser.input, "ABC".to_string());
        assert_eq!(parser.starts_with("AB"), true);
        assert_eq!(parser.starts_with("BC"), false);
        assert_eq!(parser.end(), false);
        assert_eq!(parser.next_char(), 'A');
        assert_eq!(parser.pos, 0);
        assert_eq!(parser.consume_char(), 'A');
        assert_eq!(parser.pos, 1);
        assert_eq!(parser.starts_with("AB"), false);
        assert_eq!(parser.starts_with("BC"), true);
        assert_eq!(parser.end(), false);
        assert_eq!(parser.consume_char(), 'B');
        assert_eq!(parser.pos, 2);
        assert_eq!(parser.starts_with("BC"), false);
        assert_eq!(parser.starts_with("C"), true);
        assert_eq!(parser.end(), false);
        assert_eq!(parser.consume_char(), 'C');
        assert_eq!(parser.pos, 3);
        assert_eq!(parser.starts_with("C"), false);
        assert_eq!(parser.end(), true);

        parser = Parser { pos: 0, input: "123ABC".to_string() };
        parser.consume_while( char::is_numeric );
        assert_eq!(parser.pos, 3);
        assert_eq!(parser.starts_with("AB"), true);
        assert_eq!(parser.end(), false);

        parser = Parser { pos: 0, input: "   ABC".to_string() };
        parser.consume_whitespace(  );
        assert_eq!(parser.pos, 3);
        assert_eq!(parser.starts_with("AB"), true);
        assert_eq!(parser.end(), false);

        parser = Parser { pos: 0, input: "ABC<".to_string() };
        let node = parser.parse_text(  );
        assert_eq!(parser.pos, 3);
        assert_eq!(parser.starts_with("<"), true);
        assert_eq!(parser.end(), false);
        assert_eq!(node.node_type, dom::NodeType::Text("ABC".to_string()));

        parser = Parser { pos: 0, input: "'123'ABC".to_string() };
        let value = parser.parse_attr_value(  );
        assert_eq!(parser.pos, 5);
        assert_eq!(parser.starts_with("AB"), true);
        assert_eq!(parser.end(), false);
        assert_eq!(value, "123".to_string());

        parser = Parser { pos: 0, input: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_".to_string() };
        let value = parser.parse_tag_name(  );
        assert_eq!(parser.pos, 62);
        assert_eq!(parser.starts_with("_"), true);
        assert_eq!(parser.end(), false);
        assert_eq!(value, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".to_string());

        parser = Parser { pos: 0, input: "ABC='123'XYZ".to_string() };
        let (attr_name, attr_value) = parser.parse_attr(  );
        assert_eq!(parser.pos, 9);
        assert_eq!(parser.starts_with("XY"), true);
        assert_eq!(parser.end(), false);
        assert_eq!(attr_name, "ABC".to_string());
        assert_eq!(attr_value, "123".to_string());

        parser = Parser { pos: 0, input: "ABC='123' XYZ='890'>".to_string() };
        let attr_map: dom::AttrMap = parser.parse_attributes( );
        assert_eq!(parser.pos, 19);
        assert_eq!(parser.end(), false);
        assert_eq!(attr_map.len(), 2);
        assert_eq!(attr_map.get("ABC").unwrap(), "123");
        assert_eq!(attr_map.get("XYZ").unwrap(), "890");

        parser = Parser { pos: 0, input: "<TAG ABC='123' XYZ='890'></TAG>".to_string() };
        let mut attrs = dom::AttrMap::new();
        attrs.insert( "ABC".to_string(), "123".to_string( ));
        attrs.insert( "XYZ".to_string(), "890".to_string( ));
        let node = parser.parse_element( );
        assert_eq!(node.node_type, dom::NodeType::Element(
            dom::ElementData {
                tag_name: "TAG".to_string(),
                attributes: attrs.clone()
            }
        ));
        assert_eq!(node.children.len(), 0);

        parser = Parser { pos: 0, input: "<TAG ABC='123' XYZ='890'>TEXT</TAG>".to_string() };
        let mut attrs = dom::AttrMap::new();
        attrs.insert( "ABC".to_string(), "123".to_string( ));
        attrs.insert( "XYZ".to_string(), "890".to_string( ));
        let node = parser.parse_element( );
        assert_eq!(node.node_type, dom::NodeType::Element(
            dom::ElementData {
                tag_name: "TAG".to_string(),
                attributes: attrs.clone()
            }
        ));
        assert_eq!(node.children.len(), 1);
        let text_node = dom::text("TEXT".to_string());
        assert_eq!(node.children[0], text_node.clone());

        parser = Parser { pos: 0, input: "<TAG ABC='123' XYZ='890'><TAG2>TEXT</TAG2></TAG>".to_string() };
        let mut attrs = dom::AttrMap::new();
        attrs.insert( "ABC".to_string(), "123".to_string( ));
        attrs.insert( "XYZ".to_string(), "890".to_string( ));
        let node = parser.parse_element( );
        assert_eq!(node.node_type, dom::NodeType::Element(
            dom::ElementData {
                tag_name: "TAG".to_string(),
                attributes: attrs.clone()
            }
        ));
        assert_eq!(node.children.len(), 1);
        let mut attrs2 = dom::AttrMap::new();
        assert_eq!(node.children[0].node_type, dom::NodeType::Element(
            dom::ElementData {
                tag_name: "TAG2".to_string(),
                attributes: attrs2.clone()
            }
        ));
        assert_eq!(node.children[0].children.len(), 1);
        let text_node = dom::text("TEXT".to_string());
        assert_eq!(node.children[0].children[0], text_node.clone());
    }
}
