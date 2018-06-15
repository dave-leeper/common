import Log from '../log'

// Traverses a HTML DOM tree based on a text path, returns the resulting elements.
//
// Keywords (colons are part of the keywords)
// class: Get child elements by class name.
// id: Get child element by id.
// tag: Get child elements by tag name.
// and[ Join together two expressions using a logical AND.
// or[ Join together two expressions using a logical OR.
// index: Index into an array of results.
// / Build a path down the tree by combining the expressions on both sides of the / character.
//
// Examples of valid paths
// class:className
// id:idValue
// tag:tagName
// tag:tagName/index:0
// class:className/id:idValue/tag:tagName
// class:className/or[id:idValue | class:className]/tag:tagName
// and[class:className/id:idValue/tag:tagName & class:className/id:idValue/tag:tagName]
//
// Known limitations
// and[ and or[ cannot be nested inside other and[ and or[ elements.
//
// TODO: class_not:, id_not:, tag_not:, index_not:
let contains = (array, object) => {
    for (let loop = 0; loop < array.length; loop++) {
        if (array[loop] === object) return true;
    }
    return false;
};
let unique = (array) => {
    let unique = [];
    for (let loop = 0; loop < array.length; loop++) {
        if (contains(unique, array[loop])) continue;
        unique.push(array[loop]);
    }
    return unique;
};
let removeNonChildren = (parentArray, childArray) => {
    let children = [];
    if (!parentArray || !parentArray.length) return children;
    if (!childArray || !childArray.length) return children;
    for (let loop = 0; loop < childArray.length; loop++) {
        let child = childArray[loop];
        if (!child || !child.parentNode) continue;
        if (!contains(parentArray, child.parentNode)) continue;
        children.push(child);
    }
    return children;
};
let selectMembersOnly = (memberArray, array) => {
    let members = [];
    if (!memberArray || !memberArray.length) return members;
    if (!array || !array.length) return members;
    for (let loop = 0; loop < array.length; loop++) {
        let element = array[loop];
        if (!contains(memberArray, element)) continue;
        members.push(element);
    }
    return members;
};
let logArraySummary = (array) => {
    for (let loop2 = 0; loop2 < array.length; loop2++) {
        let summary = '    ' + (loop2 + 1) + ' OF ' + array.length;
        let item = array[loop2];
        if (!item) {
            summary += item;
        } else {
            if (item && item.summary) summary += item.summary(0);
            else summary += '    Tag: ' + item.nodeName + ', Class: ' + item.classList.item(0);
        }
        Log.all(summary);
    }
};
export class DOMGrammarError {
    constructor(error) {
        this.error = error;
    }
}
export class DOMGrammar {
    static element = 'DOMGrammar';
    static terminator = '';
    static hasGrammar(pathFragment) {
        if (!pathFragment) return false;
        if (-1 !== pathFragment.indexOf(Class.element)) return true;
        if (-1 !== pathFragment.indexOf(Tag.element)) return true;
        if (-1 !== pathFragment.indexOf(Id.element)) return true;
        if (-1 !== pathFragment.indexOf(And.element)) return true;
        if (-1 !== pathFragment.indexOf(Or.element)) return true;
        if (-1 !== pathFragment.indexOf(Index.element)) return true;
        return false;
    }
    constructor(pathFragment) {
        this.pathFragment = ((pathFragment)? this.validatePathFragment(this.stripTerminator(this.stripName(pathFragment))) : null);
        this.children = [];
    }
    getName(){ return DOMGrammar.element; }
    validatePathFragment(pathFragment) {
        if (!pathFragment) throw new DOMGrammarError('Invalid path value: ' + pathFragment);
        return pathFragment;
    }
    getTerminator(){ return DOMGrammar.terminator; }
    stripName(pathFragment) {
        if (!pathFragment) return pathFragment;
        let index = pathFragment.indexOf(this.getName());
        if (-1 === index) return pathFragment;
        return pathFragment.substr(this.getName().length);
    }
    stripTerminator(pathFragment) {
        if (!pathFragment.endsWith(this.getTerminator())) return pathFragment;
        return pathFragment.substring(0, pathFragment.length - 1);
    }
    execute(DOMObject) {
        return [];
    }
}
export class Class extends DOMGrammar {
    static element = 'class:';
    static terminator = '/';
    constructor(pathFragment) {
        super(pathFragment);
    }
    getName(){ return Class.element; }
    getTerminator(){ return Class.terminator; }
    execute(DOMObject) {
        try {
            if (!Array.isArray(DOMObject)) return DOMObject.getElementsByClassName(this.pathFragment);
            let results = [];
            for (let loop = 0; loop < DOMObject.length; loop++) {
                let batch = DOMObject[loop].getElementsByClassName(this.pathFragment);
                for (let loop2 = 0; loop2 < batch.length; loop2++) {
                    results.push(batch[loop2]);
                }
            }
            return results;
        } catch(err) {
            Log.error('Class.execute Error: ' + Log.stringify(err) + ', DOMObject: ' + Log.stringify(DOMObject));
            return[];
        }
    }
}
export class Tag extends DOMGrammar {
    static element = 'tag:';
    static terminator = '/';
    constructor(pathFragment) {
        super(pathFragment);
    }
    getName(){ return Tag.element; }
    getTerminator(){ return Tag.terminator; }
    execute(DOMObject) {
        try {
            if (!Array.isArray(DOMObject)) {
                return DOMObject.getElementsByTagName(this.pathFragment);
            }
            let results = [];
            for (let loop = 0; loop < DOMObject.length; loop++) {
                let element = DOMObject[loop];
                let batch  = element.getElementsByTagName(this.pathFragment);
                for (let loop2 = 0; loop2 < batch.length; loop2++) {
                    results.push(batch[loop2]);
                }
            }
            return results;
        } catch(err) {
            Log.error('Tag.execute Error: ' + Log.stringify(err) + ', DOMObject: ' + Log.stringify(DOMObject));
            return[];
        }
    }
}
export class Id extends DOMGrammar {
    static element = 'id:';
    static terminator = '/';
    constructor(pathFragment) {
        super(pathFragment);
    }
    getName(){ return Id.element; }
    getTerminator(){ return Id.terminator; }
    execute(DOMObject) {
        try {
            if (!Array.isArray(DOMObject)) {
                let result = DOMObject.getElementById(this.pathFragment);
                if (null !== result) return [ result ];
                return [];
            }
            let results = [];
            for (let loop = 0; loop < DOMObject.length; loop++) {
                let result = DOMObject[loop].ownerDocument.getElementById(this.pathFragment);
                if (null !== result) results.push(result);
            }
            return results;
        } catch(err) {
            Log.error('Id.execute Error: ' + Log.stringify(err) + ', DOMObject: ' + Log.stringify(DOMObject));
            return[];
        }
    }
}
export class And extends DOMGrammar {
    static element = 'and[';
    static terminator = ']';
    constructor(pathFragment) {
        super(pathFragment);
        if (DOMGrammar.hasGrammar(this.pathFragment)) {
            let children = this.pathFragment.split('&');
            let first = DomTraversal.compile(children[0]);
            let second = DomTraversal.compile(children[1]);
            let newChildren = first.concat(second);
            this.children = newChildren;
        }
        this.validatePathFragment(this.pathFragment);
    }
    getName(){ return And.element; }
    getTerminator(){ return And.terminator; }
    execute(DOMObject) {
        try {
            let first = this.children[0].execute(DOMObject);
            let second = this.children[1].execute(DOMObject);
            let results = [];
            for (let loop1 = 0; loop1 < first.length; loop1++) {
                if (contains(second, first[loop1])) results.push(first[loop1]);
            }
            for (let loop2 = 0; loop2 < second.length; loop2++) {
                if ((contains(first, second[loop2]))
                && (!contains(results, second[loop2]))) {
                    results.push(second[loop2]);
                }
            }
            return results;
        } catch(err) {
            Log.error('And.execute Error: ' + Log.stringify(err) + ', DOMObject: ' + Log.stringify(DOMObject));
            return[];
        }
    }
}
export class Or extends DOMGrammar {
    static element = 'or[';
    static terminator = ']';
    constructor(pathFragment) {
        super(pathFragment);
        if (DOMGrammar.hasGrammar(this.pathFragment)) {
            let children = this.pathFragment.split('|');
            let first = DomTraversal.compile(children[0]);
            let second = DomTraversal.compile(children[1]);
            let newChildren = first.concat(second);
            this.children = newChildren;
        }
    }
    getName(){ return Or.element; }
    getTerminator(){ return Or.terminator; }
    execute(DOMObject) {
        try {
            let results = this.children[0].execute(DOMObject);
            let second = this.children[1].execute(DOMObject);
            for (let loop = 0; loop < second.length; loop++) {
                if (!contains(results, second[loop])) {
                    results.push(second[loop]);
                }
            }
            return results;
        } catch(err) {
            Log.error('Or.execute Error: ' + Log.stringify(err) + ', DOMObject: ' + Log.stringify(DOMObject));
            return[];
        }
    }
}
export class Index extends DOMGrammar {
    static element = 'index:';
    static terminator = '/';
    constructor(pathFragment) {
        super(pathFragment);
    }
    getName(){ return Index.element; }
    validatePathFragment(pathFragment) {
        super.validatePathFragment(pathFragment);
        if (/[0-9]*/.test(pathFragment)) return pathFragment;
        throw new DOMGrammarError('Invalid index: ' + pathFragment);
    }
    getTerminator(){ return Index.terminator; }
    execute(DOMObject) {
        try {
            let index = parseInt(this.pathFragment, 10);
            let result = DOMObject[ index ];
            return [ result ];
        } catch(err) {
            Log.error('Index.execute Error: ' + Log.stringify(err) + ', DOMObject: ' + Log.stringify(DOMObject));
            return[];
        }

    }
}

