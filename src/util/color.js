export default class Color {
    static PARLER_RED   = new Color(0, 98, 33);     // #a60202

    // Basic colors
    static RED              = new Color(0, 100, 50);
    static GREEN            = new Color(120, 100, 25);
    static BLUE             = new Color(240, 100, 50);
    static ORANGE           = new Color(39, 100, 50);
    static PURPLE           = new Color(300, 100, 25);
    static YELLOW           = new Color(60, 100, 50);
    static CYAN             = new Color(180, 100, 50);
    static MAGENTA          = new Color(300, 100, 50);

    // Colors related to Parler red via color theory
    // http://rgb.to/hex/02a7a7
    static COMPLEMENTARY1   = new Color(0, 98, 33);     // #a60202
    static COMPLEMENTARY2   = new Color(180, 98, 33);   // #02a7a7
    static TRIAD1           = new Color(0, 98, 33);     // #a60202
    static TRIAD2           = new Color(120, 98, 33);   // #02a702
    static TRIAD3           = new Color(240, 98, 33);   // #0202a7
    static TETRAD1          = new Color(0, 98, 33);     // #a60202
    static TETRAD2          = new Color(60, 98, 33);    // #a7a702
    static TETRAD3          = new Color(180, 98, 33);   // #02a7a7
    static TETRAD4          = new Color(240, 98, 33);   // #0202a7
    static ANALOG1          = new Color(0, 98, 33);     // #a60202
    static ANALOG2          = new Color(0, 0, 33);      // #545454
    static ANALOG3          = new Color(45, 98, 33);    // #a77d02
    static ACCENT1          = new Color(0, 98, 33);     // #a60202
    static ACCENT2          = new Color(0, 0, 33);      // #545454
    static ACCENT3          = new Color(45, 98, 33);    // #a77d02
    static ACCENT4          = new Color(180, 98, 33);   // #02a7a7
    static SPLIT1           = new Color(0, 98, 33);     // #a60202
    static SPLIT2           = new Color(150, 98, 33);   // #02a754
    static SPLIT3           = new Color(210, 98, 33);   // #0254a7

    static getRandomBasicColor() {
        let randomColor = Math.floor(Math.random() * 8);
        if (0 === randomColor) return Color.RED;
        if (1 === randomColor) return Color.GREEN;
        if (2 === randomColor) return Color.BLUE;
        if (3 === randomColor) return Color.ORANGE;
        if (4 === randomColor) return Color.PURPLE;
        if (5 === randomColor) return Color.YELLOW;
        if (6 === randomColor) return Color.CYAN;
        if (7 === randomColor) return Color.MAGENTA;
    }
    static getRandomParlerColor() {
        let randomColor = Math.floor(Math.random() * 19);
        if (0 === randomColor) return Color.COMPLEMENTARY1;
        if (1 === randomColor) return Color.COMPLEMENTARY2;
        if (2 === randomColor) return Color.TRIAD1;
        if (3 === randomColor) return Color.TRIAD2;
        if (4 === randomColor) return Color.TRIAD3;
        if (5 === randomColor) return Color.TETRAD1;
        if (6 === randomColor) return Color.TETRAD2;
        if (7 === randomColor) return Color.TETRAD3;
        if (8 === randomColor) return Color.TETRAD4;
        if (9 === randomColor) return Color.ANALOG1;
        if (10 === randomColor) return Color.ANALOG2;
        if (11 === randomColor) return Color.ANALOG3;
        if (12 === randomColor) return Color.ACCENT1;
        if (13 === randomColor) return Color.ACCENT2;
        if (14 === randomColor) return Color.ACCENT3;
        if (15 === randomColor) return Color.ACCENT4;
        if (16 === randomColor) return Color.SPLIT1;
        if (17 === randomColor) return Color.SPLIT2;
        if (18 === randomColor) return Color.SPLIT3;
    }

    // https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion#9493060
    static RGBToHSL(r, g, b){
        let locals = {
            r: r / 255,
            g: g / 255,
            b: g / 255,
            max: Math.max(r / 255, g / 255, b / 255),
            min: Math.min(r / 255, g / 255, b / 255),
            h: (Math.max(r / 255, g / 255, b / 255) + Math.min(r / 255, g / 255, b / 255)) / 2,
            s: (Math.max(r / 255, g / 255, b / 255) + Math.min(r / 255, g / 255, b / 255)) / 2,
            l: (Math.max(r / 255, g / 255, b / 255) + Math.min(r / 255, g / 255, b / 255)) / 2,
        };

        if (locals.max === locals.min){
            locals.h = locals.s = 0; // achromatic
        } else {
            let d = locals.max - locals.min;
            locals.s = locals.l > 0.5 ? d / (2 - locals.max - locals.min) : d / (locals.max + locals.min);
            switch(locals.max){
                case locals.r: locals.h = (locals.g - locals.b) / d + (locals.g < locals.b ? 6 : 0); break;
                case locals.g: locals.h = (locals.b - locals.r) / d + 2; break;
                case locals.b: locals.h = (locals.r - locals.g) / d + 4; break;
                default: locals.r = locals.g = locals.b = 0; // Will never happen.
            }
            locals.h /= 6;
        }
        return [locals.h * 360, locals.s * 100, locals.l * 100];
    }

    constructor(hue, saturation, light) {
        this.hue = hue;
        this.saturation = saturation;
        this.light = light;
    }
    getDarkerColor(divisor) {
        let locals = { divisor: ((divisor)? divisor : 2 )};
        return new Color(this.hue, this.saturation, Math.round(this.light / locals.divisor));
    }
    getLighterColor(divisor) {
        let locals = { divisor: ((divisor)? divisor : 2 )};
        return new Color(this.hue, this.saturation, Math.min(100, this.light + Math.round(this.light / locals.divisor)));
    }
    getHSLColorString() {
        return 'hsl(' + this.hue + ', ' + this.saturation + '%, ' + this.light + '%)';
    }
    // https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion#9493060
    getRGBArray(){
        let locals = {
            r: 1,
            g: 1,
            b: 1,
            hue: this.hue / 360,
            saturation: this.saturation / 100,
            light: this.light /100,
        };
        if (0 !== locals.saturation) {
            let hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            let q = locals.light < 0.5 ? locals.light * (1 + locals.saturation) : locals.light + locals.saturation - locals.light * locals.saturation;
            let p = 2 * locals.light - q;
            locals.r = hue2rgb(p, q, locals.hue + 1/3);
            locals.g = hue2rgb(p, q, locals.hue);
            locals.b = hue2rgb(p, q, locals.hue - 1/3);
        }
        return [Math.round(locals.r * 255), Math.round(locals.g * 255), Math.round(locals.b * 255)];
    }
    getHexString() {
        let rgbArray = this.getRGBArray();
        let locals = {
            r: rgbArray[0].toString(16).padStart(2, '0'),
            g: rgbArray[1].toString(16).padStart(2, '0'),
            b: rgbArray[2].toString(16).padStart(2, '0'),
        };
        return '#' + locals.r + locals.g + locals.b;
    }
    getRGBAString(alpha) {
        let locals = {
            alpha: ((alpha)? alpha : 1.0 ),
            rgbArray: this.getRGBArray(),
        };
        return 'rgba(' + locals.rgbArray[0] + ', ' + locals.rgbArray[1] + ', ' + locals.rgbArray[2] + ', ' + locals.alpha + ')';
    }
}
