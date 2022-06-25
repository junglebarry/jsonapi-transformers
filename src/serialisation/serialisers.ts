import {
  getAttributeMetadata,
  getMetaMetadata,
  getRelationshipMetadata,
} from "../decorators";
import { entityConstructor } from "../decorators/utils";

import { jsonapiLinkage, JsonapiEntity, ResourceObject } from "../jsonapi";

import { isEmptyObject, isDefined } from "./utils";

/**
 * Convert a target JSON:API entity into a JSON:API representation.
 *
 * @param  {T} target - a source entity
 * @return {ResourceObject} a JSON:API resource representation
 */
export function toJsonApi<T extends JsonapiEntity<T>>(
  target: T
): ResourceObject {
  const targetConstructor = entityConstructor(target);
  // convert attributes
  const attributeMetadata = getAttributeMetadata(targetConstructor);
  const attributeReducer = (soFar, attr) => {
    const metadata = attributeMetadata[attr];
    const targetAttribute = target[attr];
    return !isDefined(targetAttribute)
      ? soFar
      : Object.assign(soFar, {
          [metadata.name]: targetAttribute,
        });
  };
  const attributes = Object.keys(attributeMetadata).reduce(
    attributeReducer,
    {}
  );

  // convert meta properties
  const metaMetadata = getMetaMetadata(targetConstructor);
  const metaReducer = (soFar, metaProperty) => {
    const metadata = metaMetadata[metaProperty];
    const targetMeta = target[metaProperty];
    return !isDefined(targetMeta)
      ? soFar
      : Object.assign(soFar, {
          [metadata.name]: targetMeta,
        });
  };
  const meta = Object.keys(metaMetadata).reduce(metaReducer, {});

  // convert relationships
  const relationshipMetadata = getRelationshipMetadata(targetConstructor);

  const relationshipReducer = (soFar, relationshipName) => {
    const metadata = relationshipMetadata[relationshipName];
    const linkage = jsonapiLinkage(target[relationshipName]);
    return !isDefined(linkage)
      ? soFar
      : Object.assign(soFar, {
          [metadata.name]: { data: linkage },
        });
  };

  const relationships = Object.keys(relationshipMetadata).reduce(
    relationshipReducer,
    {}
  );

  // compose the object and return
  return {
    id: target.id,
    type: target.type,
    attributes,
    ...(!isEmptyObject(meta) ? { meta } : {}),
    ...(!isEmptyObject(relationships) ? { relationships } : {}),
  };
}