export default class DomTraversal {
     static compile(path) {
         if ((!path) || (typeof path !== 'string')) return [];
         if (!DOMGrammar.hasGrammar(path)) return [];
         let locals = {
             elements: [],
             path: path.replace(/\s/g,''),
             splitPath: null
         };
         if (locals.path.startsWith(Class.element)) {
             locals.splitPath = DomTraversal.split(locals.path, Class.terminator);
             try { locals.elements.push(new Class(locals.splitPath[0])); } catch(err) { Log.error(Log.stringify(err)); return []; }
         } else if (locals.path.startsWith(Id.element)) {
             locals.splitPath = DomTraversal.split(locals.path, Id.terminator);
             try { locals.elements.push(new Id(locals.splitPath[0])); } catch(err) { Log.error(Log.stringify(err)); return []; }
         } else if (locals.path.startsWith(Tag.element)) {
             locals.splitPath = DomTraversal.split(locals.path, Tag.terminator);
             try { locals.elements.push(new Tag(locals.splitPath[0])); } catch(err) { Log.error(Log.stringify(err)); return []; }
         } else if (locals.path.startsWith(And.element)) {
             locals.splitPath = DomTraversal.split(locals.path, And.terminator);
             try { locals.elements.push(new And(locals.splitPath[0])); } catch(err) { Log.error(Log.stringify(err)); return []; }
         } else if (locals.path.startsWith(Or.element)) {
             locals.splitPath = DomTraversal.split(locals.path, Or.terminator);
             try { locals.elements.push(new Or(locals.splitPath[0])); } catch(err) { Log.error(Log.stringify(err)); return []; }
         } else if (locals.path.startsWith(Index.element))  {
             locals.splitPath = DomTraversal.split(locals.path, Index.terminator);
             try { locals.elements.push(new Index(locals.splitPath[0])); } catch(err) { Log.error(Log.stringify(err)); return []; }
         } else {
             Log.error('Invalid grammar: ' + path);
             return [];
         }
         if ((locals.splitPath) && (2 === locals.splitPath.length) && 0 < (locals.splitPath[1].length)) {
             locals.elements = locals.elements.concat( DomTraversal.compile(locals.splitPath[1]));
         }
         return locals.elements;
    }
    static execute(executable, DOMElement) {
        if (!executable || !executable.length) return [];
        if (!Array.isArray(executable)) return [];
        if (contains(executable.map( item => item instanceof DOMGrammar ), false)) return [];
        if (!DOMElement) return [];
        if (!DOMElement.getElementsByClassName ) return [];
        if (!DOMElement.getElementsByTagName ) return [];
        if (!DOMElement.getElementById ) return [];

        Log.all('=== BEGIN DomTraversal execution. There are ' + executable.length + ' executable components.');
        let executionResults = [DOMElement];
        for (let executionLoop = 0; executionLoop < executable.length; executionLoop++) {
            let component = executable[executionLoop];
            Log.all('--- BEGIN executing ' + component.getName() + component.pathFragment);
            let rawResults = component.execute(executionResults[executionResults.length - 1])
            let results = unique(rawResults);
            if ((1 <= executionLoop) && (Index.element !== component.getName())) {
                results = removeNonChildren(executionResults[executionResults.length - 1], results);
            }
            if (!results || !results.length) {
                Log.error('!!! DomTraversal.execute. No results for ' + component.getName() + '.' + component.pathFragment + '. Aborting execution.');
                return [];
            }
            Log.all('... RESULTS');
            logArraySummary(results);
            executionResults.push(results);
            Log.all('--- END executing ' + component.getName() + component.pathFragment);
        }
        Log.all('=== END DomTraversal execution');
        return executionResults[executionResults.length - 1];
    }
    static split(path, character) {
        if (!path) return [];
        if (!character) return [path];
        let index = path.indexOf(character);
        if (-1 === index) return [path];
        let remainder = ((index + 1 < path.length)? path.substr(index + 1) : '');
        remainder = (('/' === remainder)? '' : remainder );
        remainder = (((remainder.length) && ('/' === remainder[0]))? remainder.substr(1) : remainder );
        if (remainder && remainder.length) {
            return [
                path.substr(0, index),
                remainder
            ]
        }
        return [ path.substr(0, index) ]
    }
}
