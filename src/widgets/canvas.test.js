import ReactDOM from "react-dom";
import React from "react";
import { MockDOM } from "../util/dom/mock-dom";
import Canvas from "./canvas";
import Color from "../util/art/color";
import Layer from "../util/art/layer";
import Log from '../util/log';

describe( 'As a developer, I need to render a canvas in React.', function() {
    beforeAll(() => {
        console.log('BEGIN CANVAS TEST ===========================================');
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    afterAll(() => {
    });
    it ( 'should be able to render a React canvas', (  ) => {
        let document = MockDOM.getTestingHTMLDOM();
        let entryTitles = document.getElementsByClassName('entry-title');
        let div = entryTitles[0];
        ReactDOM.render(
            <Canvas
                id={'ID'}
                width={200}
                height={200}
            />,
            div
        );
        expect(div.children.length).toBe(2);
        expect(div.children[1].tagName).toBe('CANVAS');
        expect(div.children[1].id).toBe('ID');
        expect(div.children[1].classList.classes.length).toBe(0);
        expect(Array.isArray(div.children[1].attributes)).toBe(true);
        expect(div.children[1].attributes.length).toBe(2);
        expect(div.children[1].attributes[0].name).toBe('width');
        expect(div.children[1].attributes[0].value).toBe('200');
        expect(div.children[1].attributes[1].name).toBe('height');
        expect(div.children[1].attributes[1].value).toBe('200');
    });
    it ( 'should set props', (  ) => {
        let canvas = new Canvas({ id: 'ID', width: '200', height: '200' });
        expect(canvas.props.id).toBe('ID');
        expect(canvas.props.width).toBe('200');
        expect(canvas.props.height).toBe('200');
    });
    it ( 'should be able to get the canvas context', (  ) => {
        let document = MockDOM.getTestingHTMLDOM();
        let entryTitles = document.getElementsByClassName('entry-title');
        let div = entryTitles[0];
        ReactDOM.render(
            <Canvas
                id={'ID'}
                width={200}
                height={200}
            />,
            div
        );
        let canvas = new Canvas({ id: 'ID', width: '200', height: '200' });
        let canvasDOM = document.getElementById('ID');
        canvas.setCanvasDOMElement(canvasDOM);
        let canvasContext = canvas.getContext();
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
    it ( 'should be able to set and get pixel colors', (  ) => {
        let document = MockDOM.getTestingHTMLDOM();
        let entryTitles = document.getElementsByClassName('entry-title');
        let div = entryTitles[0];
        ReactDOM.render(
            <Canvas
                id={'ID'}
                width={200}
                height={200}
            />,
            div
        );
        let canvas = new Canvas({ id: 'ID', width: '200', height: '200' });
        let canvasDOM = document.getElementById('ID');
        canvas.setCanvasDOMElement(canvasDOM);
        canvas.setColor(10, 10, new Color( 12, 12, 12, 0.5));
        let canvasContext = canvas.getContext();
        expect(canvasContext.fillRectParams[0]).toEqual({ x: 10, y: 10, width: 1, height: 1 });
        expect(canvasContext.fillStyle).toEqual(new Color( 12, 12, 12, 0.5).toStringWithAlpha());

        let imageData = canvas.getColor(10, 10);
        expect(imageData).toEqual(new Color( 0, 0, 0, 0));  // Mock canvas context always returns the same data for getColor
    });
    it ( 'should be able to convert to and from a Layer', (  ) => {
        let document = MockDOM.getTestingHTMLDOM();
        let entryTitles = document.getElementsByClassName('entry-title');
        let div = entryTitles[0];
        ReactDOM.render(
            <Canvas
                id={'ID'}
                width={200}
                height={200}
            />,
            div
        );
        let canvas = new Canvas({ id: 'ID', width: '200', height: '200' });
        let canvasDOM = document.getElementById('ID');
        canvas.setCanvasDOMElement(canvasDOM);
        let layer = canvas.toLayer();
        expect(layer.width).toBe(canvas.props.width);
        expect(layer.height).toBe(canvas.props.height);
        for (let xLoop = 0; xLoop < layer.width; xLoop++) {
            for (let yLoop = 0; yLoop < layer.height; yLoop++) {
                let color = layer.getColor(xLoop, yLoop);
                expect(color).toEqual(new Color( 0, 0, 0, 0));
            }
        }
        let canvasContext = canvas.getContext();
        canvasContext.reset();
        canvas.fromLayer(layer);
        expect(canvasContext.fillRectParams.length).toBe( canvas.props.width * canvas.props.height );
    });
    it ( 'should be able to load an image from a url', ( done ) => {
        let document = MockDOM.getTestingHTMLDOM();
        let entryTitles = document.getElementsByClassName('entry-title');
        let div = entryTitles[0];
        ReactDOM.render(
            <Canvas
                id={'ID'}
                width={200}
                height={200}
            />,
            div
        );
        let canvas = new Canvas({ id: 'ID', width: '200', height: '200' });
        let canvasDOM = document.getElementById('ID');
        canvas.setCanvasDOMElement(canvasDOM);
        canvas.drawImage('https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/800px-The_Earth_seen_from_Apollo_17.jpg')
            .then(( result ) => { expect(result).toBe( canvas ); done(); });
    });
});
