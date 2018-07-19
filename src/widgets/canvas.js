import React from "react";
import Color from "../util/art/color";
import Layer from "../util/art/layer";

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        if (!this.props) this.props = props;
        this.canvasDOMElement = null;
    }
    setCanvasDOMElement(canvasDOMElement) {
        this.canvasDOMElement = canvasDOMElement;
    }
    getContext() {
        if (!this.canvasDOMElement) return null;
        return this.canvasDOMElement.getContext("2d");
    }
    setColor(inX, inY, inColor) {
        let context = this.getContext();
        context.fillStyle = inColor.toStringWithAlpha();
        context.fillRect( inX, inY, 1, 1 );
    }
    getColor(inX, inY) {
        let oImageData = this.getContext().getImageData( inX,  inY, 1, 1 );
        return new Color(oImageData.data[0], oImageData.data[1], oImageData.data[2], oImageData.data[3] / 255, false);
    }
    toLayer() {
        let layer = new Layer( this.props.width, this.props.height );
        for (let rowLoop = 0; rowLoop < this.props.height; rowLoop++) {
            for (let colLoop = 0; colLoop < this.props.width; colLoop++) {
                layer.setColor( colLoop, rowLoop, this.getColor( colLoop, rowLoop ))
            }
        }
        return layer;
    }
    fromLayer(layer) {
        if (this.props.width !== layer.width) return;
        if (this.props.height !== layer.height) return;
        for (let rowLoop = 0; rowLoop < this.props.height; rowLoop++) {
            for (let colLoop = 0; colLoop < this.props.width; colLoop++) {
                this.setColor( colLoop, rowLoop, layer.getColor( colLoop, rowLoop ))
            }
        }
        return layer;
    }
    drawImage(inURL) {
        return new Promise((resolve, reject) => {
            let imageObj = new Image();
            imageObj.onload = () => {
                this.getContext().drawImage(imageObj, 0, 0);
                resolve && resolve(this);
            };
            imageObj.onerror = () => {
                reject && reject({ err: 'Image load failed.', canvas: this });
            };
            imageObj.src = inURL;
        });
    }

    render() {
        return ( <canvas id={this.props.id} width={this.props.width} height={this.props.height}/> );
    }

}
