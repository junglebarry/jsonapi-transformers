"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyBy = exports.isDefined = exports.isEmptyObject = void 0;
/**
 * Is this an empty object?
 *
 * @param  {any} obj - a candidate object to check
 * @return {boolean} - `true` if an empty Object; `false` otherwose
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
exports.isEmptyObject = isEmptyObject;
/**
 * Is this value defined?
 *
 * "Defined" here covers anything that is not "undefined".
 *
 * Falsy values may still defined if they have a valid type.
 *
 * @param  {any} value - a candidate value
 * @return {boolean} - `true` if the value is defined (including null); `false` otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function isDefined(value) {
    return typeof value !== "undefined";
}
exports.isDefined = isDefined;
/**
 * Convert an array into a keyed object for constant-time lookup.
 *
 * @param {T[]} array - an array of objects to be keyed.
 * @param {KeyingFunction<T>} keyFunc - a function converting array elements to keys
 * @type {T} - the type of elements appareaing as values in the resultant object.
 */
function keyBy(array, keyFunc) {
    var reducer = function (soFar, element) {
        var _a;
        return Object.assign(soFar, (_a = {},
            _a[keyFunc(element)] = element,
            _a));
    };
    return array.reduce(reducer, {});
}
exports.keyBy = keyBy;
