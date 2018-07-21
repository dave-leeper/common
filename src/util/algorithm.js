export oneTruthyReduce = (accumulator, currentValue) => {
    if (accumulator) return accumulator;
    return currentValue;
};
export manyTruthyReduce = (accumulator, currentValue) => {
    if (!Array.isArray(accumulator)) {
        let x = accumulator;
        accumulator = [ ];
        if (x) accumulator.push(x);
    }
    if (currentValue) accumulator.push(currentValue);
    return accumulator;
};
export uniqueReduce = (accumulator, currentValue) => {
    if (!Array.isArray(accumulator)) accumulator = [ accumulator ];
    if (arrayContainsObject(accumulator, currentValue)) return accumulator;
    accumulator.push(currentValue);
    return accumulator;
};
export mapAllExecept = (keep, replacement) => {
    return ( item ) => { if (item === keep) return item; return replacement; };
};
export arrayContainsObject = (array, object) => {
    if (!array || !Array.isArray(array) || !array.length) return false;
    for (let loop = 0; loop < array.length; loop++) {
        if (array[loop] === object) return true;
    }
    return false;
};

export arraysIdentical = (a, b) => {
    let i = a.length;
    if (i != b.length) return false;
    while (i--) { if (a[i] !== b[i]) return false; }
    return true;
};