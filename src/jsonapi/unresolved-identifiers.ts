import { ResourceIdentifier } from "./types.js";

/**
 * A class representing unresolved resource identifiers.
 *
 * This is a subtype of ResourceIdentifier that is considered "unresolved",
 * where an attempt has been made to resolve the identifier against known
 * JSON:API objects and has failed.  This allows us to deserialise JSON:API
 * documents without being able to fully resolve references to all entities.
 */
export class UnresolvedResourceIdentifier implements ResourceIdentifier {
  constructor(public id: string, public type: string) {}
}

/**
 * Convert a subtype of identifier into an unresolved resource identifier.
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {UnresolvedResourceIdentifier} an identifier (not a subtype thereof)
 */
export function unresolvedIdentifier(
  target: ResourceIdentifier
): UnresolvedResourceIdentifier {
  const { id, type } = target;
  return new UnresolvedResourceIdentifier(id, type);
}

/**
 * Is this an unresolved resource identifier?
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {boolean} whether the provided identifier is unresolved
 */
export function isUnresolvedIdentifier(
  identifier: ResourceIdentifier
): boolean {
  return identifier instanceof UnresolvedResourceIdentifier;
}

/**
 * A to-one relationship that permits replacement with an unresolved identifier.
 */
export type OneUnresolvedIdentifierOr<T> = UnresolvedResourceIdentifier | T;

/**
 * A to-many relationship that permits replacement with unresolved identifiers.
 */
export type ManyUnresolvedIdentifiersOr<T> = (
  | UnresolvedResourceIdentifier
  | T
)[];
