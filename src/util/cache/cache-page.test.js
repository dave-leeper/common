//@formatter:off
'use strict';
import CachePage from './cache-page'
import Queue from "../queue";

describe( 'As a developer, I need to object a page of information', function() {
    beforeAll(() => {
    });
    beforeEach(() => {
    });
    afterEach(() => {
        Queue.unregisterAll();
    });
    afterAll(() => {
    });
    it ( 'should be be able to create a object page', (  ) => {
        let data = "TEST DATA";
        let pageNumber = 0;
        let parentPostId = "PARENT POST ID";
        let lifetime = 1000 * 30;
        let cachePage = new CachePage(data, pageNumber, lifetime);
        expect(cachePage.data).toBe(data);
        expect(cachePage.pageNumber).toBe(pageNumber);
        expect(cachePage.lifetime).toBe(lifetime);
        expect(cachePage.createdAt).not.toBeUndefined;
        expect(cachePage.createdAt).toBeLessThanOrEqual(new Date().getTime());
        expect(cachePage.hasData()).toBe(true);
    });
    it ( 'should not expire a page with a lifetime of CachePage.NEVER_EXPIRES', (  ) => {
        let data = "TEST DATA";
        let pageNumber = 0;
        let lifetime = CachePage.NEVER_EXPIRES;
        let cachePage = new CachePage(data, pageNumber, lifetime);
        expect(cachePage.isExpired()).toBe(false);
    });
    it ( 'should expire when told to do so', (  ) => {
        let data = "TEST DATA";
        let pageNumber = 0;
        let lifetime = CachePage.NEVER_EXPIRES;
        let cachePage = new CachePage(data, pageNumber, lifetime);
        cachePage.expireNow();
        expect(cachePage.isExpired()).toBe(true);
        expect(cachePage.lifetime).toBe(-1);
    });
});

