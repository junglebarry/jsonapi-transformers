import { JsonapiEntity } from "../jsonapi";
import { MetadataMap } from "./metadata-map";

import {
  JsonapiEntityConstructorType,
  entityConstructor,
  getEntityPrototypeChain,
} from "./utils";

const META_PROPERTIES_MAP = new MetadataMap<MetaOptions>();

export interface MetaOptions {
  name?: string;
}

export function meta<T extends JsonapiEntity<T>>(
  options?: MetaOptions
): PropertyDecorator {
  const opts = options || {};
  return (target: JsonapiEntity<T>, key: string) => {
    if (!(target instanceof JsonapiEntity)) {
      throw new Error(
        "`@meta` must only be applied to properties of `JsonapiEntity` subtypes"
      );
    }
    META_PROPERTIES_MAP.setMetadataByType(
      entityConstructor(target),
      key,
      Object.assign({ name: key }, opts)
    );
  };
}

export type MetaMetadata = { [name: string]: MetaOptions };

export function getMetaMetadata<T extends JsonapiEntity<T>>(
  target: JsonapiEntityConstructorType<T>
): MetaMetadata {
  return getEntityPrototypeChain(target).reduce(
    (soFar, prototype) =>
      Object.assign(soFar, META_PROPERTIES_MAP.getMetadataByType(prototype)),
    {}
  );
}
