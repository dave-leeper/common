export default class CachePage {
    static TEN_SECONDS = (1000 * 10);
    static ONE_MINUTE = (1000 * 60);
    static DEFAULT_LIFETIME = (1000 * 20);
    static NEVER_EXPIRES = 0;
    data;
    pageNumber;
    createdAt;
    lifetime;

    constructor(data, pageNumber, lifetime) {
        this.data = data;
        this.pageNumber = pageNumber;
        this.createdAt = new Date().getTime();
        this.lifetime = lifetime;
    }
    isExpired() {
        if (-1 === this.lifetime) return true;
        if (!this.lifetime) return false;
        let now = new Date().getTime();
        return (this.createdAt + this.lifetime < now);
    }
    expireNow() {
        this.lifetime = -1;
    }
    hasData() {
        return (!!this.data);
    }
    summary(detailed) {
        let summary = {
            pageNumber: this.pageNumber,
            createdAt: this.createdAt,
            lifetime: this.lifetime
        };
        return summary;
    }
}