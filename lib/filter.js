'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getSubset = getSubset;
exports['default'] = filter;
function hasValue(value) {
  return !!value || value === 0 || value === false;
}

/**
 * @description
 * getSubset returns an object with the same structure as the original object passed in, but contains
 * only the specified paths and only if those paths have "value" (truth-y values, 0 or false).
 *
 * @param {Object} obj The object from which to create a subset.
 * @param {String[]} paths An array of paths e.g. ['deeply.nested.key'], that should be included in the subset.
 *
 * @returns {Object} An object that contains only the specified paths if they hold something of value.
 */

function getSubset(obj, paths) {
  if (!paths) return obj;

  var subset = {};

  paths.forEach(function (path) {
    var keys = path.split('.');
    var length = keys.length;
    var lastIndex = length - 1;

    var index = 0;
    var value = obj;
    var nested = subset;

    // Retrieve value specified by path
    while (value && index < length) {
      value = value[keys[index++]];
    }

    // Add to subset if the specified path is defined and hasValue
    if (index === length && hasValue(value)) {
      keys.forEach(function (key, i) {
        if (i === lastIndex) {
          nested[key] = value;
        } else if (!nested[key]) {
          nested[key] = {};
        }
        nested = nested[key];
      });
    }
  });

  return subset;
}

function filter(paths) {
  var finalPaths = typeof paths === 'string' ? [paths] : paths;

  return function (storage) {
    return _extends({}, storage, {
      put: function put(key, state, callback) {
        var subset = typeof paths === 'function' ? paths(state) : getSubset(state, finalPaths);
        storage.put(key, subset, callback);
      }
    });
  };
}