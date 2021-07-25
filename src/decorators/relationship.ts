import { JsonapiEntity } from "../jsonapi";
import { MetadataMap } from "./metadata-map";
import {
  JsonapiEntityConstructorType,
  entityConstructor,
  getEntityPrototypeChain,
} from "./utils";

const RELATIONSHIPS_MAP = new MetadataMap<RelationshipOptions>();

export interface RelationshipOptions {
  allowUnresolvedIdentifiers?: boolean;
  name?: string;
}

const DefaultRelationshipOptions: RelationshipOptions = {
  allowUnresolvedIdentifiers: false,
};

export function relationship<T extends JsonapiEntity<T>>(
  options?: RelationshipOptions
): PropertyDecorator {
  const opts = Object.assign({}, DefaultRelationshipOptions, options || {});
  return (target: JsonapiEntity<T>, key: string) => {
    if (!(target instanceof JsonapiEntity)) {
      throw new Error(
        "`@relationship` must only be applied to properties of `JsonapiEntity` subtypes"
      );
    }
    RELATIONSHIPS_MAP.setMetadataByType(
      entityConstructor(target),
      key,
      Object.assign({ name: key }, opts)
    );
  };
}

export type RelationshipMetadata = { [name: string]: RelationshipOptions };

export function getRelationshipMetadata<T extends JsonapiEntity<T>>(
  target: JsonapiEntityConstructorType<T>
): RelationshipMetadata {
  return getEntityPrototypeChain(target).reduce(
    (soFar, prototype) =>
      Object.assign(soFar, RELATIONSHIPS_MAP.getMetadataByType(prototype)),
    {}
  );
}
