"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("../decorators");
var jsonapi_1 = require("../jsonapi");
var utils_1 = require("./utils");
/**
 * Key a resource object by type and ID.
 *
 * @param  {ResourceObject} obj - a resource object
 * @return {string} - a key for an object identifier
 */
function byTypeAndId(obj) {
    return JSON.stringify(jsonapi_1.jsonapiIdentifier(obj));
}
exports.byTypeAndId = byTypeAndId;
/**
 * Deserialise an entity or entities from JSON:API.
 *
 * @param  {TopLevel} topLevel - a JSON:API top-level
 * @param  {ResourceObject[]} resourceObjects - known resource objects, for resolution
 * @return {any} - an entity or entities representing the top-level
 */
function fromJsonApiTopLevel(topLevel, resourceObjects) {
    if (resourceObjects === void 0) { resourceObjects = []; }
    // extract primary data and included resources
    var data = topLevel.data, included = topLevel.included;
    // create a lookup table of all available resource objects
    var primaryResourceObjects = undefined;
    if (Array.isArray(data)) {
        primaryResourceObjects = data;
    }
    else if (data) {
        primaryResourceObjects = [data];
    }
    var includedResourceObjects = (resourceObjects || []).concat(included || []);
    var allResourceObjects = primaryResourceObjects.concat(includedResourceObjects);
    var resourceObjectsByTypeAndId = utils_1.keyBy(allResourceObjects, byTypeAndId);
    var deserialisedObjectsByTypeAndId = {};
    var deserialised = undefined;
    if (Array.isArray(data)) {
        deserialised = data.map(function (datum) { return fromJsonApiResourceObject(datum, resourceObjectsByTypeAndId, deserialisedObjectsByTypeAndId); });
    }
    else if (data) {
        deserialised = fromJsonApiResourceObject(data, resourceObjectsByTypeAndId, deserialisedObjectsByTypeAndId);
    }
    return {
        deserialised: deserialised,
        referents: allResourceObjects,
    };
}
exports.fromJsonApiTopLevel = fromJsonApiTopLevel;
/**
 * Deserialise a resource object from JSON:API.
 *
 * @param  {ResourceObject} jsonapiResource - a resource object's JSON:API representation
 * @param  {IncludedLookup} resourceObjectsByTypeAndId - known resources, keyed by type-and-ID
 * @return {any} - a resource object, deserialised from JSON:API
 */
