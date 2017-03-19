import {
  getAttributeNames,
  getClassForJsonapiType,
  getConstructorForJsonapiType,
  getRelationshipNames,
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
  keyBy,
} from './utils';

declare const console;

export function toJsonApi(target: ResourceIdentifier) {
  const attrs = getAttributeNames(target.constructor);
  const attributeReducer = (soFar, attr) => {
    const targetAttribute = target[attr];
    return (!targetAttribute) ? soFar : Object.assign(soFar, {
      [attr]: target[attr],
    });
  }
  const attributes = Array.from(attrs).reduce(attributeReducer, {});

  const relationshipNames = getRelationshipNames(target.constructor);

  const relationshipReducer = (soFar, relationshipName) => {
    const linkage = jsonapiLinkage(target[relationshipName]);
    return (typeof linkage === 'undefined') ? soFar : Object.assign(soFar, {
      [relationshipName]: { data: linkage },
    });
  }

  const relationships = Array.from(relationshipNames).reduce(relationshipReducer, {});

  const entityWithAttributes = {
    id: target.id,
    type: target.type,
    attributes,
  };

  return isEmptyObject(relationships) ? entityWithAttributes : Object.assign(entityWithAttributes, {
    relationships,
  });
}

function byTypeAndId(obj: ResourceObject): string {
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
  const attributeNames = getAttributeNames(targetConstructor);
  const relationshipNames = getRelationshipNames(targetConstructor);

  // construct a basic instance with only ID and type specified
  const instance = new targetType();
  instance.id = id;
  instance.type = type;

  // transfer attributes from JSON API to target
  attributeNames.forEach(attribute => {
    instance[attribute] = attributes[attribute];
  });

  relationshipNames.forEach(relationship => {
     const relationshipIdentifierData = relationships[relationship];
     const { data = undefined } = relationshipIdentifierData || {};
     if (data) {
       instance[relationship] = extractResourceObjectOrObjectsFromRelationship(data, resourceObjectsByTypeAndId);
     }
  });

  return instance;
}

function extractResourceObjectFromRelationship(relationIdentifier: ResourceIdentifier, resourceObjectsByTypeAndId: IncludedLookup) {
  const relationId = byTypeAndId(relationIdentifier);
  const includedForRelationId = resourceObjectsByTypeAndId[relationId];
  return !includedForRelationId ? undefined : fromJsonApiResourceObject(includedForRelationId, resourceObjectsByTypeAndId);
}

function extractResourceObjectOrObjectsFromRelationship(resourceLinkage: ResourceLinkage, resourceObjectsByTypeAndId: IncludedLookup) {
  if (Array.isArray(resourceLinkage)) {
    return resourceLinkage.map(linkage => extractResourceObjectFromRelationship(linkage, resourceObjectsByTypeAndId));
  } else if (resourceLinkage) {
    return extractResourceObjectFromRelationship(resourceLinkage, resourceObjectsByTypeAndId);
  } else if (resourceLinkage === null) {
    return null;
  }

  return undefined;
}
