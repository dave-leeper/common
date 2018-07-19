
export default class HistogramResult {
    constructor() {
        this.reset();
    }
    reset() {
        this.red = new Array(256 + 1).join('0').split('').map(parseFloat);
        this.green = new Array(256 + 1).join('0').split('').map(parseFloat);
        this.blue = new Array(256 + 1).join('0').split('').map(parseFloat);
        this.alpha = new Array(256 + 1).join('0').split('').map(parseFloat);
    }
}
