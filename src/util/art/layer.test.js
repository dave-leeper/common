//@formatter:off
'use strict';
import Layer from './layer'
import Color from "./color";

describe( 'As a developer, I need to work with layers of color', function() {
    beforeAll(() => {
        console.log('BEGIN LAYER TEST ===========================================');
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    afterAll(() => {
    });
    it ( 'should be be able to create a layer', (  ) => {
        let layer = new Layer(5, 20);
        let black = new Color(0, 0, 0, 0);
        expect(layer.width).toBe(5);
        expect(layer.height).toBe(20);
        expect(Array.isArray(layer.colors)).toBe(true);
        expect(layer.colors.length).toBe(20);
        for (let rowLoop = 0; rowLoop < layer.colors.length; rowLoop++) {
            let row = layer.colors[rowLoop];
            expect(Array.isArray(row)).toBe(true);
            expect(row.length).toBe(5);
            for (let colLoop = 0; colLoop < row.length; colLoop++) {
                let color = row[colLoop];
                expect(color.isEqual(black, 0.0001, 0.0001)).toBe(true);
            }
        }
    });
    it ( 'should be be able to set colors in a layer', (  ) => {
        let layer = new Layer(5, 20);
        let green = new Color(0, 255, 0, 0);
        layer.setColor(2, 3, green);
        expect(green.isEqual(layer.getColor(2, 3), 0.0001, 0.0001)).toBe(true);
        layer.fill(green);
        for (let rowLoop = 0; rowLoop < layer.colors.length; rowLoop++) {
            let row = layer.colors[rowLoop];
            for (let colLoop = 0; colLoop < row.length; colLoop++) {
                let color = row[colLoop];
                expect(color.isEqual(green, 0.0001, 0.0001)).toBe(true);
            }
        }
    });
    it ( 'should be be able to convert a layer to and from a string', (  ) => {
        let layer = new Layer(5, 20);
        let as_string = layer.toString();
        let as_json = JSON.parse(as_string);
        expect(as_json.width).toBe(layer.width);
        expect(as_json.height).toBe(layer.height);
        expect(Array.isArray(as_json.data)).toBe(true);
        expect(as_json.height).toBe(as_json.data.length);
        for (let rowLoop = 0; rowLoop < as_json.data.length; rowLoop++) {
            let row = as_json.data[rowLoop];
            expect(Array.isArray(row)).toBe(true);
            expect(row.length).toBe(layer.width);
            for (let colLoop = 0; colLoop < row.length; colLoop++) {
                let col = row[colLoop];
                expect(col).toBe("0, 0, 0, 0");
            }
        }
        let new_layer = Layer.fromString(as_string);
        expect(new_layer.width).toBe(layer.width);
        expect(new_layer.height).toBe(layer.height);
        expect(new_layer.colors.length).toBe(layer.colors.length);
        for (let rowLoop = 0; rowLoop < new_layer.colors.length; rowLoop++) {
            let row = layer.colors[rowLoop];
            let new_row = new_layer.colors[rowLoop];
            expect(Array.isArray(new_row)).toBe(true);
            expect(new_row.length).toBe(row.length);
            for (let colLoop = 0; colLoop < new_row.length; colLoop++) {
                let color = layer.getColor(colLoop, rowLoop);
                let new_color = new_layer.getColor(colLoop, rowLoop);
                expect(color.isEqual(new_color, 0.0001, 0.0001)).toBe(true);
            }
        }
    });
});

