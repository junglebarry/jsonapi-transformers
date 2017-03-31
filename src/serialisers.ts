import {
  getAttributeMetadata,
  getClassForJsonapiType,
  getConstructorForJsonapiType,
  getRelationshipMetadata,
  RelationshipOptions,
} from './decorators';

import {
  jsonapiIdentifier,
  jsonapiLinkage,
  ResourceIdentifier,
  ResourceLinkage,
  ResourceObject,
  TopLevel,
} from './jsonapi-types';

import {
  isEmptyObject,
  isDefined,
  keyBy,
} from './utils';

declare const console;

export function toJsonApi(target: ResourceIdentifier): ResourceObject {
  const attributeMetadata = getAttributeMetadata(target.constructor);
  const attributeReducer = (soFar, attr) => {
    const metadata = attributeMetadata[attr];
    const targetAttribute = target[attr];
    return !isDefined(targetAttribute) ? soFar : Object.assign(soFar, {
      [metadata.name]: targetAttribute,
    });
  }
  const attributes = Object.keys(attributeMetadata).reduce(attributeReducer, {});

  const relationshipMetadata = getRelationshipMetadata(target.constructor);

  const relationshipReducer = (soFar, relationshipName) => {
    const metadata = relationshipMetadata[relationshipName];
    const linkage = jsonapiLinkage(target[relationshipName]);
    return !isDefined(linkage) ? soFar : Object.assign(soFar, {
      [metadata.name]: { data: linkage },
    });
  }

  const relationships = Object.keys(relationshipMetadata).reduce(relationshipReducer, {});

  const entityWithAttributes = {
    id: target.id,
    type: target.type,
    attributes,
  };

  return isEmptyObject(relationships) ? entityWithAttributes : Object.assign(entityWithAttributes, {
    relationships,
  });
}

export function byTypeAndId(obj: ResourceObject): string {
  return JSON.stringify(jsonapiIdentifier(obj));
}

type IncludedLookup = { [typeAndId: string]: ResourceObject };

export function fromJsonApiTopLevel(topLevel: TopLevel, resourceObjects?: ResourceObject[]): any {
  // extract primary data and included resources
  const { data, included } = topLevel;

  // create a lookup table of all available resource objects
  const allResourceObjects: ResourceObject[] = (resourceObjects || []).concat(included || []);

  const resourceObjectsByTypeAndId: IncludedLookup = keyBy(allResourceObjects, byTypeAndId);

  if (Array.isArray(data)) {
    return data.map(datum => fromJsonApiResourceObject(datum, resourceObjectsByTypeAndId));
  } else if (data) {
    return fromJsonApiResourceObject(data, resourceObjectsByTypeAndId);
  }
}


export function fromJsonApiResourceObject(jsonapiResource: ResourceObject, resourceObjectsByTypeAndId: IncludedLookup): any {

  // deconstruct primary data and remap into an instance of the chosen type
  const {
    id,
    type,
    attributes,
    relationships,
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
      whenNoIncludeRetainIdentifier
    );

  Object.keys(relationshipMetadata).forEach(relationshipName => {
    const { allowIdentifiersIfUnresolved, name } = relationshipMetadata[relationshipName];
    const relationshipIdentifierData = relationships[name];
    const { data = undefined } = relationshipIdentifierData || {};
    if (data) {
      instance[relationshipName] = extractResourceObject(data, allowIdentifiersIfUnresolved);
    }
  });

  return instance;
}

/**
 * @param {ResourceIdentifier}
 * @param {IncludedLookup}
 * @param {boolean}
 * @return {any}
 */
function extractResourceObjectFromRelationship(relationIdentifier: ResourceIdentifier, resourceObjectsByTypeAndId: IncludedLookup, allowIdentifiersIfUnresolved: boolean): any {
  const relationId = byTypeAndId(relationIdentifier);
  const includedForRelationId = relationId ? resourceObjectsByTypeAndId[relationId] : undefined;

  if (!includedForRelationId) {
    return allowIdentifiersIfUnresolved ? relationIdentifier : undefined;
  }

  return fromJsonApiResourceObject(includedForRelationId, resourceObjectsByTypeAndId);
}

/**
 * @param {ResourceLinkage} resourceLinkage -  a resource linkage datum
 * @param {IncludedLookup} resourceObjectsByTypeAndId - resolved objects keyed by type-and-ID
 * @param {boolean} allowIdentifiersIfUnresolved - when `true`, identifiers are substituted for unresolved objects
 * @return {any} -
 */
function extractResourceObjectOrObjectsFromRelationship(resourceLinkage: ResourceLinkage, resourceObjectsByTypeAndId: IncludedLookup, allowIdentifiersIfUnresolved: boolean): any {
  const extractResourceObject = (linkage) => extractResourceObjectFromRelationship(
    linkage,
    resourceObjectsByTypeAndId,
    allowIdentifiersIfUnresolved
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
