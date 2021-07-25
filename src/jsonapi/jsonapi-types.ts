/**
 * @link https://jsonapi.org/format/#document-top-level
 */
export type TopLevel =
  | TopLevelErrors
  | TopLevelMetaOnly
  | TopLevelResourcesData
  | TopLevelResourceDatum
  | TopLevelToManyRelationshipsData
  | TopLevelToOneRelationshipData;

export interface TopLevelErrors
  extends TopLevelOptionalMembers,
    WithOptionalMeta {
  errors: ErrorObject[];
}

export interface TopLevelMetaOnly extends TopLevelOptionalMembers {
  meta: MetaObject;
}

export interface TopLevelResourcesData
  extends TopLevelWithPaginationOptionalMembers,
    WithIncluded,
    WithOptionalMeta {
  data: ResourceObject[];
}

export interface TopLevelResourceDatum
  extends TopLevelOptionalMembers,
    WithIncluded,
    WithOptionalMeta {
  data: ResourceObject | null;
}

export interface TopLevelToManyRelationshipsData
  extends TopLevelWithPaginationOptionalMembers,
    WithIncluded,
    WithOptionalMeta {
  data: ResourceIdentifier[];
}

export interface TopLevelToOneRelationshipData
  extends TopLevelOptionalMembers,
    WithIncluded,
    WithOptionalMeta {
  data: ResourceIdentifier | null;
}

export interface TopLevelLinksObject {
  self?: string;
  related?: string;
}

export interface TopLevelOptionalMembers extends JsonapiObject {
  links?: TopLevelLinksObject;
}

export interface TopLevelWithPaginationOptionalMembers extends JsonapiObject {
  links?: TopLevelLinksObject & PaginationLinksObject;
}

/**
 * @link https://jsonapi.org/format/#document-resource-objects
 */

export interface ResourceObject extends ResourceIdentifier, WithOptionalLinks {
  attributes?: AttributesObject;
  relationships?: { [relationshipName: string]: RelationshipsObject };
}

/**
 * @link https://jsonapi.org/format/#document-resource-object-attributes
 */
export type AttributesObject = { [attributeName: string]: JsonValue };

/**
 * @link https://jsonapi.org/format/#document-resource-object-relationships
 */
export type RelationshipsObject =
  | RelationshipsObjectToManyResourceLinkage
  | RelationshipsObjectToOneResourceLinkage
  | RelationshipsObjectMetaOnly
  | RelationshipsObjectLinksOnly;

interface RelationshipsObjectToOneResourceLinkage extends WithOptionalMeta {
  data: ToOneResourceLinkage;
  links?: RelationshipsLinksObject;
}

interface RelationshipsObjectToManyResourceLinkage extends WithOptionalMeta {
  data: ToManyResourceLinkage;
  links?: RelationshipsLinksObject & PaginationLinksObject;
}
interface RelationshipsObjectMetaOnly {
  data: undefined;
  links?: RelationshipsLinksObject;
  meta: MetaObject;
}
interface RelationshipsObjectLinksOnly extends WithOptionalMeta {
  data: undefined;
  links: RelationshipsLinksObject;
}

export type RelationshipsLinksObject = LinksObject &
  (SelfOnlyRelationshipsLink | RelatedOnlyRelationshipsLink);

type SelfOnlyRelationshipsLink = { self: string } & WithRelatedResourceLink;

type RelatedOnlyRelationshipsLink = { related: string } & WithResourceLink;

/**
 * @link https://jsonapi.org/format/#document-resource-object-related-resource-links
 */
export interface WithRelatedResourceLink {
  related?: string;
}

/**
 * @link https://jsonapi.org/format/#document-resource-object-linkage
 */
export type ResourceLinkage = ToOneResourceLinkage | ToManyResourceLinkage;

export type ToOneResourceLinkage = null | ResourceIdentifier;
export type ToManyResourceLinkage = ResourceIdentifier[];

/**
 * @link https://jsonapi.org/format/#document-resource-object-links
 */
export interface WithResourceLink {
  self?: string;
}

/**
 * Base type for JSON:API identifiers
 */
export interface JsonapiIdentifier {
  id: string;
  readonly type: string;
}

/**
 * @link https://jsonapi.org/format/#document-resource-identifier-objects
 */
export interface ResourceIdentifier
  extends JsonapiIdentifier,
    WithOptionalMeta {}

/**
 * @link https://jsonapi.org/format/#document-compound-documents
 */
interface WithIncluded {
  included?: ResourceObject[];
}

/**
 * @link https://jsonapi.org/format/#document-meta
 */
export type MetaObject = { [metaName: string]: JsonValue };

interface WithOptionalMeta {
  meta?: MetaObject;
}

/**
 * @link https://jsonapi.org/format/#document-links
 */
export type LinksObject = { [linkName: string]: Link };

export interface WithOptionalLinks {
  links?: LinksObject;
}

export type Link = string | LinkObject;

export interface LinkObject extends WithOptionalMeta {
  href: string;
}

/**
 * @link https://jsonapi.org/format/#document-jsonapi-object
 */
export interface JsonapiObject {
  jsonapi?: { version?: string } & WithOptionalMeta;
}

/**
 * @link https://jsonapi.org/format/#error-objects
 */
export interface ErrorObject {
  id?: string;
  links?: { about: string } & LinksObject;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  meta?: MetaObject;
}

/**
 * @link https://jsonapi.org/format/#fetching-pagination
 */
export interface PaginationLinksObject extends LinksObject {
  first?: Link;
  last?: Link;
  next?: Link;
  prev?: Link;
}

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };
