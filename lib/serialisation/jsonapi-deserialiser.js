"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deserialisers_1 = require("./deserialisers");
/**
 * A class that encapsulates all traversed and included ResourceObject instances
 * as it deserialises JSON:API responses.
 */
var JsonApiDeserialiser = /** @class */ (function () {
    function JsonApiDeserialiser(initialIncludes) {
        if (initialIncludes === void 0) { initialIncludes = []; }
        this.includes = initialIncludes;
    }
    /**
     * Perform deserialisation of a response into a single object instance.
     *
     * @param {TopLevel} topLevel - the JSON:API response, to deserialise
     * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
     * @return {T} the deserialised response object
     */
    JsonApiDeserialiser.prototype.deserialiseOne = function (topLevel) {
        var _a = deserialisers_1.fromJsonApiTopLevel(topLevel, this.includes), deserialised = _a.deserialised, referents = _a.referents;
        this.includes = referents;
        return deserialised;
    };
    /**
     * Perform deserialisation of a response into a list of object instances.
     *
     * @param {TopLevel} topLevel - the JSON:API response, to deserialise
     * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
     * @return {T[]} the deserialised response objects, as an array
     */
    JsonApiDeserialiser.prototype.deserialiseMany = function (topLevel) {
        var _a = deserialisers_1.fromJsonApiTopLevel(topLevel, this.includes), deserialised = _a.deserialised, referents = _a.referents;
        this.includes = referents;
        return deserialised;
    };
    JsonApiDeserialiser.prototype.deserialise = function (topLevel) {
        if (topLevel && topLevel.data && Array.isArray(topLevel.data)) {
            return this.deserialiseMany(topLevel);
        }
        else if (topLevel && topLevel.data) {
            return this.deserialiseOne(topLevel);
        }
        throw new Error('No primary data to deserialise');
    };
    return JsonApiDeserialiser;
}());
exports.JsonApiDeserialiser = JsonApiDeserialiser;
/**
 * Perform deserialisation of a response into a single object instance, discarding included ResourceObjects
 *
 * @param {TopLevel} topLevel - the JSON:API response, to deserialise
 * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
 * @return {T} the deserialised response object
 */
function deserialiseOne(topLevel) {
    var deserialised = deserialisers_1.fromJsonApiTopLevel(topLevel).deserialised;
    return deserialised;
}
exports.deserialiseOne = deserialiseOne;
/**
 * Perform deserialisation of a response into a list of object instances, discarding included ResourceObjects
 *
 * @param {TopLevel} topLevel - the JSON:API response, to deserialise
 * @type {T} t the type of response expected - a `ResourceIdentifier` subtype
 * @return {T[]} the deserialised response objects, as an array
 */
function deserialiseMany(topLevel) {
    var deserialised = deserialisers_1.fromJsonApiTopLevel(topLevel).deserialised;
    return deserialised;
}
exports.deserialiseMany = deserialiseMany;
