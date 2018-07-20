//@formatter:off
'use strict';
import Queue from "./queue";
import Messages from "./messages";
import Log from "./log";

describe( 'As a developer, I need to send and receive messages using a queue.', function() {
    beforeAll(() => {
        console.log('BEGIN QUEUE TEST ===========================================');
    });
    beforeEach(() => {
    });
    afterEach(() => {
        Queue.unregisterAll();
    });
    afterAll(() => {
    });
    it ( 'should be able to register and unregister listeners.', (  ) => {
        let a = {};
        let b = {};
        let m = "m";
        Queue.register(a, m, () => {});
        Queue.register(b, m, () => {});
        expect(Queue.isRegistered(a, m)).toBe(true);
        expect(Queue.isRegistered(b, m)).toBe(true);
        let r = Queue.unregister(a, m);
        expect(Queue.isRegistered(a, m)).toBe(false);
        expect(Queue.isRegistered(b, m)).toBe(true);
        expect(Array.isArray(r)).toBe(true);
        expect(r.length).toBe(1);
        expect(r[0]).not.toBeNull();
        expect(r[0].listener).toBe(a);
        expect(r[0].message).toBe(m);
        r = Queue.unregister(a, m);
        expect(Array.isArray(r)).toBe(true);
        expect(r.length).toBe(0);
        Queue.unregisterAll();
        expect(Queue.isRegistered(b, m)).toBe(false);
    });
    it ( 'should be able to send messages to registered listeners.', ( done ) => {
        let a = {};
        let b = {};
        let m = "m";
        let n = "n";
        Queue.register(a, m, (data) => {
            expect(data).toBe(1);
            done();
        });
        Queue.register(b, n, () => {expect(true).toBe(false);});
        Queue.broadcast(m, 1);
    });
    it ( 'should be able to send error messages.', ( done ) => {
        let a = {};
        Queue.register(a, Messages.ERROR, (data) => {
            expect(data.message == "ERROR").toBe(true);
            done();
        });
        Queue.broadcastError("ERROR");
    });
    it ( 'should be able to send notification messages.', ( done ) => {
        let a = {};
        Queue.register(a, Messages.NOTIFICATION, (data) => {
            expect(data.message == "NOTIFICATION").toBe(true);
            done();
        });
        Queue.broadcastNotification("NOTIFICATION");
    });
    it ( 'should be able to invoke listeners that return promises back to the original broadcaster', ( done ) => {
        let a = {};
        Queue.register(a, Messages.NOTIFICATION, (data) => {
            return new Promise((resolve, reject) => {
                resolve(1);
            });
        });
        Queue.call("NOTIFICATION").then((data) => {
            expect(data == 1).toBe(true);
            done();
        })
    });
    it ( 'should be able to invoke listeners that return promises back to the original broadcaster (multiple listeners)', ( done ) => {
        let a = {};
        let b = {};
        let c = {};
        Queue.register(a, Messages.NOTIFICATION, (data) => {
            return new Promise((resolve, reject) => {
                resolve(1);
            });
        });
        Queue.register(b, Messages.NOTIFICATION, (data) => {
            return new Promise((resolve, reject) => {
                resolve(2);
            });
        });
        Queue.register(c, Messages.NOTIFICATION, (data) => {
            return new Promise((resolve, reject) => {
                resolve(3);
            });
        });
        Queue.call("NOTIFICATION").then((data) => {
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBe(3);
            expect(data[0]).toBe(1);
            expect(data[1]).toBe(2);
            expect(data[2]).toBe(3);
            done();
        })
    });
    it ( 'should be able to invoke listeners that return promises back to the original broadcaster (zero listeners)', ( done ) => {
        Queue.call("NOTIFICATION").then((data) => {
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBe(0);
            done();
        })
    });
    it ( 'should be able to invoke listeners that return promises back to the original broadcaster (reject)', ( done ) => {
        let a = {};
        Queue.register(a, Messages.NOTIFICATION, (data) => {
            return new Promise((resolve, reject) => {
                reject(1);
            });
        });
        Queue.call("NOTIFICATION").then((data) => {
        }, (error) => {
            expect(error == 1).toBe(true);
            done();
        })
    });
    it ( 'should be able to invoke listeners that return promises back to the original broadcaster (multiple listeners with reject)', ( done ) => {
        let a = {};
        let b = {};
        let c = {};
        Queue.register(a, Messages.NOTIFICATION, (data) => {
            return new Promise((resolve, reject) => {
                resolve(1);
            });
        });
        Queue.register(b, Messages.NOTIFICATION, (data) => {
            return new Promise((resolve, reject) => {
                reject(2);
            });
        });
        Queue.register(c, Messages.NOTIFICATION, (data) => {
            return new Promise((resolve, reject) => {
                resolve(3);
            });
        });
        Queue.call("NOTIFICATION").then((data) => {
        }, (error) => {
            expect(error).toBe(2);
            done();
        })
    });
    it ( 'should be able to invoke listeners that return promises back to the original broadcaster (multiple listeners with multiple reject)', ( done ) => {
        let a = {};
        let b = {};
        let c = {};
        Queue.register(a, Messages.NOTIFICATION, (data) => {
            return new Promise((resolve, reject) => {
                resolve(1);
            });
        });
        Queue.register(b, Messages.NOTIFICATION, (data) => {
            return new Promise((resolve, reject) => {
                reject(2);
            });
        });
        Queue.register(c, Messages.NOTIFICATION, (data) => {
            return new Promise((resolve, reject) => {
                reject(3);
            });
        });
        Queue.call("NOTIFICATION").then((data) => {
        }, (error) => {
            expect(error).toBe(2);
            done();
        })
    });
    it ( 'should be able to invoke listeners that return promises back to the original broadcaster (multiple listeners no promises)', ( done ) => {
        let a = {};
        let b = {};
        let c = {};
        Queue.register(a, Messages.NOTIFICATION, () => { return null; });
        Queue.register(b, Messages.NOTIFICATION, () => { return null; });
        Queue.register(c, Messages.NOTIFICATION, () => { return null; });
        Queue.call("NOTIFICATION").then((data) => {
            let r0 = data[0];
            let r1 = data[1];
            let r2 = data[2];
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBe(3);
            expect(r0 === null).toBe(true);
            expect(r1 === null).toBe(true);
            expect(r2 === null).toBe(true);
            done();
        })
    });
});
