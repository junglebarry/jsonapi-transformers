/**
 * Is this an empty object?
 *
 * @param  {any} obj - a candidate object to check
 * @return {boolean} - `true` if an empty Object; `false` otherwose
 */
export declare function isEmptyObject(obj: any): boolean;
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
export declare function isDefined(value: any): boolean;
export declare type KeyingFunction<T> = (T) => string;
/**
 * Convert an array into a keyed object for constant-time lookup.
 *
 * @param {T[]} array - an array of objects to be keyed.
 * @param {KeyingFunction<T>} keyFunc - a function converting array elements to keys
 * @type {T} - the type of elements appareaing as values in the resultant object.
 */
export declare function keyBy<T>(array: T[], keyFunc: KeyingFunction<T>): {
    [key: string]: T;
};
