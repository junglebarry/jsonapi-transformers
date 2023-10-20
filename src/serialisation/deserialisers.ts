import {
  getAttributeMetadata,
  getClassForJsonapiType,
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
  TopLevel,
  newEntity,
} from "../jsonapi";

import { isDefined, keyBy } from "./utils";

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
 * @type { { [string]: ResourceObject } }
 */
export type IncludedLookup = { [typeAndId: string]: ResourceObject };

/**
 * Deserialised objects, keyed by type-and-id
 * @type { { [string]: any } }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeserialisedLookup = { [typeAndId: string]: any };

/**
 * Deserialise an entity or entities from JSON:API.
 *
 * @param  {TopLevel} topLevel - a JSON:API top-level
 * @param  {ResourceObject[]} resourceObjects - known resource objects, for resolution
 * @return {any} - an entity or entities representing the top-level
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- should be typed, in future */
export function fromJsonApiTopLevel(
  topLevel: TopLevel,
  resourceObjects: ResourceObject[] = [],
): any {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  // extract primary data and included resources
  const { data, included } = topLevel;

  // create a lookup table of all available resource objects
  let primaryResourceObjects: ResourceObject[] = undefined;
  if (Array.isArray(data)) {
    primaryResourceObjects = data;
  } else if (data) {
    primaryResourceObjects = [data];
  }

  const includedResourceObjects: ResourceObject[] = (
    resourceObjects || []
  ).concat(included || []);

  const allResourceObjects = primaryResourceObjects.concat(
    includedResourceObjects,
  );

  const resourceObjectsByTypeAndId: IncludedLookup = keyBy(
    allResourceObjects,
    byTypeAndId,
  );

  const deserialisedObjectsByTypeAndId: DeserialisedLookup = {};

  let deserialised = undefined;
  if (Array.isArray(data)) {
    deserialised = data.map((datum) =>
      fromJsonApiResourceObject(
        datum,
        resourceObjectsByTypeAndId,
        deserialisedObjectsByTypeAndId,
      ),
    );
  } else if (data) {
    deserialised = fromJsonApiResourceObject(
      data,
      resourceObjectsByTypeAndId,
      deserialisedObjectsByTypeAndId,
    );
  }

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
/* eslint-disable @typescript-eslint/no-explicit-any -- should be typed, in future */
export function fromJsonApiResourceObject(
  jsonapiResource: ResourceObject,
  resourceObjectsByTypeAndId: IncludedLookup,
  deserialisedObjects: DeserialisedLookup = {},
): any {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  // deconstruct primary data and remap into an instance of the chosen type
  const {
    id,
    type,
    attributes = {},
    links = {},
    meta = {},
    relationships = {},
  } = jsonapiResource;

  // fetch the Typescript class responsible for deserialisation
  const targetType = getClassForJsonapiType(type);
  if (!targetType) {
    throw new Error(`No target entity type for type: ${type}`);
  }

  const targetConstructor = getConstructorForJsonapiType(type);
  if (!targetConstructor) {
    throw new Error(`No target entity constructor for type: ${type}`);
  }
  targetConstructor.prototype.type = type;

  // fetch type-specific data
  const attributeMetadata = getAttributeMetadata(targetConstructor);
  const linkMetadata = getLinkMetadata(targetConstructor);
  const metaMetadata = getMetaMetadata(targetConstructor);
  const relationshipMetadata = getRelationshipMetadata(targetConstructor);

  // construct a basic instance with only ID and type (by means of entity) specified
  const instance = newEntity(targetType, { id });

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
    whenNoIncludeRetainIdentifier: boolean,
  ) =>
    extractResourceObjectOrObjectsFromRelationship(
      linkage,
      resourceObjectsByTypeAndId,
      deserialisedObjects,
      whenNoIncludeRetainIdentifier,
    );

  Object.keys(relationshipMetadata).forEach((relationshipName) => {
    const { allowUnresolvedIdentifiers, name } =
      relationshipMetadata[relationshipName];
    const relationshipIdentifierData = relationships[name];
    const { data = undefined } = relationshipIdentifierData || {};
    if (data && Array.isArray(data)) {
      instance[relationshipName] = data
        .map((datum) =>
          extractResourceObject(datum, allowUnresolvedIdentifiers),
        )
        .filter((x) => x);
    } else if (data) {
      instance[relationshipName] = extractResourceObject(
        data,
        allowUnresolvedIdentifiers,
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
/* eslint-disable @typescript-eslint/no-explicit-any -- respects type of `deserialisedObjects` and `fromJsonApiResourceObject` */
function extractResourceObjectFromRelationship(
  relationIdentifier: ResourceIdentifier,
  resourceObjectsByTypeAndId: IncludedLookup,
  deserialisedObjects: DeserialisedLookup,
  allowUnresolvedIdentifiers: boolean,
): any {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const relationId = byTypeAndId(relationIdentifier);

  // already deserialised and cached
  const deserialisedObject = relationId
    ? deserialisedObjects[relationId]
    : undefined;
  if (deserialisedObject) {
    return deserialisedObject;
  }

  // already deserialised and cached
  const includedForRelationId = relationId
    ? resourceObjectsByTypeAndId[relationId]
    : undefined;

  if (!includedForRelationId) {
    return allowUnresolvedIdentifiers
      ? unresolvedIdentifier(relationIdentifier)
      : undefined;
  }

  // not yet deserialised, so deserialise and cache
  return fromJsonApiResourceObject(
    includedForRelationId,
    resourceObjectsByTypeAndId,
    deserialisedObjects,
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
 * @return {any} -
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- respects type of `extractResourceObjectFromRelationship` */
function extractResourceObjectOrObjectsFromRelationship(
  resourceLinkage: ResourceLinkage,
  resourceObjectsByTypeAndId: IncludedLookup,
  deserialisedObjects: DeserialisedLookup,
  allowUnresolvedIdentifiers: boolean,
): any {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const extractResourceObject = (linkage) =>
    extractResourceObjectFromRelationship(
      linkage,
      resourceObjectsByTypeAndId,
      deserialisedObjects,
      allowUnresolvedIdentifiers,
    );

  if (Array.isArray(resourceLinkage)) {
    // relationship to-many
    return resourceLinkage.map(extractResourceObject).filter(isDefined);
  } else if (resourceLinkage) {
    // relationship to-one
    return extractResourceObject(resourceLinkage);
  } else if (resourceLinkage === null) {
    // relationship removal
    return null;
  }

  return undefined;
}
