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
 * JSON:API links objects
 * @type { { [string]: any } }
 */
export type LinksObject = { [linkName: string]: any };

export interface PaginationLinksObject extends LinksObject {
  first?: string,
  last?: string,
  next?: string,
  prev?: string,
}

/**
 * JSON:API meta information objects
 * @type { { [string]: any } }
 */
export type MetaObject = { [metaName: string]: any };

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
  links?: LinksObject;
  meta?: MetaObject;
  relationships?: { [relationshipName: string]: RelationshipsObject };
}

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
  data: ResourceObject[];
  included?: ResourceObject[];
  links?: LinksObject;
  meta?: MetaObject;
}

/**
 * JSON:API top-level document permutations
 */
export interface TopLevelDatum {
  data: ResourceObject;
  included?: ResourceObject[];
  links?: LinksObject;
  meta?: MetaObject;
}

/**
 * response with pagination
 */
export interface PagedTopLevelData {
  data: ResourceObject[];
  included?: ResourceObject[];
  links?: PaginationLinksObject;
  meta?: MetaObject;
}

export type TopLevel = PagedTopLevelData | TopLevelData | TopLevelDatum;
