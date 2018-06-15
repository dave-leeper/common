export default class Cookies {
    static setCookie(name, value, hours) {
        let expires = "";
        if (hours) {
            let date = new Date();
            date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    static getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        if (ca) {
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

    static eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }
}