"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJsonApi = void 0;
var decorators_1 = require("../decorators");
var jsonapi_1 = require("../jsonapi");
var utils_1 = require("./utils");
/**
 * Convert a target JSON:API entity into a JSON:API representation.
 *
 * @param  {ResourceIdentifier} target - a source entity
 * @return {ResourceObject} a JSON:API resource representation
 */
function toJsonApi(target) {
    // convert attributes
    var attributeMetadata = decorators_1.getAttributeMetadata(target.constructor);
    var attributeReducer = function (soFar, attr) {
        var _a;
        var metadata = attributeMetadata[attr];
        var targetAttribute = target[attr];
        return !utils_1.isDefined(targetAttribute) ? soFar : Object.assign(soFar, (_a = {},
            _a[metadata.name] = targetAttribute,
            _a));
    };
    var attributes = Object.keys(attributeMetadata).reduce(attributeReducer, {});
    // convert relationships
    var relationshipMetadata = decorators_1.getRelationshipMetadata(target.constructor);
    var relationshipReducer = function (soFar, relationshipName) {
        var _a;
        var metadata = relationshipMetadata[relationshipName];
        var linkage = jsonapi_1.jsonapiLinkage(target[relationshipName]);
        return !utils_1.isDefined(linkage) ? soFar : Object.assign(soFar, (_a = {},
            _a[metadata.name] = { data: linkage },
            _a));
    };
    var relationships = Object.keys(relationshipMetadata).reduce(relationshipReducer, {});
    // compose the object and return
    var entityWithAttributes = {
        id: target.id,
        type: target.type,
        attributes: attributes,
    };
    return utils_1.isEmptyObject(relationships) ? entityWithAttributes : Object.assign(entityWithAttributes, {
        relationships: relationships,
    });
}
exports.toJsonApi = toJsonApi;
