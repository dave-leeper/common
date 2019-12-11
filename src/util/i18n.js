let fs = require("fs");

function I18n(){};
I18n.locale = 'en-US';
I18n.strings = require('./strings-' + I18n.locale);
I18n.setLocale = function(locale) {
    if (!fs.existsSync('./strings-' + locale)) return;
    let strings = require('./strings-' + locale);
    if (!strings) return;
    I18n.locale = locale;
    I18n.strings = strings;
};
I18n.get = function(stringId) {
    if ((!Number.isInteger(stringId)) || (0 > stringId) || (stringId >= I18n.strings.length)) return null;
    return I18n.strings[stringId];
};

module.exports = I18n;
