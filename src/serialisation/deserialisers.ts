import {
  getAttributeMetadata,
  getClassForJsonapiType,
  getConstructorForJsonapiType,
  getRelationshipMetadata,
} from '../decorators';

import {
  jsonapiIdentifier,
  unresolvedIdentifier,
  ResourceIdentifier,
  ResourceLinkage,
  ResourceObject,
  TopLevel,
} from '../jsonapi';

import {
  isDefined,
  keyBy,
} from './utils';

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
type IncludedLookup = { [typeAndId: string]: ResourceObject };

/**
 * Deserialised objects, keyed by type-and-id
 * @type { { [string]: any } }
 */
type DeserialisedLookup = { [typeAndId: string]: any };

/**
 * Deserialise an entity or entities from JSON:API.
 *
 * @param  {TopLevel} topLevel - a JSON:API top-level
 * @param  {ResourceObject[]} resourceObjects - known resource objects, for resolution
 * @return {any} - an entity or entities representing the top-level
 */
export function fromJsonApiTopLevel(topLevel: TopLevel, resourceObjects: ResourceObject[] = []): any {
  // extract primary data and included resources
  const { data, included } = topLevel;

  // create a lookup table of all available resource objects
  let primaryResourceObjects: ResourceObject[] = undefined;
  if (Array.isArray(data)) {
    primaryResourceObjects = data;
  } else if (data) {
    primaryResourceObjects = [data];
  }

  const includedResourceObjects: ResourceObject[] = (resourceObjects || []).concat(included || []);

  const allResourceObjects = primaryResourceObjects.concat(includedResourceObjects);

  const resourceObjectsByTypeAndId: IncludedLookup = keyBy(allResourceObjects, byTypeAndId);

  const deserialiseObjectOrArray = (data) => {
    const deserialisedObjectsByTypeAndId: DeserialisedLookup = {};
    if (Array.isArray(data)) {
      return data.map(datum => fromJsonApiResourceObject(datum, resourceObjectsByTypeAndId, deserialisedObjectsByTypeAndId));
    } else if (data) {
      return fromJsonApiResourceObject(data, resourceObjectsByTypeAndId, deserialisedObjectsByTypeAndId);
    }
    return undefined;
  };

  const deserialised = deserialiseObjectOrArray(data);

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
export function fromJsonApiResourceObject(jsonapiResource: ResourceObject, resourceObjectsByTypeAndId: IncludedLookup, deserialisedObjects: DeserialisedLookup = {}): any {

  // deconstruct primary data and remap into an instance of the chosen type
  const {
    id,
    type,
    attributes = {},
    relationships = {},
  } = jsonapiResource;

  // fetch the Typescript class responsible for deserialisation
  const targetType = getClassForJsonapiType(type);
  const targetConstructor = getConstructorForJsonapiType(type);

  // fetch type-specific data
  const attributeMetadata = getAttributeMetadata(targetConstructor);
  const relationshipMetadata = getRelationshipMetadata(targetConstructor);

  // construct a basic instance with only ID and type specified
  const instance = new targetType();
  instance.id = id;
  instance.type = type;

  // add to the list of deserialised objects, so recursive lookup works
  const typeAndId = byTypeAndId(instance);
  const deserialised = Object.assign(deserialisedObjects, {
    [typeAndId]: instance,
  });

  // transfer attributes from JSON API to target
  Object.keys(attributeMetadata).forEach(attribute => {
    const metadata = attributeMetadata[attribute];
    const jsonapiName = metadata.name;
    const sourceAttribute = attributes[jsonapiName];
    if (isDefined(sourceAttribute)) {
      instance[attribute] = attributes[jsonapiName];
    }
  });

  const extractResourceObject = (linkage: ResourceLinkage, whenNoIncludeRetainIdentifier: boolean) =>
    extractResourceObjectOrObjectsFromRelationship(
      linkage,
      resourceObjectsByTypeAndId,
      deserialisedObjects,
      whenNoIncludeRetainIdentifier
    );

  Object.keys(relationshipMetadata).forEach(relationshipName => {
    const { allowUnresolvedIdentifiers, name } = relationshipMetadata[relationshipName];
    const relationshipIdentifierData = relationships[name];
    const { data = undefined } = relationshipIdentifierData || {};
    if (data) {
      instance[relationshipName] = extractResourceObject(data, allowUnresolvedIdentifiers);
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
function extractResourceObjectFromRelationship(relationIdentifier: ResourceIdentifier, resourceObjectsByTypeAndId: IncludedLookup, deserialisedObjects: DeserialisedLookup, allowUnresolvedIdentifiers: boolean): any {
  const relationId = byTypeAndId(relationIdentifier);

  // already deserialised and cached
  const deserialisedObject = relationId ? deserialisedObjects[relationId] : undefined;
  if (deserialisedObject) {
    return deserialisedObject;
  }

  // already deserialised and cached
  const includedForRelationId = relationId ? resourceObjectsByTypeAndId[relationId] : undefined;

  if (!includedForRelationId) {
    return allowUnresolvedIdentifiers ? unresolvedIdentifier(relationIdentifier) : undefined;
  }

  // not yet deserialised, so deserialise and cache
  return fromJsonApiResourceObject(includedForRelationId, resourceObjectsByTypeAndId, deserialisedObjects);
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
function extractResourceObjectOrObjectsFromRelationship(resourceLinkage: ResourceLinkage, resourceObjectsByTypeAndId: IncludedLookup, deserialisedObjects: DeserialisedLookup, allowUnresolvedIdentifiers: boolean): any {
  const extractResourceObject = (linkage) => extractResourceObjectFromRelationship(
    linkage,
    resourceObjectsByTypeAndId,
    deserialisedObjects,
    allowUnresolvedIdentifiers
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
