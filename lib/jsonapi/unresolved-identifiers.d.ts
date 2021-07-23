import { ResourceIdentifier } from "./types";
/**
 * A class representing unresolved resource identifiers.
 *
 * This is a subtype of ResourceIdentifier that is considered "unresolved",
 * where an attempt has been made to resolve the identifier against known
 * JSON:API objects and has failed.  This allows us to deserialise JSON:API
 * documents without being able to fully resolve references to all entities.
 */
export declare class UnresolvedResourceIdentifier implements ResourceIdentifier {
    id: string;
    type: string;
    constructor(id: string, type: string);
}
/**
 * Convert a subtype of identifier into an unresolved resource identifier.
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {UnresolvedResourceIdentifier} an identifier (not a subtype thereof)
 */
export declare function unresolvedIdentifier(target: ResourceIdentifier): UnresolvedResourceIdentifier;
/**
 * Is this an unresolved resource identifier?
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {boolean} whether the provided identifier is unresolved
 */
export declare function isUnresolvedIdentifier(identifier: ResourceIdentifier): boolean;
/**
 * A to-one relationship that permits replacement with an unresolved identifier.
 */
export declare type OneUnresolvedIdentifierOr<T> = UnresolvedResourceIdentifier | T;
/**
 * A to-many relationship that permits replacement with unresolved identifiers.
 */
export declare type ManyUnresolvedIdentifiersOr<T> = (UnresolvedResourceIdentifier | T)[];
