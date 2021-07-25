import {
  getAttributeMetadata,
  getConstructorForJsonapiType,
  getLinkMetadata,
  getMetaMetadata,
  getRelationshipMetadata,
} from "../decorators";

import {
  jsonapiIdentifier,
  unresolvedIdentifier,
  ResourceIdentifier,
  ResourceLinkage,
  ResourceObject,
  newEntity,
  JsonapiEntity,
  TopLevelResourcesData,
  TopLevelResourceDatum,
  UnresolvedResourceIdentifier,
} from "../jsonapi";

import { isDefined, keyBy } from "./utils";

type DeserialisedManyResources<T extends JsonapiEntity<T>> = {
  deserialised: T[];
  referents: ResourceObject[];
};

type DeserialisedOneResource<T extends JsonapiEntity<T>> = {
  deserialised: T;
  referents: ResourceObject[];
};

/**
 * Key a resource object by type and ID.
 *
 * @param  {ResourceObject} obj - a resource object
 * @return {string} - a key for an object identifier
 */
export function byTypeAndId(obj: ResourceObject): string {
  return JSON.stringify(jsonapiIdentifier(obj));
}

/**
 * Resource objects, keyed by type-and-id
 */
export type IncludedLookup = { [typeAndId: string]: ResourceObject };

/**
 * Deserialised objects, keyed by type-and-id
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeserialisedLookup = { [typeAndId: string]: JsonapiEntity<any> };

export function fromJsonApiTopLevelResourceDatum<T extends JsonapiEntity<T>>(
  topLevel: TopLevelResourceDatum,
  resourceObjects: ResourceObject[] = []
): DeserialisedOneResource<T> {
  // extract primary data and included resources
  const { data, included = [] } = topLevel;

  // create a lookup table of all available resource objects
  const primaryResourceObjects: ResourceObject[] = [data];

  const includedResourceObjects: ResourceObject[] =
    resourceObjects.concat(included);

  const allResourceObjects = primaryResourceObjects.concat(
    includedResourceObjects
  );

  const resourceObjectsByTypeAndId: IncludedLookup = keyBy(
    allResourceObjects,
    byTypeAndId
  );

  const deserialisedObjectsByTypeAndId: DeserialisedLookup = {};

  const deserialised = fromJsonApiResourceObject<T>(
    data,
    resourceObjectsByTypeAndId,
    deserialisedObjectsByTypeAndId
  );

  return {
    deserialised,
    referents: allResourceObjects,
  };
}

/**
 *
 * @param topLevel A top-level "resource collection" response
 * @param resourceObjects Any JSON:API resource objects already resolved
 * @returns Deserialised
 */
export function fromJsonApiTopLevelResourcesData<T extends JsonapiEntity<T>>(
  topLevel: TopLevelResourcesData,
  resourceObjects: ResourceObject[] = []
): DeserialisedManyResources<T> {
  // extract primary data and included resources
  const { data, included = [] } = topLevel;

  // create a lookup table of all available resource objects
  const primaryResourceObjects: ResourceObject[] = data;

  const includedResourceObjects: ResourceObject[] =
    resourceObjects.concat(included);

  const allResourceObjects = primaryResourceObjects.concat(
    includedResourceObjects
  );

  const resourceObjectsByTypeAndId: IncludedLookup = keyBy(
    allResourceObjects,
    byTypeAndId
  );

  const deserialisedObjectsByTypeAndId: DeserialisedLookup = {};

  const deserialised = data.map((datum) =>
    fromJsonApiResourceObject<T>(
      datum,
      resourceObjectsByTypeAndId,
      deserialisedObjectsByTypeAndId
    )
  );

  return {
    deserialised,
    referents: allResourceObjects,
  };
}

/**
 * Deserialise a resource object from JSON:API.
 *
 * @param  {ResourceObject} jsonapiResource - a resource object's JSON:API representation
 * @param  {IncludedLookup} resourceObjectsByTypeAndId - known resources, keyed by type-and-ID
 * @return {any} - a resource object, deserialised from JSON:API
 */
