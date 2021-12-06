import {
  getAttributeMetadata,
  getMetaMetadata,
  getRelationshipMetadata,
} from '../decorators';

import {
  jsonapiLinkage,
  ResourceIdentifier,
  ResourceObject,
} from '../jsonapi';

import {
  isEmptyObject,
  isDefined,
} from './utils';

/**
 * Convert a target JSON:API entity into a JSON:API representation.
 *
 * @param  {ResourceIdentifier} target - a source entity
 * @return {ResourceObject} a JSON:API resource representation
 */
export function toJsonApi(target: ResourceIdentifier): ResourceObject {
  // convert attributes
  const attributeMetadata = getAttributeMetadata(target.constructor);
  const attributeReducer = (soFar, attr) => {
    const metadata = attributeMetadata[attr];
    const targetAttribute = target[attr];
    return !isDefined(targetAttribute) ? soFar : Object.assign(soFar, {
      [metadata.name]: targetAttribute,
    });
  }
  const attributes = Object.keys(attributeMetadata).reduce(attributeReducer, {});

  // convert relationships
  const relationshipMetadata = getRelationshipMetadata(target.constructor);

  const relationshipReducer = (soFar, relationshipName) => {
    const metadata = relationshipMetadata[relationshipName];
    const linkage = jsonapiLinkage(target[relationshipName]);
    return !isDefined(linkage) ? soFar : Object.assign(soFar, {
      [metadata.name]: { data: linkage },
    });
  }

  const relationships = Object.keys(relationshipMetadata).reduce(relationshipReducer, {});

  // convert `meta` properties
  const metaMetadata = getMetaMetadata(target.constructor);
  const metaReducer = (soFar, metaName) => {
    const metadata = metaMetadata[metaName];
    const targetMeta = target[metaName];
    return !isDefined(targetMeta) ? soFar : Object.assign(soFar, {
      [metadata.name]: targetMeta,
    });
  }
  const meta = Object.keys(metaMetadata).reduce(metaReducer, {});

  // compose the object and return
  return {
    id: target.id,
    type: target.type,
    attributes,
    ...(!isEmptyObject(meta) ? { meta }: {}),
    ...(!isEmptyObject(relationships) ? { relationships }: {}),
  };
}
