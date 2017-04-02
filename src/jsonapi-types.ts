/**
 * Base type for JSON:API resource identifiers
 */
export interface ResourceIdentifier {
  id: string;
  type: string;
}

/**
 * JSON:API attributes objects
 * @type { { [string]: any } }
 */
export type AttributesObject = { [attributeName: string]: any };

/**
 * JSON:API resource linkage - to-one, to-many, and nullable identifiers
 */
export type ResourceLinkage = null | ResourceIdentifier | ResourceIdentifier[];

/**
 * JSON:API Relationships object, linking resource to related resources
 */
export interface RelationshipsObject {
  data?: ResourceLinkage;
}

/**
 * JSON:API resource object.
 */
export interface ResourceObject extends ResourceIdentifier {
  attributes?: AttributesObject;
  relationships?: { [relationshipName: string]: RelationshipsObject };
}

/**
 * A to-one relationship that permits replacement with an unresolved identifier.
 */
export type OneUnresolvedIdentifierOr<T> = UnresolvedResourceIdentifier | T;

/**
 * A to-many relationship that permits replacement with unresolved identifiers.
 */
export type ManyUnresolvedIdentifiersOr<T> = (UnresolvedResourceIdentifier | T)[];

/**
 * JSON:API base class providing `id` and `type` for resources.
 */
export class JsonapiEntity implements ResourceIdentifier {
  id: string;
  type: string;
}

/**
 * Convert a subtype of identifier into an identifier alone.
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {ResourceIdentifier} an identifier (not a subtype thereof)
 */
export function jsonapiIdentifier(target: ResourceIdentifier): ResourceIdentifier {
  const { id, type } = target;
  return { id, type };
}

/**
 * Convert a linkage to pure identifiers.
 *
 * @param  {ResourceLinkage} linkage - a linkage to-one, to-many, or nullable
 * @return {?ResourceLinkage} - a linkage, converted to identifiers.
 */
export function jsonapiLinkage(linkage: ResourceLinkage): ResourceLinkage {
  if (Array.isArray(linkage)) {
    return linkage.map(jsonapiIdentifier);
  } else if (linkage) {
    return jsonapiIdentifier(linkage);
  } else if (linkage === null) {
    return null;
  }

  return undefined;
}

/**
 * JSON:API primary data (for request/response). Primary data is an object or array of objects.
 */
export type PrimaryData = ResourceObject | ResourceObject[];

/**
 * JSON:API top-level document permutations
 */
export interface TopLevelData {
  data: PrimaryData;
  included?: ResourceObject[];
}

export type TopLevel = TopLevelData;


/**
 * A class representing unresolved resource identifiers.
 *
 * This is a subtype of ResourceIdentifier that is considered "unresolved",
 * where an attempt has been made to resolve the identifier against known
 * JSON:API objects and has failed.  This allows us to deserialise JSON:API
 * documents without being able to fully resolve references to all entities.
 */
export class UnresolvedResourceIdentifier implements ResourceIdentifier {
  constructor(
    public id: string,
    public type: string
  ) {}
}

/**
 * Convert a subtype of identifier into an unresolved resource identifier.
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {UnresolvedResourceIdentifier} an identifier (not a subtype thereof)
 */
export function unresolvedIdentifier(target: ResourceIdentifier): UnresolvedResourceIdentifier {
  const { id, type } = target;
  return new UnresolvedResourceIdentifier(id, type);
}

/**
 * Is this an unresolved resource identifier?
 *
 * @param  {ResourceIdentifier} target - an instance of a subtype of identifier
 * @return {boolean} whether the provided identifier is unresolved
 */
export function isUnresolvedIdentifier(identifier: ResourceIdentifier): boolean {
  return (identifier instanceof UnresolvedResourceIdentifier);
}