export function fromJsonApiResourceObject<T extends JsonapiEntity<T>>(
  jsonapiResource: ResourceObject,
  resourceObjectsByTypeAndId: IncludedLookup,
  deserialisedObjects: DeserialisedLookup = {}
): T {
  // deconstruct primary data and remap into an instance of the chosen type
  const {
    id,
    type,
    attributes = {},
    links = {},
    meta = {},
    relationships = {},
  } = jsonapiResource;

  // fetch the Typescript class constructor responsible for deserialisation
  const targetType = getConstructorForJsonapiType(type);
  if (!targetType) {
    throw new Error(`No target entity type for type: ${type}`);
  }
  targetType.prototype.type = type;

  // fetch type-specific data
  const attributeMetadata = getAttributeMetadata(targetType);
  const linkMetadata = getLinkMetadata(targetType);
  const metaMetadata = getMetaMetadata(targetType);
  const relationshipMetadata = getRelationshipMetadata(targetType);

  // construct a basic instance with only ID and type (by means of entity) specified
  const instance = newEntity(targetType, { id }) as T;

  // SIDE-EFFECT: `deserialisedObjects`
  // add to the list of deserialised objects, so recursive lookup works
  const typeAndId = byTypeAndId(instance);
  Object.assign(deserialisedObjects, {
    [typeAndId]: instance,
  });

  // transfer attributes from JSON API to target
  Object.keys(attributeMetadata).forEach((attribute) => {
    const metadata = attributeMetadata[attribute];
    const jsonapiName = metadata.name;
    const sourceAttribute = attributes[jsonapiName];
    if (isDefined(sourceAttribute)) {
      instance[attribute] = attributes[jsonapiName];
    }
  });

  // transfer links from JSON API to target
  Object.keys(linkMetadata).forEach((link) => {
    const metadata = linkMetadata[link];
    const jsonapiName = metadata.name;
    const sourceAttribute = links[jsonapiName];
    if (isDefined(sourceAttribute)) {
      instance[link] = links[jsonapiName];
    }
  });

  // transfer meta properties from JSON API to target
  Object.keys(metaMetadata).forEach((metaInfo) => {
    const metadata = metaMetadata[metaInfo];
    const jsonapiName = metadata.name;
    const sourceAttribute = meta[jsonapiName];
    if (isDefined(sourceAttribute)) {
      instance[metaInfo] = meta[jsonapiName];
    }
  });

  const extractResourceObject = (
    linkage: ResourceLinkage,
    whenNoIncludeRetainIdentifier: boolean
  ) =>
    extractResourceObjectOrObjectsFromRelationship(
      linkage,
      resourceObjectsByTypeAndId,
      deserialisedObjects,
      whenNoIncludeRetainIdentifier
    );

  Object.keys(relationshipMetadata).forEach((relationshipName) => {
    const { allowUnresolvedIdentifiers, name } =
      relationshipMetadata[relationshipName];
    const relationshipIdentifierData = relationships[name];
    const { data = undefined } = relationshipIdentifierData || {};
    if (data) {
      instance[relationshipName] = extractResourceObject(
        data,
        allowUnresolvedIdentifiers
      );
    }
  });

  return instance;
}

/**
 * Given a resource identifier, resolve to a deserialised resource object.
 *
 * Optionally, if `allowUnresolvedIdentifiers === true`, allow identifiers in place of unresolved objects.
 *
 * @param {ResourceIdentifier} relationIdentifier - a resource identifier
 * @param {IncludedLookup} resourceObjectsByTypeAndId - resolved objects keyed by type-and-ID
 * @param {boolean} allowUnresolvedIdentifiers - when `true`, identifiers are substituted for unresolved objects
 * @return {any}
 */
function extractResourceObjectFromRelationship<T extends JsonapiEntity<T>>(
  relationIdentifier: ResourceIdentifier,
  resourceObjectsByTypeAndId: IncludedLookup,
  deserialisedObjects: DeserialisedLookup,
  allowUnresolvedIdentifiers: boolean
): T | UnresolvedResourceIdentifier | undefined {
  const relationId = byTypeAndId(relationIdentifier);

  // already deserialised and cached
  const deserialisedObject = relationId
    ? deserialisedObjects[relationId]
    : undefined;
  if (deserialisedObject) {
    return deserialisedObject;
  }

  // look in the `included` data, and if absent return undefined
  // or an UnresolvedResourceIdentifier, depending on config
  const includedForRelationId = relationId
    ? resourceObjectsByTypeAndId[relationId]
    : undefined;

  if (!includedForRelationId) {
    return allowUnresolvedIdentifiers
      ? unresolvedIdentifier(relationIdentifier)
      : undefined;
  }

  // present, but not yet deserialised, so deserialise and cache
  return fromJsonApiResourceObject<T>(
    includedForRelationId,
    resourceObjectsByTypeAndId,
    deserialisedObjects
  );
}

/**
 * Given one, many, or no resource identifier, resolve to a deserialised resource object.
 *
 * Optionally, if `allowUnresolvedIdentifiers === true`, allow identifiers in place of unresolved objects.
 *
 * @param {ResourceLinkage} resourceLinkage -  a resource linkage datum
 * @param {IncludedLookup} resourceObjectsByTypeAndId - resolved objects keyed by type-and-ID
 * @param {boolean} allowUnresolvedIdentifiers - when `true`, identifiers are substituted for unresolved objects
 * @return {JsonapiEntity | JsonapiEntity[] | null} - related JsonapiEntity instances
 */
function extractResourceObjectOrObjectsFromRelationship<
  T extends JsonapiEntity<T>
>(
  resourceLinkage: ResourceLinkage,
  resourceObjectsByTypeAndId: IncludedLookup,
  deserialisedObjects: DeserialisedLookup,
  allowUnresolvedIdentifiers: boolean
):
  | (UnresolvedResourceIdentifier | T)
  | (UnresolvedResourceIdentifier | T)[]
  | null {
  if (resourceLinkage === null) {
    // relationship removal
    return null;
  }

  const extractResourceObject = (linkage) =>
    extractResourceObjectFromRelationship<T>(
      linkage,
      resourceObjectsByTypeAndId,
      deserialisedObjects,
      allowUnresolvedIdentifiers
    );

  // relationship to-many
  if (Array.isArray(resourceLinkage)) {
    return resourceLinkage.map(extractResourceObject).filter(isDefined);
  }
  // relationship to-one
  return extractResourceObject(resourceLinkage);
}
