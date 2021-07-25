import { JsonapiEntity } from "../jsonapi";
import { MetadataMap } from "./metadata-map";

import {
  JsonapiEntityConstructorType,
  entityConstructor,
  getEntityPrototypeChain,
} from "./utils";

const LINKS_MAP = new MetadataMap<LinkOptions>();

export interface LinkOptions {
  name?: string;
}

export function link<T extends JsonapiEntity<T>>(
  options?: LinkOptions
): PropertyDecorator {
  const opts = options || {};
  return (target: JsonapiEntity<T>, key: string) => {
    if (!(target instanceof JsonapiEntity)) {
      throw new Error(
        "`@link` must only be applied to properties of `JsonapiEntity` subtypes"
      );
    }
    LINKS_MAP.setMetadataByType(
      entityConstructor(target),
      key,
      Object.assign({ name: key }, opts)
    );
  };
}

export type LinkMetadata = { [name: string]: LinkOptions };

export function getLinkMetadata<T extends JsonapiEntity<T>>(
  target: JsonapiEntityConstructorType<T>
): LinkMetadata {
  return getEntityPrototypeChain(target).reduce(
    (soFar, prototype) =>
      Object.assign(soFar, LINKS_MAP.getMetadataByType(prototype)),
    {}
  );
}