function fromJsonApiResourceObject(jsonapiResource, resourceObjectsByTypeAndId, deserialisedObjects) {
    if (deserialisedObjects === void 0) { deserialisedObjects = {}; }
    // deconstruct primary data and remap into an instance of the chosen type
    var id = jsonapiResource.id, type = jsonapiResource.type, _a = jsonapiResource.attributes, attributes = _a === void 0 ? {} : _a, _b = jsonapiResource.links, links = _b === void 0 ? {} : _b, _c = jsonapiResource.meta, meta = _c === void 0 ? {} : _c, _d = jsonapiResource.relationships, relationships = _d === void 0 ? {} : _d;
    // fetch the Typescript class responsible for deserialisation
    var targetType = decorators_1.getClassForJsonapiType(type);
    if (!targetType) {
        throw new Error("No target entity type for type: " + type);
    }
    var targetConstructor = decorators_1.getConstructorForJsonapiType(type);
    if (!targetConstructor) {
        throw new Error("No target entity constructor for type: " + type);
    }
    // fetch type-specific data
    var attributeMetadata = decorators_1.getAttributeMetadata(targetConstructor);
    var linkMetadata = decorators_1.getLinkMetadata(targetConstructor);
    var metaMetadata = decorators_1.getMetaMetadata(targetConstructor);
    var relationshipMetadata = decorators_1.getRelationshipMetadata(targetConstructor);
    // construct a basic instance with only ID and type (by means of entity) specified
    var instance = new targetType();
    instance.id = id;
    instance.type = type;
    // add to the list of deserialised objects, so recursive lookup works
    var typeAndId = byTypeAndId(instance);
    Object.assign(deserialisedObjects, (_e = {},
        _e[typeAndId] = instance,
        _e));
    // transfer attributes from JSON API to target
    Object.keys(attributeMetadata).forEach(function (attribute) {
        var metadata = attributeMetadata[attribute];
        var jsonapiName = metadata.name;
        var sourceAttribute = attributes[jsonapiName];
        if (utils_1.isDefined(sourceAttribute)) {
            instance[attribute] = attributes[jsonapiName];
        }
    });
    // transfer links from JSON API to target
    Object.keys(linkMetadata).forEach(function (link) {
        var metadata = linkMetadata[link];
        var jsonapiName = metadata.name;
        var sourceAttribute = links[jsonapiName];
        if (utils_1.isDefined(sourceAttribute)) {
            instance[link] = links[jsonapiName];
        }
    });
    // transfer meta properties from JSON API to target
    Object.keys(metaMetadata).forEach(function (metaInfo) {
        var metadata = metaMetadata[metaInfo];
        var jsonapiName = metadata.name;
        var sourceAttribute = meta[jsonapiName];
        if (utils_1.isDefined(sourceAttribute)) {
            instance[metaInfo] = meta[jsonapiName];
        }
    });
    var extractResourceObject = function (linkage, whenNoIncludeRetainIdentifier) {
        return extractResourceObjectOrObjectsFromRelationship(linkage, resourceObjectsByTypeAndId, deserialisedObjects, whenNoIncludeRetainIdentifier);
    };
    Object.keys(relationshipMetadata).forEach(function (relationshipName) {
        var _a = relationshipMetadata[relationshipName], allowUnresolvedIdentifiers = _a.allowUnresolvedIdentifiers, name = _a.name;
        var relationshipIdentifierData = relationships[name];
        var _b = (relationshipIdentifierData || {}).data, data = _b === void 0 ? undefined : _b;
        if (data && Array.isArray(data)) {
            instance[relationshipName] = data.map(function (datum) { return extractResourceObject(datum, allowUnresolvedIdentifiers); }).filter(function (x) { return x; });
        }
        else if (data) {
            instance[relationshipName] = extractResourceObject(data, allowUnresolvedIdentifiers);
        }
    });
    return instance;
    var _e;
}
exports.fromJsonApiResourceObject = fromJsonApiResourceObject;
/**
 * Given a resource identifier, resolve to a deserialised resource object.
 *
 * Optionally, if `allowUnresolvedIdentifiers === true`, allow identifiers in place of unresolved objects.
 *
 * @param {ResourceIdentifier} relationIdentifier - a resource identifier
 * @param {IncludedLookup} resourceObjectsByTypeAndId - resolved objects keyed by type-and-ID
 * @param {boolean} allowUnresolvedIdentifiers - when `true`, identifiers are substituted for unresolved objects
 * @return {any}
 */
function extractResourceObjectFromRelationship(relationIdentifier, resourceObjectsByTypeAndId, deserialisedObjects, allowUnresolvedIdentifiers) {
    var relationId = byTypeAndId(relationIdentifier);
    // already deserialised and cached
    var deserialisedObject = relationId ? deserialisedObjects[relationId] : undefined;
    if (deserialisedObject) {
        return deserialisedObject;
    }
    // already deserialised and cached
    var includedForRelationId = relationId ? resourceObjectsByTypeAndId[relationId] : undefined;
    if (!includedForRelationId) {
        return allowUnresolvedIdentifiers ? jsonapi_1.unresolvedIdentifier(relationIdentifier) : undefined;
    }
    // not yet deserialised, so deserialise and cache
    return fromJsonApiResourceObject(includedForRelationId, resourceObjectsByTypeAndId, deserialisedObjects);
}
/**
 * Given one, many, or no resource identifier, resolve to a deserialised resource object.
 *
 * Optionally, if `allowUnresolvedIdentifiers === true`, allow identifiers in place of unresolved objects.
 *
 * @param {ResourceLinkage} resourceLinkage -  a resource linkage datum
 * @param {IncludedLookup} resourceObjectsByTypeAndId - resolved objects keyed by type-and-ID
 * @param {boolean} allowUnresolvedIdentifiers - when `true`, identifiers are substituted for unresolved objects
 * @return {any} -
 */
function extractResourceObjectOrObjectsFromRelationship(resourceLinkage, resourceObjectsByTypeAndId, deserialisedObjects, allowUnresolvedIdentifiers) {
    var extractResourceObject = function (linkage) { return extractResourceObjectFromRelationship(linkage, resourceObjectsByTypeAndId, deserialisedObjects, allowUnresolvedIdentifiers); };
    if (Array.isArray(resourceLinkage)) {
        // relationship to-many
        return resourceLinkage.map(extractResourceObject).filter(utils_1.isDefined);
    }
    else if (resourceLinkage) {
        // relationship to-one
        return extractResourceObject(resourceLinkage);
    }
    else if (resourceLinkage === null) {
        // relationship removal
        return null;
    }
    return undefined;
}
