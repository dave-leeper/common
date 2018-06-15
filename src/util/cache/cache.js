import Queue from "../queue";
import Messages from "../messages";

export default class Cache {
    maxPages = 5;
    pages = [];
    constructor(maxPages) {
        this.maxPages = ((maxPages)? maxPages : this.maxPages );
    }
    summary(detailed) {
        let summary = { pages: this.pages.length, maxPages: this.maxPages, pageInfo: [] };
        for (let loop = 0; loop < this.pages.length; loop++) {
            let page = this.pages[loop];
            let pageSummary = { number: page.pageNumber, lifetime: page.lifetime, isExpired: page.isExpired() };
            if (detailed) {
                pageSummary.pageSummary = page.summary(detailed);
            }
            summary.pageInfo.push(pageSummary);
        }
        return summary;
    }
    addPage(page) {
        if (this.hasPage(page.pageNumber)) this.removePage(page.pageNumber);
        if (this.maxPages <= this.getPageCount()) this.removeFurthestPage( page.pageNumber );
        if (this.maxPages <= this.getPageCount()) this.removeOldestPage( page.pageNumber );
        this.pages.unshift(page);
        Queue.broadcast(
            Messages.CACHE_PAGE_ADDED,
            { page: page, pageCount: this.pages.length }
        );
    }
    splicePage(newPage) {
        if (!this.hasPage(newPage.pageNumber)) return null;
        for (let loop = 0; loop < this.getPageCount(); loop++) {
            let page = this.pages[loop];
            if (newPage.pageNumber !== page.pageNumber) continue;
            let splicedPage = this.pages.splice(loop, 1, newPage);
            Queue.broadcast(
                Messages.CACHE_PAGE_REFRESHED,
                {oldPage: splicedPage[0], newPage: newPage, pageNumber: newPage.pageNumber}
            );
            return splicedPage;
        }
        return null;
    }
    hasPage(pageNumber) {
        for (let loop = 0; loop < this.pages.length; loop++) {
            if (pageNumber === this.pages[loop].pageNumber) return true;
        }
        return false;
    }
    hasData(pageNumber) {
        for (let loop = 0; loop < this.pages.length; loop++) {
            if (pageNumber === this.pages[loop].pageNumber) return this.pages[loop].hasData();
        }
        return false;
    }
    isFull() {
        return this.maxPages <= this.pages.length;
    }
    getPage(pageNumber) {
        for (let loop = 0; loop < this.pages.length; loop++) {
            if (pageNumber === this.pages[loop].pageNumber) {
                return this.pages[loop];
            }
        }
        return null;
    }
    getPageCount() {
        return this.pages.length;
    }
    removePage(pageNumber) {
        for (let loop = 0; loop < this.pages.length; loop++) {
            if (pageNumber === this.pages[loop].pageNumber) {
                let result = this.pages.splice(loop, 1);
                Queue.broadcast(
                    Messages.CACHE_PAGE_REMOVED,
                    { page: result[0], pageCount: this.pages.length }
                );
                return result;
            }
        }
        return null;
    }
    getExpiredPages(keepPageNumber) {
        let expiredPages = [];
        if (!this.pages || ! this.pages.length) return expiredPages;
        for (let loop = this.pages.length - 1; loop >= 0; loop--) {
            let page = this.pages[loop];
            if (keepPageNumber === page.pageNumber) continue;
            if (!page.isExpired()) continue;
            expiredPages.push(page);
        }
        return expiredPages;
    }
    removeOldestPage(keepPageNumber) {
        if (!this.pages || ! this.pages.length) return null;
        let oldestPage = null;
        for (let loop = 0; loop < this.pages.length; loop++) {
            let page = this.pages[loop];
            if ((null === oldestPage) || (page.createdAt < oldestPage.createdAt)) {
                if (page.pageNumber !== keepPageNumber) oldestPage = page;
            }
        }
        if (!oldestPage) return null;
        let removedPage = this.removePage(oldestPage.pageNumber);
        return removedPage;
    }
    removeFurthestPage(currentPageNumber) {
        if (!this.pages || ! this.pages.length) return null;
        let currentPage = this.getPage(currentPageNumber);
        let furthestPage = currentPage;
        let furthestDistance = 0;
        for (let loop = 0; loop < this.pages.length; loop++) {
            let page = this.pages[loop];
            if (page.currentPage === currentPageNumber) continue;
            if (!currentPage) {
                currentPage = page;
                furthestPage = page;
            }
            if (furthestDistance < Math.abs(page.pageNumber - currentPage.pageNumber)) {
                furthestPage = page;
                furthestDistance = Math.abs(page.pageNumber - currentPage.pageNumber);
            }
        }
        if (!furthestPage) return null;
        let removedPage = this.removePage(furthestPage.pageNumber);
        return removedPage;
    }
    clear() {
        this.pages = [];
        Queue.broadcast( Messages.CACHE_CLEARED, { pageCount: this.pages.length });
    }
}