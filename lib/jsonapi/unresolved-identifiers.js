/**
 * A class representing unresolved resource identifiers.
 *
 * This is a subtype of ResourceIdentifier that is considered "unresolved",
 * where an attempt has been made to resolve the identifier against known
 * JSON:API objects and has failed.  This allows us to deserialise JSON:API
 * documents without being able to fully resolve references to all entities.
 */
export class UnresolvedResourceIdentifier {
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
}
/**
 * Convert a subtype of identifier into an unresolved resource identifier.
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {UnresolvedResourceIdentifier} an identifier (not a subtype thereof)
 */
export function unresolvedIdentifier(target) {
    const { id, type } = target;
    return new UnresolvedResourceIdentifier(id, type);
}
/**
 * Is this an unresolved resource identifier?
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {boolean} whether the provided identifier is unresolved
 */
export function isUnresolvedIdentifier(identifier) {
    return (identifier instanceof UnresolvedResourceIdentifier);
}
