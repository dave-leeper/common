import ReactDOM from "react-dom";
import React from "react";
import {MockCanvasContext, MockClassList, MockDOM, MockDOMElement} from "./mock-dom";
import Log from '../Log';

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
                my_prop='MyPropValue'
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
        console.log('BEGIN MOCK DOM TEST ===========================================');
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    afterAll(() => {
    });
    it ( 'should be able to maintain a class list', (  ) => {
        let classList = new MockClassList();
        expect(classList.classes.length).toBe(0);
        classList.add("CLASS1");
        expect(classList.classes.length).toBe(1);
        expect(classList.contains("CLASS1")).toBe(true);
        expect(classList.contains("JUNK")).toBe(false);
        classList.remove("CLASS1");
        expect(classList.classes.length).toBe(0);
        classList.add("CLASS1", "CLASS2", "CLASS3", "CLASS4");
        expect(classList.classes.length).toBe(4);
        expect(classList.item(0)).toBe("CLASS1");
        expect(classList.item(1)).toBe("CLASS2");
        expect(classList.item(2)).toBe("CLASS3");
        expect(classList.item(3)).toBe("CLASS4");
        classList.remove("CLASS3");
        expect(classList.classes.length).toBe(3);
        expect(classList.item(0)).toBe("CLASS1");
        expect(classList.item(1)).toBe("CLASS2");
        expect(classList.item(2)).toBe("CLASS4");
        classList.toggle("CLASS4");
        expect(classList.classes.length).toBe(2);
        expect(classList.item(0)).toBe("CLASS1");
        expect(classList.item(1)).toBe("CLASS2");
        classList.toggle("CLASS4");
        expect(classList.classes.length).toBe(3);
        expect(classList.item(0)).toBe("CLASS1");
        expect(classList.item(1)).toBe("CLASS2");
        expect(classList.item(2)).toBe("CLASS4");
        classList.remove("CLASS1", "CLASS2", "CLASS4");
        expect(classList.classes.length).toBe(0);
    });
    it ( 'should be able to create a mock canvas context', (  ) => {
        let canvasContext = new MockCanvasContext();
        let img = {};
        canvasContext.moveTo(1, 2);
        canvasContext.lineTo(3, 4);
        canvasContext.arc(5, 6, 7, 8, 9, false);
        canvasContext.fillText('TEXT1', 10, 11);
        canvasContext.strokeText('TEXT2', 12, 13);
        canvasContext.createLinearGradient(14, 15, 16, 17);
        canvasContext.createRadialGradient(18, 19, 20, 21, 22, 23);
        canvasContext.addColorStop(24, "white");
        canvasContext.fillRect(25, 26, 27, 28);
        canvasContext.drawImage(img, 29, 30);
        let imageData = canvasContext.getImageData(1, 1, 1, 1);
        expect(canvasContext.moveToParams.length).toBe(1);
        expect(canvasContext.lineToParams.length).toBe(1);
        expect(canvasContext.arcParams.length).toBe(1);
        expect(canvasContext.fillTextParams.length).toBe(1);
        expect(canvasContext.strokeTextParams.length).toBe(1);
        expect(canvasContext.createLinearGradientParams.length).toBe(1);
        expect(canvasContext.createRadialGradientParams.length).toBe(1);
        expect(canvasContext.addColorStopParams.length).toBe(1);
        expect(canvasContext.fillRectParams.length).toBe(1);
        expect(canvasContext.drawImageParams.length).toBe(1);
        expect(canvasContext.moveToParams[0]).toEqual({ x: 1, y: 2 });
        expect(canvasContext.lineToParams[0]).toEqual({ x: 3, y: 4 });
        expect(canvasContext.arcParams[0]).toEqual({ x: 5, y: 6, r: 7, sAngle: 8, eAngle: 9, counterclockwise: false });
        expect(canvasContext.fillTextParams[0]).toEqual({ text: 'TEXT1', x: 10, y: 11 });
        expect(canvasContext.strokeTextParams[0]).toEqual({ text: 'TEXT2', x: 12, y: 13 });
        expect(canvasContext.createLinearGradientParams[0]).toEqual({ x0: 14, y0: 15, x1: 16, y1: 17 });
        expect(canvasContext.createRadialGradientParams[0]).toEqual({ x0: 18, y0: 19, r0: 20, x1: 21, y1: 22, r1: 23 });
        expect(canvasContext.addColorStopParams[0]).toEqual({ stop: 24, color: 'white' });
        expect(canvasContext.fillRectParams[0]).toEqual({ x: 25, y: 26, width: 27, height: 28 });
        expect(canvasContext.drawImageParams[0]).toEqual({ img: img, x: 29, y: 30 });
        expect(imageData.data.length).toEqual(4);
        expect(imageData.data[0]).toEqual(0);
        expect(imageData.data[1]).toEqual(0);
        expect(imageData.data[2]).toEqual(0);
        expect(imageData.data[3]).toEqual(0);
        canvasContext.reset();
        expect(canvasContext.moveToParams.length).toBe(0);
        expect(canvasContext.lineToParams.length).toBe(0);
        expect(canvasContext.arcParams.length).toBe(0);
        expect(canvasContext.fillTextParams.length).toBe(0);
        expect(canvasContext.strokeTextParams.length).toBe(0);
        expect(canvasContext.createLinearGradientParams.length).toBe(0);
        expect(canvasContext.createRadialGradientParams.length).toBe(0);
        expect(canvasContext.addColorStopParams.length).toBe(0);
        expect(canvasContext.fillRectParams.length).toBe(0);
        expect(canvasContext.drawImageParams.length).toBe(0);

        let canvas = new MockDOMElement('canvas');
        expect(canvas.getContext).not.toBeUndefined;
        canvasContext = canvas.getContext();
        expect(canvasContext.moveTo).not.toBeUndefined;
        expect(canvasContext.lineTo).not.toBeUndefined;
        expect(canvasContext.arc).not.toBeUndefined;
        expect(canvasContext.fillText).not.toBeUndefined;
        expect(canvasContext.strokeText).not.toBeUndefined;
        expect(canvasContext.createLinearGradient).not.toBeUndefined;
        expect(canvasContext.createRadialGradient).not.toBeUndefined;
        expect(canvasContext.addColorStop).not.toBeUndefined;
        expect(canvasContext.fillRect).not.toBeUndefined;
        expect(canvasContext.drawImage).not.toBeUndefined;
    });
    it ( 'should be able to create a document', (  ) => {
        let document = new MockDOM();
        expect(document.tree).toBeNull;
        expect(document.nodeType).toBe(9);
        expect(document.eventListeners.length).toBe(0);
    });
    it ( 'should be able to create elements and text nodes', (  ) => {
        let document = new MockDOM();
        let element = document.createElement('TAG');
        expect(element.tagName).toBe('TAG');
        expect(element.classList.classes.length).toBe(0);
        expect(element.children.length).toBe(0);
        expect(element.attributes.length).toBe(0);
        expect(element.eventListeners.length).toBe(0);
        expect(element.ownerDocument).toBe(document);
        expect(element.nodeType).toBe(1);
        expect(element.parentNode).toBeNull;

        let text = document.createTextNode('DATA');
        expect(text.data).toBe('DATA');
        expect(text.ownerDocument).toBe(document);
        expect(text.nodeType).toBe(3);
        expect(text.parentNode).toBeNull;
    });
    it ( 'should be able to add document event listeners', (  ) => {
        let document = new MockDOM();
        document.addEventListener('TYPE', document, null);
        expect(document.eventListeners.length).toBe(1);
        expect(document.eventListeners[0]).toEqual({ type: 'TYPE', listener: document, options: null });
    });
    it ( 'should be able to add element event listeners', (  ) => {
        let document = new MockDOM();
        let element = document.createElement('TAG');
        element.addEventListener('TYPE', document, null);
        expect(element.eventListeners.length).toBe(1);
        expect(element.eventListeners[0]).toEqual({ type: 'TYPE', listener: document, options: null });
    });
    it ( 'should be able to set and remove element attributes', (  ) => {
        let document = new MockDOM();
        let element = document.createElement('TAG');
        element.setAttribute('ATTR1', 'VALUE1');
        element.setAttribute('ATTR2', 'VALUE2');
        expect(element.attributes.length).toBe(2);
        expect(element.attributes[0]).toEqual({ name: 'ATTR1', value: 'VALUE1' });
        expect(element.attributes[1]).toEqual({ name: 'ATTR2', value: 'VALUE2' });
        element.removeAttribute('ATTR2');
        expect(element.attributes.length).toBe(1);
        expect(element.attributes[0]).toEqual({ name: 'ATTR1', value: 'VALUE1' });
        element.setAttribute('ATTR1');
        expect(element.attributes.length).toBe(0);
    });
    it ( 'should be able to append and remove children', (  ) => {
        let document = new MockDOM();
        let element1 = document.createElement('TAG1');
        let element2 = document.createElement('TAG2');
        let text = document.createTextNode('DATA');
        expect(element1.parentNode).toBeNull;
        expect(element2.parentNode).toBeNull;
        expect(text.parentNode).toBeNull;
        expect(element1.ownerDocument).toBe(document);
        expect(element2.ownerDocument).toBe(document);
        expect(text.ownerDocument).toBe(document);
        element1.appendChild(element2);
        expect(element1.children.length).toBe(1);
        expect(element2.parentNode).toBe(element1);
        element2.appendChild(text);
        expect(element2.children.length).toBe(1);
        expect(text.parentNode).toBe(element2);
        element2.removeChild(text);
        expect(element2.children.length).toBe(0);
        expect(text.parentNode).toBeNull;
        expect(text.ownerDocument).toBeNull;
        element1.removeChild(element2);
        expect(element1.children.length).toBe(0);
        expect(element2.parentNode).toBeNull;
        expect(element2.ownerDocument).toBeNull;
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
        expect(div.children[1].id).toBe('MockDOMTest');
        expect(div.children[1].classList.classes.length).toBe(1);
        expect(div.children[1].classList.contains("testCSS")).toBe(true);
        expect(Array.isArray(div.children[1].attributes)).toBe(true);
        expect(div.children[1].attributes.length).toBe(1);
        expect(div.children[1].attributes[0].name).toBe('my_prop');
        expect(div.children[1].attributes[0].value).toBe('MyPropValue');
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
