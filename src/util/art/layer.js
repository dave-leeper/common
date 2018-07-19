import Color from "./color";

export default class Layer {
    static fromString(inString) {
        if (!inString) return;
        let data = JSON.parse(inString);
        let layer = new Layer( data.width, data.height );
        for (let rowLoop = 0; rowLoop < data.data.length; rowLoop++) {
            let row = data.data[rowLoop];
            for (let colLoop = 0; colLoop < row.length; colLoop++) {
                let col = row[colLoop];
                if ('transparent' !== col) col = 'rgba(' + col + ')';
                let oColor = Color.fromStringWithAlpha(col);
                layer.setColor(colLoop, rowLoop, oColor);
            }
        }
        return layer;
    }

    constructor(inWidth, inHeight) {
        this.width = inWidth ;
        this.height = inHeight ;
        this.colors = [];
        for (let xLoop = 0; xLoop < inHeight; xLoop++) {
            let row = [];

            this.colors.push(row);
            for (let yLoop = 0; yLoop < inWidth; yLoop++) {
                row.push(new Color(0, 0, 0, 0));
            }
        }
    }
    setColor(inX, inY, inColor) {
        if ((!inColor) || (!this.colors)) return;
        if ((0 > inX) || (0 > inY)) return;
        if ((inY >= this.colors.length) || (!(this.colors[inY])) || (inX >= this.colors[inY].length)) return;

        this.colors[inY][inX] = inColor;
    }
    getColor(inX, inY) {
        if (!this.colors) return null;
        if ((0 > inX) || (0 > inY)) return null;
        if ((inY >= this.colors.length) || (!(this.colors[inY])) || (inX >= this.colors[inY].length)) return null;

        return this.colors[inY][inX];
    }
    fill(inColor) {
        for (let xLoop = 0; xLoop < this.width; xLoop++) {
            for (let yLoop = 0; yLoop < this.height; yLoop++) {
                this.setColor(xLoop, yLoop, Color.get255Color(inColor));
            }
        }
    }
    toString() {
        let imageString = '{ "width": ' + this.width + ', "height": ' + this.height + ', "data": [';
        for (let yLoop = 0; yLoop < this.height; yLoop++) {
            if (0 < yLoop) imageString += ",";
            imageString += '\n[';
            for (let xLoop = 0; xLoop < this.width; xLoop++) {
                let oColor = Color.get255Color(this.getColor(xLoop, yLoop));
                let colorAsString = oColor.toStringWithAlpha();
                if ('transparent' !== colorAsString) colorAsString = colorAsString.substr( 5, colorAsString.length - 6 );
                if (0 < xLoop) imageString += ',';
                imageString += '"';
                imageString += colorAsString;
                imageString += '"';
            }
            imageString += ']';
        }
        imageString += ']}';
        return imageString;
    }
}
