
export default class EmojiParsingService {
    static REGEX_HTML_EMOJI = /&#x(?:[0-9A-Fa-f]){5}/;
    static REGEX_HTML_EMOJI2 = /&#(?:[0-9A-Fa-f]){4,5};/;
    static REGEX_UNICODE_EMOJI = /\\(u|U)D83D\\(u|U)(?:[0-9A-Fa-f]){4}/;
    static REGEX_HEX_EMOJI = /0(x|X)D83D0(x|X)(?:[0-9A-Fa-f]){4}/;

    static HTML_ELEMENT = document.createElement('p');

    static hasHTMLEmoji(text) {
        return (EmojiParsingService.REGEX_HTML_EMOJI.test(text) | EmojiParsingService.REGEX_HTML_EMOJI2.test(text));
    }

    static hasUnicodeEmoji(text) {
        return EmojiParsingService.REGEX_UNICODE_EMOJI.test(text);
    }

    static hasHexEmoji(text) {
        return EmojiParsingService.REGEX_HEX_EMOJI.test(text);
    }

    static convertHTMLEmoji(text) {
        if (!EmojiParsingService.hasHTMLEmoji(text)) return text;
        let index = text.search(EmojiParsingService.REGEX_HTML_EMOJI);
        while (-1 !== index) {
            EmojiParsingService.HTML_ELEMENT.innerHTML = text.substr(index, 8);
            text = text.replace(EmojiParsingService.REGEX_HTML_EMOJI, EmojiParsingService.HTML_ELEMENT.innerHTML);
            index = text.search(EmojiParsingService.REGEX_HTML_EMOJI);
        }
        index = text.search(EmojiParsingService.REGEX_HTML_EMOJI2);
        while (-1 !== index) {
            EmojiParsingService.HTML_ELEMENT.innerHTML = text.substr(index, 8);
            text = text.replace(EmojiParsingService.REGEX_HTML_EMOJI2, EmojiParsingService.HTML_ELEMENT.innerHTML);
            index = text.search(EmojiParsingService.REGEX_HTML_EMOJI2);
        }
        return text;
    }

    static convertUnicodeEmoji(text) {
        if (!EmojiParsingService.hasUnicodeEmoji(text)) return text;
        let index = text.search(EmojiParsingService.REGEX_UNICODE_EMOJI);
        while (-1 !== index) {
            let unicode = text.substr(index, 12);
            let codepoint1 = parseInt(unicode.substr(2, 4), 16);
            let codepoint2 = parseInt(unicode.substr(8, 4), 16);
            let codepoint = (codepoint1 - 0xD800) * 0x400 + codepoint2 - 0xDC00 + 0x10000;
            text = text.replace(EmojiParsingService.REGEX_UNICODE_EMOJI, String.fromCodePoint(codepoint));
            index = text.search(EmojiParsingService.REGEX_UNICODE_EMOJI);
        }
        return text;
    }

    static convertHexEmoji(text) {
        if (!EmojiParsingService.hasHexEmoji(text)) return text;
        let index = text.search(EmojiParsingService.REGEX_HEX_EMOJI);
        while (-1 !== index) {
            let hex = text.substr(index, 12);
            let codepoint1 = parseInt(hex.substr(2, 4), 16);
            let codepoint2 = parseInt(hex.substr(8, 4), 16);
            let codepoint = (codepoint1 - 0xD800) * 0x400 + codepoint2 - 0xDC00 + 0x10000;
            text = text.replace(EmojiParsingService.REGEX_HEX_EMOJI, String.fromCodePoint(codepoint));
            index = text.search(EmojiParsingService.REGEX_HEX_EMOJI);
        }
        return text;
    }

    static convertEmoji(text) {
        let emojiText = EmojiParsingService.convertHTMLEmoji(text);
        emojiText = EmojiParsingService.convertUnicodeEmoji(emojiText);
        emojiText = EmojiParsingService.convertHexEmoji(emojiText);
        return emojiText.replace(/:skin-tone-1:/i, '');
    }
}