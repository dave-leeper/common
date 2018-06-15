//@formatter:off
'use strict';
import Cache from './cache'
import CachePage from './cache-page'
import Queue from '../queue'
import Messages from '../messages'

describe( 'As a developer, I need a data object', function() {
    beforeAll(() => {
    });
    beforeEach(() => {
    });
    afterEach(() => {
        Queue.unregisterAll();
    });
    afterAll(() => {
    });
    it ( 'should be be able to create a object and control its maximum size', (  ) => {
        Queue.unregisterAll();
        let maxPages = 5;
        let cache = new Cache(maxPages);
        expect(cache.maxPages).toBe(maxPages);
    });
    it ( 'should be be able to add a page, even when full, and get the pages back out', (  ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage3 = new CachePage("DATA", 2, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage4 = new CachePage("DATA", 3, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage5 = new CachePage("DATA", 4, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage6 = new CachePage("DATA", 5, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        cache.addPage(cachePage1);
        expect(cache.getPageCount()).toBe(1);
        expect(cache.hasPage(cachePage1.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage1.pageNumber)).toBe(cachePage1);
        expect(cache.isFull()).toBe(false);
        cache.addPage(cachePage2);
        expect(cache.getPageCount()).toBe(2);
        expect(cache.hasPage(cachePage1.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage1.pageNumber)).toBe(cachePage1);
        expect(cache.hasPage(cachePage2.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage2.pageNumber)).toBe(cachePage2);
        expect(cache.isFull()).toBe(false);
        cache.addPage(cachePage3);
        expect(cache.getPageCount()).toBe(3);
        expect(cache.hasPage(cachePage1.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage1.pageNumber)).toBe(cachePage1);
        expect(cache.hasPage(cachePage2.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage2.pageNumber)).toBe(cachePage2);
        expect(cache.hasPage(cachePage3.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage3.pageNumber)).toBe(cachePage3);
        expect(cache.isFull()).toBe(false);
        cache.addPage(cachePage4);
        expect(cache.getPageCount()).toBe(4);
        expect(cache.hasPage(cachePage1.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage1.pageNumber)).toBe(cachePage1);
        expect(cache.hasPage(cachePage2.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage2.pageNumber)).toBe(cachePage2);
        expect(cache.hasPage(cachePage3.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage3.pageNumber)).toBe(cachePage3);
        expect(cache.hasPage(cachePage4.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage4.pageNumber)).toBe(cachePage4);
        expect(cache.isFull()).toBe(false);
        cache.addPage(cachePage5);
        expect(cache.getPageCount()).toBe(5);
        expect(cache.hasPage(cachePage1.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage1.pageNumber)).toBe(cachePage1);
        expect(cache.hasPage(cachePage2.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage2.pageNumber)).toBe(cachePage2);
        expect(cache.hasPage(cachePage3.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage3.pageNumber)).toBe(cachePage3);
        expect(cache.hasPage(cachePage4.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage4.pageNumber)).toBe(cachePage4);
        expect(cache.hasPage(cachePage5.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage5.pageNumber)).toBe(cachePage5);
        expect(cache.isFull()).toBe(true); // <---
        cache.addPage(cachePage6);
        expect(cache.getPageCount()).toBe(5); // <---
        expect(cache.hasPage(cachePage1.pageNumber)).toBe(false); // <---
        expect(cache.getPage(cachePage1.pageNumber)).toBe(null); // <---
        expect(cache.hasPage(cachePage2.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage2.pageNumber)).toBe(cachePage2);
        expect(cache.hasPage(cachePage3.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage3.pageNumber)).toBe(cachePage3);
        expect(cache.hasPage(cachePage4.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage4.pageNumber)).toBe(cachePage4);
        expect(cache.hasPage(cachePage5.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage5.pageNumber)).toBe(cachePage5);
        expect(cache.hasPage(cachePage6.pageNumber)).toBe(true);
        expect(cache.getPage(cachePage6.pageNumber)).toBe(cachePage6);
        expect(cache.isFull()).toBe(true);
    });
    it ( 'should return null when requesting a page not in the object.', (  ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage3 = new CachePage("DATA", 2, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage4 = new CachePage("DATA", 3, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage5 = new CachePage("DATA", 4, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        cache.addPage(cachePage1);
        cache.addPage(cachePage2);
        cache.addPage(cachePage3);
        cache.addPage(cachePage4);
        cache.addPage(cachePage5);
        expect(cache.hasPage(5)).toBe(false);
        expect(cache.getPage(5)).toBe(null);
    });
    it ( 'should know when is has data.', (  ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage3 = new CachePage("DATA", 2, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage4 = new CachePage("DATA", 3, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage5 = new CachePage("DATA", 4, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        expect(cache.hasData(0)).toBe(false);
        expect(cache.hasData(1)).toBe(false);
        expect(cache.hasData(2)).toBe(false);
        expect(cache.hasData(3)).toBe(false);
        expect(cache.hasData(4)).toBe(false);
        cache.addPage(cachePage1);
        cache.addPage(cachePage2);
        cache.addPage(cachePage3);
        cache.addPage(cachePage4);
        cache.addPage(cachePage5);
        expect(cache.hasData(0)).toBe(true);
        expect(cache.hasData(1)).toBe(true);
        expect(cache.hasData(2)).toBe(true);
        expect(cache.hasData(3)).toBe(true);
        expect(cache.hasData(4)).toBe(true);
        expect(cache.hasData(5)).toBe(false);
    });
    it ( 'should be able to remove a page.', (  ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage3 = new CachePage("DATA", 2, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage4 = new CachePage("DATA", 3, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage5 = new CachePage("DATA", 4, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        cache.addPage(cachePage1);
        cache.addPage(cachePage2);
        cache.addPage(cachePage3);
        cache.addPage(cachePage4);
        cache.addPage(cachePage5);
        expect(cache.hasPage(0)).toBe(true);
        let removedPages = cache.removePage(0);
        expect(cache.hasPage(0)).toBe(false);
        expect(removedPages.length).toBe(1);
        expect(removedPages[0]).toBe(cachePage1);
        removedPages = cache.removePage(9999);
        expect(removedPages).toBe(null);
    });
    it ( 'should be able to get expired pages.', (  ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage3 = new CachePage("DATA", 2, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage4 = new CachePage("DATA", 3, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage5 = new CachePage("DATA", 4, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        cache.addPage(cachePage1);
        cache.addPage(cachePage2);
        cache.addPage(cachePage3);
        cache.addPage(cachePage4);
        cache.addPage(cachePage5);
        cachePage1.expireNow();
        cachePage3.expireNow();
        cachePage5.expireNow();
        let expiredPages = cache.getExpiredPages();
        expect(expiredPages.length).toBe(3);
        expect(expiredPages[0]).toBe(cachePage1);
        expect(expiredPages[1]).toBe(cachePage3);
        expect(expiredPages[2]).toBe(cachePage5);
        expect(cache.hasPage(cachePage1.pageNumber)).toBe(true);
        expect(cache.hasPage(cachePage3.pageNumber)).toBe(true);
        expect(cache.hasPage(cachePage5.pageNumber)).toBe(true);
    });
    it ( 'should be able to remove the oldest page.', (  ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage3 = new CachePage("DATA", 2, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage4 = new CachePage("DATA", 3, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage5 = new CachePage("DATA", 4, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let now = new Date().getTime();
        cache.addPage(cachePage1);
        cache.addPage(cachePage2);
        cache.addPage(cachePage3);
        cache.addPage(cachePage4);
        cache.addPage(cachePage5);
        cachePage1.createdAt = now + 10;
        cachePage2.createdAt = now + 20;
        cachePage3.createdAt = now + 30;
        cachePage4.createdAt = now + 40;
        cachePage5.createdAt = now + 50;
        let removedPage = cache.removeOldestPage(9999);
        expect(removedPage.length).toBe(1);
        expect(removedPage[0]).toBe(cachePage1);
        expect(cache.getPageCount()).toBe(4);
        expect(cache.hasPage(cachePage1.pageNumber)).toBe(false);
        removedPage = cache.removeOldestPage(1); // <-- keep pageNumber 1
        expect(removedPage.length).toBe(1);
        expect(removedPage[0]).toBe(cachePage3);
        expect(cache.getPageCount()).toBe(3);
        expect(cache.hasPage(cachePage3.pageNumber)).toBe(false);
    });
    it ( 'should be able to remove the furthest page.', (  ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage3 = new CachePage("DATA", 2, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage4 = new CachePage("DATA", 3, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage5 = new CachePage("DATA", 4, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        cache.addPage(cachePage1);
        cache.addPage(cachePage2);
        cache.addPage(cachePage3);
        cache.addPage(cachePage4);
        cache.addPage(cachePage5);
        let removedPage = cache.removeFurthestPage(4); // <-- furthest from pageNumber 4
        expect(removedPage.length).toBe(1);
        expect(removedPage[0]).toBe(cachePage1);
        expect(cache.getPageCount()).toBe(4);
        expect(cache.hasPage(cachePage1.pageNumber)).toBe(false);
        removedPage = cache.removeFurthestPage(1); // <-- furthest from pageNumber 1
        expect(removedPage.length).toBe(1);
        expect(removedPage[0]).toBe(cachePage5);
        expect(cache.getPageCount()).toBe(3);
        expect(cache.hasPage(cachePage5.pageNumber)).toBe(false);
        removedPage = cache.removeFurthestPage(3); // <-- furthest from pageNumber 3
        expect(removedPage.length).toBe(1);
        expect((removedPage[0] === cachePage2) || (removedPage[0] === cachePage4)).toBe(true);
        expect(cache.getPageCount()).toBe(2);
        expect(cache.hasPage(cachePage2.pageNumber) && cache.hasPage(cachePage4.pageNumber)).toBe(false);
        expect(cache.hasPage(cachePage2.pageNumber) || cache.hasPage(cachePage4.pageNumber)).toBe(true);
    });
    it ( 'should be able to clear the object', (  ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage3 = new CachePage("DATA", 2, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage4 = new CachePage("DATA", 3, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage5 = new CachePage("DATA", 4, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        cache.addPage(cachePage1);
        cache.addPage(cachePage2);
        cache.addPage(cachePage3);
        cache.addPage(cachePage4);
        cache.addPage(cachePage5);
        cache.clear();
        expect(cache.hasPage(cachePage1.pageNumber)).toBe(false);
        expect(cache.hasPage(cachePage2.pageNumber)).toBe(false);
        expect(cache.hasPage(cachePage3.pageNumber)).toBe(false);
        expect(cache.hasPage(cachePage4.pageNumber)).toBe(false);
        expect(cache.hasPage(cachePage5.pageNumber)).toBe(false);
    });
    it ( 'should be able to splice a page', (  ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage3 = new CachePage("DATA", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        cache.addPage(cachePage1);
        expect(cache.pages.length).toBe(1);
        expect(cache.pages[0]).toBe(cachePage1);
        let splicedPage = cache.splicePage(cachePage2); // <--- Same pageNumber as cachePage1
        expect(splicedPage.length).toBe(1);
        expect(splicedPage[0]).toBe(cachePage1);
        expect(cache.pages.length).toBe(1);
        expect(cache.pages[0]).toBe(cachePage2);
        splicedPage = cache.splicePage(cachePage3); // <--- Different pageNumber from cachePage2
        expect(splicedPage).toBe(null);
        expect(cache.pages.length).toBe(1);
        expect(cache.pages[0]).toBe(cachePage2);
    });
    it ( 'should send a message when a page is added', ( done ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let receiver = {
            onMessage: ( data ) => {
                expect(data.page.data).toBe(cachePage1.data);
                expect(data.pageCount).toBe(1);
                Queue.unregister("TESTING", Messages.CACHE_PAGE_ADDED);
                done();
            }
        };
        Queue.register("TESTING", Messages.CACHE_PAGE_ADDED, (data) => {
            receiver.onMessage( data);
        });
        cache.addPage(cachePage1);
    });
    it ( 'should send a message when a page is spliced', ( done ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA2", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let receiver = {
            onMessage: ( data ) => {
                expect(data.oldPage.data).toBe(cachePage1.data);
                expect(data.newPage.data).toBe(cachePage2.data);
                expect(cachePage2.pageNumber).toBe(data.pageNumber);
                Queue.unregister("TESTING", Messages.CACHE_PAGE_REFRESHED);
                done();
            }
        };
        Queue.register("TESTING", Messages.CACHE_PAGE_REFRESHED, (data) => {
            receiver.onMessage( data);
        });
        cache.addPage(cachePage1);
        cache.splicePage(cachePage2);
    });
    it ( 'should send a message when a page is removed', ( done ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let receiver = {
            onMessage: ( data ) => {
                expect(data.page.data).toBe(cachePage1.data);
                expect(data.pageCount).toBe(0);
                Queue.unregister("TESTING", Messages.CACHE_PAGE_REMOVED);
                done();
            }
        };
        Queue.register("TESTING", Messages.CACHE_PAGE_REMOVED, (data) => {
            receiver.onMessage( data);
        });
        cache.addPage(cachePage1);
        cache.removePage(cachePage1.pageNumber);
    });
    it ( 'should send a message when the oldest page is removed', ( done ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA2", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let now = new Date().getTime();
        let receiver = {
            onMessage1: ( data ) => {
                expect(data.page.data).toBe(cachePage1.data);
                expect(data.pageCount).toBe(1);
                Queue.unregister("TESTING", Messages.CACHE_PAGE_REMOVED);
                done();
            }
        };
        Queue.register("TESTING", Messages.CACHE_PAGE_REMOVED, (data) => {
            receiver.onMessage1( data );
        });
        cache.addPage(cachePage1);
        cache.addPage(cachePage2);
        cachePage1.createdAt = now + 10;
        cachePage2.createdAt = now + 20;
        cache.removeOldestPage(cachePage2.pageNumber);
    });
    it ( 'should send a message when the furthest page is removed', ( done ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let receiver = {
            onMessage1: ( data ) => {
                expect(data.page.data).toBe(cachePage2.data);
                expect(data.pageCount).toBe(1);
                Queue.unregister("TESTING", Messages.CACHE_PAGE_REMOVED);
                done();
            }
        };
        Queue.register("TESTING", Messages.CACHE_PAGE_REMOVED, (data) => {
            receiver.onMessage1( data );
        });
        cache.addPage(cachePage1);
        cache.addPage(cachePage2);
        cache.removeFurthestPage(cachePage1.pageNumber);
    });
    it ( 'should send a message when the object is cleared', ( done ) => {
        let maxPages = 5;
        let cache = new Cache(maxPages);
        let cachePage1 = new CachePage("DATA", 0, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let cachePage2 = new CachePage("DATA", 1, "PARENT", CachePage.NEVER_EXPIRES, null, false);
        let receiver = {
            onMessage1: ( data ) => {
                expect(data.pageCount).toBe(0);
                Queue.unregister("TESTING", Messages.CACHE_CLEARED);
                done();
            }
        };
        Queue.register("TESTING", Messages.CACHE_CLEARED, (data) => {
            receiver.onMessage1( data );
        });
        cache.addPage(cachePage1);
        cache.addPage(cachePage2);
        cache.clear();
    });
});

