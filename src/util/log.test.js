//@formatter:off
'use strict';
let Log = require('./log' );
const recording = require('log4js/lib/appenders/recording');
let config = {
    appenders: {
        mem: { type: "recording" },
        out: { type: "stdout" }
    },
    categories: {
        default:{
            appenders: ["mem", "out"],
            level : "trace"
        }
    }
};

describe( 'As a developer, I need to be able to log information.', function() {
    beforeAll(() => {
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    afterAll(() => {
    });
    it ( 'should accept config info', ( ) => {
        try { Log.configure(config); }
        catch (error) { expect(true).toBe(false); }
    });
    it ( 'should log data', ( ) => {
        Log.configure(config);
        Log.info("TEST DATA");
        const events = recording.replay(); // events is an array of LogEvent objects.
        expect(events).not.toBeNull;
        expect(events.length).toBe(1);
        expect(events[0].categoryName).toBe('default');
        expect(events[0].data).not.toBeNull;
        expect(events[0].data.length).toBe(1);
        expect(events[0].data[0].indexOf("TEST DATA")).not.toBe(-1);
    });
});
