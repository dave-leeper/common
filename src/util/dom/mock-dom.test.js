import ReactDOM from "react-dom";
import React from "react";
import {MockDOM} from "./mock-dom";
import Log from '../Log';
import './mock-dom.css';

class ReactComponentForTesting extends React.Component {
    clicked = false;
    buttonClicked() {
        this.clicked = true;
    }
    render() {
        return (
            <span
                id='MockDOMTest'
                className='testCSS'
                key='MY_KEY'
                myProp='MyPropValue'
                onClick={() => { this.buttonClicked(); }}
            >
                TESTING
                <section>INNER TEXT</section>
            </span>
        );
    }
}

describe( 'As a developer, I need mock DOM elements for testing.', function() {
    beforeAll(() => {
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    afterAll(() => {
    });
    it ( 'should get elements by class name', (  ) => {
        let document = MockDOM.getTestingDOM();
        let results = document.getElementsByClassName('class1');
        expect(results).not.toBeNull;
        expect(results).not.toBeUndefined;
        expect(results.length).toBe(3);
        expect(results[0].id).toBe('mockDOMElement1');
        expect(results[1].id).toBe('mockDOMElement2');
        expect(results[2].id).toBe('mockDOMElement3');
        results = document.getElementsByClassName('class2');
        expect(results).not.toBeNull;
        expect(results).not.toBeUndefined;
        expect(results.length).toBe(3);
        expect(results[0].id).toBe('mockDOMElement5');
        expect(results[1].id).toBe('mockDOMElement6');
        expect(results[2].id).toBe('mockDOMElement4');
        results = document.getElementsByClassName('class3');
        expect(results).not.toBeNull;
        expect(results).not.toBeUndefined;
        expect(results.length).toBe(3);
        expect(results[0].id).toBe('mockDOMElement7');
        expect(results[1].id).toBe('mockDOMElement8');
        expect(results[2].id).toBe('mockDOMElement9');
        results = document.getElementsByClassName('class4');
        expect(results).not.toBeNull;
        expect(results).not.toBeUndefined;
        expect(results.length).toBe(1);
        expect(results[0].id).toBe('mockDOMElement10');
        results = document.getElementsByClassName('junk');
        expect(results).not.toBeNull;
        expect(results).not.toBeUndefined;
        expect(results.length).toBe(0);
        results = document.getElementsByClassName('class1');
        let mockDOMElement1 = results[0];
        results = mockDOMElement1.getElementsByClassName('class1');
        expect(results).not.toBeNull;
        expect(results).not.toBeUndefined;
        expect(results.length).toBe(2);
        expect(results[0].id).toBe('mockDOMElement2');
        expect(results[1].id).toBe('mockDOMElement3');
    });
    it ( 'should get elements by tagName name', (  ) => {
        let document = MockDOM.getTestingDOM();
        let results = document.getElementsByTagName('DIV');
        expect(results).not.toBeNull;
        expect(results).not.toBeUndefined;
        expect(results.length).toBe(4);
        expect(results[0].id).toBe('mockDOMElement1');
        expect(results[1].id).toBe('mockDOMElement7');
        expect(results[2].id).toBe('mockDOMElement4');
        expect(results[3].id).toBe('mockDOMElement10');
        results = document.getElementsByTagName('SPAN');
        expect(results).not.toBeNull;
        expect(results).not.toBeUndefined;
        expect(results.length).toBe(3);
        expect(results[0].id).toBe('mockDOMElement2');
        expect(results[1].id).toBe('mockDOMElement5');
        expect(results[2].id).toBe('mockDOMElement8');
        results = document.getElementsByTagName('SECTION');
        expect(results).not.toBeNull;
        expect(results).not.toBeUndefined;
        expect(results.length).toBe(3);
        expect(results[0].id).toBe('mockDOMElement6');
        expect(results[1].id).toBe('mockDOMElement3');
        expect(results[2].id).toBe('mockDOMElement9');
        results = document.getElementsByTagName('SPAN');
        let mockDOMElement2 = results[0];
        results = mockDOMElement2.getElementsByTagName('SPAN');
        expect(results).not.toBeNull;
        expect(results).not.toBeUndefined;
        expect(results.length).toBe(1);
        expect(results[0].id).toBe('mockDOMElement5');
    });
    it ( 'should get elements by id', (  ) => {
        let document = MockDOM.getTestingDOM();
        let results = document.getElementById('mockDOMElement1');
        expect(results.id).toBe('mockDOMElement1');
        results = document.getElementById('mockDOMElement2');
        expect(results.id).toBe('mockDOMElement2');
        results = document.getElementById('mockDOMElement3');
        expect(results.id).toBe('mockDOMElement3');
        results = document.getElementById('mockDOMElement4');
        expect(results.id).toBe('mockDOMElement4');
        results = document.getElementById('mockDOMElement5');
        expect(results.id).toBe('mockDOMElement5');
        results = document.getElementById('mockDOMElement6');
        expect(results.id).toBe('mockDOMElement6');
        results = document.getElementById('mockDOMElement7');
        expect(results.id).toBe('mockDOMElement7');
        results = document.getElementById('mockDOMElement8');
        expect(results.id).toBe('mockDOMElement8');
        results = document.getElementById('mockDOMElement9');
        expect(results.id).toBe('mockDOMElement9');
        results = document.getElementById('mockDOMElement10');
        expect(results.id).toBe('mockDOMElement10');
    });
    it ( 'should be usable to render React components', (  ) => {
        let document = MockDOM.getTestingHTMLDOM();
        let entryTitles = document.getElementsByClassName('entry-title');
        let div = entryTitles[0];
        ReactDOM.render(<ReactComponentForTesting/>, div);
        // console.log(div.summary(0));
        expect(div.children.length).toBe(2);
        expect(div.children[1].tagName).toBe('SPAN');
        expect(div.children[1].id).toBeUndefined;
        expect(div.children[1].classList.classes.length).toBe(0);
        expect(Array.isArray(div.children[1].attributes)).toBe(true);
        expect(div.children[1].attributes.length).toBe(3);
        expect(div.children[1].attributes[0].name).toBe('id');
        expect(div.children[1].attributes[0].value).toBe('MockDOMTest');
        expect(div.children[1].attributes[1].name).toBe('class');
        expect(div.children[1].attributes[1].value).toBe('testCSS');
        expect(div.children[1].attributes[2].name).toBe('myProp');
        expect(div.children[1].attributes[2].value).toBe('MyPropValue');
        expect(div.children[1].onClick).not.toBeUndefined;
        expect(div.children[1].ownerDocument).toBe(document);
        expect(div.children[1].children.length).toBe(2);
        expect(div.children[1].children[0].nodeType).toBe(3);
        expect(div.children[1].children[0].ownerDocument).toBe(document);
        expect(div.children[1].children[0].data).toBe('TESTING');
        expect(div.children[1].children[1].tagName).toBe('SECTION');
        expect(div.children[1].children[1].textContent).toBe('INNER TEXT');
        expect(div.children[1].children[1].ownerDocument).toBe(document);
    });
});
