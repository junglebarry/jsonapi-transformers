"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnresolvedIdentifier = exports.unresolvedIdentifier = exports.UnresolvedResourceIdentifier = void 0;
/**
 * A class representing unresolved resource identifiers.
 *
 * This is a subtype of ResourceIdentifier that is considered "unresolved",
 * where an attempt has been made to resolve the identifier against known
 * JSON:API objects and has failed.  This allows us to deserialise JSON:API
 * documents without being able to fully resolve references to all entities.
 */
var UnresolvedResourceIdentifier = /** @class */ (function () {
    function UnresolvedResourceIdentifier(id, type) {
        this.id = id;
        this.type = type;
    }
    return UnresolvedResourceIdentifier;
}());
exports.UnresolvedResourceIdentifier = UnresolvedResourceIdentifier;
/**
 * Convert a subtype of identifier into an unresolved resource identifier.
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {UnresolvedResourceIdentifier} an identifier (not a subtype thereof)
 */
function unresolvedIdentifier(target) {
    var id = target.id, type = target.type;
    return new UnresolvedResourceIdentifier(id, type);
}
exports.unresolvedIdentifier = unresolvedIdentifier;
/**
 * Is this an unresolved resource identifier?
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {boolean} whether the provided identifier is unresolved
 */
function isUnresolvedIdentifier(identifier) {
    return (identifier instanceof UnresolvedResourceIdentifier);
}
exports.isUnresolvedIdentifier = isUnresolvedIdentifier;
