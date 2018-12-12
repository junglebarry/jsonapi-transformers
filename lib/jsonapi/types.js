"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * JSON:API base class providing `id` and `type` for resources.
 */
var JsonapiEntity = /** @class */ (function () {
    function JsonapiEntity() {
    }
    return JsonapiEntity;
}());
exports.JsonapiEntity = JsonapiEntity;
/**
 * Convert a subtype of identifier into an identifier alone.
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {ResourceIdentifier} an identifier (not a subtype thereof)
 */
function resourceIdentifier(target) {
    var id = target.id, _a = target.meta, meta = _a === void 0 ? undefined : _a, type = target.type;
    return { id: id, meta: meta, type: type };
}
exports.resourceIdentifier = resourceIdentifier;
/**
 * Convert a subtype of identifier into an identifier alone.
 *
 * @param  {JsonapiIdentifier} target - an instance of a subtype of identifier
 * @return {JsonapiIdentifier} an identifier (not a subtype thereof)
 */
function jsonapiIdentifier(target) {
    var id = target.id, type = target.type;
    return { id: id, type: type };
}
exports.jsonapiIdentifier = jsonapiIdentifier;
/**
 * Convert a linkage to pure identifiers.
 *
 * @param  {ResourceLinkage} linkage - a linkage to-one, to-many, or nullable
 * @return {?ResourceLinkage} - a linkage, converted to identifiers.
 */
function jsonapiLinkage(linkage) {
    if (Array.isArray(linkage)) {
        return linkage.map(jsonapiIdentifier);
    }
    else if (linkage) {
        return jsonapiIdentifier(linkage);
    }
    else if (linkage === null) {
        return null;
    }
    return undefined;
}
exports.jsonapiLinkage = jsonapiLinkage;
