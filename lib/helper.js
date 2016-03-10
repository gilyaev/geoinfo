'use strict';

module.exports = helper;

function helper() {}

//calculate size of object
helper.objectSize = function(object) {
	var objectList = [],
   		stack = [object],
   		bytes = 0;

    while (stack.length) {
        var value = stack.pop();
        if (typeof value === 'boolean') {
            bytes += 4;
        } else if (typeof value === 'string') {
            bytes += value.length * 2;
        } else if (typeof value === 'number') {
            bytes += 8;
        } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
            objectList.push(value);
            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }
    return bytes;
}

//is number
helper.isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//is function
helper.isFunction = function(fn) {
	return typeof fn === 'function';
}

//is undefined
helper.isUndefined = function(value) {
	return value === void 0;
}

//is array
helper.isArray = function(array) {
    return (Array.isArray(array) || toString.call(array) === '[object Array]');
}

helper.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
};
 
helper.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
};

helper.isNull = function(obj) {
    return obj === null;
};