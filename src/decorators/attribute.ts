import { JsonapiEntity } from "../jsonapi";
import { MetadataMap } from "./metadata-map";
import {
  JsonapiEntityConstructorType,
  entityConstructor,
  getEntityPrototypeChain,
} from "./utils";

const ATTRIBUTES_MAP = new MetadataMap<AttributeOptions>();

export interface AttributeOptions {
  name?: string;
}

export function attribute<T extends JsonapiEntity<T>>(
  options?: AttributeOptions
): PropertyDecorator {
  const opts = options || {};
  return (target: JsonapiEntity<T>, key: string) => {
    if (!(target instanceof JsonapiEntity)) {
      throw new Error(
        "`@attribute` must only be applied to properties of `JsonapiEntity` subtypes"
      );
    }
    ATTRIBUTES_MAP.setMetadataByType(
      entityConstructor(target),
      key,
      Object.assign({ name: key }, opts)
    );
  };
}

export type AttributeMetadata = { [name: string]: AttributeOptions };

export function getAttributeMetadata<T extends JsonapiEntity<T>>(
  target: JsonapiEntityConstructorType<T>
): AttributeMetadata {
  return getEntityPrototypeChain(target).reduce(
    (soFar, prototype) =>
      Object.assign(soFar, ATTRIBUTES_MAP.getMetadataByType(prototype)),
    {}
  );
}
