//@formatter:off
'use strict';
import Registry from './registry'
import Cache from './cache/cache'

describe( 'As a developer, I need to work with multiple object controllers in a single application', function() {
    beforeAll(() => {
        console.log('BEGIN REGISTRY TEST ===========================================');
    });
    beforeEach(() => {
    });
    afterEach(() => {
        Registry.unregisterAll();
    });
    afterAll(() => {
    });
    it ( 'should be able to register and unregister listeners.', (  ) => {
        let a = new Cache(1);
        let b = new Cache(1);
        Registry.register(a, "A");
        Registry.register(b, "B");
        expect(Registry.get("A")).toBe(a);
        expect(Registry.get("B")).toBe(b);
        let r = Registry.unregister("A");
        expect(Registry.isRegistered("A")).toBe(false);
        expect(Registry.isRegistered("B")).toBe(true);
        expect(r).toBe(a);
        r = Registry.unregister("A");
        expect(r).toBeNull();
        Registry.unregisterAll();
        expect(Registry.isRegistered("B")).toBe(false);
        expect(Registry.get("B")).toBeNull();
    });
});

