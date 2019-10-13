/**
 * JSON:API base class providing `id` and `type` for resources.
 */
export class JsonapiEntity {
}
/**
 * Convert a subtype of identifier into an identifier alone.
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {ResourceIdentifier} an identifier (not a subtype thereof)
 */
export function jsonapiIdentifier(target) {
    const { id, type } = target;
    return { id, type };
}
/**
 * Convert a linkage to pure identifiers.
 *
 * @param  {ResourceLinkage} linkage - a linkage to-one, to-many, or nullable
 * @return {?ResourceLinkage} - a linkage, converted to identifiers.
 */
export function jsonapiLinkage(linkage) {
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
