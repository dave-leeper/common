export default class URLParser {
    static REGEX_URL = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
    static REGEX_YOUTUBE = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/i;
    static REGEX_VIMEO = /(((?:https?:\/\/)?(?:www\.)?(vimeo\.com\/)(channels\/staffpicks\/)?(ondemand\/([0-9a-z]+)\/)?([0-9]+))|((https?:)?(\/\/player\.vimeo\.com\/video\/[0-9]+)))/i;
    static REGEX_DAILY_MOTION = /(?:https?:\/\/)?(?:www.)?(dailymotion\.com|dai\.ly)\/(embed\/)?((video\/([^_]+))|([^\/_]+))/i;
    static REGEX_IMAGE = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|svg))/i;

    static splitTextAndURLs ( text ) {
        if ( !text ) return [];
        const split = text.split ( this.REGEX_URL );

        if ( split ) {
            // Get rid of empty matches.
            for ( let loop1 = split.length - 1; loop1 >= 0; loop1-- ) {
                if ( !split[ loop1 ] ) {
                    split.splice ( loop1, 1 );
                }
            }
            // Merge matches where url was broken into two.
            for ( let loop2 = split.length - 2; loop2 >= 0; loop2-- ) {
                const value = split[ loop2 ];
                if ( '//' !== value ) continue;
                const previousValue = split[ loop2 + 1 ];
                const urlCandidate = value + previousValue;
                if ( !this.REGEX_URL.test ( urlCandidate ) ) continue;
                split[ loop2 + 1 ] = urlCandidate;
                split.splice ( loop2, 1 );
            }
        }
        return split;
    }

    static decorateSplitTextAndURLs ( textAndURLs ) {
        if ( !textAndURLs ) return [];
        let result = [];

        for ( let loop = 0; loop < textAndURLs.length; loop++ ) {
            // RegEx maintains an internal state, which we don't want. So we clone them each pass through the loop.
            let REGEX_URL = new RegExp(this.REGEX_URL.source);
            let REGEX_YOUTUBE = new RegExp(this.REGEX_YOUTUBE.source);
            let REGEX_VIMEO = new RegExp(this.REGEX_VIMEO.source);
            let REGEX_DAILY_MOTION = new RegExp(this.REGEX_DAILY_MOTION.source);
            let REGEX_IMAGE = new RegExp(this.REGEX_IMAGE.source);
            let decoratedValue = {
                order: loop,
                value: textAndURLs[ loop ],
                adjustedValue: textAndURLs[ loop ],
                text: false, url: false,
                video: false,
                youtube: false,
                vimeo: false,
                dailymotion: false,
                image: false
            };
            if ( REGEX_URL.test ( textAndURLs[ loop ] ) ) {
                decoratedValue.url = true;
                if ( REGEX_YOUTUBE.test ( textAndURLs[ loop ] ) ) {
                    decoratedValue.video = true;
                    decoratedValue.youtube = true;
                    decoratedValue.adjustedValue = decoratedValue.adjustedValue.replace ( 'watch?v=', 'embed/' );
                } else if ( REGEX_VIMEO.test ( textAndURLs[ loop ] ) ) {
                    decoratedValue.video = true;
                    decoratedValue.vimeo = true;
                    if ( !/player.vimeo.com/.test ( decoratedValue.adjustedValue ) ) {
                        decoratedValue.adjustedValue = decoratedValue.adjustedValue.replace ( /^https?:\/\//, '' );
                        decoratedValue.adjustedValue = decoratedValue.adjustedValue.replace ( /^www.?/, '' );
                        decoratedValue.adjustedValue = decoratedValue.adjustedValue.replace ( /^vimeo.com\//, '' );
                        decoratedValue.adjustedValue = decoratedValue.adjustedValue.replace ( /channels\/staffpicks\//, '' );
                        decoratedValue.adjustedValue = '//player.vimeo.com/video/' + decoratedValue.adjustedValue;
                    }
                } else if ( REGEX_DAILY_MOTION.test ( textAndURLs[ loop ] ) ) {
                    decoratedValue.video = true;
                    decoratedValue.dailymotion = true;
                    if ( !/\/embed\//.test ( decoratedValue.adjustedValue ) ) {
                        decoratedValue.adjustedValue = decoratedValue.adjustedValue.replace ( /\/video\//, '/embed/video/' );
                    }
                } else if ( REGEX_IMAGE.test ( textAndURLs[ loop ] ) ) decoratedValue.image = true;
            } else {
                decoratedValue.text = true;
            }
            result.push ( decoratedValue );
        }
        return result;
    }

    static getText ( decoratedTextAndUrls ) {
        let finalText = '';
        for ( let loop = 0; loop < decoratedTextAndUrls.length; loop++ ) {
            let decoratedTextOrUrl = decoratedTextAndUrls[ loop ];
            if ( (decoratedTextOrUrl.text) && (0 < decoratedTextOrUrl.value.length) ) {
                finalText += decoratedTextOrUrl.value;
            }
        }
        return finalText;
    }

    static getImages ( decoratedTextAndUrls, generateHTMLOptions ) {
        let maxImages = (generateHTMLOptions && generateHTMLOptions.maxImages) ?
            generateHTMLOptions.maxImages : decoratedTextAndUrls.length;
        let images = [];
        for ( let loop = 0; loop < decoratedTextAndUrls.length; loop++ ) {
            let decoratedTextOrUrl = decoratedTextAndUrls[ loop ];
            if ( (decoratedTextOrUrl.image) ) {
                images.push ( decoratedTextOrUrl.value );
                if ( images.length >= maxImages ) break;
            }
        }
        return images;
    }

    static getLink ( decoratedTextOrUrl ) {
        let link = {};
        if ( !decoratedTextOrUrl.url ) return link;
        if ( decoratedTextOrUrl.video ) return link;
        if ( decoratedTextOrUrl.image ) return link;
        let baseURL = decoratedTextOrUrl.value.replace ( /^https?:\/\//, '' );
        baseURL = baseURL.replace ( /^www./, '' );
        link = { url: decoratedTextOrUrl.value, display: baseURL };
        return link;
    }

    static getLinks ( decoratedTextAndUrls, generateHTMLOptions ) {
        let maxLinks = (generateHTMLOptions && generateHTMLOptions.maxLinks) ?
            generateHTMLOptions.maxVideos : decoratedTextAndUrls.length;
        let links = [];
        for ( let loop = 0; loop < decoratedTextAndUrls.length; loop++ ) {
            let decoratedTextOrUrl = decoratedTextAndUrls[ loop ];
            if ( !decoratedTextOrUrl.url ) continue;
            if ( decoratedTextOrUrl.video ) continue;
            if ( decoratedTextOrUrl.image ) continue;
            links.push (this.getLink( decoratedTextOrUrl ) );
            if ( links.length >= maxLinks ) break;
        }
        return links;
    }

    static getVideos ( decoratedTextAndUrls, generateHTMLOptions ) {
        let maxVideos = (generateHTMLOptions && generateHTMLOptions.maxVideos) ?
            generateHTMLOptions.maxVideos : decoratedTextAndUrls.length;
        let videos = [];
        for ( let loop = 0; loop < decoratedTextAndUrls.length; loop++ ) {
            let decoratedTextOrUrl = decoratedTextAndUrls[ loop ];
            if (decoratedTextOrUrl.video) {
                videos.push ( decoratedTextOrUrl.adjustedValue );
                if ( videos.length >= maxVideos ) break;
            }
        }
        return videos;
    }
}
