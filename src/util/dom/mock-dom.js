// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
export class MockClassList {
    classes = [];
    add() {
        for (let loop = 0; loop < arguments.length; loop++) {
            let className = arguments[loop];
            if (!this.contains(className)) this.classes.push(className);
        }
    }
    contains(className) {
        for (let loop = 0; loop < this.classes.length; loop++) {
            if (className === this.classes[loop]) return true;
        }
        return false;
    }
    item(index) {
        if (0 > index) return null;
        for (let loop = 0; loop < this.classes.length; loop++) {
            if (index === loop) return this.classes[loop];
        }
        return null;
    }
    remove() {
        for (let loop = arguments.length - 1; loop >= 0; loop--) {
            let className = arguments[loop];
            if (!this.contains(className)) this.classes.splice(loop, 1);
        }
    }
    toggle(className, force) {
        if (true === force) { this.add(className); return; }
        if (false === force) { this.remove(className); return; }
        if (this.contains(className)) this.remove(className);
        else this.add(className);
    }
}
// https://developer.mozilla.org/en-US/docs/Web/API/Element
export class MockDOMElement {
    constructor(tag) {
        this.tagName = ((tag)? tag.toUpperCase() : tag );
        this.classList = new MockClassList();
        this.ownerDocument = null;
        this.parentNode = null;
        this.children = [];
        this.style = {};
        this.attributes = [];
        this.eventListeners = [];
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        this.nodeType = 1;
    }
    appendChild(mockDOMElement) {
        if (mockDOMElement.parentNode) mockDOMElement.parentNode.removeChild(mockDOMElement);
        this.children.push(mockDOMElement);
        mockDOMElement.ownerDocument = this.ownerDocument;
        mockDOMElement.parentNode = this;
    }
    removeChild(mockDOMElement) {
        for (let loop = 0; loop < this.children.length; loop++) {
            if (mockDOMElement === this.children[loop]) {
                this.children.splice(loop, 1);
                mockDOMElement.ownerDocument = null;
                mockDOMElement.parentNode = null;
                return mockDOMElement;
            }
        }
        return null;
    }
    getElementsByClassName(className) {
        let results = [];
        for (let loop = 0; loop < this.children.length; loop++) {
            let child = this.children[loop];
            if (child.classList.contains(className)) results.push(child);
            results = results.concat(child.getElementsByClassName(className));
        }
        return results;
    }
    getElementsByTagName(tag) {
        let results = [];
        if (!tag) return results;
        for (let loop = 0; loop < this.children.length; loop++) {
            let child = this.children[loop];
            if (tag.toUpperCase() === child.tagName.toUpperCase()) results.push(child);
            results = results.concat(child.getElementsByTagName(tag));
        }
        return results;
    }
    setAttribute(name, value) {
        this.removeAttribute(name);
        if ((null === value) || (undefined === value)) return;
        this.attributes.push({ name: name, value: value });
    }
    removeAttribute(name) {
        for (let loop = 0; loop < this.attributes.length; loop++) {
            if (name !== this.attributes[loop].name) continue;
            this.attributes.splice(loop, 1);
            return;
        }
    }
    addEventListener(type, listener, options) {
        this.eventListeners.push({ type: type, listener: listener, options: options });
    }
    summary(indent) {
        let summary = '';
        for (let loop = 0; loop < indent; loop++) summary += '\t';
        summary += 'id: ' + this.id;
        summary += ', tagName: ' + this.tagName;
        summary += ', classList: ' + JSON.stringify(this.classList) + '\n';
        for (let loop = 0; loop < this.children.length; loop++) {
            summary += this.children[loop].summary(indent + 1);
        }
        return summary;
    }
}
// https://developer.mozilla.org/en-US/docs/Web/API/Element
export class MockDOMTextNode {
    constructor(data) {
        this.ownerDocument = null;
        this.parentNode = null;
        this.data = data;
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        this.nodeType = 3;
    }
    summary(indent) {
        let summary = '';
        for (let loop = 0; loop < indent; loop++) summary += '\t';
        summary += 'Text node data: ' + this.data + '\n';
        return summary;
    }
}
// https://developer.mozilla.org/en-US/docs/Web/API/Document
export class MockDOM {
    static getTestingDOM() {
        // mockDOMElement1                          ('div',     'mockDOMElement1', 'class1')
        //      mockDOMElement2                     ('span',    'mockDOMElement2', 'class1')
        //              mockDOMElement5             ('span',    'mockDOMElement5', 'class2')
        //              mockDOMElement6             ('section', 'mockDOMElement6', 'class2')
        //      mockDOMElement3                     ('section', 'mockDOMElement3', 'class1')
        //              mockDOMElement7             ('div',     'mockDOMElement7', 'class3')
        //              mockDOMElement8             ('span',    'mockDOMElement8', 'class3')
        //      mockDOMElement4                     ('div',     'mockDOMElement4', 'class2')
        //              mockDOMElement9             ('section', 'mockDOMElement9', 'class3')
        //                      mockDOMElement10    ('div',     'mockDOMElement10', 'class4')
        let mockDOM = new MockDOM();
        let mockDOMElement1 = mockDOM.createElement('div');
        let mockDOMElement2 = mockDOM.createElement('span');
        let mockDOMElement3 = mockDOM.createElement('section');
        let mockDOMElement4 = mockDOM.createElement('div');
        let mockDOMElement5 = mockDOM.createElement('span');
        let mockDOMElement6 = mockDOM.createElement('section');
        let mockDOMElement7 = mockDOM.createElement('div');
        let mockDOMElement8 = mockDOM.createElement('span');
        let mockDOMElement9 = mockDOM.createElement('section');
        let mockDOMElement10 = mockDOM.createElement('div');
        mockDOMElement1.id = 'mockDOMElement1';
        mockDOMElement1.classList.add('class1');
        mockDOMElement1.appendChild(mockDOMElement2);
        mockDOMElement1.appendChild(mockDOMElement3);
        mockDOMElement1.appendChild(mockDOMElement4);
        mockDOMElement2.id = 'mockDOMElement2';
        mockDOMElement2.classList.add('class1');
        mockDOMElement2.appendChild(mockDOMElement5);
        mockDOMElement2.appendChild(mockDOMElement6);
        mockDOMElement3.id = 'mockDOMElement3';
        mockDOMElement3.appendChild(mockDOMElement7);
        mockDOMElement3.appendChild(mockDOMElement8);
        mockDOMElement3.classList.add('class1');
        mockDOMElement4.id = 'mockDOMElement4';
        mockDOMElement4.appendChild(mockDOMElement9);
        mockDOMElement4.classList.add('class2');
        mockDOMElement5.id = 'mockDOMElement5';
        mockDOMElement5.classList.add('class2');
        mockDOMElement6.id = 'mockDOMElement6';
        mockDOMElement6.classList.add('class2');
        mockDOMElement7.id = 'mockDOMElement7';
        mockDOMElement7.classList.add('class3');
        mockDOMElement8.id = 'mockDOMElement8';
        mockDOMElement8.classList.add('class3');
        mockDOMElement9.id = 'mockDOMElement9';
        mockDOMElement9.classList.add('class3');
        mockDOMElement9.appendChild(mockDOMElement10);
        mockDOMElement10.id = 'mockDOMElement10';
        mockDOMElement10.classList.add('class4');
        mockDOM.tree = mockDOMElement1;
        return mockDOM;
    }
    static getTestingHTMLDOM() {
        // HTML                                 ('html',    ,               null)
        //      mockHead                        ('head',    ,               null)
        //          mockMeta                    ('meta',    ,               null)
        //      mockBody                        ('body',    ,               null)
        //          mockDiv1A                   ('div',     ,               'post')
        //              mockHeader1             ('header',  ,               null)
        //                  mockDiv1B           ('div',     ,               'entry-title')
        //                      mockA1          ('a',       ,               null)
        //          mockDiv2A                   ('div',     ,               'post')
        //              mockHeader2             ('header',  ,               null)
        //                  mockDiv2B           ('div',     ,               'entry-title')
        //                      mockA2          ('a',       ,               null)
        //          mockDiv3A                   ('div',     ,               'post')
        //              mockHeader3             ('header',  '',             null)
        //                  mockDiv3B           ('div',     ,               'entry-title')
        //                      mockA3          ('a',       ,               null)
        //          mockDivComments             ('div',     'comments',     null)
        //              mockP                   ('p',       ,               null)
        let mockDOM = new MockDOM();
        let mockHTML = mockDOM.createElement('html');
        let mockHead = mockDOM.createElement('head');
        let mockMeta = mockDOM.createElement('meta');
        let mockBody = mockDOM.createElement('body');
        let mockDiv1A = mockDOM.createElement('div');
        let mockHeader1 = mockDOM.createElement('header');
        let mockDiv1B = mockDOM.createElement('div');
        let mockA1 = mockDOM.createElement('a');
        let mockDiv2A = mockDOM.createElement('div');
        let mockHeader2 = mockDOM.createElement('header');
        let mockDiv2B = mockDOM.createElement('div');
        let mockA2 = mockDOM.createElement('a');
        let mockDiv3A = mockDOM.createElement('div');
        let mockHeader3 = mockDOM.createElement('header');
        let mockDiv3B = mockDOM.createElement('div');
        let mockA3 = mockDOM.createElement('a');
        let mockDivComments = mockDOM.createElement('div');
        let mockP = mockDOM.createElement('p');
        mockHTML.appendChild(mockHead);
        mockHTML.appendChild(mockBody);
        mockHead.appendChild(mockMeta);
        mockBody.appendChild(mockDiv1A);
        mockBody.appendChild(mockDiv2A);
        mockBody.appendChild(mockDiv3A);
        mockBody.appendChild(mockDivComments);
        mockDiv1A.appendChild(mockHeader1);
        mockHeader1.appendChild(mockDiv1B);
        mockDiv1B.appendChild(mockA1);
        mockDiv2A.appendChild(mockHeader2);
        mockHeader2.appendChild(mockDiv2B);
        mockDiv2B.appendChild(mockA2);
        mockDiv3A.appendChild(mockHeader3);
        mockHeader3.appendChild(mockDiv3B);
        mockDiv3B.appendChild(mockA3);
        mockDivComments.appendChild(mockP);
        mockDiv1A.classList.add('post');
        mockDiv2A.classList.add('post');
        mockDiv3A.classList.add('post');
        mockDiv1B.classList.add('entry-title');
        mockDiv2B.classList.add('entry-title');
        mockDiv3B.classList.add('entry-title');
        mockDivComments.id = 'comments';
        mockDOM.tree = mockHTML;
        return mockDOM;
    }
    constructor() {
        this.tree = null;
        this.eventListeners = [];
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        this.nodeType = 9;
    }
    getElementsByClassName(className) {
        let results = [];
        if (this.tree.classList.contains(className)) results.push(this.tree);
        results = results.concat(this.tree.getElementsByClassName(className));
        return results;
    }
    getElementsByTagName(tag) {
        let results = [];
        if (!tag) return results;
        if (tag.toUpperCase() === this.tree.tagName.toUpperCase()) results.push(this.tree);
        results = results.concat(this.tree.getElementsByTagName(tag));
        return results;
    }
    getElementById(id) {
        if (!this.tree) return null;
        if (id === this.tree.id) return this.tree;
        let checkChildren = (element) => {
            if (!element.children || !element.children.length) return null
            for (let loop = 0; loop < element.children.length; loop++) {
                let child = element.children[loop];
                if (id === child.id) return child;
                let childResult = checkChildren(child);
                if (childResult) return childResult;
            }
            return null;
        };
        return checkChildren(this.tree);
    }
    createElement(tag) {
        if (!tag) return null;
        let element = new MockDOMElement( tag.toUpperCase() );
        element.ownerDocument = this;
        return element;
    }
    createTextNode(data) {
        if (!data) return null;
        let element = new MockDOMTextNode( data );
        element.ownerDocument = this;
        return element;
    }
    addEventListener(type, listener, options) {
        this.eventListeners.push({ type: type, listener: listener, options: options });
    }
    summary(indent) {
        let summary = '';
        for (let loop = 0; loop < indent; loop++) summary += '\t';
        if (!this.tree) return summary + 'Empty MockDOM'
        return this.tree.summary(indent);
    }
}
